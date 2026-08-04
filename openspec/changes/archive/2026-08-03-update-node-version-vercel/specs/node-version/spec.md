## Purpose

Define a Node.js version pin for the project's local, CI and Vercel deploy environments, aligned with the version recommended by Vercel (latest LTS, 24.x).

## ADDED Requirements

### Requirement: Node.js version aligned with Vercel recommendation

The project SHALL declare the Node.js version recommended by Vercel (24.x LTS) as the runtime for builds and deployments. The declared version MUST be consistent across `.nvmrc`, `engines.node` in `package.json`, and any documentation referencing the project's Node.js version. The `engines.node` range SHALL use the `24.x` format so Vercel resolves it to the latest 24.x release.

#### Scenario: Local environment uses the pinned version

- **WHEN** a developer installs the project on a machine with `nvm`
- **THEN** `nvm` resolves the version from `.nvmrc` to the latest Node.js 24.x LTS release

#### Scenario: Vercel deploy uses the recommended version

- **WHEN** Vercel builds a new deployment of the project
- **THEN** the build runs on the latest Node.js 24.x version, resolved from the `engines.node` range in `package.json`

#### Scenario: Documentation reflects the pinned version

- **WHEN** a contributor reads the project prerequisites
- **THEN** all documented references to the Node.js version state 24.x (matching `.nvmrc` and `engines.node`)
