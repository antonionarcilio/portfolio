## ADDED Requirements

### Requirement: Switch component divider fidelity

The `switch-btn` component SHALL render two visually distinct dividers matching the Figma reference: an inner divider between the options of a single switch group (e.g. `PT` / `EN`, `LIGHT` / `DARK`), and an outer divider between separate switch groups in a control cluster (e.g. locale group vs. theme group). No container-level override SHALL remove the inner divider's border in any placement, including the recruiter header.

#### Scenario: Inner divider visible in the header

- **WHEN** a switch group (locale, theme, or mode) renders inside the recruiter header
- **THEN** the divider between its two options is visible in both light and dark appearance, matching the reference border/color

#### Scenario: Outer divider distinct from inner divider

- **WHEN** two switch groups render next to each other in a control cluster
- **THEN** the divider between the groups uses the glyph/color defined by the reference `divider` component and is visually distinguishable from the inner divider

### Requirement: Switch, i18n, theme, and mode component parity

The locale switch, theme switch, and mode switch SHALL each match the geometry, option order, spacing, and state treatment (regular, hover, focus, current) recorded from their respective Figma component nodes, for both light and dark appearance.

#### Scenario: Locale switch option order

- **WHEN** the locale switch renders
- **THEN** it presents `PT` before `EN`, matching the reference order

#### Scenario: Header composition matches reference

- **WHEN** the recruiter header renders with the locale, theme, and mode switches assembled together
- **THEN** their spacing, alignment, and dividers match the Figma header composition in both appearances and both supported locales
