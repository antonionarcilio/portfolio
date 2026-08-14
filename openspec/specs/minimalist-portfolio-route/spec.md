## Purpose

Provide a localized, isolated showcase route where the complete minimalist component system can be reviewed before recruiter-facing screen composition consumes it.

## Requirements

### Requirement: Localized minimalist showcase route

The application SHALL expose the component showcase under the locale-aware minimalist portfolio route and SHALL render it through a namespace distinct from `gamified`.

#### Scenario: Portuguese showcase

- **WHEN** a user visits the minimalist route with `pt-BR`
- **THEN** the showcase renders the complete component inventory with Portuguese interface messages

#### Scenario: English showcase

- **WHEN** a user visits the minimalist route with `en`
- **THEN** the showcase renders the same component structure with English interface messages

### Requirement: Complete visual review surface

The showcase SHALL render every component family recorded in the Figma reference, including representative light/dark and interaction states needed for visual comparison.

#### Scenario: Component board review

- **WHEN** a reviewer opens the showcase
- **THEN** controls, navigation, steps, pagination, section switching, accessibility triggers, links/actions, cards, and dividers are visible and reviewable without relying on runtime Figma data

### Requirement: Gamified isolation

The minimalist route SHALL preserve the existing gamified route, styles, messages, and runtime behavior without importing gamified-only presentation components as its foundation.

#### Scenario: Existing portfolio remains available

- **WHEN** a user visits the gamified portfolio after the minimalist feature is added
- **THEN** the gamified portfolio continues to render with its existing behavior and localized content

### Requirement: Responsive and accessible showcase

The showcase SHALL preserve component relationships across supported viewport sizes and SHALL provide semantic interactive elements, keyboard navigation, visible focus, and usable labels.

#### Scenario: Narrow viewport review

- **WHEN** the showcase is rendered at a narrow viewport
- **THEN** component groups reflow without horizontal overflow or loss of control access
