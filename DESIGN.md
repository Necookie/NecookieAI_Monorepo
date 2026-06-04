---
name: Necookie AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  system-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  max-width: 1100px
---

## Brand & Style
This design system embodies an extreme minimalist aesthetic tailored for high-focus AI interactions. The brand personality is clinical, technical, and unobtrusive, positioning the AI as a precision tool rather than a digital companion. 

The visual language draws from **Modern Minimalism** with a **Technical/Developer-centric** edge. It prioritizes typographic flow over decorative containers. The emotional goal is to evoke a sense of mental clarity and industrial precision, achieved through expansive whitespace, an intentional lack of heavy shadows, and an asymmetric layout that breaks traditional chat patterns.

## Colors
The palette is rooted in a soft, slate-tinted off-white (#F8FAFC) to reduce eye strain while maintaining a crisp, paper-like feel. 

- **Primary:** Desaturated slate-blue (#0F172A) is used for high-contrast text and structural elements, ensuring maximum legibility.
- **Secondary/Accent:** A sharp Teal/Cyan (#0D9488) is reserved strictly for focus states, active indicators, and primary action highlights.
- **Neutral:** Slate-gray tones are used for secondary information and borders to maintain a low-viscosity interface.
- **Surface:** Subtle variations of the background tint are used to distinguish system messages from user input without the use of heavy "chat bubbles."

## Typography
The typographic system relies on a hierarchy of three distinct typefaces to separate intent. **Geist** provides a modern, geometric structure for headlines. **Inter** handles the heavy lifting of the chat dialogue for maximum readability. **JetBrains Mono** is utilized for system metadata, labels, and code blocks to reinforce the technical nature of the tool.

Text is treated as the primary structural element. Rather than containing messages in boxes, use varying weights and the monospaced label font to denote different speakers (e.g., "USER" vs "AI" in small-caps monospace).

## Layout & Spacing
The layout follows an **Asymmetric Fixed Grid**. Content is centered within a maximum width of 1100px, but message alignment should feel staggered rather than perfectly centered to create a dynamic flow.

- **Whitespace:** Use aggressive vertical padding between message exchanges (48px+) to prevent visual clutter.
- **Gutters:** Maintain a 24px horizontal gutter. 
- **Responsive:** On mobile, margins shrink to 20px and the layout becomes strictly vertical. On desktop, the "System Info" or "History" sidebar should be treated as a floating, low-contrast utility column rather than a heavy pane.

## Elevation & Depth
This design system eschews shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. 

Depth is communicated through 1px solid borders in a soft slate tint (#E2E8F0). Surfaces do not "float" with shadows; they sit on the same plane, separated by thin lines or slight shifts in background saturation. Input areas should use a slightly inset look or a sharp 1px border that shifts to teal on focus. No blurs or glassmorphism are permitted; the interface must remain opaque and grounded.

## Shapes
The shape language is "Technical-Sharp." While not perfectly square, the roundedness is kept to a disciplined minimum (6px-8px) to maintain a precise, engineered feel. 

- **Containers:** 6px radius for buttons and input fields.
- **Cards/Sections:** 8px radius for larger structural groupings.
- **Selections:** Rectangular focus states with zero or minimal rounding to contrast against the soft text flow.

## Components
- **Buttons:** Ghost-style by default with 1px slate-blue borders. Transition to a solid teal fill or teal border on hover. Use monospace labels for utility buttons (e.g., "COPY", "REGENERATE").
- **Input Fields:** A single, wide text area at the bottom of the viewport, defined by a 1px border. No heavy shadows; the focus state is a subtle teal glow or border color shift.
- **Messages:** No chat bubbles. Use a vertical "accent line" (2px wide) of teal to the left of the AI's response to provide a visual anchor.
- **Chips/Badges:** Small, rectangular labels using monospace type. Use background fills of #F1F5F9 for secondary tags.
- **Progress Indicators:** Use thin, horizontal line-based loaders rather than circular spinners to match the geometric theme.
- **Code Blocks:** High-contrast dark backgrounds (#0F172A) with sharp 6px corners, providing a stark visual break from the light-mode UI.