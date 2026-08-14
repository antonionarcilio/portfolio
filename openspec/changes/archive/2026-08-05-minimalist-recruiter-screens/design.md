## Context

The current minimalist route at `src/app/[locale]/portfolios/minimalist/` renders a component showcase, while the real localized portfolio data is already exposed by `src/shared/data/get-portfolio.ts`. The visual primitives and tokens live in `src/features/minimalist/` and must remain separate from `src/features/gamified/`.

## Goals / Non-Goals

**Goals:**

- Replace the temporary showcase composition with recruiter-facing sections.
- Reuse `PortfolioData` as the only editorial input.
- Keep each section viewport-sized, keyboard-accessible, localized, and responsive.
- Reuse the styled minimalist primitives and the captured Figma reference without new runtime or repeated Figma dependencies.

**Non-Goals:**

- Client-mode content or switching between recruiter and client modes.
- Changes to CMS fetching, mapping, or gamified contexts.
- A bespoke content model for the minimalist route.

## Decisions

- **Composition boundary:** keep orchestration in `src/features/minimalist/components/` and pass the server-fetched `PortfolioData` from `src/app/[locale]/portfolios/minimalist/page.tsx`. This avoids duplicating CMS mapping and keeps the route server-rendered.
- **Section model:** define a typed ordered section model with stable ids and localized labels. A client-side shell may observe the active section and call `scrollIntoView`, while the data remains server-provided.
- **Full-screen behavior:** use CSS scroll snapping and feature BEM classes in `src/features/minimalist/styles.css`; responsive rules belong in that stylesheet rather than arbitrary JSX breakpoints.
- **Visual integration:** consume the primitives from `minimalist-portfolio-components`, including cards, controls, steps, links, dividers, and appearance tokens. Do not import gamified styles or messages.
- **Data mapping:** map only existing `PortfolioData` fields into presentation sections. Optional collections are filtered before rendering; no placeholder biography, project, metric, or link values are introduced.
- **Localization:** use the `minimalist` root namespace for interface strings and `getPortfolio(locale)` for CMS content. Locale-aware links must use `src/i18n/navigation.ts`.
- **Validation:** run the app locally, inspect the route through Chrome DevTools MCP at desktop and narrow viewports, test scroll/keyboard/theme/locale states, and capture console/network evidence for regressions.

## Risks / Trade-offs

- [Long CMS content can exceed one viewport] → preserve viewport-sized section shells and allow internal section scrolling only where necessary, with visible continuation controls.
- [Browser scroll snapping differs by device] → retain explicit previous/next controls and verify both keyboard and touch-sized viewports.
- [Existing component work is uncommitted] → preserve unrelated worktree changes and validate the integrated route before further refactors.
- [Figma MCP quota is limited] → use the captured reference in `src/features/minimalist/reference.ts`; do not issue another identical Figma request.

## Migration Plan

1. Implement the recruiter composition behind the existing localized minimalist route.
2. Validate both locales, appearances, viewport classes, and the unchanged gamified route.
3. Roll back by restoring the showcase composition or removing only the recruiter composition files; CMS and gamified code remain untouched.
