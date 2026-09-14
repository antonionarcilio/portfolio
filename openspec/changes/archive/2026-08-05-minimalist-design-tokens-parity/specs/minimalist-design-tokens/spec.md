## Purpose

Define the single source of truth for the minimalist theme's color palette, opacity scale, and typography scale, so every value traces back to the Figma reference (`oaRNKV5sEnHE2gffqUbMJl`, component board `4012:4142`) and is defined exactly once in `styles.css`, with no parallel unused copy elsewhere.

## ADDED Requirements

### Requirement: Single palette definition per appearance

The minimalist theme SHALL define exactly one set of color custom properties (`--minimalist-background`, `--minimalist-foreground`, `--minimalist-muted`, `--minimalist-border`, `--minimalist-divider-inner`, `--minimalist-accent`) per appearance (`light`, `dark`) in `styles.css`. No later rule of equal or higher specificity SHALL redefine the same custom property for the same appearance.

#### Scenario: Light appearance resolves to the Figma base color

- **WHEN** `.minimalist-theme--light` is applied
- **THEN** `--minimalist-background` resolves to `#fffae5`, matching the Figma `primary/base` variable, and no other CSS rule overrides it for that class

#### Scenario: Dark appearance resolves to pure black/white

- **WHEN** `.minimalist-theme--dark` is applied
- **THEN** `--minimalist-background` resolves to `#000000` and `--minimalist-foreground` resolves to `#ffffff`, matching the Figma `alpha-black-100`/`alpha-white-100` variables

### Requirement: Opacity scale exposes the Figma alpha steps

The minimalist theme SHALL expose the alpha steps defined by the Figma variables `alpha-black-{30,40,50,60,70,80,100}` and `alpha-white-{30,40,50,60,70,80,100}` as reusable CSS custom properties in `styles.css`, instead of only the two ad hoc values (`muted`, `border`) previously hardcoded as inline `rgb()` literals.

#### Scenario: Muted text uses a named alpha step

- **WHEN** a muted-text element renders in either appearance
- **THEN** its color resolves to one of the documented `--minimalist-alpha-*` custom properties (not an inline literal opacity value)

### Requirement: Typography scale is centralized in CSS

The minimalist theme SHALL centralize font family (`JetBrains Mono`), font sizes (`12px`/`14px`/`16px`), and named font weights (`light`, `regular`, `medium`, `semibold`, `bold`) as CSS custom properties on `.minimalist-theme` in `styles.css`, matching the Figma `Font size/*`, `Font weight/*`, and `Font family/*` variables. Component styles SHALL reference these custom properties instead of literal numeric `font-weight` values. No TypeScript module SHALL duplicate these values unless it has an actual runtime consumer.

#### Scenario: Heading weight matches a named token

- **WHEN** any minimalist heading or emphasized label renders
- **THEN** its `font-weight` value resolves via `var(--minimalist-weight-*)`, not an unlabeled numeric literal

#### Scenario: No unconsumed token module

- **WHEN** the minimalist feature directory is inspected
- **THEN** every exported constant that duplicates a CSS custom property has at least one runtime import elsewhere in `src/`; a values module with zero consumers SHALL be deleted rather than kept in sync by hand
