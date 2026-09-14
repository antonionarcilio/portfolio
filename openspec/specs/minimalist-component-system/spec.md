## Purpose

Define visual fidelity contracts for shared minimalist interface components so their controls and links consistently match the approved reference across themes.

## Requirements

### Requirement: Collapse-button component fidelity

The `button/collapse` component (used for "view more"/"expand" affordances) SHALL match the reference's font size, weight, color, and disabled treatment in both light and dark appearance.

#### Scenario: Collapse button in the About section

- **WHEN** the About section's "view more" control renders
- **THEN** its typography and disabled-state color match the `button/collapse` reference

### Requirement: Anchor component fidelity

The `anchor` component (used for GitHub/LinkedIn/E-Mail/company links) SHALL match the reference's font size, weight, color, underline treatment, and trailing-icon spacing in both light and dark appearance, across its `variant` (primary/secondary/tertiary) and interaction state (default/hover/focus/disable) axes.

#### Scenario: Contact link rendering

- **WHEN** a contact or "visit company" link renders through the anchor component
- **THEN** its typography, underline, and trailing-icon spacing match the reference

#### Scenario: Variant controls font weight and base color

- **WHEN** the anchor renders with `variant="primary"`, `variant="secondary"`, or `variant="tertiary"`
- **THEN** it uses, respectively, regular, bold, or medium font weight, and the base (default-state) color defined by the reference for that variant and appearance

#### Scenario: Hover and focus state color

- **WHEN** the anchor is hovered or receives keyboard focus
- **THEN** its color changes to the reference's hover/focus alpha token for its current `variant` and `appearance`, without a `state` prop being passed by the caller (the change is driven by native `:hover`/`:focus-visible`)

#### Scenario: Disabled state

- **WHEN** the anchor renders with `disabled`
- **THEN** it uses the reference's disable-state alpha token for its `variant` and `appearance`, exposes `aria-disabled="true"`, is not reachable by Tab key, and does not navigate on click

#### Scenario: Conditional underline on hover/focus

- **WHEN** the anchor is hovered or focused with `appearance="dark"` and `variant` set to `primary` or `secondary`
- **THEN** the link text renders underlined

#### Scenario: No underline outside the dark primary/secondary hover/focus case

- **WHEN** the anchor is hovered or focused with `appearance="light"`, or with `variant="tertiary"` in any appearance
- **THEN** the link text does not render underlined, matching the reference

#### Scenario: Uppercase default

- **WHEN** the anchor renders without an explicit `uppercase` prop
- **THEN** its label text renders in uppercase, matching the reference default

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

### Requirement: A11y trigger component fidelity

The `a11y-trigger` component SHALL match the geometry, typography, opacity, and state treatment recorded from the Figma `a11y-trigger` node (`node-id=2109-3862`), for both light and dark appearance. It SHALL expose three independent axes — `appearance` (`light`/`dark`), `state` (`regular`/`hover`/`focus`), and `opened` (boolean) — and SHALL NOT use the accent color (`--minimalist-accent`) in any state.

#### Scenario: Regular state opacity

- **WHEN** the trigger renders with `opened=false` and no hover or focus
- **THEN** its icon (accessibility glyph and chevrons) renders at full opacity (black in light appearance, white in dark appearance)

#### Scenario: Hover or focus dims the icon only

- **WHEN** the trigger renders with `opened=false` and is hovered or receives keyboard focus
- **THEN** its icon renders at reduced opacity (~40% in light appearance, the equivalent dark-appearance alpha step), with no accent-colored text or border, and the visible keyboard-focus indicator comes from the shared theme focus ring

#### Scenario: Opened state restores full opacity

- **WHEN** the trigger renders with `opened=true`
- **THEN** its icon renders at full opacity regardless of `state`, matching the `regular` treatment, and the chevrons icon shows the collapse glyph instead of the expand glyph

#### Scenario: Geometry and typography

- **WHEN** the trigger renders in any state or appearance
- **THEN** it lays out its icon and optional badge with a 4px gap, no border, no padding, and no background; its accessibility icon renders at 20×20 and its chevrons icon at 16×16; any visible text uses 16px (`--minimalist-font-size-large`)

#### Scenario: Optional badge stays at full opacity

- **WHEN** the trigger renders with an active-count badge
- **THEN** the badge text renders at full opacity (never dimmed) in every `state`, using the same typography as the rest of the component

