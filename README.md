# Necookie AI

Welcome to **Necookie AI**, an intelligent, self-hosted web interface and assistant designed for researchers, developers, and creators. More than just a boilerplate wrapper, Necookie AI acts as a peer collaborator, engineering sidekick, and creative partner.

---

## 🌟 Key Features

- **Model Selection:** Seamlessly switch between configured upstream models (e.g., `necookie-ai`, `necookie-ai-8b`) directly from the header.
- **Authentication:** Integrated [Clerk](https://clerk.com/) authentication to securely manage users and session status.
- **Compact Mode:** A fully responsive "Compact Mode" setting that scales down UI padding, margins, and layout spacing for high-density information displays.
- **State Management:** Fully modularized global state managed by [Zustand](https://github.com/pmndrs/zustand), enabling lightning-fast UI updates without React context re-render bloat.
- **Internationalization (i18n):** Native multi-language support localized into modular dictionaries (EN, ES, FR, DE, JA).
- **Persistent Storage:** Chat history, folders, and preferences are saved via client-side storage, with Cloudflare KV integrated for server-side session data.

---

## 🎨 Design Philosophy & Aesthetic

The interface is built around a **Modern Minimalist & Technical/Developer-centric** design philosophy. It is engineered to evoke mental clarity and industrial precision, prioritizing typographic flow and clean spacing over heavy decorative containers.

- **Palette & Contrast:** The UI utilizes a soft, slate-tinted off-white background (`#f8f9ff`) to reduce eye strain and provide a paper-like feel. Contrast is driven by desaturated slate-blue (`#0b1c30` / `#0F172A`).
- **Teal Accents:** A sharp Teal/Cyan accent (`#0D9488` / `#2dd4bf` / `#006a61`) is reserved strictly for focus states, active indicators, and primary action highlights.
- **Typography Hierarchy:**
  - **Geist:** Geometric structure for display and headlines.
  - **Inter:** Highly legible body font for message conversations.
  - **JetBrains Mono:** Monospaced typography for code blocks, labels, and system metadata.
- **Bubble-Free Layout:** There are no chat bubbles. Instead, the AI's responses are clean text blocks anchored by a vertical teal line.

---

## 🏗️ Tech Stack & Architecture

Necookie AI is built as a server-rendered (SSR) application using a single-island React architecture on top of Astro.

### Frontend
- **Framework:** [React 19](https://react.dev/) (Client components mounted inside a single Astro page island)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Modular slices for UI, Settings, Chat, Messages)
- **Authentication:** [Clerk React](https://clerk.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Vanilla CSS
- **Markdown & Code:** `react-markdown` and `remark-gfm` for layout parsing, syntax highlighting via Prism.
- **Icons:** [lucide-react](https://lucide.dev/)

### Backend
- **Framework:** [Astro 6](https://astro.build/) configured for Server-Side Rendering (`output: 'server'`)
- **Server Adapter:** Cloudflare adapter (`@astrojs/cloudflare`) leveraging Cloudflare Images and KV bindings.
- **Database:** Drizzle ORM configured with Turso (libSQL) integration.
- **Endpoints:** `/api/chat` acts as a secure server-side proxy handling text streaming and upstream communication.

---

## 📂 Folder Structure

```text
/
├── public/                # Static assets (favicons, etc.)
├── src/
│   ├── components/        # React components (App, Settings, Sidebar, ChatCanvas, ChatMessage, etc.)
│   ├── lib/
│   │   ├── db/            # Drizzle ORM schemas and DB setup
│   │   ├── slices/        # Zustand state slices (chatSlice, messageSlice, uiSlice, settingsSlice)
│   │   ├── locales/       # Split i18n locale dictionaries
│   │   └── store.ts       # Shared types, unified Zustand store creation, models
│   ├── pages/
│   │   ├── api/           # Secure proxy endpoints handling streaming and auth
│   │   └── index.astro    # Core entry point page (loads the React Island)
│   └── styles/
│       └── global.css     # Global style rules and Markdown CSS overrides
├── .env.example           # Example local configuration settings
├── astro.config.mjs       # Astro configuration (Cloudflare adapter, React, Tailwind)
├── package.json           # Project dependencies and run scripts
└── tsconfig.json          # TypeScript configurations
```

---

## 🚀 Setup & Installation

Follow these steps to run Necookie AI locally.

### 1. Prerequisites
- **Node.js:** `v22.12.0` or higher
- **Package Manager:** `pnpm` (recommended) or `npm`

### 2. Configure Environment Variables
Copy the template `.env.example` file to create a local `.env` configuration:
```bash
cp .env.example .env
```
Open `.env` and fill in the required keys:
* `NECOOKIE_ENDPOINT`: The full URL to your upstream Ollama-compatible endpoint.
* `NECOOKIE_CLIENT_ID` / `NECOOKIE_CLIENT_SECRET`: Cloudflare Access keys (if using CF Access).
* `VITE_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`: Clerk authentication keys.

### 3. Install Dependencies
Run this in the root directory to fetch all packages:
```bash
pnpm install
```

### 4. Running the Development Server
Launch the Astro dev environment locally:
```bash
pnpm run dev
```
The site will be available at `http://localhost:4321`.

### 5. Production Build
Compile a production-ready standalone build to the `./dist/` directory:
```bash
pnpm run build
```

---

## 🔒 AI Safety & Privacy

### Zero Data Leakage
Your queries, secrets, and code snippets are handled with privacy by design:
- **Local / Self-Hosted Context:** Integrates with your own self-hosted or private Ollama-compatible LLM endpoint.
- **Private Memory:** All data remains strictly within the RAM/VRAM of the hosting server and is processed local to your network infrastructure.
- **Credentials Security:** Client-side requests are proxied via the Astro server-side routes. API configurations are kept strictly on the backend and are never exposed to the client browser.

---

## 📜 Acknowledgments & License

This project uses the Qwen2.5-Coder 3B model by Alibaba Cloud, licensed under the Apache License 2.0. The Necookie AI configuration, web UI, and backend wrapper code are also distributed under the Apache License 2.0.
