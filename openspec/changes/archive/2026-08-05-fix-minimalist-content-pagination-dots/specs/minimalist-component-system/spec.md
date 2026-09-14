## MODIFIED Requirements

### Requirement: Figma component fidelity

The component system SHALL provide the recorded `switch-btn`, `i18n-toggle`, `on-off-toggle`, `pagination-btn`, `card`, `divider`, `navigation-hint`, `step`, `pagination`, `section-switch`, `a11y-trigger`, and links/actions families with the geometry, typography, color, opacity, border, and state treatments represented by the captured reference. When `step` and `pagination` are used for the Minimalist content-side dot pagination, they SHALL match the Figma nodes `2101-1921` and `2101-1924` and SHALL remain distinct from footer pagination.

#### Scenario: Component state review

- **WHEN** the showcase or content-side pagination renders a component in regular, hover, focus, current, opened, or disabled state represented by the reference
- **THEN** the component changes only the corresponding visual/state properties and retains its semantic structure

#### Scenario: Content-side pagination reference

- **WHEN** the `step` and `pagination` families render beside Minimalist content
- **THEN** their geometry, spacing, colors, states, and side placement match the referenced Figma nodes in both appearances, without inheriting footer-pagination behavior
