---
version: alpha
name: Antônio Mascarenhas — Pro
description: "Editorial and near-monochrome, like a printed page: black ink at stepped alpha on a white surface (warm cream in the sunset theme), with generous air between sections. A friendly serif (Calistoga, weight 400) carries every heading; Poppins carries body, labels and controls. Colour does almost no structural work: black is the action colour, orange `bulb-on` only marks an 'on/checked' state, red only marks errors. Controls are small white pills and 6px-radius buttons inside translucent segmented containers; section panels use 32px radius. Depth is nearly flat (three soft shadows), and one easing curve drives every transition."
colors:
  primary: '#000000'
  on-primary: '#FFFFFF'
  surface: '#FFFFFF'
  surface-sunset: '#FDFAEE'
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
  grey-500: '#555452'
  bulb-on: '#FF7C00'
  red-500: '#EB2B30'
  pink-500: '#FF002F'
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
  container-page: 1066px # code: calc(1050px + 1rem); 1066 assumes a 16px root (grows with a11y bigger text)
  container-content: 986px
  container-column-wide: 520px
  container-column: 450px
  container-text: 430px
  container-illustration: 390px
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
  segmented-container:
    backgroundColor: '{colors.alpha-black-5}'
    rounded: '{rounded.md}'
    padding: 3px
  chip-outline:
    textColor: '{colors.alpha-black-100}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.full}'
    padding: 5px 12px
  field-box:
    textColor: '{colors.alpha-black-100}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.lg}'
    padding: 14px 16px
  field-label:
    textColor: '{colors.alpha-black-60}'
    typography: '{typography.label-caps}'
  control-checked:
    backgroundColor: '{colors.bulb-on}'
  section-panel:
    rounded: '{rounded.4xl}'
  project-cover:
    backgroundColor: '{colors.alpha-black-5}'
    rounded: '{rounded.md}'
  highlighted-link:
    backgroundColor: '{colors.link-highlight}'
  page-sunset:
    backgroundColor: '{colors.surface-sunset}'
  lead-text:
    textColor: '{colors.alpha-black-80}'
    typography: '{typography.body-md}'
  entry-title:
    textColor: '{colors.alpha-black-90}'
  field-fill:
    backgroundColor: '{colors.alpha-black-2}'
  field-placeholder:
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
  a11y-counter:
    textColor: '{colors.grey-500}'
---

# Antônio Mascarenhas — Pro

> Source of truth: `src/shared/styles/tokens.css` (Tailwind v4 `@theme`), theme overrides at the bottom of that
> file, high-contrast overrides in `src/shared/styles/a11y.css`, motion in `src/shared/animations.ts`.
> **The code wins on conflict**: if a value here disagrees with `tokens.css`, fix this file.
> Every token becomes a Tailwind class (`bg-alpha-black-5`, `gap-lg`, `rounded-md`, `shadow-sm`, `desktop:`) and a
> CSS variable (`--color-alpha-black-5`, `--spacing-lg`, `--radius-md`). Never write hex, `rgb()` or `[Npx]`
> values in `className` for anything a token covers. Approved arbitrary values: a component's own anatomy
> (Layout → Spacing), single-feature widths (Container and columns), the home hero `leading-*` override
> (Typography) and `label-caps` tracking (Known Gaps).

## Overview

The `pro` app is the apex portfolio. It reads like a printed page: black ink on a white surface, a lot of
vertical air between sections, and a friendly serif (Calistoga) for headings next to a geometric sans
(Poppins) for everything else. Hierarchy comes from type size, the serif/sans switch and the black alpha ramp
(`alpha-black-100` primary text, `70`/`60` secondary, `50`/`40` hints and placeholders), not from colour.

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
- One easing curve, `cubic-bezier(0.2, 0.7, 0.2, 1)`, for every transition.
- Every visible string is wrapped in `<ScrambleText>` for the locale-switch effect.

## Colors

### Ink and surface

- **Ink** (`alpha-black-100`, `primary`): headings, body text, solid CTA fill, active borders. Class `text-alpha-black-100`.
- **Lead ink** (`alpha-black-90`, `alpha-black-80`): entry titles (90) and lead/supporting paragraphs that sit
  right under a heading (80), one step softer than body ink.
