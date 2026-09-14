## ADDED Requirements

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
