## Purpose

Define the visual, interaction, accessibility, and responsive contract for the dot pagination rendered beside the Minimalist content area, independently from footer pagination.

## Requirements

### Requirement: Content dot pagination matches the Figma reference

The content-area dot pagination SHALL match the `step` and `pagination` references at node IDs `2101-1921` and `2101-1924`, including orientation, dot dimensions, gaps, alignment, typography, colors, opacity, and current/regular/interactive states in light and dark appearance.

#### Scenario: Regular and current dots

- **WHEN** the content pagination renders with any valid page selected
- **THEN** it displays the same number and order of dots as the content pages, with exactly one current dot and the Figma geometry and visual tokens

#### Scenario: Interactive dot state

- **WHEN** a user hovers, focuses, or activates a content dot
- **THEN** only the corresponding Figma interaction/current properties change, while the pagination remains in the content-side position and keeps its layout geometry

#### Scenario: Theme parity

- **WHEN** the content pagination renders in light or dark appearance
- **THEN** its dimensions and spacing remain equivalent and its colors/opacity match the corresponding Figma appearance

### Requirement: Content pagination controls the active content page

Each content dot SHALL be an independently activatable semantic control that selects its corresponding content page, exposes the active state, and preserves keyboard navigation and visible focus.

#### Scenario: Selecting a dot

- **WHEN** a user clicks or activates a content dot with Enter or Space
- **THEN** the corresponding content page becomes active and exactly one dot exposes the current state

#### Scenario: Keyboard and accessibility state

- **WHEN** a keyboard user reaches the content pagination
- **THEN** controls are reachable in logical order, have localized accessible names, expose the current state with an appropriate ARIA attribute, and show a visible focus indicator

### Requirement: Content pagination remains separate from footer pagination

The content-side dot pagination SHALL have its own rendering and layout contract and SHALL NOT change the footer pagination's controls, order, behavior, or visual presentation.

#### Scenario: Footer isolation

- **WHEN** the Minimalist page renders both content-side dots and footer navigation
- **THEN** the side dots remain located beside the content area and footer pagination remains unchanged and independently operable

### Requirement: Content pagination is responsive without horizontal overflow

The content-side pagination SHALL preserve the reference alignment within supported Minimalist viewports and SHALL NOT cause horizontal overflow of the page or shell.

#### Scenario: Narrow viewport

- **WHEN** the Minimalist route renders at a supported narrow viewport
- **THEN** the dots remain visible and usable in their responsive placement, with `scrollWidth` equal to `clientWidth` for the page shell

### Requirement: Playwright confirms visual conformance

The change SHALL include Playwright validation that captures the content-side pagination in representative viewports, locales, and appearances and checks its geometry against the recorded Figma reference values.

#### Scenario: Visual and behavioral evidence

- **WHEN** the Playwright suite runs against the Minimalist route
- **THEN** it records passing screenshots/measurements for the `step` and `pagination` elements, validates active-state interaction and focus, reports no console errors, and confirms the footer pagination and Gamified route remain unaffected
