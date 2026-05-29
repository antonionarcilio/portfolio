## Package manager

Node is managed via **nvm** and is not available globally in agent shells. `nvm use` cannot be run by agents. **Always invoke pnpm through `npx`** — never call `pnpm` directly, as it will not be found.

- Node version: **v20.16.0** (see `.nvmrc`).

## Commands

- `npx pnpm dev` — Runs the project in development mode with hot-reload (Next.js + Turbopack).
- `npx pnpm build` — Builds the app for production.
- `npx pnpm start` — Starts the already built app in a production environment.
- `npx pnpm lint` — Runs ESLint on the entire codebase for code quality.
- `npx pnpm format` — Formats all code using Prettier.
- `npx pnpm format:check` — Checks if all code is formatted.
- `npx pnpm typecheck` — Checks all project TypeScript types.
- `npx pnpm prepare` — Initializes Husky git hooks (run locally after installing dependencies).


## Code style

- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any`, no `Dict`, no untyped functions.
- Use Zod for validation.
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.
- Do not use abbreviations in variable names, keys, function names, or file names.


## Comments

- Keep your own comments. Don't strip them on refactor — they carry intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings (jsdoc) on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because of a specific bug or upstream constraint.


## Dependencies

- Inject dependencies through constructor/parameter, not global/import.
- Wrap third-party libs behind a thin interface owned by this project.

## Animations

- **All animations must be implemented exclusively via [Framer Motion](https://www.framer.com/motion/).**
- Do **not** use CSS `@keyframes`, Tailwind `animate-*`, `transition-*`, `duration-*`, `ease-*`, or inline `style={{ animation/transition }}`.
- Use `motion.*` elements, `whileHover`, `whileTap`, `whileFocus`, `AnimatePresence`, and the `animate` + `transition` props.
- Looping / ambient animations (e.g. LED pulse, radar beam) must use `animate` with `repeat: Infinity` on a `motion.*` component.
- Enter/exit transitions for conditionally-rendered elements must use `<AnimatePresence>`.
- Keep easing consistent with the project's existing curve: `[0.2, 0.7, 0.2, 1]` (cubic-bezier), expressed as `ease: [0.2, 0.7, 0.2, 1]` in Framer Motion's `transition` object.
- After migration, remove all orphaned `@keyframes` from `globals.css` and all Tailwind animation/transition variables from the `@theme` block.


## Variants

Use [`class-variance-authority`](https://cva.style) (CVA) for all components
that accept a `variant` prop.

- Import: `import { cva, type VariantProps } from 'class-variance-authority'`
- Define the `cva()` call at file top, below type imports.
- Export `type Props = VariantProps<typeof myVariant>` for type inference.
- Merge with `clsx` only for runtime-state classes not expressible as CVA variants.
- Shared variant definitions (used in ≥2 files) go in `src/shared/variants/`.

**Anti-patterns:** `[...].join(' ')`, inline JSX ternaries in `className`,
parallel `Record<string, string>` tables for the same key set.


## Structure

- Follows the Next.js 14+ App Router architecture — all files and components reside in `src/app/` and subdirectories.
- Use named subfolders to group routes, components, and features.
- **All files must strictly use kebab-case naming** (e.g.: `componente-name.tsx, hook-name.tsx`).
- Classic exceptions like `index.js`/`ts` are allowed, as well as third-party or template files.
- **camelCase**, PascalCase, and snake_case filenames are **not allowed**.


Typical structure:

```
src/
    app/                   — Next.Js Router files, global styles.
      feature-name/
        layout.tsx
        page.tsx
      global.styles.css
      ...
    features/              — Feature-based modules. Business logic lives here.
      feature-name/
        components/
        hooks/
        utils/
        services/
        types/
        styles.css
        ...
      ...
    shared/                — Reusable UI, hooks, utilities, types
      components/
      hooks/
      utils/
      services/
      types/
    api/                   — Api clients, axios instance, endpoints
    store/                 — Global state configuration
    lib/                   — Third-party libary configuration
    routes/                — Route definitions and guards
...
```

## CSS

- `src/app/globals.css` must contain **only** `@import 'tailwindcss'` and imports of feature-specific CSS files. No feature styles here.
- Feature-specific styles (`@theme`, `@utility`, `@layer`, media queries) go in `src/features/<feature>/styles.css` and are imported from `globals.css` via `@import`.
- This keeps Tailwind's PostCSS pipeline intact for `@utility` and `@layer` directives in feature files.

## Formatting

- `prettier-plugin-organize-imports` is active — imports are auto-sorted on format; do not manually reorder them.
- Husky + lint-staged run `lint` and `format` automatically on `git commit`. Do not skip hooks with `--no-verify` unless explicitly required.

## Logging

- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.

---
