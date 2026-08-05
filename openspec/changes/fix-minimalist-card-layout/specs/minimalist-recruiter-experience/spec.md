## MODIFIED Requirements

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
