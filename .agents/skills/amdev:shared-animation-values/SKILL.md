---
name: amdev:shared-animation-values
description: Enforce Framer-Motion-only animations and catch duplicated animation variants/timing/easing before they're written a second time in this project. Use this skill whenever you write, edit, or review any visual animation or transition — enter/exit of conditionally rendered elements, hover/tap/focus feedback, ambient/looping effects, or anything that would otherwise reach for a CSS transition or @keyframes. Also use it whenever you're about to write a `variants` object or a timing/easing constant, to check whether it already exists in a shared animations.ts file.
---

# Shared Animation Values (Framer Motion only)

This project animates exclusively through Framer Motion. The reason isn't
stylistic — it's that the project has a single global accessibility switch
(`reduceMotion`) that pauses every animation at once by flipping
`MotionGlobalConfig.skipAnimations`. That only works if every animation is a
Framer Motion animation; a CSS `@keyframes` or Tailwind `animate-*` class is
invisible to that flag and will keep running for a user who turned
animations off.

## Rule 1 — Framer Motion is the only animation mechanism

Use `motion.*` elements with `whileHover`, `whileTap`, `whileFocus`,
`<AnimatePresence>`, and the `animate` + `transition` props.

Do **not** use CSS `@keyframes`, Tailwind `animate-*` / `transition-*` /
`duration-*` / `ease-*` utilities, or inline `style={{ animation }}` /
`style={{ transition }}`. If you find yourself about to write one of these,
stop and convert the effect to Framer Motion props instead — see the mapping
below.

| Instead of… | Use… |
|---|---|
| `@keyframes pulse { … }` + `animation: pulse 2s infinite` | `animate={{ opacity: [1, 0.4, 1] }}` + `transition={{ repeat: Infinity, duration: 2 }}` on a `motion.*` |
| Tailwind `transition-opacity duration-300` | `animate`/`whileHover` + `transition={{ duration: 0.3 }}` |
| CSS enter/exit on conditional render | `<AnimatePresence>` wrapping the conditionally rendered `motion.*` |

**The one tolerated exception**: the `minimalist-view-reveal-in` /
`minimalist-view-reveal-out` keyframes, which exist only because the browser
View Transition API requires real CSS `@keyframes` to hook into — it has no
Framer Motion equivalent. Nothing else gets this exception.

## Rule 2 — loops, exits, and easing

- Looping/ambient animations (LED pulse, radar beam, …) use `animate` with
  `repeat: Infinity` on a `motion.*` component — not a CSS loop.
- Enter/exit transitions for conditionally rendered elements use
  `<AnimatePresence>`, not a mount/unmount CSS transition.
- Keep easing consistent with the project's curve:
  `ease: [0.2, 0.7, 0.2, 1]` in the Framer Motion `transition` object. Don't
  introduce a different curve ad hoc — if an animation needs to feel
  different, that's usually a duration change, not an easing change.

## Rule 3 — the extraction check (the part that needs active verification)

Animation variants, timing constants, and easing curves used in **two or
more components** must live in a central file, never be duplicated
inline. This is the rule most likely to be silently violated, because each
individual occurrence looks fine in isolation — the problem only exists
across files.

**Before writing a `variants` object or a timing/easing constant inline in a
component, actively check for an existing shared file first:**

1. Look for `src/features/<this-feature>/animations.ts` (shared within the
   feature) and `src/shared/animations.ts` (shared across features).
2. If what you're about to write already exists there (or something close
   enough that it should be parameterized instead of duplicated), import it
   instead of writing it inline.
3. If it doesn't exist yet, write the component's `variants`/constant inline
   as usual — but the moment you're about to write the **same** object or
   constant in a **second** component, stop, move the first occurrence out
   to the appropriate `animations.ts`, and have both components import it.

Don't wait for a third occurrence to "confirm the pattern" — two is already
duplication by this project's rule.

**Expected shape**, from the project's own reference example:

```ts
// src/features/gamified/animations.ts
export const LIST_STAGGER_STEP = 0.07;
export const LIST_MAX_STAGGER_INDEX = 5;

export const listItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  }),
};

export function listStaggerDelay(index: number): number {
  return Math.min(index, LIST_MAX_STAGGER_INDEX) * LIST_STAGGER_STEP;
}
```

Exported names are specific to what they represent (`listItemVariants`,
`LIST_STAGGER_STEP`, `listStaggerDelay`) — never generic names like
`variants`, `timing`, or `ANIMATION_CONFIG` that give no hint what they're
for when imported elsewhere.

## Rule 4 — cleanup after migrating off CSS

After converting a component's CSS animation to Framer Motion, remove the
orphaned `@keyframes` from `globals.css` and any now-unused Tailwind
animation/transition variables from the `@theme` block. Leaving them in
place is dead code that also misleads the next person into thinking CSS
animation is still a supported path in this codebase.

## Accessibility context — don't rebuild this

`src/features/gamified/contexts/a11y-context.tsx` (`A11yProvider` +
`useA11y()`) already provides a global `reduceMotion` toggle that sets
`MotionGlobalConfig.skipAnimations = true`, pausing every `motion.*`
animation instantly project-wide. It's persisted in `localStorage` under
`a11y-opts` and rehydrated synchronously to avoid a first-render flash.

Never add a manual `if (reduceMotion) { ... }` branch in a new component.
As long as the animation is implemented with `motion.*` + Framer Motion
props (which Rule 1 already requires), the global flag covers it for free —
a per-component branch is redundant code that duplicates logic the context
already owns.
