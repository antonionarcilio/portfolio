## MODIFIED Requirements

### Requirement: Recruiter section experience

The minimalist recruiter route SHALL present the portfolio as an ordered set of full-viewport sections covering introduction, profile, experience, projects, skills, education, and contact. The active section SHALL occupy the central viewport and be reachable through circular wheel or explicit navigation without horizontal overflow.

#### Scenario: Section viewport contract

- **WHEN** a recruiter opens the minimalist route
- **THEN** the active section occupies the viewport without horizontal overflow and the next section can be reached through scroll or an explicit navigation control

#### Scenario: Circular section transition

- **WHEN** the user navigates beyond either endpoint of the ordered sections
- **THEN** navigation wraps to the opposite endpoint and the selected section is centered in the viewport

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

