# Design Reference — Necookie AI

This document describes the visual design system, component patterns, and UI principles that govern the Necookie AI interface. It serves as the authoritative reference for any contributor working on the front-end.

---

## Design Philosophy

The interface is built around a modern minimalist, developer-centric aesthetic. The goal is to reduce cognitive friction during extended work sessions, not to make a visual statement. Decoration is used sparingly and only when it improves information hierarchy or orientation.

The layout avoids chat bubble patterns entirely. Assistant responses are presented as clean text blocks anchored by a vertical teal accent line, keeping the reading experience similar to a terminal or code editor rather than a messaging app.

---

## Color System

The palette separates into three roles: background surfaces, text, and accents.

### Background and Surface

| Role | Token | Value |
|---|---|---|
| Page background | `--bg-base` | `#f8f9ff` |
| Sidebar background | `--bg-sidebar` | `#f0f2fb` |
| Card / panel surface | `--bg-surface` | `#ffffff` |
| Input background | `--bg-input` | `#eef0fa` |
| Dark surface (modals, overlays) | `--bg-dark` | `#0b1c30` |

The page background is a soft slate-tinted off-white rather than pure white. This reduces glare on high-brightness displays and gives the interface a paper-like quality without veering into warm cream territory.

### Text

| Role | Token | Value |
|---|---|---|
| Primary text | `--text-primary` | `#0b1c30` |
| Secondary text | `--text-secondary` | `#0F172A` |
| Muted / metadata | `--text-muted` | `#64748b` |
| Inverse text (on dark) | `--text-inverse` | `#f8f9ff` |

### Accent

The accent color is a sharp teal/cyan. It is reserved strictly for focus states, active indicators, the assistant response line marker, and primary action highlights. It does not appear on decorative elements.

| Role | Token | Value |
|---|---|---|
| Primary accent | `--accent` | `#0D9488` |
| Accent light | `--accent-light` | `#2dd4bf` |
| Accent dark | `--accent-dark` | `#006a61` |

### Semantic

| Role | Token | Value |
|---|---|---|
| Destructive / error | `--color-error` | `#dc2626` |
| Warning | `--color-warning` | `#d97706` |
| Success | `--color-success` | `#16a34a` |

---

## Typography

Three font families are in use. Each has a distinct role that does not overlap.

| Family | Role | Fallback |
|---|---|---|
| Geist | Display headings, brand wordmark | `system-ui`, `sans-serif` |
| Inter | Body text, UI labels, message content | `system-ui`, `sans-serif` |
| JetBrains Mono | Code blocks, inline code, system metadata | `ui-monospace`, `monospace` |

### Type Scale

| Label | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Display large | 32px | 600 | 1.1 | Welcome screen heading |
| Display medium | 24px | 600 | 1.2 | Section headings |
| Title | 18px | 600 | 1.3 | Panel titles, sidebar section labels |
| Body | 16px | 400 | 1.55 | Message content, settings descriptions |
| Body small | 14px | 400 | 1.5 | Timestamps, metadata, breadcrumbs |
| Caption | 12px | 500 | 1.4 | Badges, status labels |
| Code | 14px | 400 | 1.6 | Inline and block code |

Body weight stays at 400 for message text to reduce reading fatigue over long conversations. Weight 500 and 600 are reserved for labels, headings, and navigation items where scanning speed matters more than reading comfort.

---

## Spacing

The spacing system uses a 4px base unit.

| Token | Value | Common Use |
|---|---|---|
| `space-1` | 4px | Icon gaps, tight label padding |
| `space-2` | 8px | Component internal padding (small) |
| `space-3` | 12px | Button padding, input padding |
| `space-4` | 16px | Default component gap |
| `space-6` | 24px | Section internal spacing |
| `space-8` | 32px | Panel padding |
| `space-12` | 48px | Section separation |

Compact Mode, when enabled by the user, applies a global multiplier that reduces padding and margins across the layout by approximately 25% without altering font sizes.

---

## Layout

The application uses a three-column layout at desktop widths.

```
+------------------+----------------------------------+
|                  |                                  |
|  Sidebar         |  Chat Canvas                     |
|  (260px fixed)   |  (flex-grow, centered content)   |
|                  |                                  |
|  - Chat list     |  - Welcome screen or messages    |
|  - Folders       |  - Chat input (pinned bottom)    |
|  - Settings btn  |                                  |
|                  |                                  |
+------------------+----------------------------------+
```

