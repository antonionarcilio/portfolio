# minimalist-timeline Specification

## Purpose

Disponibilizar uma timeline vertical de experiência, visualmente alinhada ao design Minimalist do Figma e pronta para ser reutilizada por futuras telas sem depender do CMS ou de interação.

## Requirements

### Requirement: Render a Minimalist experience timeline

The timeline component MUST render two year labels, a vertical connector, and two circular timeline steps in a single vertical composition. The years MUST be presented in descending visual order as the component's start and end labels, preserving the values supplied by the caller.

#### Scenario: Render the default experience timeline

- **WHEN** a caller supplies a start year and an end year
- **THEN** the component renders both year labels, one vertical connector between them, and exactly two timeline steps
- **AND** the composition is centered on its vertical axis

### Requirement: Represent active and inactive timeline steps

Each timeline step MUST expose a visually distinct active or inactive state. An active step MUST use a filled circular point, while an inactive step MUST use an unfilled circular point with the same 14 by 14 pixel footprint.

#### Scenario: Render an active start step

- **WHEN** the caller marks the start step as active
- **THEN** the start point is filled and the end point remains unfilled
- **AND** both points retain the same outer dimensions and alignment

#### Scenario: Render an active end step

- **WHEN** the caller marks the end step as active
- **THEN** the end point is filled and the start point remains unfilled
- **AND** both points retain the same outer dimensions and alignment

### Requirement: Support Minimalist appearance modes

The component MUST accept the existing Minimalist appearance modes and MUST resolve its foreground, connector, label, and step colors through Minimalist-scoped styling. It MUST NOT change or depend on Gamified theme tokens.

#### Scenario: Render the timeline in each appearance mode

- **WHEN** the caller selects the light or dark Minimalist appearance
- **THEN** the timeline preserves its structure, spacing, and state semantics
- **AND** its colors resolve within the selected Minimalist appearance

### Requirement: Remain presentational and reusable

The timeline MUST be presentational: it MUST NOT fetch data, mutate CMS content, navigate, or require an existing page section to render. The component MUST preserve the exact year values supplied by the caller.

#### Scenario: Render the component without CMS data

- **WHEN** a caller renders the component with local year values and state props
- **THEN** it renders successfully without a CMS request, route dependency, or translation key
- **AND** no interaction handler is required for the visual output
