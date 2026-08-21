## Context

`src/features/minimalist/components/button.tsx` implements the `Button` as a single CVA appearance axis (`light`/`dark`) plus CSS-driven color states in `src/features/minimalist/styles.css:220-254` (`.minimalist-button--light`/`--dark` and their `:hover`/`:focus-visible`/`:disabled` rules). This already violates `minimalist-style-boundary` (simple color/opacity/decoration state changes must be Tailwind/CVA in the component, not CSS) — see proposal.md - Why.

Figma data pulled in this session (1 `get_figma_data` call, node `4173:5008`, `button/secondary`):

- 8 components: `state={default,hover,focus,disable} × appearance={light,dark}`.
- Typography: JetBrains Mono, 14px, regular, uppercase — identical to the current `primary` (`button/collapse`, `2099:1949`).
- Colors: `default` = black/white 100% opacity, `hover`/`focus` = black/white 70%, `disable` = black/white 30% — the exact same alpha scale already defined as `--minimalist-alpha-{black,white}-{100,70,30}` and exposed as Tailwind tokens (`text-minimalist-alpha-black-100`, etc.) in `styles.css:68-81`.
- No `[`/`]` characters in any secondary component (unlike primary).
- `hover`/`focus` text style adds `textDecoration: UNDERLINE`; `default`/`disable` do not. The `get_figma_data` text-style summary doesn't expose decoration *style* (solid/wavy/dotted), so a follow-up `download_figma_images` call on the `hover, appearance=light` component (`4173:5013`) was made to inspect it visually: the underline is **wavy** (`text-decoration-style: wavy`), not solid.

Total Figma usage this session: 2/6 calls (1 `get_figma_data`, 1 `download_figma_images` for the underline-style check).

## Goals / Non-Goals

**Goals:**
- Add `variant="primary" | "secondary"` to `Button`, default `primary`, orthogonal to `appearance`.
- Match `button/secondary` pixel/opacity/decoration behavior exactly.
- Express all `appearance`/`variant`/state color and decoration logic as Tailwind classes via CVA `compoundVariants`, removing the now-redundant CSS block.
- Provide a dev-only route rendering the full matrix for manual visual QA against Figma.

**Non-Goals:**
- No new visual axes (`size`, `icon`, `pressed`, `loading`).
- No change to `minimalist-style-boundary` itself — this change makes `Button` comply with a rule that already exists.
- No automated visual-regression tooling (Chromatic/Percy) — QA is manual against the preview route, consistent with how other Minimalist components are validated today.

## Decisions

**CVA `compoundVariants` over a second `cva()` call or a lookup table.** The color/decoration state for a given `(appearance, variant)` pair is a fixed string of Tailwind classes (base + `hover:`/`focus-visible:`/`disabled:` variants). `compoundVariants` keeps this declarative and colocated with the existing `appearance` variant, avoiding a parallel `Record<string, string>` (banned by CLAUDE.md's CVA anti-patterns) or a second cva instance that would need manual `clsx` merging.

**Reuse `--minimalist-alpha-*` tokens, don't invent new colors.** Figma's secondary opacities (100/70/30) match the tokens `Button` already relies on for `primary`. No new `@theme inline` tokens are needed — this also means the 4 compound classes are just `text-minimalist-alpha-{black,white}-100`, with `hover:`/`focus-visible:` swapping to `-70` and `disabled:` to `-30`, plus `hover:underline hover:decoration-wavy focus-visible:underline focus-visible:decoration-wavy` only for `secondary` (Tailwind v4's `decoration-wavy` utility maps to `text-decoration-style: wavy`, confirmed against the downloaded Figma reference).

**Brackets rendered conditionally on `variant`, not via CSS `display:none`.** `variant="secondary"` never has bracket characters in Figma (not "brackets hidden"), so the two `motion.span` bracket elements are only rendered when `variant === 'primary'`, avoiding dead nodes/animation work for `secondary`.

**Disabled buttons never show the hover/focus treatment.** Native `<button disabled>` still matches `:hover` in some browsers (Chrome dispatches `mouseover`/`mouseout` on disabled buttons even though `click` never fires), so a plain `hover:`/`focus-visible:` compound class isn't enough. Two layers close this: (1) each `compoundVariants` entry adds `disabled:hover:*`/`disabled:focus-visible:*` classes chaining two pseudo-classes, which out-specificities the plain `hover:`/`focus-visible:` rules and forces the color back to the disabled alpha and (for `secondary`) `no-underline`; (2) `Button` reads `disabled` from props and passes `whileHover={disabled ? undefined : 'active'}` / `whileFocus={disabled ? undefined : 'active'}` to `motion.button`, so Framer Motion never runs the bracket opacity animation on a disabled `primary` button regardless of browser hover-event quirks.

**Keep the bracket-opacity CSS fallback rule.** `styles.css:226-231` (`.minimalist-button__bracket { opacity: 0 }`) documents a specific `AnimatePresence`-related Framer Motion quirk unrelated to color/state — it stays in CSS per `minimalist-style-boundary`'s "contextual/behavioral CSS remains feature-scoped" rule, and per this project's migration-note convention it is not touched beyond what's needed.

**Preview route lives outside `portfolios/`.** `src/app/[locale]/dev/minimalist-button/page.tsx` — a top-level `[locale]` segment (required for `next-intl`/`Link` to resolve), sibling to `minigames`, not nested under `portfolios/minimalist` so it's never reachable from the public portfolio's navigation or CMS-driven routing. It renders a static grid (`variant × appearance`, each with an enabled and a `disabled` instance); `hover`/`focus` are validated interactively by the developer (real mouse hover / Tab focus), not simulated in markup — matches how the rest of the Minimalist QA is done and avoids extra state-forcing code for a dev-only page. Reuses the existing `expand`/`aboutExpand` translation key (`"Ver mais"` / `"See more"`) for the button label instead of introducing a new one; adds a small `minimalist.buttonPreview` namespace only for the page's own headings (title + axis labels), per CLAUDE.md's no-hardcoded-string rule.

## Risks / Trade-offs

- **[Risk]** Removing `styles.css:220-254` could regress `primary` if a compound-variant class string has a typo → **Mitigation**: the preview route makes both variants visually diffable against Figma before merge; `primary`'s Tailwind classes are copied 1:1 from the alpha values the removed CSS already used, so no color value changes.
- **[Risk]** Global `.minimalist-theme button:focus-visible` outline rule (`styles.css:211-216`) is unrelated to this change and stays as-is; if `focus-visible:` Tailwind utilities on `Button` visually conflict with it, the outline is likely already covered by `outline: none` in the current `:hover`/`:focus-visible` CSS being removed → **Mitigation**: keep an explicit `outline-none` in the CVA base classes to preserve that behavior.
- **[Trade-off]** Manual (not automated) visual QA for hover/focus states on the preview page → acceptable since no visual-regression tooling exists elsewhere in this project.
