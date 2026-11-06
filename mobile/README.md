# Necookie AI for Android

This scaffold packages the existing hosted Necookie AI application as an Android
Trusted Web Activity (TWA), using Google's Android Browser Helper. Chat, streaming,
settings, and Clerk authentication continue to run through the existing Astro app
and Cloudflare backend. No server secrets or web build output are bundled in the APK.

This is a browser-backed Android shell, not a separate native React implementation.
It requires internet access and a deployed HTTPS app. A supporting browser renders
the application; without verified domain ownership it displays a Custom Tab toolbar.
Authentication redirects to other origins can also show browser UI. Native push,
offline chat, file sharing integrations, and a Play Store release are not included.

## Build and run

Install Android Studio, JDK 17 or 21, Android SDK Platform 36, and Build Tools 36.0.0.
Open `mobile/android` as the Android Studio project. Set `sdk.dir` in its untracked
`local.properties`, or set `ANDROID_HOME` to your SDK installation.

The deployment hostname defaults to `chat.necookie.dev`. To test another
deployment, add this to your user-level `~/.gradle/gradle.properties`:

```properties
appHost=chat.your-domain.com
```

Use the actual hostname serving the Astro app, without a protocol, port, or path.
From `mobile/android` on Windows:

```powershell
.\gradlew.bat :app:assembleDebug :app:lintDebug '-PappHost=chat.your-domain.com'
.\gradlew.bat :app:installDebug '-PappHost=chat.your-domain.com'
```

On macOS/Linux use `./gradlew` instead. The checked-in wrapper downloads the pinned
Gradle distribution and verifies its SHA-256 checksum. The debug APK is written to
`app/build/outputs/apk/debug/app-debug.apk`. Run on an Android 6.0+ emulator or device
with an up-to-date TWA-capable browser, such as Chrome. No Node install or Astro
build is needed for the Android shell.

## Verify the app and website

The application ID is `dev.necookie.ai`. Settle that ID before publishing; changing
it also requires updating the namespace and `mobile/scripts/assetlinks.mjs`.

1. Obtain the signing certificate SHA-256 fingerprint with `:app:signingReport`.
   For a Play-distributed release, use the **Play App Signing certificate** from
   Play Console, rather than the upload certificate.
2. From the repository root, generate the public website association:

   ```powershell
   node mobile/scripts/assetlinks.mjs 'AA:BB:...full 32-byte SHA-256 fingerprint...'
   ```

   The example above is intentionally incomplete; use the actual fingerprint.
   The generator writes `public/.well-known/assetlinks.json`. It replaces the file;
   preserve any existing associations and add additional certificate fingerprints
   manually when supporting multiple signed builds. Do not publish personal debug
   certificates on the production domain.
3. Deploy the Astro app and confirm
   `https://YOUR_HOST/.well-known/assetlinks.json` returns that JSON publicly with
   HTTP 200 and `Content-Type: application/json`, without redirects or sign-in.
   Ensure any future middleware protection leaves this path public.
4. Install the matching signed app and check that the toolbar disappears on the
   verified origin. OAuth redirects to unverified origins retain browser UI.

No placeholder association is deployed by this scaffold. Existing browser users
and production authentication configuration do not change.

## Validation and CI

`.github/workflows/android.yml` builds and lints debug APKs on mobile changes,
targeting `chat.necookie.dev`. Override the repository variable `ANDROID_APP_HOST`
to test a different deployment. CI artifacts use temporary debug signing and are
not release packages or a stable public update channel.

On a device, verify cold launch, Clerk sign-in/sign-out (including any configured
OAuth providers), chat streaming, history, keyboard resizing, back navigation,
theme changes, verified HTTPS links, and behavior without a network connection.
Repeat domain verification with the release certificate before distributing.

## Release handoff

Use Android Studio's **Generate Signed Bundle / APK** to create a signed Android
App Bundle. Keep keystores and passwords outside Git. Increment `versionCode` for
each upload, configure the real hostname, publish its certificate association,
and complete device testing, store listing, privacy disclosures, and applicable
Play requirements before submission. Release signing is deliberately unconfigured.

The current project pins AGP 8.13.2, Gradle 8.13, Browser Helper 2.7.3, and Android
API 36. Future native code and resources belong under `android/app/src/main`.

References: [Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/),
[domain verification](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start),
[Android Browser Helper](https://github.com/GoogleChrome/android-browser-helper).
