# Necookie AI

Welcome to **Necookie AI**, an intelligent, self-hosted web interface and assistant designed for researchers, developers, and creators. More than just a boilerplate wrapper, Necookie AI acts as a peer collaborator, engineering sidekick, and creative partner.

---

## Design Philosophy & Aesthetic

The interface is built around a **Modern Minimalist & Technical/Developer-centric** design philosophy, detailed in [DESIGN.md](./DESIGN.md). It is engineered to evoke mental clarity and industrial precision, prioritizing typographic flow and clean spacing over heavy decorative containers.

- **Palette & Contrast:** The UI utilizes a soft, slate-tinted off-white background (`#f8f9ff`) to reduce eye strain and provide a paper-like feel. Contrast is driven by desaturated slate-blue (`#0b1c30` / `#0F172A`) for high-contrast structure and text. 
- **Teal Accents:** A sharp Teal/Cyan accent (`#0D9488` / `#2dd4bf` / `#006a61`) is reserved strictly for focus states, active indicators, and primary action highlights.
- **Typography Hierarchy:**
  - **Geist:** Geometric structure for display and headlines.
  - **Inter:** Highly legible body font for message conversations.
  - **JetBrains Mono:** Monospaced typography for code blocks, labels, and system metadata.
- **Tonal Layers & Outlines:** In line with its minimalist principles, the layout rejects heavy shadows and glassmorphism. Surfaces sit on the same plane, separated by 1px solid low-contrast borders (`#E2E8F0` / `#c6c6cd`).
- **Technical-Sharp Shapes:** Borders use a disciplined minimum rounding (6px to 8px) for buttons, inputs, and cards to maintain an engineered, precise feel.
- **Bubble-Free Layout:** There are no chat bubbles. Instead, the AI's responses are clean text blocks anchored by a 2px vertical teal line on the left.

---

## Tech Stack & Architecture

Necookie AI is built as a server-rendered (SSR) application using a single-island React architecture on top of Astro.

### Frontend
- **Framework:** [React 19](https://react.dev/) (Client components mounted inside a single Astro page island)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Vanilla CSS (configured via Vite plugins)
- **Markdown & Code:** [react-markdown](https://github.com/remarkjs/react-markdown) and [remark-gfm](https://github.com/remarkjs/remark-gfm) for layout parsing
- **Icons:** [lucide-react](https://lucide.dev/) for crisp, uniform iconography

### Backend
- **Framework:** [Astro 6](https://astro.build/) configured for Server-Side Rendering (`output: 'server'`)
- **Server Adapter:** Standalone Node.js server adapter (`@astrojs/node`)
- **Endpoints:** `/api/chat` acts as a secure server-side middleware proxy to the private AI backend

---

## Folder Structure

```text
/
├── public/                # Static assets (favicons, etc.)
├── src/
│   ├── components/        # React components (App, Settings, Sidebar, ChatCanvas, etc.)
│   ├── lib/
│   │   ├── context.tsx    # React Application context (SSE parser, chat state)
│   │   ├── i18n.ts        # Localization dictionaries (EN, ES, FR, DE, JA)
│   │   └── store.ts       # Shared types, model list, and utility functions
│   ├── pages/
│   │   ├── api/
│   │   │   └── chat.ts    # Secure proxy endpoint handling Cloudflare Access tokens
│   │   └── index.astro    # Core entry point page (loads the React Island)
│   └── styles/
│       └── global.css     # Global style rules and Markdown CSS overrides
├── .env.example           # Example local configuration settings
├── astro.config.mjs       # Astro configuration (Node, React, Tailwind)
├── DESIGN.md              # Brand style guides, colors, typography, layout rules
├── LICENSE                # Apache 2.0 License file
├── package.json           # Project dependencies and run scripts
└── tsconfig.json          # TypeScript configurations
```

---

## Setup & Installation

Follow these steps to run Necookie AI locally.

### 1. Prerequisites
- **Node.js:** `v22.12.0` or higher
- **Package Manager:** `npm` (bundled with Node)

### 2. Configure Environment Variables
Copy the template `.env.example` file to create a local `.env` configuration:
```bash
cp .env.example .env
```
Open `.env` and fill in the required keys:
* `NECOOKIE_ENDPOINT`: The full URL to your upstream Ollama-compatible endpoint.
* `NECOOKIE_MODEL`: The identifier of the customized Ollama model (typically `necookie-ai`).
* `NECOOKIE_CLIENT_ID`: Cloudflare Access Client ID (if running behind Cloudflare Access).
* `NECOOKIE_CLIENT_SECRET`: Cloudflare Access Client Secret.

### 3. Install Dependencies
Run this in the root directory to fetch all packages:
```bash
npm install
```

### 4. Running the Development Server
Launch the Astro dev environment locally:
```bash
npm run dev
```
The site will be available at `http://localhost:4321`.

### 5. Production Build
Compile a production-ready standalone build to the `./dist/` directory:
```bash
npm run build
```
Preview the built server:
```bash
npm run preview
```

---

## The Necookie AI Persona

Necookie AI utilizes a customized `Modelfile` instructing the LLM to think and act differently than generic assistants. Instead of offering overly formal or sanitized responses, the AI communicates with a grounded, collaborative, and peer-to-peer developer voice. It is designed to act as:
- **A Researcher:** Connecting dots and analyzing technical logic.
- **A Engineering Peer:** Reviewing details, proposing direct fixes, and discussing optimizations.
- **A Creative Partner:** Brainstorming alongside you without robotic template text.

---

## AI Safety & Privacy

### Zero Data Leakage
Your queries, secrets, and code snippets are handled with privacy by design:
- **Local / Self-Hosted Context:** Since this application integrates with your own self-hosted or private Ollama-compatible LLM endpoint, no prompt data or generated text is sent to third-party corporate servers.
- **Private Memory:** All data remains strictly within the RAM/VRAM of the hosting server and is processed local to your network infrastructure.
- **Credentials Security:** Client-side requests are proxied via the Astro server-side route `/api/chat`. Your Cloudflare Access client tokens and API configurations are kept strictly on the backend and are never exposed to the client browser.

### Environment Isolation
- **Code Execution Advice:** Although the chat interface formats code blocks beautifully and supports downloading files locally, it does not execute generated code on the host system. Always review any code, scripts, or instructions generated by the AI and run them in a sandboxed environment (such as Docker, a containerized sandbox, or a virtual machine) to ensure system security.

---

## Acknowledgments & License

This project uses the Qwen2.5-Coder 3B model by Alibaba Cloud, licensed under the Apache License 2.0. The necookie AI configuration, web UI, and backend wrapper code are also distributed under the Apache License 2.0.
