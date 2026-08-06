## Purpose

Offer a minimalist, accessible, and navigable portfolio presentation for recruiters, with full-viewport sections and consistent behavior across locales and appearances.

## Requirements

### Requirement: Profile portrait frame fidelity

The About section's portrait frame (corner brackets and image) SHALL match the reference's dimensions, corner-mark geometry, and image aspect ratio in both light and dark appearance.

#### Scenario: Portrait frame rendering

- **WHEN** the About section renders the profile portrait frame
- **THEN** its size, corner-mark length/offset, and image proportions match the reference

### Requirement: About section typography fidelity

The About section's kicker, name, role, location, and biography text SHALL match the reference's font size, weight, color, and spacing in both light and dark appearance.

#### Scenario: About content typography

- **WHEN** the About section renders its text content
- **THEN** the kicker, name+role line, location line, and biography paragraph use the font sizes, weights, and colors from the reference

### Requirement: Recruiter section experience

The minimalist recruiter route SHALL present the portfolio as an ordered set of full-viewport sections covering introduction, profile, experience, projects, skills, education, and contact. The active section SHALL occupy the central viewport and be reachable through circular wheel or explicit navigation without horizontal overflow. The projects section SHALL additionally contain an independent card viewport whose consumed scroll does not change the active global section.

#### Scenario: Section viewport contract

- **WHEN** a recruiter opens the minimalist route
- **THEN** the active section occupies the viewport without horizontal overflow and the next section can be reached through scroll or an explicit navigation control

#### Scenario: Projects card viewport

- **WHEN** the active section is projects and the user scrolls over its card viewport
- **THEN** only the adjacent card row changes while the active global section and persistent shell remain unchanged

#### Scenario: Circular section transition

- **WHEN** the user navigates beyond either endpoint of the ordered sections outside the card viewport
- **THEN** navigation wraps to the opposite endpoint and the selected section is centered in the viewport

#### Scenario: Expanded project locks global navigation
- **WHEN** a project card is expanded
- **THEN** page scroll is ignored, side dots are hidden and footer navigation is not interactive until the card is collapsed

### Requirement: Section navigation

The route SHALL expose accessible controls for moving to the previous, next, and selected sections while preserving the active section state. Previous and next navigation SHALL be circular, and the active section context SHALL remain centered after wheel, keyboard, pointer, or pagination navigation.

#### Scenario: Keyboard section change

- **WHEN** a keyboard user activates a section control or navigation hint
- **THEN** focus moves to the selected section context, the active step is updated, and the control exposes its current state to assistive technology

#### Scenario: Endpoint navigation

- **WHEN** a keyboard user activates previous on the first section or next on the last section
- **THEN** the route selects the opposite endpoint, centers that section, and leaves the navigation control enabled

#### Scenario: Wheel section change

- **WHEN** the user performs an intentional upward or downward wheel gesture over the route
- **THEN** exactly one adjacent section is selected per gesture, with endpoint wrapping and a centered final position

### Requirement: Recruiter presentation modes

The route SHALL support the minimalist light and dark appearances and SHALL keep the recruiter composition independent from the gamified layout and runtime state.

#### Scenario: Appearance change

- **WHEN** the user changes the minimalist appearance
- **THEN** all recruiter sections and controls update to the corresponding visual tokens without changing the section order or content

### Requirement: Responsive recruiter layout

The route SHALL preserve readable hierarchy and access to every section on narrow and wide viewports.

#### Scenario: Narrow viewport

- **WHEN** the route is rendered on a narrow viewport
- **THEN** content reflows within the viewport, controls remain reachable, and no section creates horizontal scrolling
