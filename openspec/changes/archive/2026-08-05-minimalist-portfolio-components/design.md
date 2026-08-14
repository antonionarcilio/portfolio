## Context

The current implementation lives in `src/features/minimalist/` and exposes a temporary route under `src/app/[locale]/portfolios/minimalist/`. The captured Figma component reference is stored in `src/features/minimalist/reference.ts`; the feature must remain additive and isolated from `src/features/gamified/`.

## Goals / Non-Goals

**Goals:**

- Make every minimalist primitive visually traceable to the captured Figma component board.
- Centralize light/dark tokens, font family, type scale, spacing, borders, opacity, accent, and focus treatment.
- Express component properties as typed CVA variants and preserve semantic, keyboard-accessible states.
- Keep the showcase comprehensive enough to validate all component families before the recruiter screens consume them.

**Non-Goals:**

- Building recruiter content sections or client mode.
- Changing CMS mapping or gamified presentation.
- Adding a runtime Figma client or replacing local assets with exports.

## Decisions

- **Reference boundary:** treat `src/features/minimalist/reference.ts` as the captured design-time record. It records the file/node, component inventory, JetBrains Mono, type scale, and accent; implementation does not re-query Figma for the same scope.
- **Token ownership:** keep visual constants in `src/features/minimalist/tokens.ts` and expose appearance classes consumed by `src/features/minimalist/styles.css`. This prevents token drift across controls and keeps gamified variables untouched.
- **Variant API:** use CVA for appearance, interaction, current/selected, opened, disabled, and density states. Use `clsx` only for runtime state composition that is not a design variant.
- **Styling fidelity:** model the Figma geometry with feature BEM classes, explicit control heights/padding, uppercase labels, opacity roles, border treatments, and visible focus rings. Responsive overrides remain in the feature stylesheet.
- **Asset policy:** resolve existing icon/logo/favicon/misc-icon files through local conventions. If a Figma component uses an existing asset, the component receives the local asset or path rather than downloading a duplicate.
- **Showcase coverage:** render every recorded component family and representative regular, hover, focus, current, open, and disabled states in both appearances and locales.
- **Animation policy:** keep primitives static unless the prototype requires motion; any motion uses Framer Motion and shared feature animation constants.

## Risks / Trade-offs

- [The captured board may not describe every responsive breakpoint] → preserve relationships with fluid feature CSS and validate both desktop and narrow viewports.
- [A token correction can affect several primitives] → keep tokens centralized and validate the showcase as a complete matrix after changes.
- [Existing worktree implementation is uncommitted] → modify planning artifacts only here; apply implementation changes through the apply workflow while preserving unrelated files.
- [Figma quota is limited] → use the existing captured reference and avoid repeated identical MCP calls.

## Migration Plan

1. Apply the token, style, variant, accessibility, and showcase adjustments within `src/features/minimalist/`.
2. Validate the minimalist route in both locales and appearances, then validate the unchanged gamified route.
3. Let `minimalist-recruiter-screens` consume these primitives for the full recruiter experience.
