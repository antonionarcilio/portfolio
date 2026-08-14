## MODIFIED Requirements

### Requirement: Figma component fidelity

The component system SHALL provide the recorded `switch-btn`, `i18n-toggle`, `on-off-toggle`, `pagination-btn`, `card`, `divider`, `navigation-hint`, `step`, `pagination`, `section-switch`, `a11y-trigger`, and links/actions families with the geometry, typography, color, opacity, border, and state treatments represented by the captured reference. The pagination and section-switch families SHALL support the continuous centered footer behavior defined by the Minimalist footer pagination capability.

#### Scenario: Component state review

- **WHEN** the showcase renders a component in regular, hover, focus, current, opened, or disabled state represented by the reference
- **THEN** the component changes only the corresponding visual/state properties and retains its semantic structure

#### Scenario: Continuous footer component composition

- **WHEN** `pagination-btn`, `pagination`, `step`, and `section-switch` are composed in the recruiter footer
- **THEN** their active, focus, marker, icon, and appearance states match the captured Figma references while supporting a centered active item at either endpoint
