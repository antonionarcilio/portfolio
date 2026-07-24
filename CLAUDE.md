## Package manager

Node is managed via **nvm** and is not available globally in agent shells. `nvm use` cannot be run by agents. **Always invoke pnpm through `npx`** — never call `pnpm` directly, as it will not be found.

- Node version: **v20.16.0** (see `.nvmrc`).

## Commands

### Build
- `npx pnpm build` — Builds the app for production.
- `npx pnpm start` — Starts the already built app in a production environment.

### Development

- `npx pnpm dev` — Runs the project in development mode with hot-reload (Next.js + Turbopack).
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

## Git Workflow

- Git operations are managed by the user through custom automation.
- Never execute Git write operations unless the user explicitly instructs you to do so.
- Never generate or suggest commit messages unless explicitly requested.
- Never stage files (`git add`) unless explicitly requested.
- Never create, delete, or switch branches unless explicitly requested.
- Never rewrite Git history without explicit approval.
- Always preserve uncommitted changes.

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

### Responsiveness — no arbitrary breakpoint variants in JSX

- **Never** use arbitrary Tailwind breakpoint variants directly in a component's `className`: `max-[Npx]:`, `min-[Npx]:`, `max-cv:`, `min-cv:` (or any other custom breakpoint defined in `--breakpoint-*`). This applies even to a single isolated class.
- Every responsive layout rule lives in a `@media` block inside `src/features/<feature>/styles.css`, within the `cv-overrides` layer (or the feature's relevant layer), tied to a stable BEM class on the element — never to a Tailwind utility selector.
- If the element doesn't have a BEM class yet, add one before writing the media query (see the BEM convention below). Don't build the CSS rule off an attribute/position selector.
- For the custom `--breakpoint-cv` breakpoint (defined in `@theme`, `styles.css:22`), use Tailwind v4's `theme()` syntax instead of repeating the value in px/rem: `@media (width <= theme(--breakpoint-cv))` / `@media (width >= theme(--breakpoint-cv))`. Never write `880px` or `55rem` outside of `@theme`.
- When a style depends on an accessibility state already reflected as a class on `<html>` (e.g. `html.a11y-upscale` for the 1.2× zoom), **don't** replicate that condition with a JS ternary inside `className` (`opts.upscale ? 'a' : 'b'`). Instead, use a single static class in the JSX and resolve the difference in CSS with `html.a11y-upscale .my-class { … }` / `html:not(.a11y-upscale) .my-class { … }` — see the "two thresholds" pattern already used in `styles.css:192-330`.
- Exception: logic that decides runtime *behavior* (e.g. measuring `window.innerWidth` to trigger a `setState` that changes the component's flow, like the scroll threshold in `cv-header.tsx`) stays in JavaScript — the rule above covers styling only.

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
  <div className="sc-metric__label">Cores</div>
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

## CMS markdown (GitHub)

Portfolio content lives as markdown in a **public** GitHub repo
(`antonionarcilio/portfolio-cms`, branch `master`, `content/` folder), fetched
at runtime via `raw.githubusercontent.com` — no token, no Tree API. The
pipeline is: BFS starting at `content/index.md` → in-memory graph (`CmsGraph`)
→ pure mapper → `PortfolioData` → Server Component.


### How it works

1. `src/lib/github-cms/fetch-cms-file.ts` fetches a raw file by path. In dev
   it uses `cache: 'no-store'`; in production it uses fetch tags +
   `revalidate` (`CMS_REVALIDATE_SECONDS`, default 1h).
2. `src/lib/github-cms/parse-wikilink.ts` parses `"[[path|label]]"`.
3. `src/shared/data/get-cms-graph.ts` (`getCmsGraph`, cached per locale) does
   the BFS traversal starting at the root, following the wikilinks present in
   the frontmatter — only what's reachable from `content/index.md` enters the
   graph. Exposes `resolveWikiLinks(graph, field)` to resolve a field
   (`string | string[]`) into graph nodes, in source order.
4. `src/shared/data/map-portfolio.ts` (`mapPortfolioToData`) is the
   anti-corruption layer: converts the root node + graph into `PortfolioData`.
5. `src/shared/data/get-portfolio.ts` (`getPortfolio(locale)`) orchestrates the
   two steps above — it's the single entry point consumed by pages.

### Adding a new field

1. Add the field to the corresponding `.md` file in the `portfolio-cms` repo
   (outside this repo — edited via Obsidian).
2. If the field is a wikilink (or a list of wikilinks), resolve it with
   `resolveWikiLinks(graph, node.frontmatter.field)` inside the corresponding
   mapper in `map-portfolio.ts`.
3. Type the expected frontmatter shape locally in `map-portfolio.ts`
   (`RootFields`, `ProjectFields`, etc.) — there's no cross-repo import of the
   types generated in the CMS (`content-types.d.ts`); copy the fields you use.
4. List display order = literal YAML array order — never sort/reorder in
   code.

### Rules

- **Never edit `src/shared/data/get-cms-graph.ts` to fetch anything outside
  what's reachable from the root** — a file not linked from
  `content/index.md` must not trigger a network call (this is the "root is
  the single source of truth" rule).
- **No short-link resolution by basename** — every wikilink uses the full
  path (`content/<collection>/<slug>/index`).
- `PortfolioData` must never import graph types (`CmsNode`/`CmsGraph`) — the
  mapper is the boundary.

## UI localization (i18n)

Every interface string (buttons, labels, tooltips, `aria-label`, `title`,
`alt`, status messages) **must** come from `src/messages/pt-BR.json` /
`src/messages/en.json` via `next-intl` — never hardcoded in the component.
This is independent from CMS **content** localization (see section above):
`getPortfolio(locale)` translates the *data* (name, role, descriptions),
`next-intl` translates the *interface* around it.

- `src/i18n/routing.ts` — supported locales and `localePrefix`, derived from
  `src/shared/i18n/locales.ts` (`SUPPORTED_LOCALES`/`DEFAULT_LOCALE`).
- `src/i18n/navigation.ts` — locale-aware `Link`/`useRouter`/`usePathname`/
  `getPathname`. Use these instead of `next/link`/`next/navigation` whenever
  a link needs to respect the current locale.
- `src/middleware.ts` — locale detection (`NEXT_LOCALE` cookie /
  `Accept-Language`) and rewrite/redirect, via `createMiddleware(routing)`.
- Every renderable route (pages, layouts) lives inside `src/app/[locale]/...`
  — the top-level segment of the App Router, per next-intl's official
  convention. A new page **cannot** live outside that tree (except route
  handlers in `src/app/api/*`, which don't render HTML and stay outside
  `[locale]`).

### Root namespaces — one per layout/feature

`src/messages/pt-BR.json` / `en.json` are single files, but their top level
is split into one root key per layout/feature — never a flat pile of
namespaces at the top level. Today:

- `"gamefolio"` — everything belonging to the `/portfolios/gamer` layout
  (`cvHeader`, `cvFooter`, `stats`, `skillMap`, `experience`, `project`,
  `education`, `sectionHeadings`, `a11y`, `emptyState`, `scrollList`,
  `modals`, `layout`, `metadata`), e.g. `useTranslations('gamefolio.cvHeader')`.
- `"minigame"` — third-party/embedded mini-games, keyed by game name (e.g.
  `"minigame.snake"`), e.g. `useTranslations('minigame.snake')`.

A **new layout** (e.g. a second portfolio theme) gets its own root key
(e.g. `"blog"`, `"resumeClassic"`) with its own namespaces nested under it —
never add its strings as bare top-level namespaces, and never reuse
`"gamefolio"` for anything outside that layout. This keeps ownership
obvious at a glance and lets two layouts reuse a namespace name (e.g. both
having a `stats` namespace) without colliding.

### Adding a new page/feature

1. Create the route inside `src/app/[locale]/<route>/...`.
2. Server Component: use `getTranslations({ locale, namespace })` from
   `next-intl/server` (async). Client Component (`'use client'`): use
   `useTranslations(namespace)` from `next-intl`.
3. Add a new namespace (the feature/component name) nested under the
   layout's root key (see "Root namespaces" above) to **both**
   `src/messages/pt-BR.json` and `src/messages/en.json`, with the same keys
   in both files — never add a key to only one of them, and never add a
   bare top-level namespace outside a root key.
4. Variable interpolation: ICU `{name}` in the string + second argument of
   `t('key', { name: value })`. Don't manually concatenate strings
   (`'Hello ' + name`) or build the whole sentence in code.
5. Rich text (bold, inline links inside a translated sentence): use
   `t.rich('key', { tag: (chunks) => <b>{chunks}</b> })` — don't split the
   sentence into fixed chunks + JSX in the middle (that breaks word order in
   other languages). See `skillMap.partOfCore` in `map-portfolio.ts`/
   `skill-map.tsx` as a reference.
6. Option arrays (dropdown, options swiper): store them in the JSON as an
   array (`t.raw('key')`), never as a loose array of strings in the
   component. See `cvHeader.rankOptions`/`classeOptions`.
7. If a string depends on state (e.g. a label computed from a value), store
   a **stable key** (`labelKey`) in the data/state, not the already-translated
   text — translate only in the component, at render time. See
   `PortfolioData['stats']` (`labelKey: 'yearsExperience' | 'technologies' | ...`)
   in `src/shared/types/portfolio.ts` + `stats.tsx`.
8. Date/number formatting: use native `Intl.DateTimeFormat`/
   `Intl.NumberFormat` (via `useLocale()`/`getLocale()` for the active
   locale) instead of manual translation tables (e.g. a month-name array).
   See `format-experience-date-range.ts`.

### Rules

- **No hardcoded UI string**, not even as a fallback (`label ?? 'Menu'`, a
  default parameter `title = 'Details'`). A shared component with no access
  to `useTranslations` should receive the prop as required, not have a
  fixed Portuguese/English default.
- Embedded sub-features (e.g. the `src/features/minigame/snake/` easter egg)
  do **not** get their own bespoke i18n system or a `locale` prop threaded
  down manually — they use `useTranslations('minigame.<name>')` like
  everything else, since they're rendered inside the same
  `NextIntlClientProvider` tree. If a component like this receives every
  visible string as a `messages`-shaped prop object (e.g. `game-hud.tsx`),
  build that object by calling `t('key')` for each field inside the hook
  that owns it, rather than reintroducing a separate translation file.
- Never reintroduce a manual locale switcher (`useParams` + a raw `<Link>`
  building `/route/${locale}`) — always use `Link`/`useRouter` from
  `src/i18n/navigation.ts`, which already respects `localePrefix` and the
  current locale.
- When adding a new key, run `npx pnpm typecheck` — `t()`/`t.raw()` with a
  missing key only fails at runtime, typecheck won't catch a missing key
  (this project has no generated `messages.d.ts`), so manually diff the two
  JSON files side by side before considering a translation complete.

## Adding environment variables

1. Add the variable to `.env` (and `.env.example` if one exists).
2. Register it in `src/env.ts` — server-only vars go in `server`, client-accessible vars (must be prefixed `NEXT_PUBLIC_`) go in `client`. Add the matching `process.env.VAR_NAME` entry to `runtimeEnv`.
3. Consume via `import { env } from '@/env'` — never read `process.env` directly.
4. If needed in a client component, pass it down as a prop from the nearest server component (page/layout) rather than adding a `NEXT_PUBLIC_` prefix unless public exposure is intentional.

---
