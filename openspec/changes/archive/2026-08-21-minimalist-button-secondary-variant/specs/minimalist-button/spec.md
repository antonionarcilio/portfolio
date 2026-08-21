## MODIFIED Requirements

### Requirement: Button Figma variant matrix

The `Button` component SHALL expose a `variant` prop with values `primary` (default) and `secondary`, each rendering the full `default`/`hover`/`focus`/`disable` × `light`/`dark` matrix. `variant="primary"` SHALL match Figma component set `button/collapse` (`2099:1949`) exactly as before. `variant="secondary"` SHALL match Figma component set `button/secondary` (`4173:5008`). It SHALL NOT expose unsupported visual axes such as `pressed`, `size`, `icon`, or `loading`.

#### Scenario: Primary light default and disabled variants

- **WHEN** `Button` renders with `variant="primary"`, `appearance="light"` and state `default` or `disable`
- **THEN** it renders the uppercase label `VER MAIS` in JetBrains Mono, 14 px, regular weight, using black at 100% opacity for `default` and black at 30% opacity for `disable`

#### Scenario: Primary dark default and disabled variants

- **WHEN** `Button` renders with `variant="primary"`, `appearance="dark"` and state `default` or `disable`
- **THEN** it renders the uppercase label `VER MAIS` in JetBrains Mono, 14 px, regular weight, using white at 100% opacity for `default` and white at 30% opacity for `disable`

#### Scenario: Primary hover and focus bracket treatment

- **WHEN** an enabled `Button` renders with `variant="primary"` in `hover` or `focus` state, in either appearance
- **THEN** it renders the visible `[` and `]` characters around `VER MAIS` and uses black or white according to the active appearance at 70% opacity

#### Scenario: Primary disabled button ignores pointer/focus

- **WHEN** `Button` renders with `variant="primary"` and state `disable`, and receives pointer hover or keyboard focus
- **THEN** it does not render the `[`/`]` characters and remains at black or white 30% opacity according to the active appearance

#### Scenario: Secondary default and disabled variants

- **WHEN** `Button` renders with `variant="secondary"` and state `default` or `disable`, in either appearance
- **THEN** it renders the uppercase label `VER MAIS` in JetBrains Mono, 14 px, regular weight, with no `[`/`]` characters, using black (light) or white (dark) at 100% opacity for `default` and at 30% opacity for `disable`, with no underline

#### Scenario: Secondary hover and focus treatment

- **WHEN** an enabled `Button` renders with `variant="secondary"` in `hover` or `focus` state, in either appearance
- **THEN** it renders the uppercase label `VER MAIS` with no `[`/`]` characters, a wavy underline (`text-decoration-style: wavy`), and black or white according to the active appearance at 70% opacity

#### Scenario: Secondary disabled button ignores pointer/focus

- **WHEN** `Button` renders with `variant="secondary"` and state `disable`, and receives pointer hover or keyboard focus
- **THEN** it renders no underline and remains at black or white 30% opacity according to the active appearance

#### Scenario: Default variant when unspecified

- **WHEN** a consumer renders `Button` without a `variant` prop
- **THEN** it renders as `variant="primary"`

## ADDED Requirements

### Requirement: Button variant preview route

A dev-only route SHALL render every combination of `variant` (`primary`/`secondary`), `appearance` (`light`/`dark`), and the enabled/disabled states of `Button`, so the rendered matrix can be visually compared against the Figma component sets `button/collapse` (`2099:1949`) and `button/secondary` (`4173:5008`). This route SHALL NOT be linked from the public portfolio navigation.

#### Scenario: Developer opens the preview route

- **WHEN** a developer navigates to the `Button` preview route
- **THEN** the page renders all `variant` × `appearance` combinations, including a disabled instance of each, without requiring interaction to reveal any combination's base treatment
