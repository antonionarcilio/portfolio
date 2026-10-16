# PRD: Migração do Portfolio para Monorepo (pnpm workspaces)

## Overview and Problem

Hoje o portfólio é **uma única aplicação Next.js** (um `package.json`, um `node_modules`, uma raiz de build) que hospeda, dentro do mesmo app, os layouts `minimalist` e `gamified`, além das rotas `labs`, `dev`, `minigame` e do hub (`/portfolios`). O conteúdo vem de um repo separado (`portfolio-cms`, só arquivos `.md`, público), lido em build time por um pipeline em `src/shared/data` + `src/lib/github-cms`.

O objetivo é adotar uma **estrutura de monorepo real** — um único repositório, vários projetos e pacotes — de modo que:

1. cada layout seja um **app independente**, com **build e deploy próprios** na Vercel;
2. a camada de dados do CMS seja **escrita uma única vez**, em pacotes compartilhados, eliminando a possibilidade de duplicação;
3. o **`pro`** (novo layout) nasça já dentro do padrão, servindo o domínio raiz.

**Decisões estruturais já tomadas (não reabrir nesta empreitada):**

- Monorepo com **pnpm workspaces**. **Sem Turborepo** (a ser avaliado em fase futura).
- Pacotes consumidos como **fonte TypeScript** via `transpilePackages` — **sem etapa de build nos pacotes**.
- **Big bang**: tudo em uma única branch e um único merge.
- **Paridade total** para `minimalist` e `gamified`: nenhuma mudança visual ou comportamental.
- **3 apps**: `minimalist`, `gamified`, `pro`.
- **3 projetos Vercel**, **3 Deploy Hooks**, **3 webhooks** no repo CMS.
- **Hub eliminado**; o apex passa a servir o `pro`.
- Domínios: `minimalist.antoniomascarenhas.com.br`, `gamified.antoniomascarenhas.com.br`, apex `antoniomascarenhas.com.br` = `pro`.
- Redirects **301** das URLs antigas vivem no app `pro` (dono do apex).
- **2 pacotes** nesta fase: `portfolio-content-model` e `portfolio-cms-client` (sem `portfolio-ui`).
- Ferramentas e specs (`openspec/`, `docs/`, `.agents/`, `.claude/`, `.codex/`, `.opencode/`) ficam na **raiz**; **`AGENTS.md` completo por app**.
- e2e (Playwright) **por app**; os 7 specs atuais vão para `apps/minimalist`.

**Resultado esperado:** um repositório com `apps/*` + `packages/*`, 3 deploys independentes, uma única implementação do pipeline do CMS, e contexto de IA por app para permitir que agentes atuem isoladamente em cada projeto.

---

## Personas and Use Cases

### Persona 1 — Mantenedor (Antonio)

**Objetivos:** publicar alterações em um layout sem rebuildar os outros; manter o conteúdo do CMS em um único repo `.md`; não repetir a lógica do CMS.

**Jornadas principais:**
- Editar um `.md` no `portfolio-cms` e ver os 3 apps rebuildarem.
- Publicar uma mudança só no `gamified` e ver apenas ele redeployar.
- Alterar a leitura de um campo do CMS em **um** lugar (o pacote) e refletir nos 3 apps.

### Persona 2 — Agente de IA (implementador)

**Objetivos:** executar uma fatia da migração com contexto suficiente e sem ambiguidade; validar o próprio trabalho objetivamente; não quebrar paridade.

**Jornadas principais:**
- Ler o `AGENTS.md` do app em que vai atuar e as regras do workspace.
- Implementar uma user story, rodar `pnpm --filter <app> typecheck` e `build`.
- Verificar critérios de aceite sem precisar do histórico da entrevista.

### Persona 3 — Visitante/recrutador (usuário final)

**Objetivos:** consumir o portfólio sem perceber a mudança de arquitetura.

**Jornadas principais:**
- Acessar cada portfólio pelo seu domínio e ver **exatamente** o mesmo conteúdo de antes.
- Chegar por uma URL antiga e ser redirecionado (301) para a nova.

---

## User Stories

### Epic: WS — Fundação do workspace

