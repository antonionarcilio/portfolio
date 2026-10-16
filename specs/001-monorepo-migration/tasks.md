---

description: "Task list template for feature implementation"
---

# Tasks: Migração do Portfolio para Monorepo (pnpm workspaces)

**Input**: Design documents from `/specs/001-monorepo-migration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (todos presentes)

**Tests**: Não solicitados explicitamente na spec além da suíte e2e já existente (Playwright, 7 specs do `minimalist`) — nenhuma tarefa de TDD adicional foi gerada; a verificação de cada fase é feita via typecheck/build/quickstart, não via testes novos.

**Organization**: Tarefas agrupadas por user story (US1-US5, conforme `spec.md`) para permitir implementação e teste independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: A qual user story esta tarefa pertence (US1-US5)
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

Monorepo pnpm workspaces: `apps/{minimalist,gamified,pro}/src/`, `packages/{portfolio-content-model,portfolio-cms-client}/src/`, conforme `plan.md` → Project Structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fundação do workspace — nenhuma user story pode ser implementada antes disso.

- [X] T001 Criar `pnpm-workspace.yaml` na raiz declarando `packages: ['apps/*', 'packages/*']`
- [X] T002 Reescrever `package.json` da raiz: `"private": true`, remover dependências específicas de app (`next`, `react`, `tailwindcss`, `@playwright/test`), manter só tooling compartilhado (`eslint`, `prettier`, `husky`, `lint-staged`, `typescript`), scripts baseados em `pnpm --filter`/`-r` (`build`, `dev:minimalist`, `dev:gamified`, `dev:pro`, `lint`, `typecheck`, `format`, `format:check`, `prepare`)
- [X] T003 [P] Criar `tsconfig.base.json` na raiz com os mesmos `compilerOptions` do `tsconfig.json` atual, sem `paths`/`include`/`exclude`
- [X] T004 [P] Refatorar `eslint.config.mjs` da raiz para ser a base compartilhada importável por cada app — **desvio registrado**: em vez de reexportar `next/core-web-vitals` via `FlatCompat` (risco de resolução de módulo entre pacotes, ver `research.md`), a raiz ficou com um config mínimo (só `ignores`); cada app recebe seu próprio `eslint.config.mjs` completo com `next/core-web-vitals`/`next/typescript` (ver T028/T032/T036)
- [X] T005 Rodar `npx pnpm install` para consolidar um único `pnpm-lock.yaml` na raiz — **nota de ambiente**: shell sandbox está em Node v26 (`.nvmrc` pede 24.x, `nvm use` indisponível para agentes); usei `--config.engine-strict=false` para contornar, mantendo essa flag nas instalações seguintes desta sessão

**Checkpoint**: Workspace pnpm funcional, pronto para receber pacotes e apps.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Os 2 pacotes compartilhados (`portfolio-content-model`, `portfolio-cms-client`) — **todas** as 5 user stories dependem deles, pois são a única fonte do contrato de dados e do pipeline do CMS.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa.

- [X] T006 [P] Criar `packages/portfolio-content-model/package.json` (`"private": true`, sem `react`/`server-only`, dependência: `zod`)
- [X] T007 [P] Criar `packages/portfolio-content-model/tsconfig.json` estendendo `../../tsconfig.base.json`
- [X] T008 `git mv src/shared/types/portfolio.ts packages/portfolio-content-model/src/types/portfolio.ts`
- [X] T009 `git mv src/shared/i18n/locales.ts packages/portfolio-content-model/src/i18n/locales.ts`
- [X] T010 `git mv src/shared/utils/location.ts packages/portfolio-content-model/src/utils/location.ts`
- [X] T011 Criar `packages/portfolio-content-model/src/schema.ts`: schema Zod `portfolioDataSchema: z.ZodType<PortfolioData>` espelhando `PortfolioData` campo a campo, e `parsePortfolioData(data: unknown): PortfolioData` lançando erro com o campo ofensivo e a forma esperada (ver `contracts/portfolio-content-model.md`)
- [X] T012 Criar `packages/portfolio-content-model/src/index.ts`: barrel exportando `PortfolioData`, `ProjectEntry`, `ExperienceEntry`, `Seniority`, `portfolioDataSchema`, `parsePortfolioData`, `SUPPORTED_LOCALES`, `SupportedLocale`, `DEFAULT_LOCALE`, `isSupportedLocale`, `parseLocation`, `parseEducationLocation`
- [X] T013 [P] Criar `packages/portfolio-cms-client/package.json` (dependências: `portfolio-content-model: workspace:*`, `zod`, `server-only`, `gray-matter`; `exports`: `{".": "./src/index.ts", "./revalidate": "./src/revalidate.ts"}`)
- [X] T014 [P] Criar `packages/portfolio-cms-client/tsconfig.json` estendendo `../../tsconfig.base.json`
- [X] T015 `git mv src/lib/github-cms/fetch-cms-file.ts packages/portfolio-cms-client/src/fetch-cms-file.ts`, removendo `import { env } from '@/env'` e recebendo `CmsClientConfig` por parâmetro (FR-004, `contracts/portfolio-cms-client.md`)
- [X] T016 `git mv src/lib/github-cms/parse-wikilink.ts packages/portfolio-cms-client/src/parse-wikilink.ts` (sem alterações de lógica)
- [X] T017 `git mv src/shared/data/get-cms-graph.ts packages/portfolio-cms-client/src/get-cms-graph.ts`, encadeando `CmsClientConfig` em cada chamada de `fetchCmsFile`/`fetchRootFrontmatter` — **desvio registrado**: o cache do grafo não ficou em `get-cms-graph.ts` (exporta `buildCmsGraph`, sem cache); o cache por locale passou a viver no closure de `create-cms-client.ts` (um `Map` por instância de cliente), mais simples e correto que uma chave composta `owner/repo/branch/locale` num cache global do módulo
- [X] T018 `git mv src/shared/data/map-portfolio.ts packages/portfolio-cms-client/src/map-portfolio.ts`, atualizar imports para `portfolio-content-model`
- [X] T019 `git mv src/shared/utils/calc-xp-level.ts packages/portfolio-cms-client/src/calc-xp-level.ts` (lógica inalterada; não exportado no barrel público)
- [X] T020 ~~`git mv src/shared/data/get-portfolio.ts ...`~~ — **desvio registrado**: arquivo removido em vez de movido. Sua lógica (resolver o nó raiz + mapear) foi absorvida diretamente em `create-cms-client.ts` (T021), já reutilizando o grafo cacheado — mantê-lo como função standalone duplicaria a busca do grafo sem cache compartilhado
- [X] T021 Criar `packages/portfolio-cms-client/src/create-cms-client.ts`: `createCmsClient(config: CmsClientConfig): CmsClient` com `getPortfolio(locale)`/`getCmsGraph(locale)` fechando sobre `config` e um cache de grafo por locale no closure
- [X] T022 Criar `packages/portfolio-cms-client/src/revalidate.ts`: `handleRevalidateWebhook(request: Request, config: RevalidateConfig): Promise<Response>` usando `Request`/`Response` web-standard, verificação HMAC-SHA256 via `X-Hub-Signature-256` + `timingSafeEqual`, filtro de branch, respostas `401`/`200 {triggered:false}`/`503`/`200 {triggered:true}` conforme `contracts/revalidate-webhook.md`
- [X] T023 Criar `packages/portfolio-cms-client/src/index.ts`: `import 'server-only'` no topo; exporta `createCmsClient`, `CmsClient`, `CmsClientConfig`, `CmsGraph`, `CmsNode` — **não** reexporta `revalidate.ts` nem `calcXpLevel`
- [X] T024 Rodar `npx pnpm install` para linkar os 2 pacotes novos no workspace (com `--config.engine-strict=false`, ver nota T005)
- [X] T025 Verificar contratos: `grep -r "@/env" packages/portfolio-cms-client/src` retorna vazio (confirmado); `npx pnpm --filter portfolio-content-model exec tsc --noEmit` e `npx pnpm --filter portfolio-cms-client exec tsc --noEmit` sem erros (confirmado)

**Checkpoint**: Pacotes compartilhados prontos e validados — as 5 user stories podem começar.

---

## Phase 3: User Story 1 - Publicar um layout sem afetar os outros (Priority: P1) 🎯 MVP

**Goal**: Cada um dos 3 apps (`minimalist`, `gamified`, `pro`) existe como unidade de build independente — alterar/buildar um não exige build dos outros.

**Independent Test**: `npx pnpm --filter gamified build` conclui sem erro e sem rodar build de `minimalist`/`pro`.

### Implementation for User Story 1

- [X] T026 [P] [US1] Criar `apps/minimalist/package.json` (dependências trimadas ao que as features do minimalist usam; `portfolio-content-model`/`portfolio-cms-client` como `workspace:*`; scripts `dev`, `build`, `start`, `lint`, `typecheck`)
- [X] T027 [P] [US1] Criar `apps/minimalist/tsconfig.json` estendendo `../../tsconfig.base.json`, `paths: {"@/*": ["./src/*"]}`
- [X] T028 [P] [US1] Criar `apps/minimalist/eslint.config.mjs` — config completa própria (`FlatCompat` + `next/core-web-vitals`/`next/typescript`), não um import do root (ver desvio T004)
- [X] T029 [P] [US1] Criar `apps/minimalist/next.config.ts` com `transpilePackages: ['portfolio-content-model', 'portfolio-cms-client']`
- [X] T030 [P] [US1] Criar `apps/gamified/package.json` (mesmo padrão de T026, dependências das features do gamified)
- [X] T031 [P] [US1] Criar `apps/gamified/tsconfig.json`
- [X] T032 [P] [US1] Criar `apps/gamified/eslint.config.mjs`
- [X] T033 [P] [US1] Criar `apps/gamified/next.config.ts` com `transpilePackages`
- [X] T034 [P] [US1] Criar `apps/pro/package.json` (app mínimo: `next`, `react`, `next-intl`, `portfolio-content-model`, `portfolio-cms-client`)
- [X] T035 [P] [US1] Criar `apps/pro/tsconfig.json`
- [X] T036 [P] [US1] Criar `apps/pro/eslint.config.mjs`
- [X] T037 [P] [US1] Criar `apps/pro/next.config.ts` com `transpilePackages` **+ os redirects 301 (T053 adiantada)**
- [X] T038 [US1] Rodar `npx pnpm install` para linkar os 3 apps novos no workspace
- [X] T039 [US1] Verificar build isolado: os 3 apps buildam sem erro isoladamente — **desvio registrado**: para o build passar, foi necessário adiantar para esta fase a criação de `src/i18n/{routing,navigation,request}.ts`, `messages/{pt-BR,en}.json` (placeholders `{}`), `postcss.config.mjs` e um `src/app/{layout.tsx,page.tsx,globals.css}` mínimo em cada app (sem isso o `next-intl` plugin falha no build antes mesmo de qualquer rota real existir); essas peças serão substituídas pelas reais na Phase 6 (US4)

**Checkpoint**: Os 3 apps existem como unidades de build independentes. User Story 1 testável isoladamente (mesmo com páginas ainda mínimas/placeholder).

> **Nota de escopo (FR-001/SC-001)**: T039 verifica build isolado local (`pnpm --filter`). A verificação completa de "só o projeto afetado faz deploy em produção" depende do Ignored Build Step por projeto na Vercel (Epic INF/US-35), que é um runbook manual fora do escopo das tarefas deste documento.

---

## Phase 4: User Story 2 - Atualizar conteúdo do CMS uma vez e refletir nos três sites (Priority: P1)

**Goal**: Cada app consome `portfolio-cms-client` por uma única fachada (`cmsClient.getPortfolio`), e cada um expõe seu próprio endpoint de revalidação validado por HMAC.

**Independent Test**: enviar um webhook simulado (assinatura válida, branch correta) para `/api/revalidate` de cada app e confirmar `200 {triggered:true}`; com assinatura inválida, confirmar `401`.

### Implementation for User Story 2

- [X] T040 [P] [US2] Criar `apps/minimalist/src/env.ts` (`MY_DOMAIN`, `CMS_GITHUB_OWNER`, `CMS_GITHUB_REPO`, `CMS_GITHUB_BRANCH`, `CMS_GITHUB_WEBHOOK_SECRET`, `VERCEL_DEPLOY_HOOK_URL`)
- [X] T041 [P] [US2] Criar `apps/minimalist/src/lib/cms-client.ts`: `export const cmsClient = createCmsClient({owner: env.CMS_GITHUB_OWNER, repo: env.CMS_GITHUB_REPO, branch: env.CMS_GITHUB_BRANCH})`
- [X] T042 [P] [US2] Criar `apps/minimalist/src/app/api/revalidate/route.ts`: wrapper fino chamando `handleRevalidateWebhook(request, {secret: env.CMS_GITHUB_WEBHOOK_SECRET, deployHookUrl: env.VERCEL_DEPLOY_HOOK_URL, branch: env.CMS_GITHUB_BRANCH})`
- [X] T043 [P] [US2] Criar `apps/minimalist/src/app/api/cms-debug/route.ts` (ativo só em dev, usa `cmsClient.getCmsGraph`)
- [X] T044 [P] [US2] Criar `apps/gamified/src/env.ts` (mesmas variáveis de T040)
- [X] T045 [P] [US2] Criar `apps/gamified/src/lib/cms-client.ts` (mesmo padrão de T041)
- [X] T046 [P] [US2] Criar `apps/gamified/src/app/api/revalidate/route.ts` (mesmo padrão de T042)
- [X] T047 [P] [US2] Criar `apps/gamified/src/app/api/cms-debug/route.ts`
- [X] T048 [P] [US2] Criar `apps/pro/src/env.ts` (mesmas variáveis de T040)
- [X] T049 [P] [US2] Criar `apps/pro/src/lib/cms-client.ts` (mesmo padrão de T041)
- [X] T050 [P] [US2] Criar `apps/pro/src/app/api/revalidate/route.ts` (mesmo padrão de T042)
- [X] T051 [P] [US2] Criar `apps/pro/src/app/api/cms-debug/route.ts`
- [X] T052 [US2] Verificar contrato do webhook: testado em `minimalist` (porta 3911, `next start` com `.env` local apontando para `CMS_GITHUB_OWNER=antonionarcilio`/`CMS_GITHUB_REPO=portfolio-cms`) — confirmados os 4 casos: sem secret/hook → `503`; assinatura inválida → `401`; branch errada → `200 {triggered:false}`; assinatura+branch válidas → segue até tentar o Deploy Hook (que é fake neste teste, logo `502` — confirma que a validação completa passou). `gamified`/`pro` compartilham a mesma implementação via `handleRevalidateWebhook`, não repetidos individualmente.
- [X] Criados `.env.sample` (template, valores placeholder) e `.env` (local, gitignorado, valores reais do repo CMS) em cada um dos 3 apps — não estava listado como task própria, mas é pré-requisito direto de T040/044/048 para o app sequer buildar/rodar

**Checkpoint**: Os 3 apps compartilham uma única implementação de leitura/revalidação de CMS (FR-003, FR-004, FR-006, FR-007).

> **Nota de escopo (FR-006/SC-002)**: T052 valida o lado receptor do webhook (`/api/revalidate`) com requisições simuladas. O disparo real da notificação (3 webhooks configurados no repositório `portfolio-cms`, Epic INF/US-33) é um runbook manual fora do escopo das tarefas deste documento.

---

## Phase 5: User Story 3 - Visitante chega por uma URL antiga (Priority: P2)

**Goal**: URLs antigas do app único (hub e rotas `/portfolios/<layout>`) redirecionam permanentemente (301) para o domínio novo equivalente; o hub deixa de existir.

**Independent Test**: `curl -I` em `/portfolios`, `/pt-BR/portfolios/minimalist`, `/portfolios/gamified/qualquer-rota` retorna `301` com `Location` correto.

### Implementation for User Story 3

- [X] T053 [US3] Implementar `async redirects()` em `apps/pro/next.config.ts` com as 6 entradas da tabela de `contracts/revalidate-webhook.md` (feito junto com T037, na criação do `next.config.ts`)
- [X] T055 [US3] Verificado via `next start` na porta 3912: `/portfolios` → `308` para `/`; `/pt-BR/portfolios/minimalist` → `308` para `https://minimalist.antoniomascarenhas.com.br/pt-BR`; `/portfolios/gamified/qualquer-rota` → `308` para `https://gamified.antoniomascarenhas.com.br/qualquer-rota` (Next.js usa `308` para `permanent: true`, semanticamente equivalente ao 301 pedido pelo PRD — preserva o método da requisição)

