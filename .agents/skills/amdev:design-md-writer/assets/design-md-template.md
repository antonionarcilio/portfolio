---
version: alpha
name: <Product or App Name>
description: "<One dense paragraph: personality, palette, typography, geometry, depth.>"
# omitted:
#   - section: Motion & Micro-interaction
#     reason: "<why>"
colors:
  primary: "#000000"
  on-primary: "#FFFFFF"
  surface: "#FFFFFF"
  ink: "#000000"
typography:
  body-md:
    fontFamily: <Family>
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 8px
spacing:
  section-y: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
---

# <Product or App Name>

## Overview

<2–3 paragraphs.>

**Key Characteristics:**
- <trait tied to tokens>

## Colors

> Source: `<path/to/tokens>` — code wins on conflict. Token → code: `primary` → `bg-…` / `--color-…`.

### <Role group>
- **<Readable Name>** (`token`, #HEX): <where and when it is used>.

## Typography

### Font Family
### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
### Principles

## Layout

### Spacing System
### Grid & Container
### Whitespace Philosophy

## Elevation & Depth

## Shapes

## Motion & Micro-interaction

## Voice & Content Strategy

## Components

### <Component>
Role: …
- Variants:
- Anatomy:
- States:
- Code: `<path>`

## Do's and Don'ts

### Do
### Don't

## Responsive Behavior

## Known Gaps

- <what was not verified / measured>
