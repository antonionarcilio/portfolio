## Purpose

Oferecer uma apresentação minimalista, acessível e navegável do portfólio para recrutadores, com seções de tela cheia e comportamento consistente entre locales e aparências.

## ADDED Requirements

### Requirement: Recruiter section experience

The minimalist recruiter route SHALL present the portfolio as an ordered set of full-viewport sections covering introduction, profile, experience, projects, skills, education, and contact.

#### Scenario: Section viewport contract

- **WHEN** a recruiter opens the minimalist route
- **THEN** the active section occupies the viewport without horizontal overflow and the next section can be reached through scroll or an explicit navigation control

### Requirement: Section navigation

The route SHALL expose accessible controls for moving to the previous, next, and selected sections while preserving the active section state.

#### Scenario: Keyboard section change

- **WHEN** a keyboard user activates a section control or navigation hint
- **THEN** focus moves to the selected section context, the active step is updated, and the control exposes its current state to assistive technology

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