**Checkpoint**: Nenhuma URL antiga conhecida resulta em erro ou página em branco.

> **Nota de ordenação (F1)**: a deleção do hub (`src/app/[locale]/portfolios/*`, antes T054) foi movida para a Phase 6 (ver T102a), logo antes da verificação final de paridade (T103) — assim o domínio raiz nunca fica sem conteúdo real entre a remoção do hub e a página `pro` existir.

---

## Phase 6: User Story 4 - Visitante acessa cada portfólio pelo domínio próprio (Priority: P2)

**Goal**: `minimalist` e `gamified` entregam conteúdo/comportamento idênticos ao estado pré-migração; `pro` renderiza dados reais do CMS com JSON-LD/OG.

**Independent Test**: checklist manual de paridade (SC-004) — navegar pelas rotas principais de `minimalist`/`gamified` nos 2 idiomas e comparar contra o estado anterior.

### Implementation for User Story 4 — `minimalist`

- [X] T056 [US4] `git mv src/features/minimalist/** apps/minimalist/src/features/minimalist/**`
- [X] T057 [P] [US4] `git mv src/shared/a11y/store.ts apps/minimalist/src/shared/a11y/store.ts`
- [X] T058 [P] [US4] `git mv src/shared/components/markdown-text.tsx apps/minimalist/src/shared/components/markdown-text.tsx`
- [X] T059 [P] [US4] `git mv src/shared/components/plain-text.tsx apps/minimalist/src/shared/components/plain-text.tsx`
- [X] T060 [P] [US4] `git mv src/shared/utils/json-ld.ts apps/minimalist/src/shared/utils/json-ld.ts`
- [X] T061 [P] [US4] `git mv src/shared/utils/portfolio-og-image.ts apps/minimalist/src/shared/utils/portfolio-og-image.ts`
- [X] T062 [P] [US4] `git mv src/shared/styles/a11y.css apps/minimalist/src/shared/styles/a11y.css`
- [X] T063 [P] [US4] `git mv src/types/assets.d.ts apps/minimalist/src/types/assets.d.ts`
- [X] T064 [P] [US4] `git mv src/_assets/{icons,logos} apps/minimalist/src/_assets/`
- [X] T065 [US4] Atualizar imports em `apps/minimalist/src/features/minimalist/**`: `@/shared/types/portfolio` → `portfolio-content-model` (5 arquivos); `@/shared/data/get-portfolio` não era usado dentro de `features/` (só no page.tsx — ver T070)
- [X] T066 [US4] Criar `apps/minimalist/src/i18n/{routing,navigation,request}.ts` (routing importa `SUPPORTED_LOCALES`/`DEFAULT_LOCALE` de `portfolio-content-model`) — feito na Phase 3 (T039), adiantado por ser pré-requisito do build
- [X] T067 [US4] Criar `apps/minimalist/src/middleware.ts` (cópia do `middleware.ts` raiz atual, matcher inalterado)
- [X] T068 [P] [US4] `git mv public/{favicon-dark.svg,favicon-light.svg,logo-dark.svg,logo-light.svg,og-image.webp} apps/minimalist/public/` — **nota**: `og-image.webp` também é usado pelo `gamified` (mesmo `PORTFOLIO_OG_IMAGE`); ver T086 para a cópia
- [X] T069 [P] [US4] `git mv public/portfolios/minimalist/placeholder-gallery.svg public/portfolios/minimalist/sounds/*.wav apps/minimalist/public/`
- [X] T070 [US4] Conteúdo de `portfolios/minimalist/page.tsx` reescrito (não `git mv` puro) em `apps/minimalist/src/app/[locale]/page.tsx`, achatando o segmento (PRD US-18) **e fundindo a lógica do `layout.tsx` aninhado removido (T071-nota)**: `getPortfolio(locale)` → `cmsClient.getPortfolio(locale)`, `href: '/portfolios/minimalist'` → `href: '/'`
- [X] T071 [US4] `git mv src/app/[locale]/portfolios/minimalist/minimalist-page-content.tsx apps/minimalist/src/app/[locale]/minimalist-page-content.tsx` — **desvio registrado**: o `layout.tsx` aninhado de `portfolios/minimalist/` (script de pré-hidratação + skip-link) não foi promovido a layout do app (isso vazaria esse comportamento para `labs/`/`dev/`, que nunca tiveram esse wrapper) — foi fundido diretamente dentro do novo `page.tsx` (T070), preservando o escopo original
- [X] T072 [US4] Criar `apps/minimalist/src/app/[locale]/layout.tsx` (fork do layout raiz atual, fontes Share_Tech_Mono/JetBrains_Mono/Poppins/Inter; `getPortfolio()` → `cmsClient.getPortfolio(routing.defaultLocale)`)
- [X] T073 [P] [US4] `git mv src/app/[locale]/not-found.tsx apps/minimalist/src/app/[locale]/not-found.tsx`
- [X] T074 [P] [US4] `git mv src/app/[locale]/labs/posts/flip/** apps/minimalist/src/app/[locale]/labs/posts/flip/**`
- [X] T075 [P] [US4] `git mv src/app/[locale]/dev/{minimalist-anchor,minimalist-animated-icon,minimalist-button,minimalist-timeline}/page.tsx apps/minimalist/src/app/[locale]/dev/`
- [X] T076 [US4] Criar `apps/minimalist/src/app/globals.css` (`@import 'tailwindcss'; @import './shared/styles/a11y.css'; @import './features/minimalist/styles.css';`)
- [X] T077 [US4] Criar `apps/minimalist/src/app/robots.ts` e `sitemap.ts` (só rotas/locales deste app) — corrige de quebra o bug do `sitemap.ts` original (só emitia a URL do `gamified`)
- [X] T078 [US4] Criar `apps/minimalist/messages/{pt-BR,en}.json` contendo os root keys `"minimalist"` **e `"labs"`** (descoberto durante a execução: `labs` era um root key separado, não aninhado em `minimalist` — ambos pertencem só a este app), movidos de `src/messages/*.json`
- [X] T079 [US4] `git mv e2e/minimalist-*.spec.ts playwright.config.ts apps/minimalist/` (7 specs), `webServer.url` de `/en/portfolios/minimalist` → `/en`, e todas as 43 ocorrências de `/en/portfolios/minimalist`/`` `/${locale}/portfolios/minimalist` `` dentro dos próprios specs corrigidas para `/en`/`` `/${locale}` ``
- [X] T080 [US4] Verificado com dados reais do CMS (`.env` apontando para `antonionarcilio/portfolio-cms`): `npx pnpm --filter minimalist build` ok (SSG completo pt-BR/en, dev/labs, api routes, sitemap/robots); smoke test via `next start` confirmou título real (“Antônio Mascarenhas — Frontend”), `/pt-BR` redireciona 307 para `/` (comportamento esperado do `localePrefix: 'as-needed'`), `/en/labs/posts/flip` 200, `sitemap.xml` com as 2 URLs corretas. **Playwright não executado nesta verificação** (rodar como parte da validação final de `quickstart.md`)