**Sidebar** is fixed-width at 260px. On narrower viewports it collapses off-screen and can be toggled via the header control.

**Chat Canvas** takes the remaining width. Message content is constrained to a max-width of 800px and centered within the canvas to keep line lengths comfortable on wide displays.

**Chat Input** is fixed to the bottom of the canvas. It grows vertically with content up to a maximum height before switching to internal scroll.

There are no modals with backdrop overlays except for the folder rename/create dialog. Settings and Help open as slide-in panels anchored to the right edge.

---

## Components

### Message Layout

User messages are right-aligned, displayed in a plain block with no decorative border. Assistant messages are left-aligned with a 3px vertical teal accent line (`--accent`) on the left edge, serving as the visual separator between the two roles.

Streaming messages display a blinking cursor at the insertion point. When streaming completes, the cursor disappears and the copy, rating, and regeneration controls fade in.

### Code Blocks

Code blocks use the JetBrains Mono font at 14px on a slightly darker surface color (`--bg-input`). A language label and a copy button appear in the top-right corner. Horizontal scrolling is preferred over line wrapping inside code blocks.

Inline code uses the same font family at 13px with a subtle background tint and 2px horizontal padding, without a border.

### Sidebar Chat Items

Each chat item in the sidebar displays the derived title on a single line, truncated with an ellipsis if it overflows. A timestamp is shown as relative time (e.g., "3 hours ago"). On hover, action controls for rename, move-to-folder, pin, and delete appear.

Pinned chats appear at the top of the list under a "Pinned" label. Below that, chats are grouped by date: Today, Yesterday, the past 7 days by weekday name, and then by month for older entries.

### Input Composer

The chat input is a resizable `textarea` styled to look like a flat text field. It has no visible border in the resting state; a bottom border in `--accent` appears on focus. A send button sits to the right and activates only when the field has non-empty, non-whitespace content. The Enter key submits; Shift+Enter inserts a newline.

### Settings Panel

The settings panel slides in from the right over the canvas. It is not a modal — the sidebar remains accessible behind it. Settings are grouped into: account, appearance (language, compact mode), model selection, and danger zone (clear history). Changes are persisted immediately via the `/api/settings` endpoint without a save button, except for destructive actions which require a confirmation step.

---

## Motion and Animation

Animations are functional rather than decorative. They communicate state transitions and preserve spatial orientation.

| Interaction | Animation |
|---|---|
| Sidebar open/close | Slide and fade, 200ms ease-out |
| Settings/Help panel open | Slide in from right, 250ms ease-out |
| New message appear | Fade in, 150ms ease |
| Streaming cursor | Blink at 1s interval |
| Button hover | Background tint transition, 100ms |
| Modal dialog | Scale from 95% to 100%, fade in, 200ms |

No animation exceeds 300ms. Nothing loops unless it is communicating an ongoing process (streaming cursor, loading spinner).

Framer Motion is used for layout animations and panel transitions. CSS transitions handle hover states and simple opacity changes.

---

## Responsive Behavior

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile | < 768px | Sidebar hidden by default, header toggle reveals it as a full-height drawer |
| Tablet | 768px - 1024px | Sidebar visible but narrower (220px); message max-width reduces to 680px |
| Desktop | > 1024px | Full three-column layout; message max-width 800px |

At mobile widths the sidebar overlays the canvas rather than pushing it. A tap outside the sidebar closes it.

---

## Accessibility

Focus states use the `--accent` color as a 2px outline with a 2px offset. No focus state is suppressed.

Color contrast ratios meet WCAG AA at minimum for all text/background combinations. The muted text (`--text-muted`) on the sidebar background is the most constrained pair and targets a 4.5:1 ratio.

Interactive elements have a minimum touch target size of 40x40px. Icon-only buttons carry `aria-label` attributes.

Streaming responses update a live region so screen readers announce new content without the user navigating to it.

---

## Compact Mode

Compact Mode is a user-controlled density setting toggled from the settings panel. When active, it adds a `data-compact="true"` attribute to the root element. Global CSS rules scoped to this attribute reduce:

- Sidebar item padding from 12px to 8px
- Message vertical spacing from 24px to 14px
- Header height from 56px to 44px
- Input area padding from 16px to 10px

Font sizes do not change in Compact Mode.