### Requirement: Minimalist visual tokens

The component system SHALL expose JetBrains Mono, uppercase interface labels, 12/14/16 px text sizes, documented spacing, border, opacity, focus, background, foreground, muted, and accent roles for light and dark appearance.

#### Scenario: Light appearance

- **WHEN** a minimalist component renders in light appearance
- **THEN** it uses the light prototype roles and preserves the configured regular, hover, and focus contrast values

#### Scenario: Dark appearance

- **WHEN** a minimalist component renders in dark appearance
- **THEN** it uses the dark prototype roles while preserving the same component geometry and interaction semantics

### Requirement: Figma component fidelity

The component system SHALL provide the recorded `switch-btn`, `i18n-toggle`, `on-off-toggle`, `pagination-btn`, `card`, `divider`, `navigation-hint`, `step`, `pagination`, `section-switch`, `a11y-trigger`, and links/actions families with the geometry, typography, color, opacity, border, and state treatments represented by the captured reference. When `step` and `pagination` are used for the Minimalist content-side dot pagination, they SHALL match the Figma nodes `2101-1921` and `2101-1924` and SHALL remain distinct from footer pagination.

#### Scenario: Component state review

- **WHEN** the showcase or content-side pagination renders a component in regular, hover, focus, current, opened, or disabled state represented by the reference
- **THEN** the component changes only the corresponding visual/state properties and retains its semantic structure

#### Scenario: Content-side pagination reference

- **WHEN** the `step` and `pagination` families render beside Minimalist content
- **THEN** their geometry, spacing, colors, states, and side placement match the referenced Figma nodes in both appearances, without inheriting footer-pagination behavior

### Requirement: Accessible component states

All interactive minimalist components SHALL use semantic controls, localized accessible names, visible keyboard focus, and ARIA state attributes where applicable.

#### Scenario: Keyboard interaction

- **WHEN** a keyboard user focuses and activates a minimalist control
- **THEN** the control is reachable in logical order, exposes its current state, and retains a visible focus indicator

### Requirement: Existing asset reuse

The system SHALL resolve icons, logos, favicon, and misc-icons from existing local assets and SHALL NOT request or persist equivalent Figma exports.

#### Scenario: Local icon-backed control

- **WHEN** a minimalist control needs an asset already present in the codebase
- **THEN** it renders the local asset with a localized accessible label or name

### Requirement: Localized interface contract

All user-visible labels and accessibility text SHALL come from matching `en` and `pt-BR` messages under the `minimalist` namespace.

#### Scenario: Locale review

- **WHEN** the showcase is opened in either supported locale
- **THEN** component labels, states, tooltips, and accessible names use the active locale without hardcoded fallback copy

### Requirement: Captured design reference

The implementation SHALL use the stored Figma reference for the selected component scope and SHALL NOT call Figma during rendering or repeat an identical MCP read during implementation.

#### Scenario: Reference reuse

- **WHEN** an engineer verifies an already-recorded component family
- **THEN** the engineer uses the stored reference and local implementation evidence instead of issuing another identical Figma request

### Requirement: Expandable card component contract

The shared Minimalist `card` component SHALL support compact and expanded states with a localized accessible toggle, stable identity, a content slot suitable for a FLIP transition, and a separate expanded-content slot rendered only when open.

#### Scenario: Compact card

- **WHEN** a card is rendered in its default state
- **THEN** its summary is visible, its expansion control exposes `aria-expanded="false"`, and its identity remains stable across state changes

#### Scenario: Expanded card

- **WHEN** the card is toggled open
- **THEN** its expanded content is rendered in the card body, the control exposes `aria-expanded="true"`, and the visual transition can be driven by the shared FLIP contract

### Requirement: Project description rendering

Project cards SHALL pass the complete CMS `desc` field to the shared `MarkdownText` renderer in the expanded-content slot; the compact state MAY continue to show the short `excerpt`.

#### Scenario: Markdown project description
- **WHEN** a project contains Markdown emphasis or multiple paragraphs in `desc`
- **THEN** the expanded card renders that syntax through `MarkdownText` without replacing it with plain text

### Requirement: Card expansion localization

The card's expand and collapse labels SHALL come from the `minimalist` message namespace for both `en` and `pt-BR` and SHALL not be hardcoded in the component.

#### Scenario: Localized toggle

- **WHEN** a user changes the locale while viewing a card
- **THEN** the accessible label and visible action text use the active locale