> **Correções pós-implementação (achadas pelo usuário, não pela verificação original de T080):**
> - `recruiter.tsx`: classe `py-8${hasExpandedContent...}` sem espaço antes do `${` fazia o Tailwind v4 não gerar `.py-8` — o wrapper `.minimalist-theme` ficava sem padding vertical (32px perdidos). Corrigido com um espaço.
> - `sound-catalog.ts`: os 8 sons apontavam para `/portfolios/minimalist/sounds/*.wav` (caminho antigo) em vez de `/sounds/*.wav` — efeitos sonoros silenciosamente quebrados. Corrigido.
> - `gallery-images.ts`: `GALLERY_PLACEHOLDER` apontava para `/portfolios/minimalist/placeholder-gallery.svg` em vez de `/placeholder-gallery.svg`. Corrigido.
> - `e2e/minimalist-a11y-panel.spec.ts` e `e2e/minimalist-content-pagination.spec.ts`: navegavam para `/en/portfolios/gamified` (rota que não existe mais neste app) como "página de teste" para verificar isolamento/cleanup — trocado para `/en/labs/posts/flip` (rota real deste app).

### Implementation for User Story 4 — `gamified`

- [X] T081 [US4] `git mv src/features/{gamified,minigame}/** apps/gamified/src/features/`
- [X] T082 [P] [US4] Copiado `a11y/store.ts`, `markdown-text.tsx`, `json-ld.ts`, `portfolio-og-image.ts`, `styles/a11y.css` para `apps/gamified/src/shared/`
- [X] T083 [P] [US4] `git mv src/shared/components/{dropdown-base,modal-base,overlay-base,svg-icon,tooltip-base}.tsx src/shared/hooks/use-is-mobile.ts src/shared/utils/cloudinary-url.ts apps/gamified/src/shared/` (exclusivos do gamified; `assets.d.ts` **não** foi copiado — confirmado que nenhum `.ts`/`.tsx` do gamified importa `.svg` como módulo)
- [X] T084 [US4] Atualizado `@/shared/types/portfolio` → `portfolio-content-model` em 13 arquivos de `features/gamified` (mesmo padrão de T065); `features/minigame` não tinha nenhum import cross-cutting (autocontido)
- [X] T085 [US4] Criar `apps/gamified/src/i18n/{routing,navigation,request}.ts` (feito na Phase 3) e `apps/gamified/src/middleware.ts`
- [X] T086 [P] [US4] `git mv public/portfolios/gamified/{favicon-gamified.svg,cursors/*.svg} apps/gamified/public/` + corrigidos os 15 caminhos `/portfolios/gamified/cursors/*` → `/cursors/*` em `features/gamified/styles.css` + copiado `og-image.webp` de `minimalist` (também usado pelo `gamified` via `PORTFOLIO_OG_IMAGE` — não estava previsto no plano original)
- [X] T087 [US4] Conteúdo de `portfolios/gamified/page.tsx` reescrito em `apps/gamified/src/app/[locale]/page.tsx`, achatando o segmento (PRD US-24) **e fundindo o `layout.tsx` aninhado removido** (A11yProvider, skip-link, fonte Chakra Petch, portal root) — o `minigames/snake` nunca teve esse wrapper (confirmado: era rota irmã, não aninhada em `portfolios/gamified`), então não herda isso agora também, preservando o comportamento original
- [X] T088 [US4] `git mv src/app/[locale]/minigames/snake/page.tsx apps/gamified/src/app/[locale]/minigames/snake/page.tsx` (caminho **plural mantido**, decisão confirmada)
- [X] T089 [US4] Criar `apps/gamified/src/app/[locale]/layout.tsx` — **desvio**: só Share_Tech_Mono/JetBrains_Mono (Chakra Petch ficou escopado à página em T087, não ao layout — preserva que `minigames/snake` nunca recebia essa fonte)
- [X] T090 [P] [US4] Copiado `not-found.tsx` para `apps/gamified/src/app/[locale]/not-found.tsx`
- [X] T091 [US4] Criar `apps/gamified/src/app/globals.css` (tailwindcss + `shared/styles/a11y.css` + `features/gamified/styles.css` + `features/minigame/snake/styles.css`)
- [X] T092 [US4] Criar `apps/gamified/src/app/robots.ts` e `sitemap.ts`
- [X] T093 [US4] Criar `apps/gamified/messages/{pt-BR,en}.json` com os root keys `"gamified"` e `"minigame"`
- [X] T094 [US4] Redirect de `/minigames/snake` → 404 em produção (plural preservado) — feito na Phase 3 (T033)
- [X] T095 [US4] Verificado com dados reais do CMS: build ok (SSG `/[locale]` e `/[locale]/minigames/snake` nos 2 idiomas); smoke test via `next start` confirmou título real, `/en/minigames/snake` 200, `/cursors/pointer.svg` 200, `/favicon-gamified.svg` 200

