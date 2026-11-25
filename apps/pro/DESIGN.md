---
version: alpha
name: Antônio Mascarenhas — Pro
description: "Editorial and near-monochrome, like a printed page: black ink at stepped alpha on a white surface (warm cream in the sunset theme), with generous air between sections. A friendly serif (Calistoga, weight 400) carries every heading; Poppins carries body, labels and controls. Colour does almost no structural work: black is the action colour, orange `bulb-on` only marks an 'on/checked' state, red only marks errors. Controls are small white pills and 6px-radius buttons inside translucent segmented containers; section panels use 32px radius. Depth is nearly flat (three soft shadows), and motion is tuned per case rather than forced onto one curve."
colors:
  primary: '#000000'
  on-primary: '#FFFFFF'
  surface: '#FFFFFF'
  alpha-black-100: '#000000'
  alpha-black-90: '#000000E6'
  alpha-black-80: '#000000CC'
  alpha-black-70: '#000000B3'
  alpha-black-60: '#00000099'
  alpha-black-50: '#00000080'
  alpha-black-40: '#00000066'
  alpha-black-30: '#0000004D'
  alpha-black-10: '#0000001A'
  alpha-black-5: '#0000000D'
  alpha-black-2: '#00000005'
  alpha-white-100: '#FFFFFF'
  link-highlight: '#FFEB99'
  bulb-on: '#FF7C00'
  red-500: '#EB2B30'
  pink-500: '#FF002F'
  # Theme groups: the top-level values above are the `day` theme. Each group lists only what that mode
  # overrides; the code keeps the same token names (`--color-surface`…), switched by `data-theme` / a11y class.
  sunset:
    surface: '#FDFAEE'
  high-contrast: # key roles only; the full inverted ramp is in Colors → Themes
    surface: '#000000'
    alpha-white-100: '#000000'
    alpha-black-100: '#FFFFFF'
    red-500: '#FF6B6B'
typography:
  display-2xl: { fontFamily: Calistoga, fontSize: 72px, fontWeight: 400, lineHeight: 90px }
  display-xl: { fontFamily: Calistoga, fontSize: 60px, fontWeight: 400, lineHeight: 72px }
  display-lg: { fontFamily: Calistoga, fontSize: 48px, fontWeight: 400, lineHeight: 60px }
  display-md: { fontFamily: Calistoga, fontSize: 36px, fontWeight: 400, lineHeight: 44px }
  display-sm: { fontFamily: Calistoga, fontSize: 30px, fontWeight: 400, lineHeight: 38px }
  display-xs: { fontFamily: Calistoga, fontSize: 24px, fontWeight: 400, lineHeight: 32px }
  body-xl: { fontFamily: Poppins, fontSize: 20px, fontWeight: 400, lineHeight: 30px }
  body-lg: { fontFamily: Poppins, fontSize: 18px, fontWeight: 400, lineHeight: 28px }
  body-md: { fontFamily: Poppins, fontSize: 16px, fontWeight: 400, lineHeight: 24px }
  body-sm: { fontFamily: Poppins, fontSize: 14px, fontWeight: 400, lineHeight: 20px }
  body-xs: { fontFamily: Poppins, fontSize: 12px, fontWeight: 400, lineHeight: 18px }
  label-sm: { fontFamily: Poppins, fontSize: 14px, fontWeight: 600, lineHeight: 20px }
  label-caps: { fontFamily: Poppins, fontSize: 14px, fontWeight: 600, lineHeight: 20px, letterSpacing: 0.56px }
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  2xl: 20px
  3xl: 24px
  4xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 48px
  5xl: 64px
  section: 180px
  section-compact: 100px
  section-end: 64px
  panel: 36px
  container-page: 1066px # code: calc(1050px + 1rem); 1066 assumes a 16px root (grows with a11y bigger text)
  container-content: 986px
  container-column-wide: 520px
  container-column: 450px
  container-text: 430px
  container-illustration: 390px
