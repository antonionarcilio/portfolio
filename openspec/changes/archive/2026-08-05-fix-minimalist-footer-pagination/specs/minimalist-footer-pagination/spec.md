## Purpose

Define the visual and interaction contract for the Minimalist footer and pagination controls, including a centered active item and continuous circular navigation across sections.

## ADDED Requirements

### Requirement: Continuous centered section navigation

The Minimalist pagination controls SHALL navigate the ordered sections as a circular sequence. Moving past the last section SHALL select the first, and moving before the first SHALL select the last; the active section SHALL remain centered in the content viewport after every navigation action.

#### Scenario: Wheel moves forward continuously

- **WHEN** the user scrolls down on the Minimalist content area while the last section is active
- **THEN** the first section becomes active and the section transition finishes with the active section centered and no page-level horizontal overflow

#### Scenario: Wheel moves backward continuously

- **WHEN** the user scrolls up on the Minimalist content area while the first section is active
- **THEN** the last section becomes active and the section transition finishes with the active section centered

#### Scenario: Controls wrap at both ends

- **WHEN** the user activates previous or next from any section
- **THEN** the selected section changes by one position modulo the total section count and neither control is disabled solely because the selection is at an endpoint

### Requirement: Centered active footer item

The footer SHALL present the section options on a horizontally scrollable or translated track whose active option is centered in the available footer navigation area whenever the viewport can display the track. The active option SHALL expose its selected state and retain the Figma-defined marker, underline, typography, spacing, and appearance-specific colors.

#### Scenario: Active option remains centered

- **WHEN** the active section changes through wheel, keyboard, pagination button, or footer option activation
- **THEN** the active footer option is visually centered in the footer navigation area after the transition, while neighboring options remain available on either side when space permits

#### Scenario: Footer adapts to narrow viewports

- **WHEN** the Minimalist route is rendered at a narrow supported viewport
- **THEN** the active footer option remains visible and centered, controls remain reachable, and the page has no horizontal scrolling caused by the footer

### Requirement: Pagination and footer reference fidelity

The pagination trigger and footer SHALL match the supplied Figma references in geometry, alignment, typography, icon treatment, spacing, active/hover/focus states, and light/dark appearance.

#### Scenario: Pagination trigger matches reference

- **WHEN** the pagination trigger renders in regular, hover, focus, and active contexts
- **THEN** its dimensions, icon, gap, opacity, focus treatment, and appearance-specific colors match the pagination reference node

#### Scenario: Footer matches reference

- **WHEN** the footer renders with any active section and either supported appearance
- **THEN** its layout, option labels, previous/next controls, active marker, spacing, and colors match the footer reference node

### Requirement: Input and accessibility parity

The continuous footer navigation SHALL preserve semantic controls, localized accessible names, visible keyboard focus, and a single active state for assistive technology across `en` and `pt-BR`.

#### Scenario: Keyboard navigation wraps

- **WHEN** a keyboard user activates previous, next, or a footer section option at either sequence endpoint
- **THEN** navigation wraps to the corresponding section, updates the active accessible state, and keeps focus on a usable navigation control

#### Scenario: Wheel input is bounded per gesture

- **WHEN** a wheel gesture produces multiple browser wheel events
- **THEN** the gesture causes at most one section change until the transition lock is released, while subsequent intentional gestures remain usable