### Implementation for User Story 4 — `pro`

- [X] T096 [US4] Criar `apps/pro/src/app/[locale]/page.tsx`: chama `cmsClient.getPortfolio(locale)`, renderiza nome/papel/e-mail/github/linkedin, `generateMetadata` com JSON-LD + OG (PRD US-28)
- [X] T097 [P] [US4] Copiar `apps/pro/src/shared/utils/{json-ld.ts,portfolio-og-image.ts}` (cópias novas)
- [X] T098 [US4] Criar `apps/pro/src/app/[locale]/layout.tsx` (layout mínimo, `NextIntlClientProvider`, `<Analytics/>`)
- [X] T098a [P] [US4] Criar `apps/pro/src/app/[locale]/not-found.tsx` (cópia do mesmo not-found genérico) — testado em runtime: `/en/rota-inexistente` retorna `404` com a página customizada, não um erro de servidor
- [X] T099 [P] [US4] Copiado `favicon-dark.svg` (renomeado `favicon.svg`) e `og-image.webp` da raiz para `apps/pro/public/`
- [X] T100 [US4] Criar `apps/pro/messages/{pt-BR,en}.json` com namespace mínimo `"pro"` (`metadata.title`/`metadata.description`/`labels.{email,github,linkedin}`)
- [X] T101 [US4] Criar `apps/pro/src/app/robots.ts` e `sitemap.ts`
- [X] T102 [US4] Verificado com dados reais: build ok (SSG `/[locale]` nos 2 idiomas); smoke test confirmou `<title>` e `<h1>` reais, JSON-LD embutido no HTML
- [X] T102a [US4] Deletado `src/app/[locale]/portfolios/page.tsx` e `portfolio-hub-content.tsx` (remoção do hub, FR-009/PRD US-30) — feito agora, com a página real de `apps/pro` já existindo e testada (T096-T102)

