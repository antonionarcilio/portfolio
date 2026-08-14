## Purpose

Define the visual and interaction contract for the Minimalist footer and pagination controls, including a centered active item and continuous circular navigation across sections.

## Requirements

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

The footer SHALL present a window of section options on a translated track whose active option is always in the center slot of the window and centered in the available footer navigation area. The footer SHALL render a bounded window of options derived from the active section rather than the full circular sequence, and SHALL update the active option instantly, without a sliding transition. The active option SHALL expose its selected state and retain the Figma-defined marker, underline, typography, spacing, and appearance-specific colors.

#### Scenario: Active option remains centered

- **WHEN** the active section changes through wheel, keyboard, pagination button, or footer option activation
- **THEN** the active footer option is visually centered in the footer navigation area while neighboring options remain available on either side

#### Scenario: Windowed option set

- **WHEN** the footer renders
- **THEN** exactly five section options are present, the active option occupies the center slot, and only the active option is focusable in the tab order

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

#### Scenario: Wheel displacement accumulates

- **WHEN** a wheel gesture produces multiple browser wheel events whose accumulated displacement is below the configured threshold
- **THEN** no section change occurs and the displacement keeps accumulating in the same direction

#### Scenario: Wheel confirms a section change

- **WHEN** the accumulated wheel displacement crosses the configured threshold in a single direction
- **THEN** the active section changes by exactly one position and the accumulation resets, while a reversed direction resets the accumulation without changing the section

#### Scenario: Global wheel uses the configured threshold

- **WHEN** wheel input is handled by the global Minimalist page outside an independently scrollable project-list movement
- **THEN** the global accumulator changes section only after 120px of accumulated displacement in one direction and resets after a confirmed change

#### Scenario: Footer navigation observes a delay

- **WHEN** a footer wheel, chevron, keyboard, or option-click navigation confirms a section change
- **THEN** another footer navigation is ignored for 1.5 seconds while the active section and footer state remain stable

#### Scenario: Item-driven navigation keeps focus on the active option

- **WHEN** a user activates a footer section option by pointer or keyboard
- **THEN** the active option updates and focus remains on the newly active option

#### Scenario: Control-driven navigation preserves control focus

- **WHEN** a user activates the previous/next control or the step pagination
- **THEN** the active section updates without moving focus away from the activated control

### Requirement: Project list wheel isolation

The Minimalist project list SHALL retain vertical scrolling and its existing row-snap behavior when wheel input originates inside `.minimalist__project-grid`. The footer wheel handler SHALL ignore those events so it cannot prevent the list from scrolling or change the active section.

#### Scenario: Project list scrolls independently

- **WHEN** a user scrolls the project list with wheel input while no project is expanded
- **THEN** the project grid scrolls to the next or previous available row without changing the active footer section

#### Scenario: Footer wheel remains isolated from project scrolling

- **WHEN** wheel input originates inside the project grid
- **THEN** the footer accumulator does not consume the event and the page-level footer handler does not call `preventDefault()` for that event

#### Scenario: Project-list boundary hands off to the global page

- **WHEN** the project grid is at its top and receives upward wheel input, or is at its bottom and receives downward wheel input
- **THEN** the grid does not consume or prevent that boundary event, allowing the global page accumulator to receive it
