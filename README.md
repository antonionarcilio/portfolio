# Antonio Mascarenhas — Portfolio

Monorepo (pnpm workspaces) com 3 apps Next.js 15 independentes — `minimalist`, `gamified`, `pro` — e 2 pacotes compartilhados que centralizam o contrato de dados e o pipeline de leitura do CMS. Cada app tem deploy próprio na Vercel.

## Apps e domínios

| App | Domínio | Descrição |
|---|---|---|
| `minimalist` | `minimalist.antoniomascarenhas.com.br` | Layout minimalista do portfólio. |
| `gamified` | `gamified.antoniomascarenhas.com.br` | Layout gamificado, com minigame Snake easter egg. |
| `pro` | `antoniomascarenhas.com.br` (apex) | App mínimo no domínio raiz; também hospeda os redirects 301 das URLs antigas. |

## Requirements

- Node.js 24.x, selecionado via `.nvmrc`.
- pnpm 9.15.9, invocado via `npx pnpm` neste projeto.

## Setup

```bash
git clone <repository-url>
cd portfolio
npx pnpm install
cp apps/minimalist/.env.sample apps/minimalist/.env
cp apps/gamified/.env.sample apps/gamified/.env
cp apps/pro/.env.sample apps/pro/.env
npx pnpm --filter minimalist dev   # ou gamified / pro
```

Cada app roda em sua própria porta/instância de dev server; não há mais um único `npx pnpm dev` na raiz.

Variáveis de ambiente obrigatórias (documentadas no `.env.sample` de cada app, validadas por `src/env.ts` de cada app):

- `MY_DOMAIN`
- `CMS_GITHUB_OWNER`
- `CMS_GITHUB_REPO`
- `CMS_GITHUB_BRANCH`
- `CMS_GITHUB_WEBHOOK_SECRET`
- `VERCEL_DEPLOY_HOOK_URL`

## Comandos

| Comando | Propósito |
|---|---|
| `npx pnpm install` | Instala dependências de todo o workspace. |
| `npx pnpm build` | Builda os 3 apps (`pnpm --filter './apps/*' build`). |
| `npx pnpm --filter <app> dev` | Dev server (Turbopack) de um app específico. |
| `npx pnpm --filter <app> build` / `start` | Build/start de produção de um app isolado. |
| `npx pnpm --filter <app> lint` / `typecheck` | Lint/typecheck isolado de um app ou pacote. |
| `npx pnpm lint` / `typecheck` | Roda em todo o workspace (`pnpm -r`). |
| `npx pnpm format` / `format:check` | Prettier em todo o repositório. |
| `npx pnpm prepare` | Inicializa hooks do Husky. |

`<app>` é `minimalist`, `gamified`, `pro`, `portfolio-content-model` ou `portfolio-cms-client`.

## Rotas por app

### `minimalist`

| Rota | Descrição |
|---|---|
| `/{locale}` | Página principal. |
| `/{locale}/labs/posts/flip` | Experimento de UI. |
| `/{locale}/dev/*` | Páginas de desenvolvimento — escondidas (404) em produção. |
| `/api/cms-debug?locale=en` | Inspeção do grafo do CMS — só em dev. |
| `/api/revalidate` | Webhook de rebuild (ver abaixo). |
| `/sitemap.xml`, `/robots.txt` | Gerados. |

### `gamified`

| Rota | Descrição |
|---|---|
| `/{locale}` | Página principal (portfólio interativo). |
| `/{locale}/minigames/snake` | Minigame Snake — escondido (404) em produção, acessível via easter egg. |
| `/api/cms-debug?locale=en`, `/api/revalidate` | Como no `minimalist`. |
| `/sitemap.xml`, `/robots.txt` | Gerados. |

### `pro`

| Rota | Descrição |
|---|---|
| `/{locale}` | Página mínima com dados reais do CMS (nome, papel, contatos) + JSON-LD/OG. |
| `/portfolios`, `/portfolios/minimalist/*`, `/portfolios/gamified/*` (com ou sem prefixo de locale) | Redirects 301 para os domínios novos — ver `apps/pro/AGENTS.md`. |
| `/api/cms-debug?locale=en`, `/api/revalidate` | Como nos outros apps. |
| `/sitemap.xml`, `/robots.txt` | Gerados. |

`{locale}` é `pt-BR` ou `en`. Roteamento e detecção de locale são configurados em `src/i18n/` e `src/middleware.ts` de cada app.

## Fluxo do CMS

O pipeline de leitura do CMS markdown (GitHub, repo público `antonionarcilio/portfolio-cms`) existe **uma única vez**, em `packages/portfolio-cms-client`. Cada app consome via `cmsClient.getPortfolio(locale)` (instanciado em `src/lib/cms-client.ts`). O contrato de dados (`PortfolioData` e afins) vive em `packages/portfolio-content-model`.

Mudanças no CMS ficam visíveis depois de um novo build — cada app tem seu próprio webhook `/api/revalidate` e seu próprio Deploy Hook da Vercel. Ver [docs/cms-content-updates.md](docs/cms-content-updates.md) para o fluxo completo (3 webhooks → 3 Deploy Hooks).

## Estrutura do repositório

```text
pnpm-workspace.yaml
tsconfig.base.json
eslint.config.mjs

apps/
  minimalist/   — ver apps/minimalist/AGENTS.md
  gamified/     — ver apps/gamified/AGENTS.md
  pro/          — ver apps/pro/AGENTS.md

packages/
  portfolio-content-model/   — contrato de dados + locales
  portfolio-cms-client/      — pipeline de leitura do CMS + webhook de revalidação

docs/           — documentação operacional e de produto
specs/          — specs geradas pelo speckit (spec.md/plan.md/tasks.md por feature)
```

Strings de interface pertencem a `apps/<app>/messages/{en,pt-BR}.json`. O conteúdo do CMS é mantido no repositório separado `portfolio-cms`.

## Verificação de paridade

Após qualquer alteração estrutural, confirme que `minimalist` e `gamified` continuam idênticos ao comportamento anterior à migração para monorepo: navegar pelas rotas principais nos dois idiomas, comparar textos de interface e comportamento. Ver `specs/001-monorepo-migration/quickstart.md` para o roteiro completo de validação ponta a ponta.

## Documentação

- [Accessibility](docs/accessibility.md)
- [CMS content updates](docs/cms-content-updates.md)
- [Gamified easter egg](docs/easter-egg.md)
- [Spec da migração para monorepo](specs/001-monorepo-migration/spec.md)

## License

Private portfolio project.
