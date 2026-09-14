## ADDED Requirements

### Requirement: Profile portrait sourced from CMS

The recruiter "About" section SHALL render the profile portrait from the existing localized portfolio data pipeline instead of a static local asset.

#### Scenario: CMS provides a portrait

- **WHEN** the CMS root content includes a portrait/avatar reference
- **THEN** the About section renders that image resolved through the portfolio data pipeline

#### Scenario: CMS omits the portrait

- **WHEN** the CMS root content has no portrait/avatar reference
- **THEN** the About section omits the portrait without rendering a broken image or a fabricated placeholder