- US-1: Como mantenedor, quero um `pnpm-workspace.yaml` na raiz declarando `apps/*` e `packages/*`, para que apps e pacotes formem um workspace único.
- US-2: Como mantenedor, quero um `package.json` privado na raiz com scripts baseados em `pnpm --filter`/`-r` (`build`, `lint`, `typecheck`, `dev:*`), para operar o monorepo sem Turborepo.
- US-3: Como agente, quero um `tsconfig.base.json` na raiz, estendido por cada app e pacote, para padronizar o compilador.
- US-4: Como mantenedor, quero eslint, prettier, husky e lint-staged compartilhados na raiz, para evitar drift de configuração.
- US-5: Como agente, quero um lockfile único na raiz e as versões das libs comuns harmonizadas, para que os apps não divirjam de dependência.

### Epic: CM — Pacote `portfolio-content-model`

- US-6: Como agente, quero mover `PortfolioData` (`src/shared/types/portfolio.ts`) para `packages/portfolio-content-model`, para que o contrato tenha dono único.
- US-7: Como agente, quero mover o módulo de locales (`SupportedLocale`, `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `isSupportedLocale`) para o pacote de modelo, para que o contrato de idioma seja compartilhado.
- US-8: Como agente, quero mover `parseLocation`/utilitários puros de localização (`src/shared/utils/location.ts`) para o pacote de modelo, pois são consumidos tanto pelo mapper quanto pelas páginas.
- US-9: Como mantenedor, quero um schema **Zod** para `PortfolioData` e um `package.json` com `exports` (fonte TS, sem React e sem `server-only`), para que a forma do contrato seja validável.

### Epic: CC — Pacote `portfolio-cms-client`

- US-10: Como agente, quero mover `fetch-cms-file.ts` e `parse-wikilink.ts` (`src/lib/github-cms/`) para o pacote de cliente, para centralizar o acesso ao CMS.
- US-11: Como agente, quero mover `get-cms-graph.ts`, `map-portfolio.ts` e `get-portfolio.ts` (`src/shared/data/`) para o pacote, para que o pipeline exista uma única vez.
- US-12: Como agente, quero mover `calc-xp-level.ts` (`src/shared/utils/`) para dentro do pacote de cliente, pois só o mapper o consome.
- US-13: Como agente, quero um `createCmsClient({ owner, repo, branch })` com injeção de configuração, para eliminar o import direto de `@/env` em `get-cms-graph.ts`.
- US-14: Como mantenedor, quero a rota `/api/revalidate` (validação HMAC + filtro de branch) exportada como **subpath** do pacote, recebendo `{ secret, deployHookUrl }` por parâmetro, para não duplicar essa lógica em 3 apps.
- US-15: Como agente, quero o pacote marcado com `server-only`, expondo `getPortfolio(locale)` como fachada única, para que os apps só conheçam essa API.

### Epic: MIN — App `minimalist`

- US-16: Como agente, quero criar `apps/minimalist` com `next.config.ts` (`transpilePackages` dos pacotes), `tsconfig.json` estendendo a base, `eslint.config.mjs` e `package.json` próprios.
- US-17: Como agente, quero mover `src/features/minimalist/**` para `apps/minimalist/src/features/minimalist`, preservando histórico via `git mv`.
- US-18: Como agente, quero mover as rotas do layout minimalista e as rotas `labs/*` e `dev/*` para `apps/minimalist/src/app/[locale]/…` com caminho limpo (sem o segmento `/portfolios/minimalist`).
- US-19: Como agente, quero mover `i18n/`, `middleware.ts`, `env.ts` e as chaves de mensagem do root key `minimalist` para o app, para que ele seja autônomo.
- US-20: Como agente, quero substituir os imports `@/shared/data/get-portfolio` e `@/shared/types/portfolio` pelos pacotes e ajustar o `globals.css` para importar apenas o CSS do próprio layout.
- US-21: Como agente, quero mover o `public/` do minimalist (sons, placeholder de galeria, favicon/logo), ajustar os caminhos de asset afetados (`/portfolios/minimalist/…`), criar `sitemap.ts`/`robots.ts` próprios e mover os 7 specs de e2e + `playwright.config.ts` para o app.

### Epic: GAM — App `gamified`

- US-22: Como agente, quero criar `apps/gamified` com `next.config.ts` (`transpilePackages`), `tsconfig.json`, `eslint.config.mjs` e `package.json` próprios.
- US-23: Como agente, quero mover `src/features/gamified/**` para `apps/gamified/src/features/gamified`, preservando histórico.
- US-24: Como agente, quero mover as rotas do layout gamificado e a rota `minigame/snake` para `apps/gamified/src/app/[locale]/…`, além de mover `src/features/minigame/**` para o app.
- US-25: Como agente, quero mover `i18n/`, `middleware.ts`, `env.ts` e as chaves de mensagem dos root keys `gamified` e `minigame` para o app.
- US-26: Como agente, quero substituir os imports pelos pacotes, ajustar o `globals.css`, mover o `public/` do gamified (cursores, favicon-gamified) e criar `sitemap.ts`/`robots.ts` próprios.

### Epic: PRO — App `pro` (mínimo, no apex)

- US-27: Como mantenedor, quero criar `apps/pro` como app mínimo (layout, i18n pt-BR/en, metadados) para provar deploy, domínio e padrão do monorepo.
- US-28: Como mantenedor, quero que o `pro` consuma `getPortfolio(locale)` do pacote e renderize dados do CMS (nome, papel, links) com JSON-LD e OG, usando o mesmo grafo raiz do CMS.
- US-29: Como mantenedor, quero que o app `pro` implemente os **301** das URLs antigas (`/portfolios/minimalist/*` → `minimalist.…`, `/portfolios/gamified/*` → `gamified.…`, `/portfolios` → apex), por ser o dono do apex.
- US-30: Como agente, quero **remover o hub** (rota `[locale]/portfolios/page.tsx`, `portfolio-hub-content.tsx` e as chaves `portfolioHub` dos messages), pois ele é substituído pelo apex servido pelo `pro`.

### Epic: INF — Infraestrutura Vercel e CMS

- US-31: Como mantenedor, quero 3 projetos Vercel, cada um com **Root Directory** apontando para o respectivo `apps/<x>` e a opção **"Include source files outside of the Root Directory in the Build Step"** habilitada.
- US-32: Como mantenedor, quero 3 **Deploy Hooks** e as env vars (`MY_DOMAIN`, `CMS_GITHUB_*`, `CMS_GITHUB_WEBHOOK_SECRET`, `VERCEL_DEPLOY_HOOK_URL`) configuradas por projeto.
- US-33: Como mantenedor, quero **3 webhooks** (config de UI, sem arquivo) no repo `portfolio-cms`, cada um apontando para o `/api/revalidate` do seu app.
- US-34: Como mantenedor, quero os domínios configurados: `minimalist.…` e `gamified.…` nos respectivos projetos, e o apex no projeto `pro`.
- US-35: Como mantenedor, quero um **Ignored Build Step** por projeto (via `git diff`) para só rebuildar o app afetado em mudanças de código.

### Epic: DOC — Contexto de IA, documentação e limpeza

- US-36: Como agente, quero um `AGENTS.md` completo em cada app, além do `AGENTS.md` de workspace na raiz, para atuar isoladamente em cada projeto.
- US-37: Como agente, quero remover a estrutura do app único (`src/app`, `src/shared`, `src/lib`, `src/features` antigos, `src/i18n`, `src/messages`, `src/env.ts`, `src/middleware.ts`) e referências órfãs, para não restar código duplicado.
- US-38: Como mantenedor, quero atualizar `docs/cms-content-updates.md` para o fluxo de 3 webhooks + 3 Deploy Hooks, e revisar `docs/accessibility.md`/`docs/easter-egg.md` quanto a caminhos.
- US-39: Como mantenedor, quero atualizar o `README.md` (estrutura de monorepo, comandos, rotas, domínios) e validar a paridade ponta a ponta.
- US-40: Como mantenedor, quero registrar a mudança de arquitetura no `openspec/` na raiz, mantendo specs e ferramentas centralizadas.

---

## Consumes & Provides

| Epic | Consumes | Provides |
|---|---|---|
| **WS** | — | `pnpm-workspace.yaml`, scripts de raiz, `tsconfig.base.json`, config compartilhada, lockfile único |
| **CM** | — | `PortfolioData`, schema Zod, `SupportedLocale`/`SUPPORTED_LOCALES`/`DEFAULT_LOCALE`, `parseLocation` |
| **CC** | CM (`PortfolioData`, locales) | `getPortfolio(locale)`, `createCmsClient`, fachada do pipeline, subpath `revalidate` |
| **MIN** | CM, CC | App `minimalist` deployável (layout + labs + dev), sitemap/robots próprios |
| **GAM** | CM, CC | App `gamified` deployável (layout + minigame/snake), sitemap/robots próprios |
| **PRO** | CM, CC | App `pro` deployável no apex; **mapa de 301**; remoção do hub |
| **INF** | MIN, GAM, PRO (artefatos deployáveis) | 3 projetos Vercel, 3 Deploy Hooks, 3 webhooks, domínios, Ignored Build Step |
| **DOC** | WS; MIN, GAM, PRO (para limpeza) | `AGENTS.md` por app, docs atualizados, remoção do app único, registro no `openspec/` |

---

## Dependency Graph and Execution Waves

**Dependências:**

- `CM` não depende de ninguém; `WS` não depende de ninguém.
- `CC` depende de `CM` (usa `PortfolioData` e locales).
- `MIN`, `GAM` e `PRO` dependem de `CM` e `CC`; **não dependem entre si**.
- `INF` depende de `MIN`, `GAM` e `PRO` (precisa dos apps existindo para configurar Root Directory e deploys).
- `DOC` depende de `WS` (para `AGENTS.md`) e de `MIN`/`GAM`/`PRO` (para a limpeza do app único).

### Wave 1
- **WS** — Fundação do workspace (US-1 a US-5)
- **CM** — Pacote `portfolio-content-model` (US-6 a US-9)

### Wave 2
- **CC** — Pacote `portfolio-cms-client` (US-10 a US-15)

### Wave 3
- **MIN** — App `minimalist` (US-16 a US-21)
- **GAM** — App `gamified` (US-22 a US-26)
- **PRO** — App `pro` + remoção do hub (US-27 a US-30)

### Wave 4
- **INF** — Infraestrutura Vercel e CMS (US-31 a US-35)
- **DOC** — Contexto de IA, documentação e limpeza (US-36 a US-40)

> Observação: a **redação** do `AGENTS.md` de cada app (US-36) pode começar já na Wave 3, em paralelo à criação do app correspondente. A **remoção do app único** (US-37) só pode ocorrer após MIN, GAM e PRO estarem migrados.

---

## Acceptance Criteria

### Epic WS

- **US-1** — Dado a raiz do repositório, quando eu abrir `pnpm-workspace.yaml`, então ele declara `apps/*` e `packages/*`.
- **US-2** — Dado a raiz, quando eu rodar `pnpm build` a partir dela, então os 3 apps são buildados (em ordem topológica), sem depender de Turborepo.
- **US-3** — Dado que um app ou pacote estende `tsconfig.base.json`, quando eu rodar `pnpm typecheck`, então nenhum erro de configuração de caminho/alias é reportado.
- **US-4** — Dado um commit com arquivos fora de qualquer pacote/app válido, quando o husky rodar, então lint-staged executa normalmente; não existem configs de lint/prettier divergentes por app.
- **US-5** — Dado o workspace instalado, então existe **um único** `pnpm-lock.yaml` na raiz e nenhum lockfile dentro de `apps/*` ou `packages/*`.

### Epic CM

- **US-6 a US-8** — Dado o pacote `portfolio-content-model`, quando eu importar `PortfolioData`, `SupportedLocale`, `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `isSupportedLocale` e `parseLocation`, então todos resolvem a partir do pacote e **não** existem mais em `src/shared/`.
- **US-9** — Dado um objeto que não satisfaz a forma de `PortfolioData`, quando eu validá-lo com o schema Zod do pacote, então a validação falha apontando o campo e a forma esperada; dado um objeto válido, a validação passa. O `package.json` do pacote não declara `react` nem `server-only`.

### Epic CC

- **US-10 a US-12** — Dado o pacote `portfolio-cms-client`, quando eu procurar por `fetchCmsFile`, `parseWikiLink`, `getCmsGraph`, `mapPortfolioToData`, `getPortfolio` e `calcXpLevel`, então todos existem no pacote e **não** existem mais em `src/lib/github-cms` ou `src/shared/data`.
- **US-13** — Dado o código do pacote, quando eu procurar por `@/env`, então **não há nenhuma ocorrência**; a configuração do CMS entra por `createCmsClient({ owner, repo, branch })`.
- **US-14** — Dado um POST em `/api/revalidate` de qualquer app com assinatura HMAC válida e `ref` igual à branch configurada, então cada app dispara o **seu** Deploy Hook; com assinatura inválida retorna 401; com branch diferente retorna 200 com `triggered: false`; sem secret/hook retorna 503.
- **US-15** — Dado um app que importa do pacote, quando ele tentar importar em um Client Component, então o build falha por causa de `server-only`; `getPortfolio(locale)` é a única API de alto nível necessária para renderizar dados.

### Epic MIN

- **US-16** — Dado `apps/minimalist`, quando eu rodar `pnpm --filter minimalist build`, então o build conclui sem erro e sem precisar buildar os pacotes.
- **US-17 a US-18** — Dado o app `minimalist`, quando eu navegar para `/{locale}` e para `/{locale}/labs/posts/flip` e `/{locale}/dev/minimalist-button` em dev, então todas renderizam; nenhum arquivo permanece em `src/features/minimalist` ou `src/app/[locale]` na raiz do repo.
- **US-19** — Dado o app `minimalist`, então ele possui seu próprio `middleware.ts`, `env.ts`, `i18n/` e `messages/`; nenhuma string de interface do minimalist é resolvida a partir de um arquivo fora do app.
- **US-20** — Dado o código de `apps/minimalist`, quando eu procurar por `@/shared/data` ou `@/shared/types/portfolio`, então **não há ocorrências**; o `globals.css` importa apenas Tailwind, `a11y.css` e o `styles.css` do minimalist.
- **US-21** — Dado o app `minimalist`, então seus assets públicos resolvem sem 404 (sons e placeholder de galeria), `/{locale}/sitemap.xml` e `/robots.txt` respondem, e os 7 specs de e2e rodam a partir do app apontando para o novo domínio/URL.

### Epic GAM

- **US-22** — Dado `apps/gamified`, quando eu rodar `pnpm --filter gamified build`, então o build conclui sem erro.
- **US-23 a US-24** — Dado o app `gamified`, quando eu navegar para `/{locale}` e para a rota do minigame/easter egg, então o comportamento é idêntico ao anterior; `features/gamified` e `features/minigame` não permanecem na raiz.
- **US-25** — Dado o app `gamified`, então ele possui `middleware.ts`, `env.ts`, `i18n/` e `messages/` próprios, contendo os root keys `gamified` e `minigame`.
- **US-26** — Dado o código de `apps/gamified`, então não há imports de `@/shared/data`/`@/shared/types/portfolio`, o `globals.css` importa apenas o CSS do gamified (e o do minigame), os cursores e o favicon resolvem, e sitemap/robots respondem.

### Epic PRO

- **US-27** — Dado `apps/pro`, quando eu rodar `pnpm --filter pro build`, então o build conclui sem erro.
- **US-28** — Dado o app `pro` acessado no domínio raiz, quando a página carregar, então os dados vindos de `getPortfolio(locale)` (nome, papel, links) aparecem, com JSON-LD e OG válidos, para os locales `pt-BR` e `en`.
- **US-29** — Dado uma requisição a `/pt-BR/portfolios/minimalist`, quando ela chegar ao app `pro`, então a resposta é **301** para `https://minimalist.antoniomascarenhas.com.br/pt-BR` (preservando o locale); idem para `gamified`; e `/portfolios` responde 301 para o apex.
- **US-30** — Dado o repositório, quando eu procurar por `portfolioHub` ou `portfolio-hub-content`, então **não há ocorrências**; a rota do hub não existe em nenhum app.

### Epic INF

- **US-31** — Dado o projeto Vercel de um app, quando um push chegar ao repo, então apenas o app afetado builda; o build enxerga `packages/*`.
- **US-32** — Dado um projeto Vercel, então as 4 env vars estão presentes e o Deploy Hook responde a um POST disparando um deployment novo.
- **US-33** — Dado um push em `master` no `portfolio-cms`, então os 3 webhooks entregam 200 e 3 deployments são criados (em fila, por conta do limite do plano Hobby).
- **US-34** — Dado os domínios, então cada app responde no seu host com SSL válido, e o apex responde com o app `pro`.
- **US-35** — Dado um commit que altera apenas `apps/minimalist`, quando um push ocorrer, então apenas o projeto do minimalist builda (Ignored Build Step funciona); um commit que altera `packages/*` builda todos os apps afetados.

### Epic DOC

- **US-36** — Dado `apps/<x>/AGENTS.md`, então um agente consegue identificar comandos, estrutura, regras e limites daquele app sem ler a raiz.
- **US-37** — Dado o repositório, quando eu procurar pelas pastas do app único (`src/app`, `src/shared`, `src/lib/github-cms`, `src/features`), então elas **não existem** mais na raiz, e nenhum import órfão permanece.
- **US-38** — Dado `docs/cms-content-updates.md`, então ele descreve o fluxo com 3 webhooks + 3 Deploy Hooks e os comandos de teste atualizados.
- **US-39** — Dado o `README.md`, então ele descreve a estrutura de monorepo, os comandos por app, os domínios e as rotas; e a seguinte verificação de paridade passa: mesmo conteúdo, mesmo comportamento e mesmos textos de interface nos 3 apps comparados ao estado anterior.
- **US-40** — Dado `openspec/`, então specs e ferramentas permanecem centralizados na raiz e a mudança de arquitetura está registrada.
