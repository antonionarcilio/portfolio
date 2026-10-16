# Implementation Plan: Migração do Portfolio para Monorepo (pnpm workspaces)

**Branch**: `001-monorepo-migration` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-monorepo-migration/spec.md`

## Summary

Migrar o app único Next.js atual (`src/`), que hospeda os layouts `minimalist` e `gamified` mais o hub `/portfolios`, para um monorepo pnpm workspaces com 3 apps independentes (`minimalist`, `gamified`, `pro`) e 2 pacotes compartilhados (`portfolio-content-model`, `portfolio-cms-client`). A abordagem técnica: pacotes consumidos como fonte TypeScript via `transpilePackages` (sem build próprio), `createCmsClient` com injeção de configuração (elimina import direto de `@/env` no pacote), rota `/api/revalidate` exportada como subpath reutilizado por um wrapper fino em cada app, redirects 301 via `next.config.ts` `redirects()` no app `pro`, e big-bang numa única branch (sem período de app único + apps novos coexistindo).

## Technical Context

**Language/Version**: TypeScript 5.x sobre Node.js v24.19.0 (`.nvmrc`)

**Primary Dependencies**: Next.js 15.3.9 (App Router), React 19.2, next-intl (i18n), Zod (validação), class-variance-authority (variantes de UI), Tailwind CSS v4, gray-matter (parse de frontmatter markdown), Playwright (e2e)

**Storage**: N/A — não há banco de dados; conteúdo é lido em build time via HTTP de arquivos `.md` no repositório público `antonionarcilio/portfolio-cms` (branch `master`) e processado em memória (grafo de conteúdo via BFS)

**Testing**: `tsc --noEmit` (typecheck) e ESLint por app/pacote; Playwright para e2e (7 specs hoje, todos do `minimalist`, movidos para `apps/minimalist/e2e`)

**Target Platform**: Vercel (3 projetos, 1 por app), runtime Node.js 24.x, build estático (ISR implícito via rebuild completo disparado por webhook)

**Project Type**: web-application — monorepo com 3 apps Next.js independentes + 2 pacotes de biblioteca TypeScript (sem runtime próprio, consumidos como fonte)

**Performance Goals**: Não há meta quantitativa nova — a migração deve preservar exatamente o comportamento e desempenho percebido hoje (paridade, SC-004); nenhum requisito de performance adicional foi levantado na spec.

**Constraints**:
- Monorepo com **pnpm workspaces** (`pnpm@9.15.9`, conforme `package.json` atual), **sem Turborepo** nesta fase.
- Pacotes consumidos como **fonte TS** via `transpilePackages` — **sem etapa de build** nos pacotes.
- **Big bang**: tudo numa única branch e um único merge (sem app único "zumbi" coexistindo de forma buildável com os novos apps).
- **Paridade total** de conteúdo/comportamento/textos para `minimalist` e `gamified` (verificação por checklist manual, conforme clarificação SC-004).
- Apenas **2 pacotes** nesta fase (`portfolio-content-model`, `portfolio-cms-client`) — sem `portfolio-ui` compartilhado; componentes de UI duplicados por app quando não cobertos pelos 2 pacotes.
- Convenções de `AGENTS.md`: arquivos kebab-case, funções de 4-20 linhas, arquivos <500 linhas, sem `any`/tipos implícitos, Zod para validação, injeção de dependência por parâmetro (não import global), CVA para variantes.

**Scale/Scope**: Projeto pessoal de portfólio (baixo tráfego, sem SLA formal); 3 apps publicáveis, 2 pacotes compartilhados, 40 user stories de origem (`docs/prd.md`), 1 operador humano (mantenedor) configurando infraestrutura.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` ainda está no estado de template (placeholders não preenchidos, ex.: `[PRINCIPLE_1_NAME]`) — não há princípios ratificados para este projeto. **Gate: N/A (sem constituição ratificada)**. Nenhuma violação a justificar; a seção de Complexity Tracking permanece vazia.

## Project Structure

### Documentation (this feature)

```text
specs/001-monorepo-migration/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── portfolio-content-model.md
│   ├── portfolio-cms-client.md
│   └── revalidate-webhook.md
└── tasks.md               # Phase 2 output (/speckit-tasks — ainda não gerado)
```

### Source Code (repository root)

```text
pnpm-workspace.yaml
tsconfig.base.json
package.json                 # raiz, privado, só tooling compartilhado
eslint.config.mjs            # base compartilhada

apps/
├── minimalist/
│   ├── package.json, tsconfig.json, eslint.config.mjs, next.config.ts
│   ├── playwright.config.ts, e2e/ (7 specs minimalist-*)
│   ├── public/
│   └── src/
│       ├── env.ts, middleware.ts
│       ├── i18n/{routing,navigation,request}.ts
│       ├── lib/cms-client.ts
│       ├── shared/{a11y,components,utils,styles}/**   # cópias locais (gap 1)
│       ├── features/minimalist/**
│       ├── messages/{pt-BR,en}.json                   # root key "minimalist"
│       └── app/
│           ├── globals.css, robots.ts, sitemap.ts
│           ├── api/{revalidate,cms-debug}/route.ts
│           └── [locale]/{page.tsx,layout.tsx,not-found.tsx,labs/**,dev/**}
├── gamified/
│   └── (mesma estrutura — features/{gamified,minigame}, messages root keys "gamified"+"minigame",
│          rota /minigames/snake mantida plural)
└── pro/
    └── (app mínimo — page.tsx consome cmsClient.getPortfolio, next.config.ts com redirects() 301,
          remove o hub)

packages/
├── portfolio-content-model/
│   └── src/{types/portfolio.ts, schema.ts, i18n/locales.ts, utils/location.ts, index.ts}
└── portfolio-cms-client/
    └── src/{fetch-cms-file.ts, parse-wikilink.ts, get-cms-graph.ts, map-portfolio.ts,
              calc-xp-level.ts, get-portfolio.ts, create-cms-client.ts, revalidate.ts, index.ts}
```

**Structure Decision**: Monorepo pnpm workspaces com `apps/*` (unidades de deploy) e `packages/*` (bibliotecas de fonte TS, sem build próprio, via `transpilePackages`). Corresponde 1:1 à estrutura já detalhada e aprovada no plano técnico em `/home/antonio/.claude/plans/me-diga-se-com-memoized-adleman.md`, que permanece a referência de baixo nível (ordem de `git mv`, conteúdo exato de cada arquivo novo) para a fase de implementação.

## Complexity Tracking

*Não aplicável — nenhuma violação de constituição a justificar (ver Constitution Check acima).*
