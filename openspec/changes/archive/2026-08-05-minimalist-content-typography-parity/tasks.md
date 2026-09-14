## 1. Collapse button (Figma node 2099-1949)

- [x] 1.1 Inspected node `2099-1949` (`button/collapse`, 8 variants: state × appearance): text is 14px regular JetBrains Mono, 0 letter-spacing — matches current CSS. The `disable` state fill is `alpha-black-30`/`alpha-white-30` (dimmed), not full-opacity black/white
- [x] 1.2 Fixed `.minimalist-recruiter__more:disabled` in `styles.css`: was forcing `opacity: 1` (full-opacity, contradicting the reference's dimmed disabled state) — changed to `opacity: 0.3` to match the measured fill
- [x] 1.3 Single shared class (`.minimalist-recruiter__more`) — the fix applies uniformly to About "view more" and Experience/Projects "expand"; no per-usage change needed

## 2. Anchor / link component (Figma node 2101-1277)

- [x] 2.1 Inspected node `2101-1277` (`anchor`, 48 variants: state × variant × uppercase × appearance): text and trailing icon are both 14px regular, `alpha-black-100`/`alpha-white-100` fill (matches current `.minimalist-link` color/size already). Found the real gap: an `uppercase` boolean property exists on the component, and the About section's actual "content/about/collapsed" instance uses it (`GITHUB`/`LINKEDIN`/`E-MAIL`/`WHATSAPP`, all caps) — our code rendered mixed-case with no way to opt in
- [x] 2.2 Added an `uppercase` prop to `MinimalistLink` (`minimalist-links.tsx`) and `linkVariants` (`variants.ts`), plus `.minimalist-link--uppercase { text-transform: uppercase; }` in `styles.css`
- [x] 2.3 Applied `uppercase` to the About section's contact links (GitHub/LinkedIn/E-Mail/extra contacts) in `minimalist-recruiter.tsx`; left "Visit company" (Projects) as-is — the reference for that link wasn't part of this change's scope and its current casing wasn't flagged as wrong

## 3. Portrait frame and image (Figma node 2113-3357)

- [x] 3.1 Inspected node `2113-3357`: the image itself is 168×168 (already matched current CSS). The corner-bracket vector is a 32×32 bounding box positioned at the frame's outer edge (12px padding before the image, i.e. 12px outside the image edge, 20px inside it), drawn as ~2px-thick solid bars — much larger/bolder than the previous 16×16 / 1px marks
- [x] 3.2 Updated `.minimalist-recruiter__portrait::before`/`::after` to `32px` size, `-12px` offset, `2px` border width. Also found and fixed a real bug: `overflow: hidden` on `.minimalist-recruiter__portrait` was clipping its own `::before`/`::after` pseudo-elements (which extend outside the box via negative offsets) — moved the clip to the `img` element instead so the corner marks stay visible

## 4. Remaining About content typography (Figma node 2113-3356)

- [x] 4.1 Inspected node `2113-3356`: kicker is 14px/semibold/full-opacity black (shared `.minimalist-kicker` is 12px/muted/uppercase — diverges); name+role line is 16px (name bold, role regular, both full-opacity, not 28px as before); location and bio are both 16px/Light(300)/full-opacity (previously 14px/muted for both)
- [x] 4.2 Updated `.minimalist-recruiter__about-copy h1`, `.minimalist-recruiter__about-role`, `.minimalist-recruiter__about-location`, and `.minimalist-recruiter__about-copy .flex` in `styles.css` to the measured sizes/weights/colors
- [x] 4.3 The kicker value diverges from the shared `.minimalist-kicker` (14px/semibold/full-opacity vs. 12px/muted/uppercase) — per the design.md decision, added an About-specific `.minimalist-recruiter__about-kicker` class instead of changing the shared one, so Experience/Projects/Education kickers and `minimalist-showcase.tsx` are untouched

## 5. Visual validation

- [x] 5.1 Built (`npx pnpm build` + `npx pnpm start`) and used browser automation (`claude-in-chrome`, in place of a separate Playwright script — same visual-regression intent) to screenshot the About section at `/en` and `/pt-BR`, light and dark
- [x] 5.2 Compared against the Figma crops: kicker (14px semibold uppercase), name+role (16px, one line), location (16px Light, full opacity, with `<3`), bio (16px Light, full opacity), disabled "view more"/"expand" (dimmed 0.3 opacity), uppercase `+`-separated contact links, and the larger/bolder portrait corner brackets all match. Also confirmed no regression on Experience/Projects (`.minimalist-recruiter__more`, "Visitar empresa" link) after the shared-class changes
- [x] 5.3 Ran `npx pnpm format`, `npx pnpm lint`, `npx pnpm typecheck`, `npx pnpm build` — all clean
