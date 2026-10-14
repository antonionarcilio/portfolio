## Package manager

Node is managed via **nvm** and is not available globally in agent shells. `nvm use` cannot be run by agents. **Always invoke pnpm through `npx`** — never call `pnpm` directly, as it will not be found.

- Node version: **v24.x** (see `.nvmrc`).

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

## Variants

Use [`class-variance-authority`](https://cva.style) (CVA) for all components
that accept a `variant` prop.

- Import: `import { cva, type VariantProps } from 'class-variance-authority'`
- Define the `cva()` call at file top, below type imports.
- Export `type Props = VariantProps<typeof myVariant>` for type inference.
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

## CMS markdown (GitHub)

Portfolio content lives as markdown in a **public** GitHub repo
(`antonionarcilio/portfolio-cms`, branch `master`, `content/` folder), fetched
at runtime via `raw.githubusercontent.com` — no token, no Tree API. The
pipeline is: BFS starting at `content/index.md` → in-memory graph (`CmsGraph`)
→ pure mapper → `PortfolioData` → Server Component.


### How it works

1. `src/lib/github-cms/fetch-cms-file.ts` fetches a raw file by path. In dev
   it uses `cache: 'no-store'`; in production it uses `cache: 'force-cache'`
   (the site is fully static — content is fetched only during `next build`
   and cached until the next rebuild).
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

- `"gamified"` — everything belonging to the `/portfolios/gamified` layout
  (`cvHeader`, `cvFooter`, `stats`, `skillMap`, `experience`, `project`,
  `education`, `sectionHeadings`, `a11y`, `emptyState`, `scrollList`,
  `modals`, `layout`, `metadata`), e.g. `useTranslations('gamified.cvHeader')`.
- `"minigame"` — third-party/embedded mini-games, keyed by game name (e.g.
  `"minigame.snake"`), e.g. `useTranslations('minigame.snake')`.

A **new layout** (e.g. a second portfolio theme) gets its own root key
(e.g. `"blog"`, `"resumeClassic"`) with its own namespaces nested under it —
never add its strings as bare top-level namespaces, and never reuse
`"gamified"` for anything outside that layout. This keeps ownership
obvious at a glance and lets two layouts reuse a namespace name (e.g. both
having a `stats` namespace) without colliding.

## Adding environment variables

1. Add the variable to `.env` (and `.env.example` if one exists).
2. Register it in `src/env.ts` — server-only vars go in `server`, client-accessible vars (must be prefixed `NEXT_PUBLIC_`) go in `client`. Add the matching `process.env.VAR_NAME` entry to `runtimeEnv`.
3. Consume via `import { env } from '@/env'` — never read `process.env` directly.
4. If needed in a client component, pass it down as a prop from the nearest server component (page/layout) rather than adding a `NEXT_PUBLIC_` prefix unless public exposure is intentional.

---
