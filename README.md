# Necookie AI

Necookie AI is a self-hosted web interface for interacting with Ollama-compatible language models. It is built as a server-rendered application running on Cloudflare Workers, with a React front-end mounted as a single-island component inside an Astro page.

The project targets developers and researchers who want a private, fully controlled AI interface backed by their own infrastructure rather than a third-party SaaS product.

---

## Features

**Model selection.** Switch between configured upstream models (e.g., `neco-ai-1.0`) directly from the application header. Additional models such as Gemini are planned.

**Authentication.** Session handling is provided by [Clerk](https://clerk.com/). All routes are protected server-side via Astro middleware before any request reaches the API or the client.

**Compact mode.** A density setting that reduces UI padding, margins, and layout spacing for users who prefer more information on screen at once.

**Persistent chat history.** Conversations, folders, and pinned chats are stored in a Turso (libSQL) database per authenticated user. The sidebar organizes chats chronologically and by folder.

**Streaming responses.** The `/api/chat` endpoint establishes a server-sent event stream from the upstream model and forwards chunks to the client incrementally, so responses appear as they are generated.

**Internationalization.** Locale strings are split into modular dictionary files covering English, Spanish, French, German, and Japanese. The active language is stored per user in the database.

**Message ratings.** Users can rate individual assistant messages as helpful or unhelpful. Ratings are stored alongside the message record.

---

## Architecture

The application is a server-side rendered Astro project deployed to Cloudflare Workers via the `@astrojs/cloudflare` adapter. The entire interactive front-end is a single React island (`App.tsx`) hydrated on the client. There is no client-side routing; all navigation state is managed in memory by Zustand.

```
Browser
  |
  | HTTPS
  v
Cloudflare Workers (Astro SSR)
  |-- src/middleware.ts       Clerk session validation on every request
  |-- src/pages/index.astro  Renders the HTML shell and mounts the React island
  |-- src/pages/api/chat.ts  Streaming proxy to the upstream Ollama endpoint
  |-- src/pages/api/chats/   REST endpoints for chat CRUD (list, create, delete)
  |-- src/pages/api/messages/ REST endpoints for message CRUD
  |-- src/pages/api/settings/ REST endpoints for user settings
  |
  | libSQL (Turso)
  v
Database
  |-- settings    User language and model preferences
  |-- chats       Chat sessions (id, userId, title, createdAt, folder, pinned)
  |-- messages    Messages per chat (id, chatId, role, content, timestamp)
```

The upstream model endpoint is called server-side only. Credentials (`NECOOKIE_CLIENT_ID`, `NECOOKIE_CLIENT_SECRET`) are never exposed to the browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build/) (`output: 'server'`) |
| Deployment | [Cloudflare Workers](https://workers.cloudflare.com/) via `@astrojs/cloudflare` |
| UI | [React 19](https://react.dev/) (single island) |
| State management | [Zustand 5](https://github.com/pmndrs/zustand) |
| Authentication | [Clerk](https://clerk.com/) (`@clerk/astro`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + custom global CSS |
| Markdown rendering | `react-markdown`, `remark-gfm`, `react-syntax-highlighter` |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Database | [Turso (libSQL)](https://turso.tech/) |

---

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── App.tsx                Main React island entry point
│   │   ├── Header.tsx             Top navigation bar with model selector
│   │   ├── Sidebar.tsx            Chat history, folders, and search
│   │   ├── ChatCanvas.tsx         Message rendering area
│   │   ├── ChatMessage.tsx        Individual message with markdown rendering
│   │   ├── ChatInput.tsx          Message composer and send controls
│   │   ├── WelcomeScreen.tsx      Prompt suggestions shown on a new chat
│   │   ├── SettingsPanel.tsx      Language, model, and display preferences
│   │   ├── FoldersView.tsx        Folder management view
│   │   ├── FolderModal.tsx        Create / rename folder dialog
│   │   ├── HelpPanel.tsx          In-app documentation panel
│   │   ├── SignInPage.tsx         Clerk sign-in page wrapper
│   │   ├── WeatherTimeWidget.tsx  Ambient clock and weather display
│   │   ├── LeavesBackground.tsx   Decorative animated background
│   │   ├── AntigravityDashboard.tsx  Internal admin/debug panel
│   │   └── ui/                    Shared primitive UI components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts          Drizzle ORM table definitions
│   │   │   └── client.ts          Turso database client initialization
│   │   ├── slices/
│   │   │   ├── chatSlice.ts       Chat session state and actions
│   │   │   ├── messageSlice.ts    Message streaming state and actions
│   │   │   ├── settingsSlice.ts   User settings state
│   │   │   └── uiSlice.ts         UI state (panels, sidebar, compact mode)
│   │   ├── locales/               i18n dictionary files (en, es, fr, de, ja)
│   │   ├── context.tsx            React context for dependency injection
│   │   ├── i18n.ts                i18n lookup utilities
│   │   └── store.ts               Shared types, model list, utility functions
│   ├── pages/
│   │   ├── index.astro            Application entry point
│   │   └── api/
│   │       ├── chat.ts            Streaming chat proxy endpoint
│   │       ├── chats/             Chat CRUD endpoints
│   │       ├── messages/          Message CRUD endpoints
│   │       └── settings/          User settings endpoints
│   ├── styles/
│   │   └── global.css             Global styles and markdown overrides
│   └── middleware.ts              Clerk authentication middleware
├── .env.example                   Environment variable reference
├── astro.config.mjs               Astro configuration
├── drizzle.config.ts              Drizzle Kit configuration
├── package.json
├── tsconfig.json
└── wrangler.toml                  Cloudflare Workers configuration
```

---

## Local Setup

### Prerequisites

- **Node.js** v22.12.0 or higher
- **pnpm** (recommended) — install with `npm install -g pnpm`

### 1. Clone the repository

```bash
git clone <repository-url>
cd necookie-ai
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the provided example file and populate it with your credentials:

```bash
cp .env.example .env
```

Open `.env` and set the following values:

| Variable | Description |
|---|---|
| `NECOOKIE_ENDPOINT` | Full URL to your Ollama-compatible chat endpoint |
| `NECOOKIE_MODEL` | Default model name served by that endpoint |
| `NECOOKIE_CLIENT_ID` | Cloudflare Access service token Client ID |
| `NECOOKIE_CLIENT_SECRET` | Cloudflare Access service token Client Secret |
| `TURSO_DATABASE_URL` | libSQL connection URL from your Turso dashboard |
| `TURSO_AUTH_TOKEN` | Auth token from your Turso dashboard |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (prefixed `PUBLIC_` for client exposure) |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side only, never sent to the browser) |

### 4. Run the development server

```bash
pnpm dev
```

The application will be available at `http://localhost:4321`.

### 5. Production build

```bash
pnpm build
```

The compiled output is written to `./dist/`. Deploy by running `wrangler deploy` with appropriate Cloudflare credentials.

---

## Database

Necookie AI uses Drizzle ORM against a Turso (libSQL) database. The schema defines three tables:

- **settings** — one row per user storing their preferred language and model
- **chats** — chat sessions with title, folder, pinned status, and a user ID
- **messages** — individual messages referencing a parent chat, with cascade delete on chat removal

To generate and apply migrations, use Drizzle Kit:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

The `drizzle.config.ts` file at the project root configures the migration output directory and database driver.

---

## API Endpoints

All endpoints are server-side only. Requests from the browser are authenticated through Clerk middleware before reaching any handler.

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat` | Streams a chat completion from the upstream model |
| `GET` | `/api/chats` | Returns all chats for the authenticated user |
| `POST` | `/api/chats` | Creates a new chat session |
| `DELETE` | `/api/chats/[id]` | Deletes a chat and cascades to its messages |
| `GET` | `/api/messages/[chatId]` | Returns all messages for a given chat |
| `POST` | `/api/messages` | Saves a new message |
| `GET` | `/api/settings` | Returns the user's stored settings |
| `POST` | `/api/settings` | Creates or updates the user's settings |

---

## Privacy

The upstream model endpoint is called exclusively from the Astro server-side handler. The browser never contacts the LLM directly. API credentials (`NECOOKIE_CLIENT_ID`, `NECOOKIE_CLIENT_SECRET`, `CLERK_SECRET_KEY`, `TURSO_AUTH_TOKEN`) exist only in the server environment and are absent from any client-side bundle. Chat content is processed within the hosting infrastructure and is not forwarded to any external analytics service.

---

## License

Necookie AI is distributed under the Apache License 2.0. The Qwen2.5-Coder 3B model by Alibaba Cloud, which may be served by the connected Ollama instance, is also released under the Apache License 2.0.

Copyright 2026 Dheyn Michael Orlanda
