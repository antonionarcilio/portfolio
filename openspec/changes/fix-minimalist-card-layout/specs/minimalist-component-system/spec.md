## ADDED Requirements

### Requirement: Expandable card component contract

The shared Minimalist `card` component SHALL support compact and expanded states with a localized accessible toggle, stable identity, and content slot suitable for a FLIP transition.

#### Scenario: Compact card

- **WHEN** a card is rendered in its default state
- **THEN** its summary is visible, its expansion control exposes `aria-expanded="false"`, and its identity remains stable across state changes

#### Scenario: Expanded card

- **WHEN** the card is toggled open
- **THEN** its expanded content is rendered in the card body, the control exposes `aria-expanded="true"`, and the visual transition can be driven by the shared FLIP contract

### Requirement: Card expansion localization

The card's expand and collapse labels SHALL come from the `minimalist` message namespace for both `en` and `pt-BR` and SHALL not be hardcoded in the component.

#### Scenario: Localized toggle

- **WHEN** a user changes the locale while viewing a card
- **THEN** the accessible label and visible action text use the active locale
