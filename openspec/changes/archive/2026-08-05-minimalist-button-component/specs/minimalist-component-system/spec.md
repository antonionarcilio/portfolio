## MODIFIED Requirements

### Requirement: Figma component fidelity

The component system SHALL provide the recorded `switch-btn`, `i18n-toggle`, `on-off-toggle`, `pagination-btn`, `button/collapse`, `card`, `divider`, `navigation-hint`, `step`, `pagination`, `section-switch`, `a11y-trigger`, and links/actions families with the geometry, typography, color, opacity, border, and state treatments represented by the captured reference. The `button/collapse` family SHALL be exposed as an independent `Button` component rather than only as duplicated markup embedded in recruiter controls.

#### Scenario: Component state review

- **WHEN** the showcase renders a component in a state represented by its reference
- **THEN** the component changes only the corresponding visual/state properties and retains its semantic structure

#### Scenario: Button family reuse

- **WHEN** a Minimalist control requires the `button/collapse` family
- **THEN** the consumer uses the independent `Button` component and does not duplicate its variant or state classes

#### Scenario: Button matrix completeness

- **WHEN** the `Button` component is reviewed against node `2099:1949`
- **THEN** all eight combinations (`default`, `hover`, `focus`, `disable` × `light`, `dark`) are represented and no unsupported Button axis is introduced
