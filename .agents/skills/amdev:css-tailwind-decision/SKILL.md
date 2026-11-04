---
name: amdev:css-tailwind-decision
description: Decide whether a style belongs inline as a Tailwind utility class or in a feature's styles.css file (BEM, @theme, breakpoints) in this Next.js + Tailwind v4 project. Use this skill every time you write, edit, review, or migrate CSS or a className — including adding a single new class, touching src/features/<feature>/styles.css, globals.css, responsive variants, hover/focus states, or CVA variants. Also use it when the user asks to "migrate to Tailwind", "clean up CSS", or reviews a component's styling.
---

# CSS vs. Tailwind Decision

This project (Next.js + Tailwind v4) has a strict rule for where a style lives.
Getting this wrong is easy to miss in review because both inline classes and a
BEM rule in `styles.css` "work" — the bug is architectural, not visual. Run
through this checklist **before** writing a new `className` or a new CSS rule,
and again when reviewing or migrating existing styles.

## The core test

Ask: does this declaration depend on any of the following?

- a media or container query
- a pseudo-element (`::before`, `::after`, …)
- a relational selector (`+`, `:not()`, compound selectors)
- `@keyframes`
- a custom property that changes by theme or JS state

**No → it belongs inline as a Tailwind utility class in the JSX**, using the
tokens already exposed via `@theme inline` (e.g. `text-minimalist-sm`,
`bg-minimalist-background`, `font-weight-minimalist-*`). This holds even for a
single declaration or a short block — there's no "too simple to count as CSS"
exception.

**Example:**
```
/* Don't: a BEM rule that only encodes static values */
.foo__overlay { position: absolute; inset: 0; z-index: 4; background: var(--minimalist-background); }
```
```tsx
// Do: the same thing, inline
<div className="absolute inset-0 z-4 bg-minimalist-background" />
```

**Yes → it stays in `src/features/<feature>/styles.css`** (never in
`globals.css`, which only imports feature files) as a `@theme`, `@utility`,
`@layer`, media query, pseudo-element, gradient/mask, contextual layering,
overflow/scroll behavior, calculated geometry, or theme/state rule.

## When to keep a BEM class alongside utilities

Don't remove a semantic class just because its declarations could be inlined.
Keep a BEM class when it carries:
- feature behavior,
- a responsive CSS anchor (a stable selector a `@media` rule targets),
- a pseudo-element,
- a theme/state rule,
- or otherwise meaningful component styling.

Don't create a CSS selector whose only job is to duplicate local utilities —
that's the smell this skill exists to catch.

## Variants and runtime classes

- Design variants (appearance, state, density, a `variant` prop) → CVA
  (`class-variance-authority`), defined at the top of the file.
- `clsx` is only for runtime class composition that is *not* a design
  variant.
- Pseudo-class interactions (`hover`, `focus-visible`, `disabled`) always use
  the native Tailwind variant directly in `className` (`hover:`,
  `focus-visible:`), optionally inside a CVA definition — never a
  hand-maintained BEM modifier like `--hover`. Reserve manual modifiers
  (`--selected`, `--active`, `--current`) for state that only exists in
  JS/React and has no CSS pseudo-class equivalent.

## Breakpoints

- Breakpoints are centralized tokens in a `@theme` block (never
  `@theme inline`) inside the feature's `styles.css`, namespaced per feature
  (e.g. `--breakpoint-mobile`). Tailwind v4 merges all `@theme` blocks
  globally, so a new token name must not collide with another feature's
  (check `src/features/*/styles.css` for existing `--breakpoint-*` names
  before adding one).
- **Decision rule**: a Tailwind utility + breakpoint → named variant in JSX
  (`max-mobile:`, `min-tablet:`). Custom CSS + breakpoint → a
  `@media (width <= theme(--breakpoint-*))` rule tied to a stable BEM class
  in the feature's `styles.css`.
- Never write an arbitrary breakpoint literal (`max-[670px]:`) in a
  `className`, and never hardcode a pixel/rem value in `@media` — always
  `theme(--breakpoint-*)` in CSS or the named variant in JSX. This applies
  even to one isolated class.
- Each responsive rule lives in exactly one place. Don't write a `@media`
  block that mirrors a `max-*:` variant already present in the JSX for the
  same element, or vice versa.

## Duplication

The same set of Tailwind utility classes, or the same BEM rule, repeated
across 2+ components is a signal to extract — not copy-paste. Extract to a
named constant: a CVA definition, or an exported `className` string. This
mirrors the project's rule for shared animation values (see
`src/features/<feature>/animations.ts` / `src/shared/animations.ts`), applied
to styling instead of motion.

## BEM naming

When a class is warranted (see "When to keep a BEM class" above), follow
`Block__Element--Modifier`:
- Block: a feature prefix when the component lives in shared CSS (e.g. `sc-`
  for skill-constellation, `cv-` for curriculum).
- Element: describes the role of the child, not its tag or appearance
  (`.sc-metric__value`, never `.sc-metric__span`).
- Modifier: describes state or variant (`.sc-chip--selected`, never
  `.sc-chip-s`).
- No single- or two-letter class names, and no nesting BEM blocks inside each
  other — a new block name for a nested component.
- Existing classes that predate this convention are tolerated until the
  component is touched for another reason; don't do a naming-only refactor
  unless that's the explicit task.

## Guardrail

A feature's `styles.css` passing ~800 lines is a signal that layout logic is
leaking into CSS that should be named JSX variants or CVA variants instead.
If you hit that size while adding a rule, pause and check whether the new
rule actually needs the "yes" branch of the core test above, or whether it's
there out of habit.

## Applying this during a migration

When migrating an existing component from hand-written CSS to this
convention:
1. Classify every declaration in the existing rule individually against the
   core test — don't move or keep a whole rule block as a unit if it mixes
   declarations that belong in different places.
2. Move the "no" declarations to inline Tailwind utilities, keeping the
   feature's existing token names (check `@theme inline` in the feature's
   `styles.css` before introducing a new token).
3. Keep the "yes" declarations in `styles.css`, and keep (or rename to BEM)
   the class that anchors them if it's still needed as a selector target.
4. If the old class is left with zero declarations after step 2, delete it
   and the JSX reference to it.