- **Secondary ink** (`alpha-black-70`, `alpha-black-60`): supporting copy, metadata, field labels, hover state of black elements.
- **Hint ink** (`alpha-black-50`, `alpha-black-40`): placeholders, unchecked control rings, hints.
- **Lines and tints** (`alpha-black-30`/`10`/`5`/`2`): accordion dividers, field borders, segmented-container and cover tints, field fill.
- **Surface** (`surface`): page background and every surface that must follow the theme (body, sticky header, skills strip). Use `bg-surface` / `var(--color-surface)`. Day `#FFFFFF`, sunset `brand-alpha` `#FDFAEE`, high contrast `#000`. Never re-implement the theme switch per feature.
- **White** (`alpha-white-100`): raised controls (white buttons, cards) that stay white in both themes.

Use the **alpha** ramps for neutrals: high contrast (`a11y.css`) inverts them. `grey-*` is opaque and only
appears where the Figma asks for it (today: the a11y counter, `text-grey-500`); every `grey-*` in use needs an
override in the `html.a11y-high-contrast` block.

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
| `body-xl`, `body-lg`       | `text-xl`, `text-lg`                                | 20/30, 18/28       | Rare emphasis copy                                   |
| `body-md`                  | `text-md`                                           | 16/24              | Running text, accordion titles                       |
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

### Container and columns

Width tokens live in the `--container-*` namespace and generate `max-w-*` and `w-*` classes.

| Token                    | Value                 | Class                              | Use                                                                              |
| ------------------------ | --------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `container-page`         | `calc(1050px + 1rem)` | `max-w-page px-lg`                 | Page container, centred (`app/[locale]/layout.tsx`); the `+1rem` offsets `px-lg` |
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
(591px, header drawer ⇄ island, `features/header/styles.css`), `cards-two-columns` (691px, project grids,
`tokens.css`), `contact-intro-padded` (406px) and `contact-wide` (1120px) in `features/contact/styles.css`.
Never use `sm:`/`md:`/`lg:` or `min-[Npx]:`.

## Elevation & Depth

Almost flat. Separation comes from lines and tints first; a shadow means "this sits above the page".

| Level    | Treatment                                         | Use                                                         |
| -------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Flat     | No border, no shadow                              | Text blocks, section panels on `surface`                    |
| Lines    | `border-alpha-black-10` / `30`                    | Field borders, accordion dividers                           |
| Tint     | `bg-alpha-black-5` / `2`                          | Segmented containers, project covers, field fill            |
| Raised   | `shadow-sm` (`0 1px 2px rgb(0 0 0 / .15)`)        | Active white button, sliding pill, toggle thumb             |
| Floating | `shadow-md` (`0 4px 6px rgb(0 0 0 / .15)`)        | Dropdown menus (language, a11y)                             |
| Lifted   | `shadow-lg` (`0 18px 48px -18px rgb(0 0 0 / .12)`) | Floating card (contact form)                                |

- Pick the lowest level that works. Never put a shadow on a tinted container itself (`alpha-black-5`
  segmented container, cover); a raised white control _inside_ it (active button, sliding pill) is the
  intended pattern.
- No coloured shadows, no inner shadows, no new `shadow-[...]` values: a fourth level is a token change in `tokens.css`.
- In high contrast, separation relies on the inverted alpha lines; do not add shadows to compensate.

## Shapes

| Token      | Class           | Use                                                     |
| ---------- | --------------- | ------------------------------------------------------- |
| `sm` 6px   | `rounded-sm`    | White buttons, dropdown menus, sliding pill             |
| `md` 8px   | `rounded-md`    | Segmented containers, project covers, profile photo     |
| `lg` 10px  | `rounded-lg`    | Form fields, submit button                              |
| `xl` 12px  | `rounded-xl`    | Header tools panel                                      |
| `2xl` 20px | `rounded-2xl`   | Contact form card                                       |
| `3xl` 24px | `rounded-t-3xl` | Mobile bottom sheet                                     |
| `4xl` 32px | `rounded-4xl`   | Section panels (hero, criteria, quality, contact intro) |
| `full`     | `rounded-full`  | Chips, icon buttons, avatars, radios                    |

Radius grows with the object: controls 6, containers 8, panels 32. Component internals keep their own values
(toggle thumb 2px, checkbox 5px).

## Motion & Micro-interaction

- One curve everywhere: `cubic-bezier(0.2, 0.7, 0.2, 1)` (`SCRAMBLE_EASING`/`INTERFACE_EASING` in `shared/animations.ts`).
- Hover, focus and state changes on controls use the `transition-interface` utility (400ms on colour, background, border, opacity, shadow, translate; `shared/styles/interaction.css`).
- Framer Motion handles enter/exit: accordion 300ms, avatar reveal 350ms, illustration fade 400ms. Durations and
  variants live in `shared/animations.ts` (or a feature's own `animations.ts` when only it uses them, e.g. the
  header); never inline them. The CSS curve in `interaction.css` duplicates `SCRAMBLE_EASING`: change both together.
