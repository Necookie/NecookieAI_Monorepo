# Mobile reliability, testing, and distribution

Status: audited November 7, 2026. Background jobs and live synchronization remain
proposed work. The QR download page and signed direct APK release are implemented.

## Findings verified in this checkout

- The Android shell and desktop website can use the same Clerk account and Turso
  records when configured to use the same deployment. There is no mobile database.
- API tests use the actual route handlers, Drizzle queries, and an isolated local
  libSQL database. Two request contexts with the same user ID can read and write
  the same conversations, messages, and language/model settings.
- The audit reproduced and fixed missing ownership verification on message reads
  and an ownership bypass in the chat-title upsert when IDs collide.
- Tests cover signed-out requests and attempts by another account to read, rename,
  append to, truncate, pin, or delete a conversation.
- These tests supply authenticated user IDs. They do not test real Clerk tokens,
  redirects, production database credentials, or authentication on a physical phone.
- Live unauthenticated HTTP checks of `https://chat.necookie.dev` returned 200 for
  the app shell, 401 for `/api/chats` and `/api/settings`, and 404 for
  `/.well-known/assetlinks.json` before release signing was configured. A real
  release certificate association is now published. These checks do not establish
  authenticated access.
- There is no subscription or polling mechanism for cross-device changes. Chat
  selection now refetches saved messages, but two open clients still do not update
  one another automatically. Shared storage alone does not provide live synchronization.
- Initial data now waits for Clerk readiness and reloads when the user changes,
  clearing account data and cancelling the previous initial load. Tests cover
  cancelled hydration, saved language/model restoration, and reloading cached
  messages. Physical-device sign-in/data restoration still needs verification.
- Assistant messages are assembled and saved by the client after streaming.
  Closing or suspending the browser can interrupt generation and persistence.
- Theme, compact mode, and message-marker color are device-local preferences;
  message ratings are currently in-memory. They are not account-wide database
  features despite earlier README claims about ratings.

## Reliable generation proposal

Keep inference on the existing model server. Introduce a durable server-owned job:

1. Authenticate the request, verify chat ownership, and atomically save the user
   message and a generation job with a unique request ID.
2. Dispatch via a durable outbox/queue. Recover dispatch failures so a committed
   message cannot remain silently unprocessed.
3. A separate Cloudflare Queue consumer calls the model and checkpoints progress
   to durable storage. Enforce one active generation per conversation and use a
   stable assistant-message ID. Retries must not create duplicate responses.
4. Record `queued`, `running`, `completed`, `failed`, and `cancelled` states. Define
   timeouts, retry limits, stale-job recovery, and handling of chat deletion or
   regeneration while work is active. Queue retry delivery is at least once.
5. Both clients subscribe to authenticated, user-scoped change events, using a
   Durable Object/WebSocket hub or an equivalent event stream. Attach sequence
   numbers; reconnect with a durable snapshot/cursor to recover missed events.
6. The server saves the completed assistant response. The phone can disconnect
   or be suspended without owning generation. Reopening restores current state.

Queue consumers have a 15-minute wall-clock limit. Establish a model deadline
within that limit; do not promise unlimited generation duration. An HTTP stream
or `waitUntil` alone is not sufficient for this requirement. Notification delivery
is a separate feature from reliable generation and can be added later.

Required work includes database migrations, queue/consumer infrastructure,
idempotency and cancellation logic, authenticated event delivery, and changes to
send, regenerate, edit, and stop-generation flows on the shared web client.

## QR download (direct APK)

The sidebar has a **Get Android app** link to the public landing page at
`https://chat.necookie.dev/download/android`. The page displays a QR encoding this
same permanent address and a working download button. The APK is published as a
signed GitHub release. Direct download is the selected channel; Google Play is
only a future option.
Do not encode session tokens, account IDs, or expiring build-artifact URLs.

The landing page should stay public and display the app name, release version,
minimum Android version, release notes, and the available install channel:

| Channel | First install | Later shell updates |
| --- | --- | --- |
| Google Play | QR opens landing page, then Play listing | Play-managed updates; optional in-app update prompt |
| Direct APK | QR opens landing page, then signed release APK | Download newer signed APK; Android confirms an in-place update |

For direct distribution, publish immutable versioned APKs and a `latest` release
manifest containing version code, release URL, checksum, and release notes. Upload
and verify an APK before changing the manifest. Keep older releases available.
An update indicator can link to the current release; automatic package installation
requires native integration and is not implemented by the current TWA launcher.

Direct APK installation requires allowing that browser/source to install apps.
A QR code cannot bypass Android's install confirmation. Do not distribute the
temporary CI debug APK as a public release.

## Updates

Most product changes remain on the hosted website and arrive on reload, without
an APK update. If adding a new-version prompt, defer reload during active work.

Native shell changes need an updated package with the same application ID,
compatible signing identity, and a higher version code. Users update the existing
installation; they should not uninstall it. Choose and protect the release signing
key before public distribution. Plan consistent signing before offering both
Play and direct distribution.

## Physical-phone acceptance test

Use a test account and an APK configured for the actual HTTPS deployment:

1. Sign in on desktop and phone with the same account; confirm account identity.
2. Create a uniquely named test chat on desktop; verify it and its messages on
   the phone. Create a reply, folder assignment, and pin on phone; verify desktop.
3. Change language/model and verify server-backed preferences on the other client.
   Do not expect device-local appearance settings or in-memory ratings to sync.
4. Exercise configured OAuth providers, sign-out, expired sessions, account
   switching, cold launch, and returning after Android kills the app. Ensure old
   account data disappears on sign-out and cannot appear for another account.
5. With both clients open, verify new and edited records appear without reload.
   This currently requires new synchronization work and is not a passing feature.
6. After durable jobs ship, start generation, lock the phone, disconnect its
   network, and force-stop it. Verify completion on desktop, then reopen the phone
   and confirm the identical saved result without duplicate messages.
7. Test cancellation, model errors, queue retries, reconnecting mid-generation,
   concurrent sends, and deleting a conversation while a job is running.
8. Install release N, create a session, update to N+1 without uninstalling, and
   verify authentication, history, and app links remain intact.

## References

- https://developers.cloudflare.com/queues/platform/limits/
- https://developers.cloudflare.com/queues/reference/delivery-guarantees/
- https://developers.cloudflare.com/durable-objects/best-practices/websockets/
- https://developer.android.com/distribute/marketing-tools/alternative-distribution
- https://developer.android.com/google/play/app-updates
- https://developer.chrome.com/docs/android/trusted-web-activity
