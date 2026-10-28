---
version: alpha
name: Siftify Web
description: Dark music-player interface with green accent and square-edged controls.
colors:
  primary: 'oklch(74% 0.2124 148.67)'
  background: 'oklch(12% 0.002 148.67)'
  foreground: 'oklch(99.11% 0.002 148.67)'
  muted: 'oklch(70.5% 0.004 148.67)'
  surface: 'oklch(21.03% 0.004 148.67)'
  surface-secondary: 'oklch(25.7% 0.003 148.67)'
  surface-tertiary: 'oklch(27.21% 0.003 148.67)'
  border: 'oklch(28% 0.002 148.67)'
  accent-foreground: 'oklch(15% 0.03 148.67)'
typography:
  body:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 400
rounded:
  default: 0px
components:
  body:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    typography: '{typography.body}'
  accent:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.accent-foreground}'
    rounded: '{rounded.default}'
---

## Overview

Document the UI as it exists, not a new design. `index.html` enables the dark theme; `src/app/globals.css` is the source of truth for both dark and light tokens. HeroUI styles and Tailwind utilities compose the interface.

## Colors

Use semantic classes such as `bg-background`, `bg-surface`, `bg-surface-secondary`, `text-foreground`, `text-muted`, `text-accent` and `border-border`. The green accent marks active controls and navigation; `accent-muted` is the lower-emphasis active background. Refer to `globals.css` for light-theme values and status colors rather than hard-coding dark colors.

## Typography

The body uses Geist Variable via `@fontsource-variable/geist`, `font-sans`, `text-base` and `font-normal`. Tables use smaller text and tabular numbers for track positions and durations.

## Layout

`src/routes/_app.tsx` uses a viewport-height grid with left navigation, a scrollable main area, a right sidebar and a player spanning the bottom. Track rows use fixed table columns and truncate long titles. The current sidebars have fixed widths and can leave no main content on narrow screens; mobile responsiveness is not implemented by this layout.

## Shapes

Global `--radius` and `--field-radius` are zero. Prefer the existing square-edged HeroUI controls and restrained borders; use existing semantic surface tiers for separation.

## Components

- Use HeroUI components and existing module patterns for buttons, inputs, tables and links. Icon-only controls need an accessible label.
- Custom icons live in `public/assets/icons/sprite.svg`: add a `<symbol>` with a unique `id` and `viewBox`, and render it with `src/common/ui/Icon.tsx` using its `name`. Icons inherit `currentColor`; the SVG is decorative and labelled by its enclosing control. SVGs should not hard-code a conflicting fill if they need to inherit the active color.
- The playback equalizer uses `equalizer-bar` animation in `globals.css`; it has a static `prefers-reduced-motion` alternative.

## Do's and Don'ts

- Use the existing `text-accent` and `bg-accent-muted` states for active navigation and controls.
- Preserve visible focus and keyboard-accessible controls; do not add extra screen-reader labels to decorative SVGs.
- Avoid inventing a separate palette, rounding scale or icon dependency when extending this UI.
