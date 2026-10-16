# Phase 1 Data Model: Migração do Portfolio para Monorepo

As entidades abaixo correspondem aos "Key Entities" da spec (`spec.md`), detalhadas com os campos e regras que já existem no código atual (validados na exploração prévia) e que devem ser preservados/formalizados pelo pacote `portfolio-content-model`.

## PortfolioData (Dado do portfólio / contrato de conteúdo)

Representa a informação exibida em qualquer um dos três layouts. Hoje vive em `src/shared/types/portfolio.ts`; passa a viver em `packages/portfolio-content-model/src/types/portfolio.ts`.

- **Campos**: identidade (nome, papel/seniority), projetos (`ProjectEntry[]`), experiências (`ExperienceEntry[]`), educação, links — a forma exata deve ser lida do arquivo fonte antes da implementação (não reproduzida aqui de memória para evitar divergência).
- **Validação**: um schema Zod (`schema.ts`, novo) espelha esse tipo campo a campo e expõe `parsePortfolioData(data: unknown): PortfolioData`, lançando um erro cuja mensagem inclui o valor recebido e a forma esperada (regra do `AGENTS.md` sobre mensagens de exceção).
- **Relacionamentos**: é o formato de saída do mapeamento feito por `portfolio-cms-client` (`mapPortfolioToData`) a partir do `CmsGraph`.

### Seniority

Enum/union usado em `ExperienceEntry`/identidade — valor controlado, não um texto livre.

### ProjectEntry

Um projeto do portfólio — título, descrição, links, cover (campo hoje presente mas já identificado como candidato a ocultação quando vazio, conforme decisões de produto anteriores registradas em memória do projeto).

### ExperienceEntry

Uma experiência profissional — inclui campos de localização resolvidos por `parseLocation`/`parseEducationLocation` (ver abaixo) e de duração, usados por `calcXpLevel` no pacote de CMS para computar nível de XP (contexto do layout `gamified`).

## SupportedLocale / SUPPORTED_LOCALES / DEFAULT_LOCALE

- **Representa**: o conjunto de idiomas suportados pelos três apps (`pt-BR`, `en`) e o idioma padrão.
- **Regras**: `isSupportedLocale(value: string): value is SupportedLocale` — type guard usado pelo middleware de cada app e pela rota de debug do CMS.
- **Relacionamentos**: consumido por `i18n/routing.ts` de cada app e por `getPortfolio(locale)`/`createCmsClient` do pacote de CMS.

## ParsedLocation / ParsedEducationLocation

- **Representa**: a forma estruturada (cidade, estado, país, remoto) derivada de uma string de localização bruta vinda do CMS.
- **Regras**: `parseLocation`/`parseEducationLocation` são funções puras — mesma entrada sempre produz mesma saída, sem efeitos colaterais.
- **Relacionamentos**: usado pelo `map-portfolio.ts` do pacote de CMS ao montar `ExperienceEntry`/entradas de educação dentro de `PortfolioData`.

## CmsGraph / CmsNode (Grafo de conteúdo do CMS)

- **Representa**: a estrutura de nós de conteúdo alcançáveis via BFS a partir de `content/index.md` no repositório `antonionarcilio/portfolio-cms`.
- **Regras**: só entra no grafo o que é alcançável a partir da raiz (regra de "fonte única de verdade" do `AGENTS.md` — nunca editar `get-cms-graph.ts` para buscar algo fora disso); wikilinks resolvidos sempre por caminho completo (`content/<collection>/<slug>/index`), nunca por nome curto.
- **Relacionamentos**: é a entrada do mapper (`mapPortfolioToData`) que produz `PortfolioData`; é cacheado por chave `${owner}/${repo}/${branch}/${locale}` dentro do pacote (ver `create-cms-client.ts` na seção de contratos).

## CmsClientConfig

- **Representa**: a configuração necessária para instanciar um cliente de CMS — `{ owner: string, repo: string, branch: string }`.
- **Regras**: nenhum valor tem default implícito dentro do pacote `portfolio-cms-client` — cada app monta esse objeto a partir do seu próprio `env.ts` (`CMS_GITHUB_OWNER`, `CMS_GITHUB_REPO`, `CMS_GITHUB_BRANCH`). Essa é a entidade central da injeção de dependência (FR-004, US-13).
- **Relacionamentos**: consumida por `createCmsClient(config)`, que fecha sobre `config` e expõe `getPortfolio(locale)`/`getCmsGraph(locale)`.

## Notificação de mudança de conteúdo (Webhook payload + RevalidateConfig)

- **Representa**: o evento HTTP recebido em `/api/revalidate` de cada app quando o repositório `portfolio-cms` recebe um push.
- **Regras de validação** (FR-007): assinatura HMAC-SHA256 no header `X-Hub-Signature-256`, comparada com `timingSafeEqual`; `ref` do payload deve corresponder a `refs/heads/${branch}` configurado; resposta é `401` para assinatura inválida, `200 { triggered: false }` para branch diferente, `503` se faltar segredo/hook configurado (condição distinta de "rejeitado", ver Edge Cases da spec).
- **`RevalidateConfig`**: `{ secret: string | undefined, deployHookUrl: string | undefined, branch: string }` — também injetado por parâmetro, nunca lido de `env` dentro do pacote.
- **Relacionamentos**: cada app monta seu próprio `RevalidateConfig` a partir do seu `env.ts` e repassa para `handleRevalidateWebhook(request, config)`.

## Redirecionamento de URL antiga

- **Representa**: o mapeamento estático entre uma URL do app único anterior e seu endereço equivalente pós-migração.
- **Regras**: implementado como entradas declarativas em `next.config.ts` → `redirects()` do app `pro` (dono do domínio apex); todas com `permanent: true` (301); preserva o segmento de locale quando presente na URL de origem.
- **Mapeamentos conhecidos** (ver `contracts/` para a tabela completa): `/portfolios/minimalist/*` → domínio do `minimalist`; `/portfolios/gamified/*` → domínio do `gamified`; `/portfolios` → raiz do apex.
