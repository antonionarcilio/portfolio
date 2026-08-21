## 1. Types

- [x] 1.1 Add `MinimalistButtonVariant = 'primary' | 'secondary'` to `src/features/minimalist/types.ts`.

## 2. Button component

- [x] 2.1 In `src/features/minimalist/components/button.tsx`, add a `variant` CVA variant (`primary`/`secondary`, default `primary`) alongside the existing `appearance` variant.
- [x] 2.2 Add `compoundVariants` for the 4 `appearance × variant` combinations, each setting: base color token (`text-minimalist-alpha-{black,white}-100`), `hover:`/`focus-visible:` color (`-70`) and, only for `secondary`, `hover:underline focus-visible:underline`, and `disabled:` color (`-30`).
- [x] 2.3 Add `outline-none` to the CVA base classes (replaces the `outline: none` currently in the CSS `:hover`/`:focus-visible` rules being removed) and `disabled:opacity-100` (replaces `.minimalist-button:disabled { opacity: 1 }`).
- [x] 2.4 Render the two bracket `motion.span` elements only when `variant === 'primary'`.
- [x] 2.5 Add `variant?: MinimalistButtonVariant` to `ButtonProps` (optional, CVA default handles the fallback).

## 3. Style cleanup

- [x] 3.1 Remove `.minimalist-button--light`, `.minimalist-button--dark`, and their `:hover`/`:focus-visible`/`:disabled` blocks from `src/features/minimalist/styles.css` (current lines ~220-254), keeping `.minimalist-button__bracket` (opacity fallback) untouched.
- [x] 3.2 Grep the repo for any remaining reference to the removed classes to confirm nothing else depends on them.

## 4. Existing consumers

- [x] 4.1 Verify `about-bio-panel.tsx`, `card.tsx`, and `section.tsx` (current `<Button>` usages) still compile without passing `variant` (defaults to `primary`) and render unchanged.

## 5. Preview route (dev-only)

- [x] 5.1 Create `src/app/[locale]/dev/minimalist-button/page.tsx` rendering a grid of `Button` for every `variant` (`primary`/`secondary`) × `appearance` (`light`/`dark`) combination, each shown once enabled and once `disabled`.
- [x] 5.2 Add a `minimalist.buttonPreview` namespace (page title + axis labels only) to `src/messages/pt-BR.json` and `src/messages/en.json`, with identical keys in both files; reuse the existing `expand`/`aboutExpand` (`"Ver mais"`/`"See more"`) key for the `Button` label prop.
- [x] 5.3 Confirm the route is not linked from any portfolio navigation/menu component.

## 6. Verification

- [x] 6.1 `npx pnpm typecheck` and `npx pnpm lint` pass.
- [x] 6.2 Manually load the preview route in both locales and both `appearance` values, hover/Tab into each button, and compare against Figma `button/collapse` (`2099:1949`) and `button/secondary` (`4173:5008`): text, opacity steps (100/70/30), bracket presence, and underline-on-hover/focus for `secondary` only.
- [x] 6.3 Manually verify the existing "VER MAIS" collapse control (recruiter screen) still renders and behaves as before (no `variant` prop passed).

## 7. Fixes: disabled hover/focus and wavy underline

- [x] 7.1 In each `compoundVariants` entry, add `disabled:hover:*`/`disabled:focus-visible:*` classes that pin the color back to the disabled alpha (`-30`) and, for `secondary`, force `no-underline`, so a disabled button never shows the hover/focus treatment.
- [x] 7.2 In `button.tsx`, destructure `disabled` from props and pass `whileHover={disabled ? undefined : 'active'}` / `whileFocus={disabled ? undefined : 'active'}` to `motion.button`, so the bracket opacity animation never runs on a disabled `primary` button.
- [x] 7.3 Re-check Figma node `4173:5008` for the secondary underline's decoration style: `get_figma_data`'s text-style summary doesn't expose it, so download the `hover, appearance=light` component (`4173:5013`) as a PNG and inspect it directly — confirmed **wavy**, not solid.
- [x] 7.4 Replace `hover:underline focus-visible:underline` with `hover:underline hover:decoration-wavy focus-visible:underline focus-visible:decoration-wavy` in the `secondary` compound variants.
- [x] 7.5 Re-run `npx pnpm typecheck`/`npx pnpm lint`, and manually re-verify in the preview route: disabled buttons (both variants) show no bracket/underline effect on hover, and the enabled secondary button's hover/focus underline is wavy.
