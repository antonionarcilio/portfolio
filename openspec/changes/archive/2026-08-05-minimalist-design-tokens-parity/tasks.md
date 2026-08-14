## 1. Palette cleanup in styles.css

- [x] 1.1 Diff the two `.minimalist-theme--light`/`--dark` blocks (lines ~23-39 and ~288-304) property by property; confirm which custom properties only exist in one block
- [x] 1.2 Delete the stale first block (`#f5f5f5`/`#111111`), keeping the recruiter-shell block (`#fffae5`/`#000000`) as the single definition per appearance
- [x] 1.3 Fold in any property the deleted block had that the kept block is missing (if none, skip)

## 2. Alpha and font-weight tokens

- [x] 2.1 Add `--minimalist-alpha-black-{30,40,50,60,70,80,100}` and `--minimalist-alpha-white-{30,40,50,60,70,80,100}` custom properties to `.minimalist-theme` (or the per-appearance blocks, whichever keeps light/dark resolution correct)
- [x] 2.2 Add `--minimalist-weight-{light,regular,medium,semibold,bold}` custom properties (300/400/500/600/700) to `.minimalist-theme`
- [x] 2.3 Replace literal `font-weight: <number>` declarations in `styles.css` with `var(--minimalist-weight-*)`
- [x] 2.4 Replace `--minimalist-muted`/`--minimalist-border` literal opacity values with references to the new alpha-scale properties where they match an existing step

## 3. Token registry cleanup

- [x] 3.1 Audit `tokens.ts` for runtime consumers (`grep -rn "minimalistTokens\|appearanceClass" src/`); confirmed zero imports outside the file itself
- [x] 3.2 Delete `src/features/minimalist/tokens.ts` (dead code — CSS custom properties in `styles.css` are the only thing actually read)
- [x] 3.3 Update `reference.ts` to record node `4012:4142` as the queried component board (keep `capturedComponents`/`font`/`fontSizes`/`accent` as-is; they already match Figma)

## 4. Verification

- [x] 4.1 Run `npx pnpm typecheck` and `npx pnpm lint`
- [x] 4.2 Load `/portfolios/minimalist` (recruiter and showcase routes) in light and dark appearance, pt-BR and en, and visually confirm no regression versus the pre-change screenshots (background/foreground/muted/border/weights unchanged in the rendered app, only the source of truth is deduplicated)
