## 1. Base switch component (Figma node 2099-1997)

- [x] 1.1 Inspect node `2099-1997` (all variants: regular/hover/focus/current, light/dark) via browser and capture the inner-divider and outer-divider treatment precisely (color, width, style)
- [x] 1.2 Update `switchButtonVariants` (`src/features/minimalist/variants.ts`) and `.minimalist-switch`/`.minimalist-control-group__options` in `src/features/minimalist/styles.css` so the inner divider between a group's two options matches the reference in both appearances
- [x] 1.3 Verified `.minimalist-recruiter__header .minimalist-switch` against the reference: `switch-btn` has no border/box in Figma in any state, so the header override is correct as-is. The real gap was that no divider element existed between a group's two options at all — fixed by inserting the `Divider` `v1` component in `I18nToggle`/`ThemeToggle`/the mode switch (see 1.2, 2.x)
- [x] 1.4 Re-confirmed the outer `Divider` `v2` shape (4-point sparkle, 7×11px) against node `2099-1997`; fixed its color from `--minimalist-muted` to `--minimalist-border` (matches the reference's 40%-alpha fill) and added a dedicated `--minimalist-divider-inner` (50%-alpha) token for the `v1` inner divider

## 2. Locale, theme, and mode switches

- [x] 2.1 Inspect node `2126-2821` (locale switch) and verify `I18nToggle` (`minimalist-controls.tsx`) option order, spacing, and states against it — order already fixed in a prior round; added the missing `v1` divider between `PT`/`EN`
- [x] 2.2 Inspect node `2065-932` (theme switch) and verify `ThemeToggle` against it — added the missing `v1` divider between the two options
- [x] 2.3 Inspect node `2065-736` (mode switch) and implement/verify the corresponding component against it — confirmed it maps to the existing R/C mode buttons in `minimalist-recruiter.tsx`; replaced the raw `|` text span with the `Divider` `v1` component for consistency and correct color
- [x] 2.4 No new labels were introduced (mode switch reuses existing `mode`/R/C copy); en.json/pt-BR.json unchanged

## 3. Header composition (Figma node 2060-84)

- [x] 3.1 Inspected node `2060-84`: confirmed order (locale+theme cluster → logo → a11y-trigger → mode cluster) and outer-divider placement already match `minimalist-recruiter.tsx`'s `<header>`; no structural reordering needed
- [x] 3.2 No additional spacing/layout changes were needed beyond the divider fixes above; verified visually (see 4.x)

## 4. Header visual validation

- [x] 4.1 Built the app (`npx pnpm build` + `npx pnpm start`) and used browser automation (`claude-in-chrome`, in place of a separate Playwright script — same visual-regression intent) to screenshot the header at `/en/portfolios/minimalist` and `/pt-BR/portfolios/minimalist`, light and dark
- [x] 4.2 Compared each screenshot against the corresponding Figma node crop: inner `|` and outer sparkle dividers now render correctly in all four combinations; no remaining discrepancy found
- [x] 4.3 Ran `npx pnpm format`, `npx pnpm lint`, `npx pnpm typecheck` — all clean

## 5. CMS avatar field

- [x] 5.1 Added optional `avatar?: string` to `RootFields` in `src/shared/data/map-portfolio.ts` and `mapAvatarUrl()` resolves it to a raw content URL in `mapPortfolioToData` (string template via `env.CMS_GITHUB_*`, no network call — see design.md Decision 3)
- [x] 5.2 Added `avatarUrl: string | null` to `PortfolioData` in `src/shared/types/portfolio.ts`
- [x] 5.3 Added `raw.githubusercontent.com` to `images.remotePatterns` in `next.config.ts`
- [x] 5.4 Documented the field via a doc-comment on `RootFields.avatar` (path, not wikilink; omitted → no portrait) — the `portfolio-cms` repo itself is edited separately via Obsidian, per CLAUDE.md

## 6. About section content (Figma node 2131-2611)

- [x] 6.1 Inspected node `2131-2611` (`content/about/collapsed`) via Figma Dev Mode: kicker is a fixed `// About Me` label (not `data.role`), name+role sit on one line separated by `|`, location gets its own line with a decorative `<3` suffix, and the contact-links row is separated by a literal `+` glyph (not the header's divider component) — all cross-checked against the previous `AboutPage`
- [x] 6.2 Replaced the hardcoded `Image src="/images/minimalist-profile.png"` with a conditional `data.avatarUrl` render; renders nothing (portrait frame stays, no broken image) when it's null
- [x] 6.3 Restructured `AboutPage` in `minimalist-recruiter.tsx` (kicker → name+role → location → bio) and `styles.css` (`.minimalist-recruiter__about-role`, `.minimalist-recruiter__about-location`, `+`-separated `.minimalist-recruiter__about-meta` links) to match; added `aboutKicker`/`locationSuffix` i18n keys to `en.json`/`pt-BR.json`; dropped the `data.company` line, which the reference does not show in this view
- [x] 6.4 Removed `public/images/minimalist-profile.png` after confirming no remaining references

## 7. Content visual validation

- [x] 7.1 Screenshotted the About section in `/en` and `/pt-BR`, light and dark, via `claude-in-chrome` (in place of a separate Playwright script); avatar-absent state verified (no CMS `avatar` field yet) — shows the portrait frame with corner brackets and no broken image
- [x] 7.2 Compared against the Figma crop for node `2131-2611`: kicker, name|role line, location+`<3`, bio, and `+`-separated links all match
- [x] 7.3 Ran `npx pnpm format`, `npx pnpm lint`, `npx pnpm typecheck`, `npx pnpm build` — all clean
