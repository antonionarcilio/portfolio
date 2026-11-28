# Example: Notion marketing site (condensed)

Use this to calibrate **tone, density and structure**. Do not copy values or recipes. It was condensed from a
much larger auto-extracted file (~3k lines): recipes were removed, component tokens were rewritten as refs, and
the measurement lists were cut. This size (~170 lines) is the target.

```markdown
---
version: alpha
name: Notion
description: "Calm, editorial, near-monochrome: white canvas, black ink, warm-grey secondary text and a warm off-white band surface. One confident blue carries CTAs and focus rings. Small illustration accents (amber, coral, green, lavender) decorate cards only. Inter with tight negative tracking on giant display type; Lyon Text serif reserved for quotes. Soft geometry (4/8/12px, pills for chips) and whisper-light layered shadows."
colors:
  primary: "#0075DE"
  primary-pressed: "#005BAB"
  primary-tint: "#E6F3FE"
  on-primary: "#FFFFFF"
  ink: "#000000"
  body-secondary: "#615D59"
  muted: "#A39E98"
  surface: "#FFFFFF"
  surface-warm: "#F6F5F4"
  accent-amber: "#FFB110"
  success: "#1AAE39"
typography:
  hero-display: { fontFamily: Inter, fontSize: 96px, fontWeight: 600, lineHeight: 1.05, letterSpacing: -4.6px }
  display-md:   { fontFamily: Inter, fontSize: 54px, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.875px }
  title-md:     { fontFamily: Inter, fontSize: 22px, fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.25px }
  quote:        { fontFamily: Lyon Text, fontSize: 18px, fontWeight: 400, lineHeight: 1.55 }
  body-md:      { fontFamily: Inter, fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  label-md:     { fontFamily: Inter, fontSize: 14px, fontWeight: 500, lineHeight: 1.45 }
  caption:      { fontFamily: Inter, fontSize: 12px, fontWeight: 500, lineHeight: 1.35, letterSpacing: 0.125px }
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  full: 9999px
spacing:
  section-y: 96px
  card-grid-gap: 8px
  card-padding: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    height: 36px
    padding: 4px 14px
  button-primary-hover:
    backgroundColor: "{colors.primary-pressed}"
  button-secondary:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary-pressed}"
    rounded: "{rounded.sm}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    height: 30px
  card-link:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-padding}"
---

# Notion

## Overview

Reads like a well-edited document: white canvas, black ink, a warm-grey supporting cast and one blue that
says where to click. Calm and trustworthy, punctuated by whimsy (illustrations, small accent bursts) that never
does structural work.

Hierarchy comes from type scale and tracking, not color or containers. Density is low between sections
(`section-y` 96px) and moderate inside components (14px medium labels, compact ghost buttons).

**Key Characteristics:**
- Near-monochrome: `ink` on `surface`, `surface-warm` for alternating bands.
- One action color: `primary` for CTAs **and** every focus ring.
- Giant display type with negative tracking that scales with size.
- Lyon Text only in quotes, a voice rather than a second UI font.
- Radius steps with object size: `xs` controls, `sm` buttons, `md` cards, `full` chips.

## Colors

### Interaction
- **Notion Blue** (`primary`, #0075DE): primary CTA fill and focus ring (2px solid, 2px offset). Text on it is
  always `on-primary`.
- **Pressed Blue** (`primary-pressed`): hover/focus fill of primary; label color of `button-secondary`.
- **Blue Mist** (`primary-tint`): fill of the secondary CTA. Never a section background.

### Text & Surface
- **Ink** (`ink`): headlines. Body copy is ink at ~90% alpha inside components.
- **Warm Graphite** (`body-secondary`) / **Pebble** (`muted`): secondary and tertiary text.
- **Paper White** (`surface`) / **Warm Stone** (`surface-warm`): canvas and alternating bands.

### Accents
- `accent-amber`, `success`: illustrations, badges and chips only. **Never** buttons, links or text.

## Typography

**Inter** for everything; **Lyon Text** only for `quote`.

| Token | Size | Weight | LH | Tracking | Use |
|---|---|---|---|---|---|
| `hero-display` | 96 | 600 | 1.05 | -4.6px | Hero h1 |
| `display-md` | 54 | 700 | 1.05 | -1.875px | Section h2 |
| `title-md` | 22 | 700 | 1.25 | -0.25px | Card titles |
| `quote` | 18 | 400 | 1.55 | normal | Testimonials |
| `body-md` | 16 | 400 | 1.5 | normal | Running text |
| `label-md` | 14 | 500 | 1.45 | normal | Buttons, nav |
| `caption` | 12 | 500 | 1.35 | +0.125px | Footer column heads |

Principles: pick the token, never a weight alone. Negative tracking only at ≥20px. Display line-heights are tight
(1.05–1.2), text sizes open (1.45–1.55).

## Layout

- Sections separated by `section-y` (96px). Whitespace lives **between** sections, not inside them.
- Link cards pack tightly: 5-column grid, `card-grid-gap` 8px, `card-padding` 24px.
- Container max-width was not captured (see Known Gaps).

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | no shadow | canvas, bands |
| Hairline | `1px solid` ink @10% | link cards, footer pill |
| Soft | 4 stacked shadows, max 4% black | floating previews |
| Focus | `2px solid primary`, offset 2px | every interactive element |

Depth comes from many near-invisible layers, never from one dark drop shadow.

## Shapes

`xs` 4px ghost controls · `sm` 8px buttons and links · `md` 12px cards · `full` chips and tags. Primary CTAs are
never pills.

## Components

### Button
Role: the only interactive fill. Primary for the main action, secondary (tinted) paired beside it, ghost for
quiet navigation.
- Variants: `button-primary`, `button-secondary`, `button-ghost`.
- States: hover → `primary-pressed` (primary), ink @5% wash (ghost); focus → blue ring. Transparent 2px outline
  reserved at rest, so there is no layout shift.

### Link card
Role: dense grid of destinations. Hairline border, `md` radius, 40px icon, `body-md` bold title.

## Do's and Don'ts

### Do
- Pair `button-primary` with `button-secondary` for dual CTAs.
- Separate bands with `section-y` and `surface-warm`.
### Don't
- Don't use accent colors for interaction.
- Don't add a third typeface or radius values outside the scale.
- Don't apply negative tracking below 20px.

## Responsive Behavior

Header keeps logo, CTA and a 44px menu toggle. Grids collapse to a single column; testimonials become a horizontal
carousel. New touch controls should be at least 44px.

## Known Gaps

- One page captured; container max-width and breakpoints unknown.
- Hover and pressed states measured only for buttons and header links.
```
