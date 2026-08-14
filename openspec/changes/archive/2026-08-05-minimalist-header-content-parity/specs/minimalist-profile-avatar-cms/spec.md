## Purpose

Resolve the minimalist portfolio's profile avatar/portrait image from the same CMS content pipeline used for every other portfolio data field, rather than a static file bundled with the app.

## ADDED Requirements

### Requirement: Avatar resolution through the CMS pipeline

The portfolio data pipeline SHALL resolve an optional profile avatar/portrait image URL from the CMS root content, following the same BFS/graph/mapper flow used for the rest of `PortfolioData`, and expose it as an explicit typed field.

#### Scenario: Avatar field present in CMS frontmatter

- **WHEN** the CMS root frontmatter declares a portrait/avatar path
- **THEN** the mapper resolves it to a loadable image URL and includes it in `PortfolioData`

#### Scenario: Avatar field absent in CMS frontmatter

- **WHEN** the CMS root frontmatter has no portrait/avatar path
- **THEN** the mapper returns a null/absent value instead of throwing or fabricating a URL

### Requirement: Remote image loading is configured

The application SHALL be configured to load the resolved avatar image from the CMS repository's raw content host through the framework's image optimization.

#### Scenario: Avatar renders through next/image

- **WHEN** `PortfolioData` includes a resolved avatar URL from the CMS raw content host
- **THEN** the image renders without a remote-image-host configuration error
