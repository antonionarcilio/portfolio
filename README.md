# Antonio Mascarenhas — Portfolio

This repository contains Antonio Mascarenhas's portfolio, built with Next.js 15, React 19, TypeScript, Tailwind CSS v4 and `next-intl`.

## Features

- Locale-aware routes for English and Brazilian Portuguese (`en` and `pt-BR`).
- Interactive gamified portfolio with experience, projects, education, skills, achievements and contact sections.
- Accessibility controls for scale, cursor size, greyscale, link highlighting and reduced motion.
- Snake minigame used by the gamified portfolio easter egg.
- Static metadata, sitemap, robots route and Open Graph image.
- Markdown CMS integration backed by the public `antonionarcilio/portfolio-cms` repository.

## Requirements

- Node.js 24.x, selected from `.nvmrc`.
- pnpm 9.15.9, invoked through `npx pnpm` in this project.

## Setup

```bash
git clone <repository-url>
cd portfolio
npx pnpm install
cp .env.sample .env.local
npx pnpm dev
```

The development server runs at `http://localhost:3000`.

Required environment variables are documented in `.env.sample` and validated by `src/env.ts`:

- `MY_DOMAIN`
- `CMS_GITHUB_OWNER`
- `CMS_GITHUB_REPO`
- `CMS_GITHUB_BRANCH`
- `CMS_GITHUB_WEBHOOK_SECRET`
- `VERCEL_DEPLOY_HOOK_URL`

## Commands

| Command | Purpose |
|---|---|
| `npx pnpm dev` | Start Next.js with Turbopack. |
| `npx pnpm build` | Create a production build. |
| `npx pnpm start` | Serve the production build. |
| `npx pnpm lint` | Run the project's lint script. |
| `npx pnpm typecheck` | Run TypeScript without emitting files. |
| `npx pnpm format` | Format the repository with Prettier. |
| `npx pnpm format:check` | Check formatting without writing. |
| `npx pnpm prepare` | Initialize Husky hooks. |
| `npx pnpm worktree:create` | Create a worktree through the repository helper. |

## Routes

| Route | Purpose |
|---|---|
| `/{locale}` | Homepage placeholder. |
| `/{locale}/portfolios/gamified` | Interactive gamified portfolio. |
| `/{locale}/minigames/snake` | Snake page; production redirects it to `/404`, while the game remains available to the easter egg flow. |
| `/api/cms-debug?locale=en` | Development-only CMS graph inspection endpoint. |
| `/api/revalidate` | Validated GitHub webhook that triggers a Vercel Deploy Hook for the configured CMS branch. |
| `/sitemap.xml` | Generated sitemap. |
| `/robots.txt` | Generated robots policy. |

`{locale}` is `pt-BR` or `en`. Locale detection and routing are configured in `src/i18n/` and `src/middleware.ts`.

## CMS flow

The application reads Markdown from the public GitHub CMS at build time. `src/shared/data/get-cms-graph.ts` starts at the locale root and follows only reachable wikilinks. `src/shared/data/map-portfolio.ts` converts the CMS graph into the UI-facing `PortfolioData` type, and `src/shared/data/get-portfolio.ts` is the single entry point used by pages.

CMS changes become visible after a new build. The `/api/revalidate` webhook validates GitHub's HMAC signature, checks the configured branch and calls the Vercel Deploy Hook. See [docs/cms-content-updates.md](docs/cms-content-updates.md) for configuration details.

## Project structure

```text
src/
  app/[locale]/       Locale-aware pages and layouts
  app/api/            CMS debug and revalidation handlers
  features/gamified/  Interactive portfolio feature
  features/minigame/  Snake minigame feature
  i18n/               next-intl routing and request configuration
  lib/github-cms/     CMS file fetching and wikilink parsing
  messages/           English and Brazilian Portuguese UI messages
  shared/             Shared components, data mapping, hooks, types and utilities
public/               Static favicon, OG image and cursor assets
docs/                 Operational and feature documentation
```

Interface strings belong in both `src/messages/en.json` and `src/messages/pt-BR.json`. CMS content is maintained in the separate `portfolio-cms` repository.

## Documentation

- [Accessibility](docs/accessibility.md)
- [CMS content updates](docs/cms-content-updates.md)
- [Gamified easter egg](docs/easter-egg.md)

## License

Private portfolio project.
