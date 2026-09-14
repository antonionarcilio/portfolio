## ADDED Requirements

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
