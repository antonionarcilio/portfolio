## Monorepo

This repository is a **pnpm workspaces** monorepo with 3 independent Next.js apps (`apps/minimalist`, `apps/gamified`, `apps/pro`) and 2 shared packages (`packages/portfolio-content-model`, `packages/portfolio-cms-client`). Each app is deployed separately on Vercel. App/package-specific conventions live in the `AGENTS.md` of **that** directory — read this file together with the one in the directory you are working in, never just this one.

- `apps/minimalist/AGENTS.md`
- `apps/gamified/AGENTS.md`
- `apps/pro/AGENTS.md`
- `packages/portfolio-content-model/AGENTS.md`
- `packages/portfolio-cms-client/AGENTS.md`

## Package manager

Node is managed via **nvm** and is not available globally in agent shells. `nvm use` cannot be run by agents. **Always invoke pnpm via `npx`** — never call `pnpm` directly.

- Node version: **v24.x** (see `.nvmrc`).

## Commands (workspace root)

- `npx pnpm install` — installs dependencies for the whole workspace.
- `npx pnpm build` — builds all apps (`pnpm --filter './apps/*' build`).
- `npx pnpm --filter <app> dev` / `build` / `start` / `lint` / `typecheck` — runs a command for a single app/package (`minimalist`, `gamified`, `pro`, `portfolio-content-model`, `portfolio-cms-client`).
- `npx pnpm lint` / `typecheck` — runs across all packages/apps (`pnpm -r`).
- `npx pnpm format` / `format:check` — Prettier across the whole repo.
- `npx pnpm prepare` — initializes Husky hooks.

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
- Inside `packages/*` this is mandatory: no package reads `process.env` for its own configuration (CMS owner/repo/branch, secrets) — everything is injected via parameters by the consuming app. See `packages/portfolio-cms-client/AGENTS.md`.

## Variants

Use [`class-variance-authority`](https://cva.style) (CVA) for all components
that accept a `variant` prop.

- Import: `import { cva, type VariantProps } from 'class-variance-authority'`
- Define the `cva()` call at file top, below type imports.
- Export `type Props = VariantProps<typeof myVariant>` for type inference.
- Shared variant definitions (used by ≥2 components in the same app) live in that app's `src/shared/variants/` — there is no longer a `src/shared` shared across apps.

**Anti-patterns:** `[...].join(' ')`, inline JSX ternaries in `className`,
parallel `Record<string, string>` tables for the same key set.

## Workspace structure

```
pnpm-workspace.yaml
tsconfig.base.json          — shared compilerOptions; each app/package extends it
eslint.config.mjs           — shared ignores at the root; each app has its own
                               full eslint.config.mjs (next/core-web-vitals/typescript)

apps/
  minimalist/                — see apps/minimalist/AGENTS.md
  gamified/                  — see apps/gamified/AGENTS.md
  pro/                       — see apps/pro/AGENTS.md

packages/
  portfolio-content-model/   — data contract + locales (see the package's AGENTS.md)
  portfolio-cms-client/      — CMS pipeline (see the package's AGENTS.md)
```

Inside each app, the structure follows the Next.js App Router (`src/app/[locale]/...`), with `src/features/<name>/` for UI logic and `src/shared/` for local copies of utilities shared between apps (see the "Dependencies" section above — there is no longer a single `src/shared` at the repository level).

- **All files must use kebab-case** (e.g. `component-name.tsx`, `hook-name.tsx`).
- Classic exceptions such as `index.js`/`ts` are allowed, as are third-party/template files.
- **camelCase**, PascalCase and snake_case in file names are **not allowed**.

## CSS

- Each app's `globals.css` must contain **only** `@import 'tailwindcss'`, the import of `shared/styles/a11y.css` (when applicable) and the imports of that app's feature-specific CSS. No feature styles may live in `globals.css`.
- Feature-specific styles (`@theme`, `@utility`, `@layer`, media queries) go in that app's `src/features/<feature>/styles.css` and are imported via `@import`.

## Formatting

- `prettier-plugin-organize-imports` is active — imports are auto-sorted on format; do not manually reorder them.
- Husky + lint-staged run `lint` and `format` automatically on `git commit`. Do not skip hooks with `--no-verify` unless explicitly required.

## Logging

- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.

## CMS markdown (GitHub)

The content-reading pipeline (BFS starting at `content/index.md`, wikilink resolution, mapping to `PortfolioData`) lives **exactly once** in the `packages/portfolio-cms-client` package — see `packages/portfolio-cms-client/AGENTS.md` for how it works and how to add a new CMS field. No app should reimplement or duplicate this logic; all of them consume it via `cmsClient.getPortfolio(locale)` (instantiated in each app's `src/lib/cms-client.ts`).

## UI localization (i18n)

Every interface string (buttons, labels, tooltips, `aria-label`, `title`, `alt`, status messages) **must** come from the **app's** `messages/pt-BR.json`/`messages/en.json` via `next-intl` — never hardcoded in the component. This is independent from the localization of CMS **content**: `cmsClient.getPortfolio(locale)` translates the *data* (name, role, descriptions), while `next-intl` translates the *interface* around it.

- Each app's `src/i18n/routing.ts` — supported locales and `localePrefix`, derived from `SUPPORTED_LOCALES`/`DEFAULT_LOCALE` of the `portfolio-content-model` package.
- `src/i18n/navigation.ts` — locale-aware `Link`/`useRouter`/`usePathname`/`getPathname`. Use these instead of `next/link`/`next/navigation` whenever a link must respect the current locale.
- Each app's `src/middleware.ts` — locale detection and rewrite/redirect via `createMiddleware(routing)`.
- Every renderable route (pages, layouts) lives inside that app's `src/app/[locale]/...` — except route handlers in `src/app/api/*`, which do not render HTML and live outside `[locale]`.
- Each app has its own root key(s) in `messages/*.json` — see the app's `AGENTS.md` for which ones.

## Adding environment variables

1. Add the variable to the **app's** `.env` (and to that app's `.env.sample`).
2. Register it in the **app's** `src/env.ts` — server-only vars under `server`, client-accessible vars (`NEXT_PUBLIC_` prefix) under `client`. Add the matching entry to `runtimeEnv`.
3. Consume it via `import { env } from '@/env'` — never read `process.env` directly outside `env.ts`.
4. If a Client Component needs it, pass it as a prop from the nearest Server Component instead of adding the `NEXT_PUBLIC_` prefix, unless public exposure is intentional.

There is no longer a shared `env.ts`/`.env` at the root — each app is self-contained.

---
