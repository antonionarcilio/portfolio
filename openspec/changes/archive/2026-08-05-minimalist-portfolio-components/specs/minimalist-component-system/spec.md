## Purpose

Define a reusable, accessible component system whose visual tokens, geometry, states, and local assets remain faithful to the minimalist Figma prototype without coupling the application to Figma at runtime.

## ADDED Requirements

### Requirement: Minimalist visual tokens

The component system SHALL expose JetBrains Mono, uppercase interface labels, 12/14/16 px text sizes, documented spacing, border, opacity, focus, background, foreground, muted, and accent roles for light and dark appearance.

#### Scenario: Light appearance

- **WHEN** a minimalist component renders in light appearance
- **THEN** it uses the light prototype roles and preserves the configured regular, hover, and focus contrast values

#### Scenario: Dark appearance

- **WHEN** a minimalist component renders in dark appearance
- **THEN** it uses the dark prototype roles while preserving the same component geometry and interaction semantics

### Requirement: Figma component fidelity

The component system SHALL provide the recorded `switch-btn`, `i18n-toggle`, `on-off-toggle`, `pagination-btn`, `card`, `divider`, `navigation-hint`, `step`, `pagination`, `section-switch`, `a11y-trigger`, and links/actions families with the geometry, typography, color, opacity, border, and state treatments represented by the captured reference.

#### Scenario: Component state review

- **WHEN** the showcase renders a component in regular, hover, focus, current, opened, or disabled state represented by the reference
- **THEN** the component changes only the corresponding visual/state properties and retains its semantic structure

### Requirement: Accessible component states

All interactive minimalist components SHALL use semantic controls, localized accessible names, visible keyboard focus, and ARIA state attributes where applicable.

#### Scenario: Keyboard interaction

- **WHEN** a keyboard user focuses and activates a minimalist control
- **THEN** the control is reachable in logical order, exposes its current state, and retains a visible focus indicator

### Requirement: Existing asset reuse

The system SHALL resolve icons, logos, favicon, and misc-icons from existing local assets and SHALL NOT request or persist equivalent Figma exports.

#### Scenario: Local icon-backed control

- **WHEN** a minimalist control needs an asset already present in the codebase
- **THEN** it renders the local asset with a localized accessible label or name

### Requirement: Localized interface contract

All user-visible labels and accessibility text SHALL come from matching `en` and `pt-BR` messages under the `minimalist` namespace.

#### Scenario: Locale review

- **WHEN** the showcase is opened in either supported locale
- **THEN** component labels, states, tooltips, and accessible names use the active locale without hardcoded fallback copy

### Requirement: Captured design reference

The implementation SHALL use the stored Figma reference for the selected component scope and SHALL NOT call Figma during rendering or repeat an identical MCP read during implementation.

#### Scenario: Reference reuse

- **WHEN** an engineer verifies an already-recorded component family
- **THEN** the engineer uses the stored reference and local implementation evidence instead of issuing another identical Figma request
