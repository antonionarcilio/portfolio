## Purpose

Definir o componente `Button` do Minimalist como uma abstração independente e fiel ao componente Figma `button/collapse`, incluindo suas oito combinações de aparência e estado.

## Requirements

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

### Requirement: Button geometry and decoration

The `Button` SHALL preserve the geometry and decoration represented by each Figma component variant: JetBrains Mono text, 14 px uppercase label, the reference spacing and alignment for the `[` / `VER MAIS` / `]` content, and no button-level border or radius. The dashed `#8A38F5` stroke and 5 px radius shown on the Figma `COMPONENT_SET` SHALL be treated as inspection framing, not as Button decoration.

#### Scenario: Reference geometry

- **WHEN** any supported `Button` variant is rendered
- **THEN** its computed box, text metrics, content alignment, padding, border, outline and radius match the captured variant within the approved visual tolerance, with no component-level outline introduced from the set frame

#### Scenario: No unsupported content

- **WHEN** a consumer renders `Button`
- **THEN** the component accepts the collapse label/content contract only and does not render an icon, loading indicator, alternate size, or unsupported visual slot

### Requirement: Button native interaction semantics

The `Button` SHALL render as a native `button` with `type="button"` by default, expose a localized accessible name, use the native disabled behavior, and show the Figma focus treatment when focus is keyboard-visible.

#### Scenario: Default activation

- **WHEN** a user activates an enabled `Button` with pointer, Enter, or Space
- **THEN** the supplied action is invoked using native button semantics

#### Scenario: Keyboard focus

- **WHEN** a keyboard user tabs to an enabled `Button`
- **THEN** it receives visible focus treatment matching the Figma `focus` variant and is included in the logical focus order

#### Scenario: Disabled activation

- **WHEN** `Button` renders disabled
- **THEN** it uses the Figma `disable` treatment, is not reachable by Tab, and does not invoke its action

### Requirement: Button isolation

The `Button` SHALL be implemented as an independently importable Minimalist component, and consumers of the `button/collapse` contract SHALL use it instead of duplicating equivalent native markup and visual classes. Other Minimalist control families SHALL remain unchanged by this capability.

#### Scenario: Collapse control migration

- **WHEN** the Minimalist recruiter screen renders a “VER MAIS” collapse control
- **THEN** it uses the independent `Button` component while preserving the current localized label and disabled behavior

#### Scenario: Other control families remain separate

- **WHEN** Minimalist renders an anchor, divider, toggle, pagination, card, navigation or accessibility control
- **THEN** that control does not receive Button-specific variants or an unrelated Button visual contract

### Requirement: Button variant preview route

A dev-only route SHALL render every combination of `variant` (`primary`/`secondary`), `appearance` (`light`/`dark`), and the enabled/disabled states of `Button`, so the rendered matrix can be visually compared against the Figma component sets `button/collapse` (`2099:1949`) and `button/secondary` (`4173:5008`). This route SHALL NOT be linked from the public portfolio navigation.

#### Scenario: Developer opens the preview route

- **WHEN** a developer navigates to the `Button` preview route
- **THEN** the page renders all `variant` × `appearance` combinations, including a disabled instance of each, without requiring interaction to reveal any combination's base treatment