- Locale switch: `ScrambleText` decodes every visible string for ~1s at 24fps, without layout shift.
- `prefers-reduced-motion` (and the a11y "pause animations" option) turns motion off.

## Components

Shared primitives live in `src/shared/components/` and `src/shared/variants/` (CVA). Reuse them before writing
a new control.

**Sizing:** components that hold text size from their content plus padding. Do not fix `width`/`height` on
them; the YAML above lists padding, radius and type, never dimensions. Deliberate exceptions:

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

### Focus

Keyboard focus mirrors hover: every interactive element pairs `hover:` with `focus-visible:` (same border,
fill or colour change) and drops the browser outline (`focus-visible:outline-none`). Fields use
`focus-within:` on the box. A new interactive element must show a visible `focus-visible:` change; never remove
the outline without replacing it.

### Submit button

The only solid black CTA (contact form): `primary` fill, `label-sm`, `rounded-lg`. Hover/focus →
`alpha-black-70`; `submitting` shows `Spinner`; `sent` shows a check and is disabled.

### Chip

Tags and small labels, `rounded-full`. Variants `outline-v1` (default), `outline-v2`, `filled-v1`
(`alpha-black-5`), `filled-v2` (white); sizes `sm`/`md`/`lg` (12/14/16px text); `wide`; `disabled` (50%).

### ButtonUnderline

Inline text link with an animated underline and a trailing up-right arrow. Sizes `md` (`text-sm`) and `lg`
(`text-md`). Hover/focus → `alpha-black-70`.

### Form fields

`FieldFrame` = `label-caps` label (red asterisk when required) + control + `FieldHint`. The box
(`fieldBoxVariants`): `alpha-black-2` fill, `alpha-black-10` border, `rounded-lg`, `body-sm`, placeholder
`alpha-black-40`. Hover/focus-within → border `alpha-black-100`; `error` → border `red-500`; disabled → 50%.
Controls: `TextField`, `MessageField` (grows to 6 lines), `BudgetField`, `OptionScroller` (single choice, faded edges).

### Checkbox, Radio, ToggleSwitch

Unchecked: `alpha-black-50` ring, `bulb-on` on hover/focus. Checked: `bulb-on`. Radio `sm` 14 / `md` 18 / `lg`
20px; checkbox 18px; toggle sized in `rem` so it scales with bigger text.

### Accordion

Collapsible blocks (project detail, mobile menu). `body-md` trigger, `alpha-black-30` divider, arrow rotates
on open (Framer Motion, 300ms). Can be controlled for exclusive groups.

### Project cards

Covers are desaturated and reveal colour on hover (`GrayscaleReveal`), on an `alpha-black-5` tint,
`rounded-md`, aspect 450/337. `ProjectCard` (home, overlays on hover), `ProjectListCard` (works, metadata below),
`ProjectCoverCard` (project detail).

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
- Use `transition-interface` and `shared/animations.ts` for motion.
- Give every `hover:` style a matching `focus-visible:` style.
- Let content and padding size components.

### Don't

- Don't write hex, `rgb()`, `rgba()` or `[Npx]` values in `className` when a token exists (approved
  exceptions: see the note at the top of this file).
- Don't use `bulb-on`, `brand-*` or `red-500` as an action or decorative colour.
- Don't add a third typeface, use Calistoga above weight 400, or use Tailwind's default type scale.
- Don't use `grey-*` without a high-contrast override.
- Don't use `sm:`/`md:`/`lg:`, `min-[Npx]:` or Tailwind's numeric spacing (`gap-4`).
- Don't fix `h-[Npx]`/`w-[Npx]` on text-bearing components (exceptions listed under Components → Sizing).
- Don't remove the focus outline without a `focus-visible:` replacement.

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

## Known Gaps

- No direct comparison with the Figma file was done. The recent code changes (gaps 14→16 and 22→24px, `red-300` `#f38083`) are not yet reflected in the Figma.
- `label-caps` uses `tracking-[0.56px]` inline; there is no letter-spacing token.
- Focus has no ring of its own: it reuses the hover treatment, which is subtle on `inactive` white buttons (fill `alpha-black-5`). Not audited against WCAG 2.4.11 focus appearance.