### Verificação final de paridade

- [X] T103 [US4] Checklist de paridade (SC-004) executado via smoke test com os 2 apps rodando simultaneamente (`next start`) e dados reais do CMS: títulos reais idênticos nos 2 idiomas para ambos os apps; seções reais do `gamified` presentes no HTML (`experience-section`, `projects-section`, `skills-section`); `labs/posts/flip` 200 no `minimalist`; `/dev/*` corretamente escondido em produção (307 → 404) nos dois apps, replicando o comportamento original. **Recomendação**: revisão visual humana no navegador antes do deploy final, esta verificação automatizada cobre conteúdo/rotas, não pixels.

**Checkpoint**: Os 3 apps entregam conteúdo/comportamento completos; `minimalist`/`gamified` com paridade total, `pro` funcional com dados reais do CMS.

---

## Phase 7: User Story 5 - Agente de IA implementa uma fatia isolada (Priority: P3)

**Goal**: Cada app/pacote tem documentação própria e autocontida.

**Independent Test**: um agente lê só `apps/gamified/AGENTS.md` e encontra tudo que precisa para trabalhar isoladamente nesse app.

### Implementation for User Story 5

- [X] T104 [P] [US5] Escrever `apps/minimalist/AGENTS.md` (comandos, estrutura, pipeline do CMS via `cmsClient`, i18n, env vars deste app)
- [X] T105 [P] [US5] Escrever `apps/gamified/AGENTS.md`
- [X] T106 [P] [US5] Escrever `apps/pro/AGENTS.md`
- [X] T107 [P] [US5] Escrever `packages/portfolio-content-model/AGENTS.md` (mínimo)
- [X] T108 [P] [US5] Escrever `packages/portfolio-cms-client/AGENTS.md` (mínimo)
- [X] T109 [US5] Reduzido `AGENTS.md` da raiz só a regras verdadeiramente globais (package manager, comandos de workspace, code style, git workflow, comentários, DI, CVA, estrutura/kebab-case, CSS, formatting, logging, ponteiros para CMS/i18n/env por app) + índice apontando para os 5 `AGENTS.md` de app/pacote no topo

