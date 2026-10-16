# Phase 0 Research: Migração do Portfolio para Monorepo

Não há marcadores `NEEDS CLARIFICATION` pendentes no Technical Context — todas as decisões abaixo já foram tomadas durante a elaboração do PRD (`docs/prd.md`) e validadas contra o estado atual do código numa exploração prévia. Este documento consolida as decisões técnicas que fecham qualquer ambiguidade restante antes do design de Fase 1.

## Gerenciador de workspace

- **Decision**: pnpm workspaces, sem Turborepo.
- **Rationale**: decisão estrutural já tomada no PRD; o repo é pequeno o suficiente (3 apps, 2 pacotes) para não precisar de orquestração de build incremental/cache distribuído ainda. Reavaliar Turborepo é uma fase futura explicitamente adiada.
- **Alternatives considered**: Turborepo (adiado — overhead de configuração não justificado no tamanho atual do repo); Nx (não cogitado no PRD, fora de escopo).

## Consumo dos pacotes compartilhados

- **Decision**: pacotes consumidos como fonte TypeScript via `transpilePackages` do Next.js, sem etapa de build própria.
- **Rationale**: elimina a necessidade de rodar `tsc`/bundler nos pacotes antes de cada build de app; o Next.js já transpila TS de workspaces via `transpilePackages`. Reduz uma camada de configuração (sem `dist/`, sem `exports` apontando para artefatos compilados).
- **Alternatives considered**: build próprio por pacote com `tsup`/`tsc` gerando `dist/` — rejeitado por adicionar uma etapa de build e watch mode extra para um monorepo pequeno, sem ganho de isolamento relevante aqui.

## Injeção de configuração no cliente do CMS

- **Decision**: `createCmsClient({ owner, repo, branch })` como factory, em vez de o pacote importar `@/env` diretamente.
- **Rationale**: a regra do `AGENTS.md` exige "injetar dependências por parâmetro, não por import global"; além disso um pacote não pode depender do módulo `env.ts` de um app específico — cada app tem o seu próprio. A injeção também torna o pacote testável isoladamente (sem precisar mockar `process.env`).
- **Alternatives considered**: pacote lendo `process.env` diretamente — rejeitado (acopla o pacote a nomes de variável de ambiente específicos de um app, viola US-13 e a regra de DI do `AGENTS.md`).

## Rota de revalidação como subpath

- **Decision**: `handleRevalidateWebhook(request: Request, config)` exportado via subpath `portfolio-cms-client/revalidate`, consumido por um wrapper de ~6 linhas em cada app (`src/app/api/revalidate/route.ts`).
- **Rationale**: evita duplicar a lógica de verificação HMAC + filtro de branch em 3 apps (US-14); manter como subpath (não no barrel principal `index.ts`) evita que todo consumidor do pacote carregue código de `node:crypto` HMAC à toa.
- **Alternatives considered**: middleware compartilhado — rejeitado, pois middleware do Next.js não compõe bem entre um pacote externo e o middleware de i18n que cada app já tem; rota HTTP direta no pacote — inviável, pacotes não publicam rotas, só funções.

## Redirects 301 do app `pro`

- **Decision**: `next.config.ts` → `async redirects()` (declarativo, nativo, suporta `permanent: true` e `:path*`).
- **Rationale**: mais simples que implementar via middleware (que já tem responsabilidade de locale) ou via route handler catch-all; roda antes do roteamento do Next, sem custo de renderização.
- **Alternatives considered**: middleware próprio para redirects — rejeitado, misturaria responsabilidades com o middleware de i18n e arriscaria colisão de matchers; route handler `[...path]/route.ts` — rejeitado, mais código do que o necessário para uma tabela estática de redirects.

## Caminho da rota do minigame

- **Decision**: manter `/minigames/snake` (plural), como já existe hoje no código — não renomear para o singular sugerido em prosa pelo PRD (US-24).
- **Rationale**: decisão confirmada explicitamente pelo usuário durante o planejamento, para não quebrar links/bookmarks existentes da rota atual.
- **Alternatives considered**: renomear para singular `/minigame/snake` para bater literalmente com o texto do PRD — descartado pelo usuário.

## Componentes de UI não cobertos pelos 2 pacotes

- **Decision**: duplicar (não compartilhar via um 3º pacote) os arquivos de `src/shared/*` que `minimalist` e `gamified` usam e que não fazem parte do contrato de dados nem do pipeline de CMS (ex.: `a11y/store.ts`, `markdown-text.tsx`, `json-ld.ts`, `portfolio-og-image.ts`, `styles/a11y.css`). Cada app consumidor recebe sua própria cópia.
- **Rationale**: decisão estrutural já tomada no PRD ("2 pacotes nesta fase, sem `portfolio-ui`"); confirmado explicitamente pelo usuário que esses itens devem estar disponíveis em ambos os projetos consumidores, não centralizados.
- **Alternatives considered**: criar um 3º pacote `portfolio-ui` agora — explicitamente fora de escopo desta fase por decisão do PRD.

## Verificação de paridade (SC-004)

- **Decision**: checklist manual — navegar pelas rotas principais de `minimalist` e `gamified` nos dois idiomas, comparando textos de interface e comportamento contra o estado anterior à migração.
- **Rationale**: não existe hoje nenhuma suíte de comparação visual automatizada (os 7 specs e2e testam interação, não diff pixel-a-pixel); criar uma para este propósito seria desproporcional ao tamanho do projeto (portfólio pessoal).
- **Alternatives considered**: captura automatizada de screenshots com diff pixel-a-pixel — rejeitado por desproporcional; confiar apenas nos specs e2e existentes — rejeitado por não cobrir o layout `gamified`, que não tem e2e hoje.
