## MODIFIED Requirements

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
