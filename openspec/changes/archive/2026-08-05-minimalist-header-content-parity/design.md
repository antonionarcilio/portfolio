## Context

See proposal.md - Why. Additional current-state notes relevant to the approach:

- `src/features/minimalist/styles.css` defines the base switch look (`.minimalist-switch`, border + padding, ~line 541) and then re-declares it inside the header scope (`.minimalist-recruiter__header .minimalist-switch`, ~line 329) with `border: 0; padding: 0;`, which is what makes the inner divider disappear specifically in the header. The same base rule is reused unmodified by the footer section-switch, so the bug is header-scoped, not global.
- The outer divider between switch groups already exists as a component (`Divider` in `minimalist-controls.tsx`, `dividerVariants` in `variants.ts`) and is wired into the header (`minimalist-recruiter.tsx`). Its `v2` glyph (`✦`) was chosen from an earlier, less rigorous inspection round and needs to be re-confirmed against node `2099-1997` rather than assumed correct.
- `PortfolioData` (`src/shared/types/portfolio.ts`) and its mapper (`src/shared/data/map-portfolio.ts`) have no avatar/portrait field today. `ProjectFields.cover` and `AchievementFields.cover` exist as frontmatter interfaces but are never mapped into `PortfolioData` — there is no existing precedent to copy verbatim, only the fetch/BFS/mapper pattern to follow.
- `fetchCmsFile` (`src/lib/github-cms/fetch-cms-file.ts`) builds raw URLs as `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`. The same host/path convention applies to an image reference, but images are loaded via `next/image` (`src=`), not fetched as text, so the mapper only needs to build the URL string, not call `fetchCmsFile`.
- `next.config.ts` only allow-lists `res.cloudinary.com` in `images.remotePatterns`; `raw.githubusercontent.com` is not yet allowed.

## Goals / Non-Goals

**Goals:**
- Make the header's three switches (locale, theme, mode) and their two divider types pixel-faithful to the cited Figma nodes, in both appearances and locales.
- Source the About section's portrait from CMS content through the existing data pipeline shape, with a graceful absent-field path.
- Leave a Playwright-based visual check as the acceptance method for both the header and the About section, per the user's explicit request.

**Non-Goals:**
- Redesigning the CMS markdown schema beyond adding one optional frontmatter field for the portrait path.
- Migrating other static images (logo, favicon) to CMS — out of scope, not requested.
- Building a generic multi-image CMS asset system — this change adds exactly one field for exactly one use site (About portrait).

## Decisions

**1. Fix the switch base component before touching each concrete switch.**
The proposal's own ordering (base `switch-btn` → locale/theme/mode → header composition) matches how the bug actually originates: the base component's divider contract is right, but a header-scoped override strips it. Fixing the base variant/CSS first and then removing the header override (rather than patching the override) prevents the same class of bug from recurring in any future placement of `switch-btn`.

**2. Represent the two divider kinds as the existing `Divider` component (outer) plus a CSS-only inner rule on `.minimalist-switch` (inner), not two new components.**
The outer divider is already a discrete visual element between groups — a real component. The inner divider between a switch group's own options is a border/pseudo-element of the switch buttons themselves in Figma, not a standalone node — encoding it as CSS on `.minimalist-switch`/`.minimalist-control-group__options` avoids inventing a component Figma doesn't have. Alternative considered: give the inner separator its own `<Divider>` instance between the two `SwitchButton`s — rejected because it would require restructuring every switch group's children and Figma's node inspection (per the user's links) frames it as a state of the switch button pair, not a separate element.

**3. Add avatar as a plain optional string field (`avatarUrl: string | null`) on `PortfolioData`, resolved in the mapper by string-templating the raw content host — no new fetch call.**
Mirrors how `iconUrl` is already computed in the mapper (`lucideIconUrl(fields.icon)`) as a pure string transform rather than a network call. Alternative considered: reuse `fetchCmsFile` to validate the asset exists before returning a URL — rejected as unnecessary network overhead during build for something `next/image` will already 404 gracefully on, and inconsistent with how every other CMS-backed URL in this codebase is treated (constructed, not pre-validated).

**4. Frontmatter field name and exact CMS path are a task-time decision, confirmed against the live `portfolio-cms` repo content when implementing, not guessed here.**
The field must be added to the external `portfolio-cms` repo by hand (per CLAUDE.md's CMS rules) before the mapper can resolve real data; until then the mapper must treat it as absent and the About section must render without a portrait, which is already required by `minimalist-cms-presentation`'s "Empty or unavailable content" requirement.

## Risks / Trade-offs

- [Figma node inspection is manual/visual, not exported design tokens] → Mitigation: cross-check every measurement with a zoomed screenshot and the Playwright DOM/style dump before editing CSS, same method that already found the PT/EN order and pagination-shape bugs in this feature.
- [Adding `raw.githubusercontent.com` as a remote image host widens `next/image`'s trusted domain list] → Mitigation: the CMS repo is already the sole, public, read-only source of truth for all portfolio content; no new trust boundary is crossed.
- [The external `portfolio-cms` repo may not yet have a portrait field when this ships] → Mitigation: covered by Decision 4 — the code path is correct with the field absent, so shipping the code doesn't require the content change to land first.

## Migration Plan

No data migration. Deploy order: ship the code change (mapper tolerates the missing field), then add the frontmatter field + image to the `portfolio-cms` repo, then the next scheduled/triggered rebuild picks it up. Rollback is a normal revert; nothing is destructive.
