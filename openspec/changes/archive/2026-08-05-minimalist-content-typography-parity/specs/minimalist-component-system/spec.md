## ADDED Requirements

### Requirement: Collapse-button component fidelity

The `button/collapse` component (used for "view more"/"expand" affordances) SHALL match the reference's font size, weight, color, and disabled treatment in both light and dark appearance.

#### Scenario: Collapse button in the About section

- **WHEN** the About section's "view more" control renders
- **THEN** its typography and disabled-state color match the `button/collapse` reference

### Requirement: Anchor component fidelity

The `anchor` component (used for GitHub/LinkedIn/E-Mail/company links) SHALL match the reference's font size, color, underline treatment, and trailing-icon spacing in both light and dark appearance.

#### Scenario: Contact link rendering

- **WHEN** a contact or "visit company" link renders through the anchor component
- **THEN** its typography, underline, and trailing-icon spacing match the reference