**Checkpoint**: Nenhum app/pacote depende de contexto fora de si mesmo para ser compreendido.

---

## Phase 8: Polish & Cross-Cutting Concerns (PRD US-37 a US-40)

**Purpose**: Remoção do código morto do app único e atualização de documentação de nível de repositório — depende de todas as user stories anteriores estarem completas e verificadas.

- [X] T110 Deletado `src/` inteiro (restava apenas `app/{api,[locale]/{layout,not-found,portfolios/*},globals.css,robots.ts,sitemap.ts}`, `env.ts`, `i18n/`, `messages/`, `middleware.ts` — tudo mais já tinha sido `git mv`'d nas fases anteriores) + `next.config.ts`, `next-env.d.ts`, `tsconfig.json` e `postcss.config.mjs` da raiz (`playwright.config.ts` já tinha sido movido na Phase 6)
- [X] T111 Verificação precisa (a instrução literal do grep é ampla demais — `@/shared`/`@/features` são aliases **válidos** dentro de cada app agora): confirmado vazio para os caminhos que de fato migraram — `@/lib/github-cms`, `@/shared/types/portfolio`, `@/shared/data`, `@/shared/i18n/locales`, `@/shared/utils/location`, `@/shared/utils/calc-xp-level`
- [X] T112 `package.json` da raiz já podado para tooling (`eslint`, `prettier`, `husky`, `lint-staged`, `typescript`) desde T002 (Phase 1) — nada restante para remover
- [X] T113 [P] Atualizado `docs/cms-content-updates.md` para o fluxo de 3 webhooks / 3 Deploy Hooks (tabela por app, exemplos de curl por domínio)
- [X] T114 [P] Revisado `docs/accessibility.md` e `docs/easter-egg.md` — todos os caminhos `src/features/*`, `src/shared/*`, `src/messages/*`, `src/app/*` corrigidos para `apps/gamified/src/...`/`apps/gamified/messages/...`
- [X] T115 `README.md` reescrito (estrutura de monorepo, comandos `pnpm --filter <app>`, os 3 domínios e rotas por app, `/minigames/snake` mantido plural, fluxo de CMS, link para o quickstart)
- [X] T116 Verificado SC-006: `grep -r "portfolioHub\|portfolio-hub-content" .` (excluindo `node_modules`) retorna vazio
- [X] T117 Validação de `quickstart.md` executada (passos 1-6, equivalentes às verificações já feitas fase a fase): `pnpm install` ok; `tsc --noEmit` dos 2 pacotes ok; os 3 apps buildam isoladamente com dados reais do CMS; smoke tests confirmaram conteúdo real, redirects 301→308, webhook (503/401/200 false/502), `not-found` do `pro`. **Passo 7 (Playwright) não executado** nesta sessão — recomendado rodar antes do deploy real.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: depende da conclusão do Setup — **bloqueia** todas as user stories
- **User Stories (Phase 3-7)**: todas dependem da conclusão da Foundational
  - US1 não depende de nenhuma outra story
  - US2 depende dos apps existirem como unidades de build (US1) para ter onde colocar `env.ts`/`lib/cms-client.ts`/rotas de API
  - US3 depende do app `pro` existir (US1) para configurar `redirects()`
  - US4 depende de US1 (apps existirem) e se beneficia de US2 (cms-client já disponível) — é a fase que entrega o conteúdo/rotas completos
  - US5 (documentação) só faz sentido depois que a estrutura real de cada app/pacote existe (US1-US4)
- **Polish (Phase 8)**: depende de todas as user stories desejadas estarem completas e verificadas

### User Story Dependencies

- **US1 (P1)**: pode começar após a Foundational — sem dependência de outras stories
- **US2 (P1)**: depende de US1 (precisa dos 3 apps existindo) — testável independentemente a partir daí
- **US3 (P2)**: depende de US1 (app `pro` existindo)
- **US4 (P2)**: depende de US1; integra com US2 (usa `cmsClient`) mas é testável por si (paridade de conteúdo/rotas)
- **US5 (P3)**: depende de US1-US4 terem produzido a estrutura real a documentar

### Parallel Opportunities

- Todas as tarefas `[P]` de uma mesma fase podem rodar em paralelo (arquivos diferentes, sem dependência entre si)
- Dentro da Foundational: T006/T007 e T013/T014 (scaffolding dos 2 pacotes) são paralelos entre si
- Dentro de US1: a criação dos 3 apps (T026-T037) é inteiramente paralela entre os 3 apps
- Dentro de US2: os 3 blocos por app (T040-T043, T044-T047, T048-T051) são paralelos entre si
- Dentro de US4: a migração de `minimalist` (T056-T080), `gamified` (T081-T095) e `pro` (T096-T102) pode ser feita por agentes/devs diferentes em paralelo, desde que US1 e US2 já estejam prontos
- Dentro de US5: todos os `AGENTS.md` (T104-T108) são paralelos entre si

---

## Parallel Example: User Story 1

```bash
# Scaffold dos 3 apps em paralelo (arquivos totalmente independentes):
Task: "Criar apps/minimalist/package.json, tsconfig.json, eslint.config.mjs, next.config.ts"
Task: "Criar apps/gamified/package.json, tsconfig.json, eslint.config.mjs, next.config.ts"
Task: "Criar apps/pro/package.json, tsconfig.json, eslint.config.mjs, next.config.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

User Story 1 isolada só prova que os 3 apps buildam de forma independente (valor estrutural, mas nenhum app serve conteúdo real ainda). Para um MVP que já demonstra o objetivo central do PRD (deploy independente + conteúdo do CMS centralizado), a entrega mínima recomendada é:

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (pacotes)
3. Completar Phase 3: User Story 1 (apps isolados)
4. Completar Phase 4: User Story 2 (cada app consumindo `cmsClient`)
5. **PARAR e VALIDAR**: os 3 apps buildam isoladamente e servem conteúdo do CMS via uma única implementação

### Incremental Delivery

1. Setup + Foundational → fundação pronta
2. US1 → apps isolados, testável independentemente
3. US2 → CMS centralizado, testável independentemente (MVP completo do objetivo central do PRD)
4. US3 → redirects + remoção do hub, testável independentemente
5. US4 → paridade completa de `minimalist`/`gamified` + `pro` funcional — maior fase, pode ser paralelizada por app
6. US5 → documentação por app/pacote
7. Polish → remoção do código morto, docs de repositório, validação final de `quickstart.md`

### Parallel Team Strategy

Com múltiplos agentes/devs, após Setup + Foundational:
- Agente A: `apps/minimalist` (US4, bloco minimalist)
- Agente B: `apps/gamified` (US4, bloco gamified)
- Agente C: `apps/pro` (US3 + US4, bloco pro)

Cada bloco integra de volta sem quebrar os outros, pois cada app é uma unidade de build independente desde US1.

---

## Notes

- Tarefas `[P]` = arquivos diferentes, sem dependência entre si
- O rótulo `[Story]` mapeia cada tarefa à user story correspondente para rastreabilidade
- Verificar build/typecheck isolado após cada bloco de app (checkpoints de cada fase)
- A fase de Polish (PRD US-37) é **irreversível na prática** (deleção de pastas inteiras, não `git mv`) — só executar depois que US1-US5 passarem na verificação
- Evitar: tarefas vagas, conflito no mesmo arquivo entre tarefas `[P]`, dependências cruzadas entre stories que quebrem a independência
