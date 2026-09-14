## Purpose

Use the real editorial CMS content as the single source for minimalist screens, while presenting optional profile imagery without introducing broken or fabricated visual content.

## Requirements

### Requirement: Profile portrait sourced from CMS

The recruiter "About" section SHALL render the profile portrait from the existing localized portfolio data pipeline instead of a static local asset.

#### Scenario: CMS provides a portrait

- **WHEN** the CMS root content includes a portrait/avatar reference
- **THEN** the About section renders that image resolved through the portfolio data pipeline

#### Scenario: CMS omits the portrait

- **WHEN** the CMS root content has no portrait/avatar reference
- **THEN** the About section omits the portrait without rendering a broken image or a fabricated placeholder

### Requirement: Real CMS portfolio data

The recruiter route SHALL render profile, biography, experience, projects, skills, education, achievements, contact links, and descriptions from the existing localized portfolio data source.

#### Scenario: CMS-backed rendering

- **WHEN** a supported locale is requested
- **THEN** the route uses the localized result of the existing portfolio data pipeline and does not invent replacement profile or project content in the component layer

### Requirement: Empty or unavailable content

The route SHALL handle absent optional CMS fields without rendering broken links, undefined labels, or fabricated values.

#### Scenario: Optional field is absent

- **WHEN** an optional project, achievement, education field, or contact link is missing
- **THEN** the corresponding presentation is omitted or rendered through a localized empty state while the remaining sections remain usable

### Requirement: Interface localization

The recruiter route SHALL provide matching interface messages in `en` and `pt-BR`, including navigation labels, accessibility text, metadata, and empty states.

#### Scenario: Locale switch

- **WHEN** the user opens the same recruiter section in another supported locale
- **THEN** interface text and CMS content use that locale without hardcoded fallback copy