motion:
  # Purpose-named; mirrors `src/shared/animations.ts` (seconds there) and `transition-interface`.
  interface-feedback: { duration: 400ms, delay: 0ms, timingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
  accordion-toggle: { duration: 300ms, delay: 0ms, timingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
  avatar-reveal: { duration: 350ms, delay: 0ms, timingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
  illustration-fade: { duration: 400ms, delay: 0ms, timingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
  locale-scramble: { duration: 1000ms, delay: 0ms, timingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
  spinner-rotation: { duration: 800ms, delay: 0ms, timingFunction: linear }
components:
  button-submit:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.lg}'
    padding: 12px 18px
  button-submit-hover:
    backgroundColor: '{colors.alpha-black-70}'
  button-white-active:
    backgroundColor: '{colors.alpha-white-100}'
    textColor: '{colors.alpha-black-100}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.sm}'
    padding: 0 10px
    height: 29px
  button-white-inactive:
    textColor: '{colors.alpha-black-100}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.sm}'
    padding: 0 10px
    height: 29px
  button-white-inactive-hover:
    backgroundColor: '{colors.alpha-black-5}'
  button-white-sm:
    typography: '{typography.body-xs}'
    padding: 0 8px
    height: 24px
  button-white-lg:
    typography: '{typography.body-md}'
    padding: 0 12px
    height: 33px
  segmented-container:
    backgroundColor: '{colors.alpha-black-5}'
    rounded: '{rounded.md}'
    padding: 3px
  chip-outline:
    textColor: '{colors.alpha-black-100}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.full}'
    padding: 5px 12px
  chip-outline-hover:
    backgroundColor: '{colors.alpha-black-5}'
  chip-filled: # text is alpha-black-100; omitted here because the linter ignores the tint's alpha
    backgroundColor: '{colors.alpha-black-5}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.full}'
    padding: 5px 12px
  chip-filled-hover:
    backgroundColor: '{colors.alpha-black-10}'
  chip-white:
    backgroundColor: '{colors.alpha-white-100}'
    textColor: '{colors.alpha-black-100}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.full}'
    padding: 5px 12px
  field-box:
    textColor: '{colors.alpha-black-80}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.lg}'
    padding: 14px 16px
  field-label:
    textColor: '{colors.alpha-black-60}'
    typography: '{typography.label-caps}'
  control-checked:
    backgroundColor: '{colors.bulb-on}'
  toggle-track:
    backgroundColor: '{colors.alpha-black-5}'
  toggle-thumb:
    backgroundColor: '{colors.alpha-white-100}'
  section-panel:
    rounded: '{rounded.4xl}'
  project-cover:
    backgroundColor: '{colors.alpha-black-5}'
    rounded: '{rounded.md}'
  highlighted-link:
    backgroundColor: '{colors.link-highlight}'
  page-sunset:
    backgroundColor: '{colors.sunset.surface}'
  page-high-contrast:
    backgroundColor: '{colors.high-contrast.surface}'
    textColor: '{colors.high-contrast.alpha-black-100}'
  button-white-high-contrast:
    backgroundColor: '{colors.high-contrast.alpha-white-100}'
    textColor: '{colors.high-contrast.alpha-black-100}'
  field-hint-error-high-contrast:
    textColor: '{colors.high-contrast.red-500}'
  lead-text:
    textColor: '{colors.alpha-black-80}'
    typography: '{typography.body-md}'
  entry-title:
    textColor: '{colors.alpha-black-90}'
  field-fill:
    backgroundColor: '{colors.alpha-black-2}'
  field-placeholder:
    textColor: '{colors.alpha-black-60}'
  field-hint:
    textColor: '{colors.alpha-black-60}'
  card-separator: # decorative `|` between title and year on project cards
    textColor: '{colors.alpha-black-40}'
  field-hint-error:
    textColor: '{colors.red-500}'
  field-hint-error-hover:
    textColor: '{colors.pink-500}'
  toggle-hover:
    backgroundColor: '{colors.alpha-black-50}'
  separator:
    backgroundColor: '{colors.alpha-black-10}'
  divider-vertical:
    backgroundColor: '{colors.alpha-black-30}'
  drawer-overlay:
    backgroundColor: '{colors.alpha-black-30}'
---

# Antônio Mascarenhas — Pro

> Source of truth: `@src/shared/styles/tokens.css` (Tailwind v4 `@theme`), theme overrides at the bottom of that
> file, high-contrast overrides in `@src/shared/styles/a11y.css`, motion in `@src/shared/animations.ts`.
> `@path` spans are DESIGN.md external references (resolved from this folder); the spec linter
> (`npx @google/design.md lint DESIGN.md`) flags them when a file is moved or renamed.
> **The code wins on conflict**: if a value here disagrees with `tokens.css`, fix this file.
> Every token becomes a Tailwind class (`bg-alpha-black-5`, `gap-lg`, `rounded-md`, `shadow-sm`, `desktop:`) and a
> CSS variable (`--color-alpha-black-5`, `--spacing-lg`, `--radius-md`). Never write hex, `rgb()` or `[Npx]`
> values in `className` for anything a token covers. Approved arbitrary values: a component's own anatomy
> (Layout → Spacing), single-feature widths (Container and columns), the home hero `leading-*` override
> (Typography) and `label-caps` tracking (Known Gaps).

## Overview

The `pro` app is the apex portfolio. Its job is to present Antônio's work, sell his services and show what he
knows. It speaks to two audiences at once: **recruiters and hiring teams** assessing a career, and **prospective
clients** deciding whether to start a project (the contact form is the main conversion point). Every page should
help one of them answer "is this the person I need?". The visitor should leave with the confidence of talking
to someone **careful and discerning**, who thinks before building, and who is at the same time
**approachable**, never salesy.

It reads like a printed page: black ink on a white surface, a lot of
vertical air between sections, and a friendly serif (Calistoga) for headings next to a geometric sans
(Poppins) for everything else. Hierarchy comes from type size, the serif/sans switch and the black alpha ramp
(`alpha-black-100` primary text, `80`…`60` secondary, `50`/`40` for non-text indicators and decoration), not from colour.

Density is low between sections (`section` 180px) and compact inside controls: white 6px-radius buttons of
24–33px sit in translucent `alpha-black-5` segmented containers. Depth is nearly flat.

Themes switch via `data-theme` on `<html>` (`day`, `sunset`). An accessibility menu can add high contrast,
bigger text, link highlighting and more on top. Components must therefore use semantic tokens and never fixed
colours.

**Key Characteristics:**

- Near-monochrome: `alpha-black-*` on `surface` (white in day, `brand-alpha` cream in sunset, black in high contrast).
- Black is the action colour (`primary`); hover lightens to `alpha-black-70`.
- `bulb-on` orange means "on/checked" only (toggle, checkbox, radio). Never a CTA.
- Calistoga at weight 400 for every `h1`/`h2`; Poppins for body, labels and controls.
- Fixed rhythm: `lg` 16px heading→body, `2xl` 24px text→actions and between columns, `3xl` 32px between cards, `section` 180px between sections.
- Motion fits its purpose: quick, soft feedback on controls; each animated piece keeps the timing tuned to it.
- Every visible string is wrapped in `<ScrambleText>` for the locale-switch effect.

## Colors

### Ink and surface

- **Ink** (`alpha-black-100`, `primary`): headings, body text, solid CTA fill, active borders. Class `text-alpha-black-100`.
- **Lead ink** (`alpha-black-90`, `alpha-black-80`): entry titles (90) and lead/supporting paragraphs that sit
  right under a heading (80), one step softer than body ink.
- **Secondary ink** (`alpha-black-70`, `alpha-black-60`): supporting copy, metadata, field labels, hover state of black elements.
- **Indicator ink** (`alpha-black-50`, `alpha-black-40`): not for text that must be read (see Contrast). `50`
  for non-text indicators (unchecked checkbox/radio ring, toggle hover); `40` for pure decoration (the `|`
  separators on project cards).
- **Lines and tints** (`alpha-black-30`/`10`/`5`/`2`): accordion dividers, field borders, segmented-container and cover tints, field fill.
- **Surface** (`surface`): page background and every surface that must follow the theme (body, sticky header, skills strip). Use `bg-surface` / `var(--color-surface)`. Day `#FFFFFF`, sunset `brand-alpha` `#FDFAEE`, high contrast `#000`. Never re-implement the theme switch per feature.
- **White** (`alpha-white-100`): raised controls (white buttons, cards) that stay white in both themes.

Use the **alpha** ramps for neutrals: high contrast (`@src/shared/styles/a11y.css`) inverts them. `grey-*` is opaque and only
appears where the Figma asks for it (none in use today); every `grey-*` in use needs an override in the
`html.a11y-high-contrast` block.

### Themes

The YAML top-level colours are the `day` theme. The `sunset` and `high-contrast` groups list only what each
mode overrides; in code the token names stay the same (`--color-surface`, `--color-alpha-black-60`…) and the
value is swapped by `[data-theme='sunset']` (`tokens.css`) or `html.a11y-high-contrast` (`a11y.css`). So a
component written with `bg-surface` / `text-alpha-black-60` is correct in every mode without extra classes.

- **Sunset**: only `surface` changes (warm cream `#FDFAEE`); ink stays black.
- **High contrast**: dark mode. `surface` and `alpha-white-100` go black (so white buttons turn black), the
  `alpha-black` ramp becomes white — `100`…`60` `#FFFFFF`, `50` 90%, `40` 80%, `30` 70%, `10` 50%, `5` 15%,
  `2` 8% white — and `red-500` → `#FF6B6B`, `pink-500` → `#FF9EB0` to stay legible on black. The YAML group
  holds only the key roles; the rest stays in prose so the linter doesn't flag unreferenced tokens.

### Contrast

Target **WCAG 2.2 AA** in `day` and `sunset` (high contrast exceeds it by construction):

| Ink on `surface`   | Ratio on white | Allowed for                                                       |
| ------------------ | -------------- | ----------------------------------------------------------------- |
| `alpha-black-100`…`70` | 21 → 8.5:1 | Any text                                                          |
| `alpha-black-60`   | 5.7:1          | Lowest step for text that must be read: hints, help labels, placeholders, field prefixes |
| `alpha-black-50`   | 4.0:1          | Non-text indicators only (control rings, ≥ 3:1)                   |
| `alpha-black-40`   | 2.9:1          | Decoration and disabled states only                               |

Sunset cream lowers each ratio by ~1%; the table still holds. The rule also applies to text on the
`alpha-black-5` tint and to white controls.

### State and accent

- **Bulb on** (`bulb-on`, `#FF7C00`): checked/on state of `Checkbox`, `Radio`, `ToggleSwitch`, and their hover ring.
- **Error** (`red-500`): field border and hint on validation error, required asterisk. Hover on an error hint shifts to `pink-500`.
- **Link highlight** (`link-highlight`, `#FFEB99`): background of links in the a11y "highlight links" mode. In code it is `--color-brand-200` (`a11y.css`).
- **Brand yellow** (`brand-*`): not a design colour here, only the source palette behind theming and a11y. `brand-alpha` backs the sunset surface (use `surface`), `brand-200` backs `link-highlight`, and the large a11y cursor hardcodes `#ffcc00` inside an SVG data URI (CSS variables cannot reach it). Do not use brand yellow in components.

### Reserved palettes

The YAML lists only the colours in use, each with a role. `tokens.css` also defines reserved palettes, kept
as the Figma mirror: `brand` 50–900, `grey` 100–700, translucent `alpha-white-*`, `alpha-black-20`/`3`,
`paper-light`/`dark`, `pink-*`, `red-*`, `blue-*` and `bulb-off`. Their classes exist (`bg-blue-500`), but
using one is a design decision: give it a role in this section and add it to the YAML in the same change. Ask
before introducing a new hue (`blue-*` has no role yet).

Scales follow one rule: each step below 500 is the 500 colour mixed with 20% more white (`red-400` = 20%,
`red-300` = 40%…); steps above 500 darken it in 20% steps. The `*-alpha` key of each palette is its lightest tint
used as a background (`brand-alpha` is the sunset surface).

## Typography

- **Calistoga** (`font-portfolio-title`), weight 400 only: all headings and the `StatItem` numbers.
- **Poppins** (`font-portfolio`): body, labels, buttons, fields. Weights `font-light` 300, `font-regular` 400, `font-medium` 500, `font-semibold` 600, `font-bold` 700 (never numeric or `font-normal`).

| Token                      | Class                                               | Size / line height | Use                                                  |
| -------------------------- | --------------------------------------------------- | ------------------ | ---------------------------------------------------- |
| `display-2xl`…`display-xl` | `text-display-2xl`, `text-display-xl`               | 72/90, 60/72       | Available, unused today                              |
| `display-lg`               | `text-display-lg`                                   | 48/60              | Home hero `h1` (falls to `display-md` below `small`) |
| `display-md`               | `text-display-md`                                   | 36/44              | Section `h2`, contact heading, stat numbers          |
| `display-sm`, `display-xs` | `text-display-sm`, `text-display-xs`                | 30/38, 24/32       | Sub-headings                                         |
| `body-xl`, `body-lg`       | `text-xl`, `text-lg`                                | 20/30, 18/28       | Accordion titles (`text-lg font-semibold`), emphasis |
| `body-md`                  | `text-md`                                           | 16/24              | Running text                                         |
| `body-sm`                  | `text-sm`                                           | 14/20              | Controls, chips, fields, secondary copy              |
| `body-xs`                  | `text-xs`                                           | 12/18              | Captions, counters, card metadata                    |
| `label-sm`                 | `text-sm font-semibold`                             | 14/20              | Submit button, card titles                           |
| `label-caps`               | `text-sm font-semibold uppercase tracking-[0.56px]` | 14/20              | Form field labels (`FieldFrame`)                     |

Principles:

- Each `text-*` token carries its paired line height; do not add `leading-*` except for a deliberate layout override (the home hero uses `leading-[55px]`/`[44px]`).
- Only the `text-xs`…`text-xl` and `text-display-*` scales exist. Never Tailwind defaults (`text-base`, `text-2xl`) or `text-[Npx]`.

## Layout

### Spacing

Named base-4 scale (`gap-lg`, `p-2xl`, `mt-sm`…): `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `2xl` 24 ·
`3xl` 32 · `4xl` 48 · `5xl` 64. Never Tailwind's numeric scale (`gap-4`). Off-grid values (`p-[3px]`,
`px-[10px]`) only inside a component's own anatomy, never between blocks.

| Relationship                                               | Token                                                                  |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| Heading → paragraph inside a text block                    | `gap-lg`                                                               |
| Text block → actions; between the two columns of a section | `gap-2xl`                                                              |
| Between cards; card list on tablet+                        | `gap-3xl` (falls to `gap-lg` below `tablet`)                           |
| Between page sections                                      | `gap-section pb-section` on `<main>` (180px)                           |
| Between sections on mobile (opt-in per page: home, about)  | `max-tablet:gap-section-compact max-tablet:pb-section-compact` (100px) |
| End of a short page before the footer (contact)            | `pb-section-end` (64px)                                                |
| Inner padding of a section panel on desktop (works, contact) | `desktop:p-panel` (36px)                                             |

### Container and columns

Width tokens live in the `--container-*` namespace and generate `max-w-*` and `w-*` classes.

| Token                    | Value                 | Class                              | Use                                                                              |
| ------------------------ | --------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `container-page`         | `calc(1050px + 1rem)` | `max-w-page px-lg`                 | Page container, centred (`@src/app/[locale]/layout.tsx`); the `+1rem` offsets `px-lg` |
| `container-content`      | 986px                 | `max-w-content`                    | Section panels                                                                   |
| `container-column-wide`  | 520px                 | `max-w-column-wide`                | Home hero illustration, contact form card                                        |
| `container-column`       | 450px                 | `max-w-column`, `desktop:w-column` | Wide column of a two-column section (hero text, sticky column, covers)           |
| `container-text`         | 430px                 | `max-w-text`, `desktop:w-text`     | Text columns                                                                     |
| `container-illustration` | 390px                 | `max-w-illustration`               | Square illustrations                                                             |

- Sections are two-column on `desktop` (`desktop:flex-row`) and stack below it.
- Widths used by a single feature stay local (`max-w-[932px]` home projects, `max-w-[502px]` contact intro, `contact-wide:max-w-[1094px]`). Repeat one in a second place → make it a `--container-*` token.

### Breakpoints

| Token     | Min width | Class                       | Typical use                              |
| --------- | --------- | --------------------------- | ---------------------------------------- |
| `small`   | 480px     | `small:` / `max-small:`     | Hero type step, card padding             |
| `tablet`  | 640px     | `tablet:` / `max-tablet:`   | Compact section rhythm, gaps             |
| `desktop` | 1020px    | `desktop:` / `max-desktop:` | Two-column sections (main layout switch) |
| `wide`    | 1200px    | `wide:` / `max-wide:`       | Wide-only refinements                    |

Feature-specific cuts are named `@custom-variant`s, not global breakpoints: `header-compact`/`header-full`
(591px, header drawer ⇄ island, `@src/features/header/styles.css`), `cards-two-columns` (691px, project grids,
`@src/shared/styles/tokens.css`), `contact-intro-padded` (406px) and `contact-wide` (1120px) in `@src/features/contact/styles.css`.
Never use `sm:`/`md:`/`lg:` or `min-[Npx]:`.

## Elevation & Depth

Almost flat. Separation comes from lines and tints first; a shadow means "this sits above the page".

| Level    | Treatment                                         | Use                                                         |
| -------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Flat     | No border, no shadow                              | Text blocks, section panels on `surface`                    |
| Lines    | `border-alpha-black-10` / `30`                    | Field borders, accordion dividers                           |
| Tint     | `bg-alpha-black-5` / `2`                          | Segmented containers, project covers, field fill            |
| Raised   | `shadow-sm` (`0 1px 2px rgb(0 0 0 / .15)`)        | Active white button, sliding pill, toggle thumb             |
| Floating | `shadow-md` (`0 4px 6px rgb(0 0 0 / .15)`)        | Floating menus (available, unused today)                    |
| Lifted   | `shadow-lg` (`0 18px 48px -18px rgb(0 0 0 / .12)`) | Floating card (contact form)                                |

- Pick the lowest level that works. Never put a shadow on a tinted container itself (`alpha-black-5`
  segmented container, cover); a raised white control _inside_ it (active button, sliding pill) is the
  intended pattern.
- No coloured shadows, no inner shadows, no new `shadow-[...]` values: a fourth level is a token change in `tokens.css`.
- In high contrast, separation relies on the inverted alpha lines; do not add shadows to compensate.

## Shapes

| Token      | Class           | Use                                                     |
| ---------- | --------------- | ------------------------------------------------------- |
| `sm` 6px   | `rounded-sm`    | White buttons, sliding pill                             |
| `md` 8px   | `rounded-md`    | Segmented containers, project covers, profile photo     |
| `lg` 10px  | `rounded-lg`    | Form fields, submit button                              |
| `xl` 12px  | `rounded-xl`    | Header tools panel                                      |
| `2xl` 20px | `rounded-2xl`   | Contact form card                                       |
| `3xl` 24px | `rounded-t-3xl` | Mobile bottom sheet                                     |
| `4xl` 32px | `rounded-4xl`   | Section panels (hero, criteria, quality, contact intro) |
| `full`     | `rounded-full`  | Chips, icon buttons, avatars, radios                    |

Radius grows with the object: controls 6, containers 8, panels 32. Component internals keep their own values
(toggle track 3.5px, toggle thumb 2px, checkbox 5px).

## Motion & Micro-interaction

- Motion is tuned per case: control feedback, enter/exit, loops and counters each keep the timing that fits them.
  Don't unify existing motions.
- Values start local: a duration or curve used by one piece lives next to it (a named constant in the component,
  or a Tailwind `duration-*` class). When it repeats, promote it: inside one feature → the feature's
  `animations.ts`; across features → `@src/shared/animations.ts`; a repeated CSS transition → an `@utility` in
  `@src/shared/styles/interaction.css` (like `transition-interface`).
- Control feedback (hover, focus, state) uses `transition-interface`: 400ms on colour, background, border, opacity,
  shadow and translate, curve `cubic-bezier(0.2, 0.7, 0.2, 1)` (`INTERFACE_EASING` in `@src/shared/animations.ts`; the
  CSS utility repeats it, so change both together).
- Framer Motion handles enter/exit (accordion 300ms, avatar reveal 350ms, illustration fade 400ms); shared values
  live in `@src/shared/animations.ts`.
- Locale switch: `ScrambleText` decodes every visible string for ~1s at 24fps, without layout shift.
- `prefers-reduced-motion` (and the a11y "pause animations" option) turns motion off.
- **Tokens:** the YAML `motion` group names each shared motion by purpose (`interface-feedback`,
  `accordion-toggle`, `avatar-reveal`, `illustration-fade`, `locale-scramble`, `spinner-rotation`). They
  document the code; they don't generate CSS. A new shared motion gets a token here in the same change.
- **Easing intent:** one curve, `cubic-bezier(0.2, 0.7, 0.2, 1)` (fast start, long soft landing), serves
  enter, exit and state changes alike. This is deliberate: the motions are short and soft, so separate
  accelerate/decelerate curves would add rules without a visible gain. Exceptions: loops run `linear` (spinner,
  `ButtonUnderline` wave) and the sticky header slides with Tailwind `ease-out` (300ms, local).
- **What moves:** control feedback, surfaces that appear or disappear (accordion panel, avatar name chip,
  illustration swap, project-card overlay 200ms and grayscale reveal 500ms, both local), the header hiding on
  scroll, the `StatItem` count-up and the locale scramble. What doesn't: page layout and section entrances. The
  `StatItem` counter is the only scroll-triggered motion (once, when it enters the viewport); don't add
  reveal-on-scroll to sections. Loops only while they mean something: the spinner while submitting, the
  `ButtonUnderline` wave (1.8s, local), shown only on hover/focus (it runs at `opacity: 0` otherwise).
- **Properties:** animate `opacity` and `transform` (translate, rotate). The accordion animating `height` is an
  accepted exception (Framer Motion measures `auto`); don't copy it to new pieces.

## Voice & Content Strategy

UI copy lives in `@messages/pt-BR.json` and `@messages/en.json` (root key `pro`); every rule applies to both
locales. CMS content (project texts, bio) follows the same voice but is edited in the CMS.

- **Tone of voice:** reflective, direct and warm. Short claims that show judgment ("Nem tudo que pode ser feito
  precisa ser feito."), followed by a plain explanation. No hype, no buzzword stacking, no fake urgency.
- **Person:** first person singular, **"eu"/"I"**: the site is one person talking. Never the institutional
  "nós"/"we" ("podemos chamar você", "não aceitamos"). The inclusive "a gente"/"vamos"/"juntos" ("you and I")
  is allowed in invitations ("Vamos construir algo juntos."). Address the visitor as **"você"/"you"**.
- **Capitalization:** sentence case everywhere: headings, buttons, labels, menu items, chips. Only proper nouns
  and brands keep their own casing, spelled the official way (`WordPress`, `n8n`, `Next.js`, `GitHub`,
  `LinkedIn`). `label-caps` turns labels uppercase through CSS; the source string stays sentence case.
- **Punctuation:** headings are full sentences and end with a period ("Vamos conversar."). Exclamation marks
  only in celebration moments (the contact success state); never in headings of content sections or errors.
- **Terminology:**
  - **"Trabalhos" / "Works"**: the section, the page and the list of portfolio pieces (nav, page title, list
    label). A single piece is a **"projeto" / "project"** ("Outros projetos", the "Projetos" stat).
  - **"Email"** (no hyphen) in both locales, labels and running text.
  - **"Projeto"** in the contact form means the visitor's project; keep that meaning there.
- **Action labels:** infinitive verb naming the outcome: "Ver todos", "Ver a lista completa", "Enviar
  mensagem", "Voltar ao início", "Entrar em contato" (English: "View all", "Send message", "Back to home").
  Conversational invitations may start with "Vamos…" ("Vamos trocar uma ideia"). Never "OK", "Clique aqui" or
  "Enviar" alone.
- **Empty, loading and error states:** errors say what to do, in the user's terms, and name the expected
  format when there is one ("Use o formato voce@empresa.com."). A system failure doesn't blame the visitor and
  suggests retrying. Loading uses a short verb ("Aguarde") next to `Spinner`. The 404 may be playful but
  always ends in a way back ("Voltar ao início").
- **Numbers, dates and units:** follow the locale: pt-BR `R$ 1.500,00`, en `1,500.00`. Periods and years as
  digits ("Em até 2 semanas", "2026"); the year is not wrapped in `ScrambleText` (see Components).

## Components

Shared primitives live in `src/shared/components/` and `src/shared/variants/` (CVA). Reuse them before writing
a new control.

**Sizing:** components that hold text size from their content plus padding. Do not fix `width`/`height` on
them; the YAML above lists padding, radius and type, and dimensions only for the exceptions below (the white-button `height`s). Deliberate exceptions:

- **White button family and header island** (`h-[24px]`/`[29px]`/`[33px]`, island `[39px]`): the sliding pill
  animates under those buttons and must match their box exactly.
- **Controls with an intrinsic shape**: radio (14/18/20px), checkbox (18px), toggle (`rem`), avatars (28px),
  icons (`size-[Npx]`). Their size is the shape itself, not a text box.

Do not copy fixed heights to new text-bearing components. Components that take text (`Chip`, `TriggerWithHelp`, `ButtonUnderline`, `ContactSection`,
`StatItem`) already wrap it in `ScrambleText`.

### ScrambleText

Mandatory wrapper for every visible string (CMS or `t(...)`), placed inside the element that carries the
typography; `children` is always a `string`. Not for attributes, numbers or rich text.

### White button and segmented container

The default control: a white `rounded-sm` button inside an `alpha-black-5` `rounded-md p-[3px]` container. Used
by navigation, the a11y trigger, `TriggerWithHelp` and `OptionScroller`.

- Variants (`buttonWhiteVariants`): `active` (white + `shadow-sm`), `inactive` (transparent until hover), `sliding`/`slidingCurrent` (over the sliding pill); sizes `sm` 24 / `md` 29 (default) / `lg` 33px, icons 10/12/14px.
- States: hover/focus-visible → border `alpha-black-60` (active) or fill `alpha-black-5` (inactive).
- Code: `@src/shared/variants/button-white-variants.ts`, pill in `@src/features/header/sliding-pill.tsx`.
- Border-only states (active hover, field hover/error, unchecked rings) stay in prose: the spec's component
  properties have no `borderColor`, and an unknown property is a linter warning.

### Focus

Keyboard focus mirrors hover: every interactive element pairs `hover:` with `focus-visible:` (same border,
fill or colour change) and drops the browser outline (`focus-visible:outline-none`). Fields use
`focus-within:` on the box. A new interactive element must show a visible `focus-visible:` change; never remove
the outline without replacing it.

### Submit button

The only solid black CTA (contact form): `primary` fill, `label-sm`, `rounded-lg`. Hover/focus →
`alpha-black-70`; `submitting` shows `Spinner`; `sent` shows a check and is disabled.
Code: `@src/features/contact/submit-button.tsx`.

### Chip

Tags and small labels, `rounded-full`. Variants `outline-v1` (default), `outline-v2`, `filled-v1`
(`alpha-black-5`), `filled-v2` (white); sizes `sm`/`md`/`lg` (12/14/16px text); `wide`; `disabled` (50%).
YAML: `chip-outline` = `outline-v1`, `chip-filled` = `filled-v1`, `chip-white` = `filled-v2`. Code:
`@src/shared/components/chip.tsx`.

### ButtonUnderline

Inline text link with an animated underline and a trailing up-right arrow. Sizes `md` (`text-sm`) and `lg`
(`text-md`). Hover/focus → `alpha-black-70`. Code: `@src/shared/components/button-underline.tsx`.

### Form fields

`FieldFrame` = `label-caps` label (red asterisk when required) + control + `FieldHint`. The box
(`fieldBoxVariants`): `alpha-black-2` fill, `alpha-black-10` border, `rounded-lg`, `body-sm`, text `alpha-black-80`,
placeholder `alpha-black-60`, hint `alpha-black-60` (`alpha-black-100` on hover). Hover/focus-within → border `alpha-black-100`; `error` → border `red-500`; disabled → 50%.
Controls: `TextField`, `MessageField` (grows to 6 lines), `BudgetField`, `OptionScroller` (single choice, faded edges).
Code: `@src/shared/variants/field-box-variants.ts`, `@src/shared/components/field-frame.tsx`,
`@src/shared/components/field-hint.tsx`.

### Checkbox, Radio, ToggleSwitch

Unchecked: `alpha-black-50` ring, `bulb-on` on hover/focus. Checked: `bulb-on`. Radio `sm` 14 / `md` 18 / `lg`
20px; checkbox 18px; toggle sized in `rem` so it scales with bigger text. ToggleSwitch track is
`alpha-black-5` off, `alpha-black-50` on hover, `bulb-on` on; the thumb is white with `shadow-sm`.

- **States supported**: unchecked, checked, hover/focus, disabled. **Indeterminate is not supported**: no
  screen needs a "partly selected" parent today. Add it (with its own visual) only when a real use case appears.
- Code: `@src/shared/components/checkbox.tsx`, `@src/shared/components/radio.tsx`,
  `@src/shared/components/toggle-switch.tsx`.

### Accordion

Collapsible blocks (project detail, mobile menu). `body-lg` semibold trigger (`text-lg font-semibold`), `alpha-black-30` divider, arrow rotates
on open (Framer Motion, 300ms). Can be controlled for exclusive groups.

### Project cards

Covers are desaturated and reveal colour on hover (`GrayscaleReveal`), on an `alpha-black-5` tint,
`rounded-md`, aspect 450/337. `ProjectCard` (home, overlays on hover), `ProjectListCard` (works, metadata below),
`ProjectCoverCard` (project detail). Code: `@src/features/home/project-card.tsx`,
`@src/features/works/project-list-card.tsx`, `@src/features/project-detail/project-cover-card.tsx`,
`@src/shared/components/grayscale-reveal.tsx`.

### Content blocks

`ContactSection` (closing block: `display-md` heading, `body-md`, links row), `StatItem` (Calistoga number
counting up + `body-sm` label), `TeamAvatarGroup` (28px round desaturated avatars, name chip on hover),
`MarkdownText` (CMS markdown), `StickyColumn`, `Spinner`.

### Header

Sticky, hides on scroll down. `header-full`: logo, a centred segmented "island" (nav ⇄ tools panel) and icon
tools (`rounded-full`, `opacity-60` → 100 on hover). `header-compact`: current-page label plus a bottom sheet
drawer (`rounded-t-3xl`). Its surface follows the theme via `--color-surface`.

## Do's and Don'ts

### Do

- Use the alpha ramps for every neutral, and `bg-surface` for anything that must follow the theme.
- Use the named spacing scale and the section tokens; keep the relationships in the Layout table.
- Use `desktop:` as the main layout switch; name feature-specific cuts with `@custom-variant`.
- Use the radius and shadow tokens (`rounded-sm`…`rounded-4xl`, `shadow-sm|md|lg`).
- Wrap every visible string in `ScrambleText`; take UI strings from `messages/*.json`.
- Use `transition-interface` for control feedback; keep other motion values local until they repeat, then promote them.
- Give every `hover:` style a matching `focus-visible:` style.
- Let content and padding size components.
- Keep text that must be read at `alpha-black-60` or darker (WCAG AA, see Colors → Contrast).

### Don't

- Don't write hex, `rgb()`, `rgba()` or `[Npx]` values in `className` when a token exists (approved
  exceptions: see the note at the top of this file).
- Don't use `bulb-on`, `brand-*` or `red-500` as an action or decorative colour.
- Don't add a third typeface, use Calistoga above weight 400, or use Tailwind's default type scale.
- Don't use `grey-*` without a high-contrast override.
- Don't use `sm:`/`md:`/`lg:`, `min-[Npx]:` or Tailwind's numeric spacing (`gap-4`).
- Don't fix `h-[Npx]`/`w-[Npx]` on text-bearing components (exceptions listed under Components → Sizing).
- Don't remove the focus outline without a `focus-visible:` replacement.
- Don't use `alpha-black-50`/`40` for readable text (hints, labels, placeholders).

## Responsive Behavior

- Below `desktop` (1020px), two-column sections stack; text columns go full width.
- Below `tablet` (640px), home and about tighten section spacing to 100px; card lists tighten to `gap-lg`.
- Below `header-full` (591px), the header island becomes a current-page label plus a bottom sheet drawer.
- Below `small` (480px), the home hero steps down to `display-md`.
- Project grids become two columns at `cards-two-columns` (691px).

### Touch targets

- New controls aimed at mobile should reach a 44×44px touch area (padding or a larger hit box), even when the
  visual stays small.
- Deliberate exceptions: the header icon tools use the 18px icon as their visual box, and the white button
  family keeps its fixed heights for the sliding pill. Don't treat these as patterns to copy.

## Iteration Guide

1. Read this file and `tokens.css` before a visual change; the code wins on conflict.
2. Reuse a shared component or variant before writing a new one; extend the CVA variant instead of overriding classes.
3. Pick values from the tokens (colour, spacing, radius, shadow, width, breakpoint). If none fits, propose a new token instead of a `[Npx]` value.
4. Check the change in `day`, `sunset` and high contrast, and at the `tablet` and `desktop` breakpoints.
5. Wrap new visible text in `ScrambleText` and add its strings to both `messages/*.json`.
6. When you add or change a token or shared component, update this file in the same change.
7. Run `npx @google/design.md lint DESIGN.md` after editing this file: 0 errors, and no warnings besides the `motion` one listed in Known Gaps.

## Known Gaps

- No direct comparison with the Figma file was done. The recent code changes (gaps 14→16 and 22→24px, `red-300` `#f38083`) are not yet reflected in the Figma.
- `label-caps` uses `tracking-[0.56px]` inline; there is no letter-spacing token.
- The `motion` group follows the current spec (`docs/spec.md` on `google-labs-code/design.md`), but the
  published linter (`@google/design.md` 0.4.0) predates it and warns that `motion` is not a recognized key.
  Expected; it goes away when a newer linter ships. Keep `motion` as is.
- Out of scope: the contact e-mail templates (`@src/lib/contact/contact-email-templates.tsx`) use inline hex and
  Helvetica on purpose, because e-mail clients cannot read the app's CSS tokens.
- Focus has no ring of its own: it reuses the hover treatment, which is subtle on `inactive` white buttons (fill `alpha-black-5`). Not audited against WCAG 2.4.11 focus appearance.
