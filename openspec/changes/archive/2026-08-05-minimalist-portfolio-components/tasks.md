## 1. Feature boundary and tokens

- [x] 1.1 Audit the existing `src/features/minimalist/` components against the captured reference and record any missing visual properties.
- [x] 1.2 Centralize JetBrains Mono, type scale, palette, opacity, spacing, border, focus, and appearance tokens.
- [x] 1.3 Confirm the feature stylesheet import does not change gamified styles or global contracts.

## 2. Component fidelity

- [x] 2.1 Align control geometry and states for language, appearance, on/off, pagination, section, and accessibility controls.
- [x] 2.2 Align card, divider, navigation hint, step, links, and action variants with the captured prototype.
- [x] 2.3 Ensure CVA variants expose regular, hover, focus, current, opened, and disabled states without duplicated class maps.

## 3. Assets and accessibility

- [x] 3.1 Verify every icon/logo/favicon/misc-icon resolves from local assets and remove any duplicate export path.
- [x] 3.2 Verify semantic elements, localized labels, ARIA state, visible focus, and keyboard order for every interactive component.
- [x] 3.3 Compare `en` and `pt-BR` minimalist message keys and remove hardcoded interface fallbacks.

## 4. Showcase and responsive behavior

- [x] 4.1 Render all recorded component families and representative states in the temporary showcase route.
- [x] 4.2 Add feature-scoped responsive rules for narrow and wide review sizes without arbitrary JSX breakpoints.
- [x] 4.3 Validate light/dark appearance and ensure the showcase remains independent from `gamified`.

## 5. Verification

- [x] 5.1 Compare typography, palette, opacity, borders, spacing, geometry, and states against the captured Figma reference.
- [x] 5.2 Use Chrome DevTools MCP to inspect screenshots, computed styles, focus behavior, responsive layout, console messages, and network requests.
- [x] 5.3 Run `npx pnpm format:check`, `npx pnpm lint`, `npx pnpm typecheck`, and `npx pnpm build`.
- [x] 5.4 Run `openspec validate --changes "minimalist-portfolio-components" --strict` and `git diff --check`.
