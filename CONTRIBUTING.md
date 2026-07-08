# Contributing

Thank you for your interest in contributing to Necookie AI.

---

## Before You Start

Check the issue tracker for existing reports before opening a new one. If you plan to work on something non-trivial, open an issue first to discuss the approach. This avoids duplicated effort and ensures contributions align with the project's direction.

---

## Development Setup

Follow the [local setup instructions](README.md#local-setup) in the README to get the development server running. You will need credentials for Clerk, Turso, and a reachable Ollama-compatible endpoint.

For the database, Drizzle Kit can run against the local SQLite replica during development. The local replica file is listed in `.gitignore` and is not committed.

---

## Making Changes

**Branch naming.** Use short, descriptive branch names: `fix/sidebar-scroll`, `feat/folder-rename`, `docs/readme-update`.

**Commits.** Write commit messages in the imperative mood: "Fix sidebar scroll on mobile" rather than "Fixed" or "Fixing". Keep the subject line under 72 characters. Add a body if the change needs context that the diff alone does not provide.

**Code style.** The project uses TypeScript throughout. Match the style of the surrounding code. There is no linter enforced yet — use judgment about consistency.

**Component patterns.** React components live in `src/components/`. Shared primitive components (buttons, inputs, dialogs) live in `src/components/ui/`. State slices live in `src/lib/slices/`. Do not add client-side data fetching inside components; use the existing API endpoints and Zustand slice actions.

**API endpoints.** Each endpoint file under `src/pages/api/` is a standard Astro API route. Authentication is handled by the Clerk middleware before any handler runs — do not duplicate auth checks inside endpoint handlers.

**Database changes.** If your change requires a schema modification, update `src/lib/db/schema.ts` and generate a migration using `pnpm drizzle-kit generate`. Do not hand-edit the migration files.

---

## Pull Requests

- Open pull requests against the `main` branch
- Describe what the change does and why
- Reference the related issue if one exists
- Keep changes focused — separate unrelated fixes into separate pull requests
- Include screenshots for any visual changes

---

## Reporting Bugs

Include the following when reporting a bug:

- What you did
- What you expected to happen
- What actually happened
- Browser and operating system
- Any relevant error messages or console output

---

## License

By contributing to this project, you agree that your contributions are licensed under the Apache License 2.0, the same license as the project itself.
