# Necookie AI — Interface design

A quiet black-and-white workspace for writing, coding, and research. Follow [BRAND.md](BRAND.md) and the implemented tokens in `src/styles/global.css`.

## Palette

Default interface colors are neutral grays. Establish hierarchy with contrast, spacing, weight, and borders.

| Role / token | Light | Dark |
| --- | --- | --- |
| `--color-canvas` | `#ffffff` | `#111111` |
| `--color-surface-soft` | `#fafafa` | `#171717` |
| `--color-surface-card` | `#f5f5f5` | `#1f1f1f` |
| `--color-ink` | `#171717` | `#fafafa` |
| `--color-body` | `#404040` | `#d4d4d4` |
| `--color-muted` | `#666666` | `#b3b3b3` |
| `--color-muted-soft` | `#737373` | `#a3a3a3` |
| `--color-hairline` | `#dedede` | `#363636` |
| `--color-primary` | `#171717` | `#fafafa` |
| `--color-on-primary` | `#ffffff` | `#111111` |

Primary actions invert in dark mode. `--color-on-dark` stays light for code windows; use `--color-on-primary` on primary buttons and `--color-inverse` on ink backgrounds. Success, warning, and error states pair neutral colors with distinctive icons and explicit text.

Legacy `accent-teal`, `accent-amber`, and `surface-cream-strong` names remain neutral compatibility aliases. New components use semantic shadcn tokens such as `bg-background`, `text-foreground`, and `border-border`, mapped to the application palette.

## Typography

Inter handles headings, navigation, labels, and messages. JetBrains Mono handles code, color values, and technical metadata. Fall back to system sans-serif and monospace respectively.

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| Welcome heading | 28–36px responsive | 600 | 1.15 |
| Panel heading | 22–24px | 600 | 1.2 |
| Body / messages | 15–16px | 400 | 1.55–1.65 |
| Controls | 13–14px | 500 | 1.5 |
| Metadata | 11–12px | 400–500 | 1.4 |

Use concise headings and sentence case. Keep long message text at regular weight.

## Layout and surfaces

- Desktop sidebar: 240px wide, collapsing to a 52px icon rail. Below 768px it opens as an overlay drawer.
- Chat content and composer: centered, 760px maximum width. Scroll code horizontally without widening the viewport.
- Welcome suggestions: two columns from 400px, one column below. Use thin borders, 12px radii, 24px padding, and neutral hover surfaces.
- Settings and Help: centered overlay panels with dimmed backdrops, scrollable bodies, and visible close actions. Settings is at most 672px wide and 90vh high.
- Spacing: a 4px grid with common gaps of 8, 12, 16, 24, and 32px. Controls use 6–8px radii; panels use 12–16px.
- Compact mode reduces spacing while preserving readable text.

## Components and beUI

The app uses React 19, Tailwind CSS 4, and [beUI](https://beui.dev/). `components.json` configures the registry and `@/` alias. Add components with `pnpm dlx shadcn add @beui/<name>` and review their dependencies and semantic tokens.

The installed `src/components/motion/color-picker.tsx` and its supporting utilities come from beUI. `MessageMarkerPicker` composes the trigger, saturation area, hue slider, hex input, swatch, and presets inside Appearance settings. Its panel expands within the scrollable body so controls stay reachable on smaller screens.

The default assistant-message marker is `#737373`. Users can select a neutral preset or custom color. This preference persists immediately on the current device as `necookie-message-marker` and applies through `--message-marker`. Reset restores the default. It does not recolor navigation, body text, or primary actions.

Assistant messages use an open reading layout with a slim marker. Code blocks have a neutral dark frame; syntax colors distinguish code tokens. User-provided images retain their content colors.

## Motion and accessibility

- Use restrained springs, small press feedback, and short fades. Welcome cards lift by 2px.
- Respect `prefers-reduced-motion` in Motion components and CSS. Avoid decorative looping animation.
- Provide a visible 2px focus outline with a 3px offset. Label icon actions and retain keyboard input, Escape dismissal, and focus restoration.
- Color selection supports hex entry and keyboard controls as well as pointer dragging.
- Keep body text at AA contrast. Status, selection, and errors require text or shape cues beyond color.
- Theme and marker changes apply immediately. Language and compact mode retain their existing Save/Cancel behavior.

## Review

Inspect light and dark modes at desktop and mobile widths. Check the sidebar, cards, composer, dialogs, and error states for consistent neutral tokens. Open the picker, change a value, reload, reset, and test Escape. Run the production build and inspect for overflow and runtime errors before shipping.
