## ADDED Requirements

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
