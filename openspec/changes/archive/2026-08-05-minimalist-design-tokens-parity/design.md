## Context

See proposal.md - Why. Relevant files: `src/features/minimalist/styles.css` (two conflicting `.minimalist-theme--light`/`--dark` blocks, lines 23-39 and 288-304), `src/features/minimalist/reference.ts` (captured Figma board record). Confirmed against Figma via `get_variable_defs` on node `4012:4142` (file `oaRNKV5sEnHE2gffqUbMJl`): `primary/base = #fffae5`, alpha scale `alpha-black/white-{30,40,50,60,70,80,100}`, `Font size/text-{xs,sm,md} = 12/14/16`, `Font weight/{regular,medium,semibold,bold}`, `Font family/font-family-portfolio = JetBrains Mono`. Accent purple (`#8a38f5`/`#b982ff`) is not a bound Figma variable on the inspected nodes — it stays a literal token, unchanged by this proposal.

`src/features/minimalist/tokens.ts` (`minimalistTokens`, `appearanceClass`) was audited and has **zero runtime consumers** — `grep -rn "minimalistTokens\|appearanceClass" src/` outside the file itself returns nothing, and both components that need the theme class (`minimalist-recruiter.tsx`, `minimalist-showcase.tsx`) build `` `minimalist-theme--${appearance}` `` inline rather than calling `appearanceClass()`. It is not wired into the CSS pipeline in any way; `styles.css` is the only thing the browser reads. The file is removed by this change rather than kept in sync (see Decisions).

## Goals / Non-Goals

**Goals:**

- Collapse the two conflicting theme blocks in `styles.css` into one, keeping the values that already match Figma (`#fffae5`/`#000000` light, `#000000`/`#ffffff` dark).
- Remove `tokens.ts` as a dead, unconsumed duplicate; keep `reference.ts` (an intentional design-time record, not a runtime value source) in sync with the node actually queried.
- Add the missing alpha and font-weight tokens as CSS custom properties so future components pull from a scale instead of inventing literals.

**Non-Goals:**

- Redesigning the accent color or introducing new visual treatments not present in the current Figma board.
- Touching `gamified` tokens/styles or any non-`minimalist` feature.
- Auditing every consumer of `font-weight`/opacity literals across all minimalist components in this change — this proposal adds the tokens and fixes the palette block; a full literal-to-token sweep of every selector is tracked as follow-up (see Open Questions) to keep the diff reviewable.

## Decisions

- **Keep the second (recruiter shell) block as canonical, delete the first.** It's the one matching Figma's `primary/base`; the first block is the stale pre-recruiter palette. Alternative considered: keep the first and update its values in place — rejected because the second block also carries `display:flex; height:100dvh` layout rules for `.minimalist-theme` that are load-bearing for the recruiter shell, so merging into the first would require moving that layout logic too, adding risk for no benefit.
- **Opacity scale as CSS custom properties on `.minimalist-theme`, not a TS export.** Consistent with how `--minimalist-muted`/`--minimalist-border` already work; components consume via `var(--minimalist-alpha-60)` etc. Alternative (a TS `opacityScale` map like the old `minimalistTokens.opacity`) was rejected because opacity is only ever consumed as CSS, and a TS map would duplicate the same values in two places — the exact drift this change is fixing.
- **Font weights as named CSS custom properties** (`--minimalist-weight-regular: 400`, etc.) defined once in `.minimalist-theme`, replacing inline numeric literals in selectors. Mirrors the existing pattern for `--minimalist-font-size-*`.
- **Delete `tokens.ts` instead of syncing it.** It had zero runtime imports (verified by grep) — nothing ever read `minimalistTokens.colors` or called `appearanceClass()`. Keeping it "in sync by hand" is exactly the maintenance trap that caused the original drift this change fixes: a value duplicated where only one copy (`styles.css`) is ever actually read will rot the moment someone updates the other one. Initial drafts of this change (tasks 3.1-3.3) mistakenly re-synced it instead of deleting it, directly contradicting the opacity decision above — corrected after review. If a future component genuinely needs these values in TypeScript (e.g. for a canvas/SVG renderer that can't read CSS custom properties), reintroduce a minimal typed export at that point, scoped to what that consumer needs.
- **`reference.ts` node-id update:** record `4012:4142` (the full component board), since that's the node actually queried for variable defs; keep `accent`/`capturedComponents` as-is (unchanged, not Figma-variable-bound). `reference.ts` itself stays as a design-time audit record (per the original `minimalist-portfolio-components` design decision) — it has no runtime consumer either, but that's its intended role, not drift.

## Risks / Trade-offs

- [Deleting the first theme block could remove a property the second block doesn't redefine] → diff both blocks property-by-property before deleting; the second block is missing `--minimalist-focus-width`/`--minimalist-focus-offset`/`--minimalist-disabled-opacity`/`--minimalist-font-size-*`, which live only in the base `.minimalist-theme` selector (not the `--light`/`--dark` variants) and are unaffected by this merge.
- [Introducing named font-weight tokens touches many selectors at once] → apply mechanically (literal → `var(--minimalist-weight-*)`) with no visual change, verify via the existing `/portfolios/minimalist` showcase route in both appearances before/after.

## Migration Plan

1. Merge the two `.minimalist-theme--light`/`--dark` blocks in `styles.css` into one per appearance, keeping Figma-confirmed values.
2. Add alpha-scale and font-weight custom properties to `.minimalist-theme`.
3. Delete `tokens.ts`; update `reference.ts` node-id to match.
4. Replace literal `font-weight` numbers in `styles.css` selectors with the new custom properties (mechanical, no visual change expected).
5. Visually verify `/portfolios/minimalist` (recruiter and showcase routes) in light/dark and pt-BR/en before/after.

## Open Questions

- Whether to also sweep every remaining literal opacity/spacing value in `styles.css` onto tokens in this same change or as a separate follow-up change — deferred since it doesn't change the specs or this change's approach.
