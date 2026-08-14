## MODIFIED Requirements

### Requirement: Switch component divider fidelity

The `switch-btn` component itself SHALL render as unadorned uppercase text — no border, padding, or background in any state or appearance. The visible divider between the two options of a single switch group (e.g. `PT` / `EN`, `LIGHT` / `DARK`, `R` / `C`) SHALL be the `divider` component (`v1`, vertical) placed between the two `switch-btn` instances, not a border on the button itself. A second, visually distinct divider (the `divider` component's alternate glyph) SHALL separate different switch groups in a control cluster (e.g. locale group vs. theme group). No container-level override SHALL hide or remove either divider in any placement, including the recruiter header.

#### Scenario: Inner divider visible in the header

- **WHEN** a switch group (locale, theme, or mode) renders inside the recruiter header
- **THEN** the divider between its two options is visible in both light and dark appearance, matching the reference glyph/color, and no button in the group renders its own border

#### Scenario: Outer divider distinct from inner divider

- **WHEN** two switch groups render next to each other in a control cluster
- **THEN** the divider between the groups uses the glyph/color defined by the reference `divider` component and is visually distinguishable from the inner divider

### Requirement: Switch, i18n, theme, and mode component parity

The locale switch, theme switch, and mode switch SHALL each be built from the same `switch-btn` atom and match the geometry, option order, spacing, and state treatment (regular, hover, focus, current) recorded from the Figma `switch-btn` node (`node-id=2099-1997`), for both light and dark appearance. `switch-btn` SHALL expose exactly two independent axes — `appearance` (`light`/`dark`) and `current` (boolean) — with `regular`/`hover`/`focus` treated as interaction states, never as a caller-driven visual identity distinct from `current`.

#### Scenario: Locale switch option order

- **WHEN** the locale switch renders
- **THEN** it presents `PT` before `EN`, matching the reference order

#### Scenario: Header composition matches reference

- **WHEN** the recruiter header renders with the locale, theme, and mode switches assembled together
- **THEN** their spacing, alignment, and dividers match the Figma header composition in both appearances and both supported locales

#### Scenario: Current option color and underline

- **WHEN** a `switch-btn` renders with `current=true`
- **THEN** its text renders at full opacity (black in light appearance, white in dark appearance) with an underline, regardless of interaction state, and never uses the accent color

#### Scenario: Idle option opacity

- **WHEN** a `switch-btn` renders with `current=false` and no hover or focus
- **THEN** its text renders at 40% opacity in light appearance or 50% opacity in dark appearance, with no underline and no border

#### Scenario: Hover or focus on a non-current option

- **WHEN** a `switch-btn` with `current=false` is hovered or receives keyboard focus
- **THEN** its text renders at 80% opacity (light or dark appearance, matching), with no underline and no accent-colored border — the visible keyboard-focus indicator comes from the shared theme focus ring, not a `switch-btn`-specific style

#### Scenario: Mode switch built on the shared atom

- **WHEN** the `R`/`C` mode switch renders in the recruiter header
- **THEN** each option is a `switch-btn` instance exposing `aria-pressed` for its selected state (not `aria-current="page"`), and the disabled `C` option uses the native `disabled` attribute instead of component-specific CSS
