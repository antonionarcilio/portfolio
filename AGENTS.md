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

### Shared animation values

Animation variants, timing constants, and easing curves used in **two or more components** must be extracted to a central file — never duplicated.

- Per-feature shared animations go in `src/features/<feature>/animations.ts`.
- Shared animations used across features go in `src/shared/animations.ts`.
- Each exported value should have a clear, specific name (e.g. `listItemVariants`, `listStaggerDelay`, `LIST_STAGGER_STEP`).
- Components import from that file instead of defining local copies.

```ts
// src/features/gamer/animations.ts
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

**Rule:** if you find yourself writing the same `variants` object or timing constant in a second component, stop and extract first.

### Disable / pause animations (reduceMotion)

The gamer feature has a global accessibility toggle that pauses **all** Framer Motion animations at once. No per-component code is needed.

- **Context:** `src/features/gamer/contexts/a11y-context.tsx` — `A11yProvider` + `useA11y()` hook.
- **Key:** `reduceMotion` (type `A11yKey`). Toggle via `useA11y().toggle('reduceMotion')`.
- **Mechanism:** sets `MotionGlobalConfig.skipAnimations = true` (Framer Motion global flag) — all `motion.*` components skip their animations instantly.
- **CSS class:** `a11y-reduce-motion` is added to `<html>` when active (use it only for non-Framer-Motion effects; standard animations are already covered by `skipAnimations`).
- **Persistence:** stored in `localStorage` under the key `a11y-opts`; rehydrated synchronously at module load to avoid a first-render flash.

**Rule for new animations:** use `motion.*` + Framer Motion props only — they are automatically paused when `reduceMotion` is on. Never add a separate "if reduceMotion" branch; the global flag handles it.


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

### CSS class naming — BEM

All custom CSS classes follow **BEM** (Block\_\_Element--Modifier).

```
block               — independent component:      .sc-metric
block__element      — child tied to the block:    .sc-metric__value
block--modifier     — variant of the block:       .sc-metric--compact
block__element--modifier — variant of the child: .sc-metric__label--muted
```

#### Rules

- **Block** names use a feature prefix when the component lives in shared CSS (`sc-` for skill-constellation, `cv-` for curriculum, etc.).
- **Element** names describe the role of the child, not its tag or visual appearance. Use `.sc-metric__value`, never `.sc-metric__span` or `.sc-metric__big`.
- **Modifier** names describe the state or variant. Use `.sc-chip--selected`, never `.sc-chip-s` or `.sc-chip2`.
- **Never nest BEM blocks** inside each other in the CSS — each block is self-contained. Use a new block name for nested components.
- **Single-letter, two-letter, and abbreviated class names are banned** — a reader must not have to guess what `.fl`, `.v`, or `.ci-g` mean.
- Utility classes from Tailwind (`flex`, `gap-4`, …) are exempt from BEM — apply them directly in JSX alongside BEM class names.

#### Example

```css
/* Block */
.sc-metric { … }

/* Elements */
.sc-metric__value { font-size: 20px; color: var(--cyan); }
.sc-metric__value small { … }
.sc-metric__label { font-size: 9px; text-transform: uppercase; }

/* Modifier on block */
.sc-metric--compact { padding: 4px 8px; }
```

```tsx
<div className="sc-metric sc-metric--compact">
  <div className="sc-metric__value">{count}<small>/{total}</small></div>
  <div className="sc-metric__label">Núcleos</div>
</div>
```

#### Migration note

Existing classes that predate this rule (e.g. `.sc-metric .value`, `.sc-cat-item .name`) are tolerated until the component is touched for another reason — **do not** refactor naming alone in a dedicated PR unless it is the primary task.

## Formatting

- `prettier-plugin-organize-imports` is active — imports are auto-sorted on format; do not manually reorder them.
- Husky + lint-staged run `lint` and `format` automatically on `git commit`. Do not skip hooks with `--no-verify` unless explicitly required.

## Logging

- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.

## GraphQL + Codegen

This project talks to Strapi via GraphQL. The pipeline is: `.graphql` file → codegen → typed document → server-only data function → Server Component.

### Commands

```bash
npx pnpm codegen        # Generate types once (required after adding/editing .graphql files)
npx pnpm codegen:watch  # Regenerate on every .graphql file change (during development)
```

`npx pnpm dev` runs codegen automatically before starting Next.js.

### Step-by-step: adding a new query

**1. Write the query** in `src/shared/data/queries/<name>.graphql`.

```graphql
# src/shared/data/queries/my-data.graphql
query MyData($locale: I18NLocaleCode) {
  myData(locale: $locale) {
    id
    title
  }
}
```

**2. Run codegen** to generate the typed document:

```bash
npx pnpm codegen
```

This writes to `src/gql/` — **never edit those files manually**.

**3. Create a data-fetching function** in `src/shared/data/get-<name>.ts`:

```ts
import 'server-only';

import { MyDataDocument } from '@/gql/graphql';
import { query } from '@/lib/apollo-client';

export async function getMyData(locale = DEFAULT_LOCALE) {
  const { data } = await query({ query: MyDataDocument, variables: { locale } });
  if (!data?.myData) return null;
  return mapMyDataToData(data.myData); // anti-corruption layer (see below)
}
```

Rules:
- Always add `import 'server-only'` — these functions must never run in the browser.
- Import the generated `*Document` from `@/gql/graphql`, not from `@/gql/gql`.
- Use the `query` helper exported from `@/lib/apollo-client` (server Apollo client with Next.js cache tags).

**4. (Optional) Create a mapper** in `src/shared/data/map-<name>.ts` as an anti-corruption layer that converts the raw GraphQL response into the domain type used by the UI. This keeps GraphQL schema changes isolated from the rest of the app. See `src/shared/data/map-portfolio.ts` for reference.

**5. Call the data function from a Server Component** (page or layout):

```tsx
// app/portfolios/gamer/[locale]/page.tsx (Server Component)
import { getMyData } from '@/shared/data/get-my-data';

export default async function Page({ params }: PageProps) {
  const data = await getMyData(locale);
  if (!data) notFound();
  return <MyClientComponent data={data} />;
}
```

### Rules

- **Never call Apollo or `query()` from Client Components.** Data is fetched in Server Components and passed down as props.
- **Never import from `@/gql/gql`** in application code — use `@/gql/graphql` for the generated documents and types.
- **Never edit `src/gql/`** by hand — it is fully generated by codegen.
- After editing any `.graphql` file, run `npx pnpm codegen` before using the new types.

## Adding environment variables

1. Add the variable to `.env` (and `.env.example` if one exists).
2. Register it in `src/env.ts` — server-only vars go in `server`, client-accessible vars (must be prefixed `NEXT_PUBLIC_`) go in `client`. Add the matching `process.env.VAR_NAME` entry to `runtimeEnv`.
3. Consume via `import { env } from '@/env'` — never read `process.env` directly.
4. If needed in a client component, pass it down as a prop from the nearest server component (page/layout) rather than adding a `NEXT_PUBLIC_` prefix unless public exposure is intentional.

---
