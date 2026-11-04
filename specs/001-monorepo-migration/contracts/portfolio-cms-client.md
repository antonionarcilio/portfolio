# Contract: `portfolio-cms-client`

Pacote de biblioteca TypeScript marcado `server-only`, consumido como fonte via `transpilePackages`. Depende de `portfolio-content-model` (`workspace:*`).

## Exports — barrel principal (`.`, `./src/index.ts`)

| Export | Tipo | Descrição |
|---|---|---|
| `createCmsClient(config: CmsClientConfig)` | function → `CmsClient` | Factory única de alto nível — toda a API que um app precisa. |
| `CmsClient` | type | `{ getPortfolio(locale): Promise<PortfolioData \| null>; getCmsGraph(locale): Promise<CmsGraph> }`. |
| `CmsClientConfig` | type | `{ owner: string; repo: string; branch: string }`. |
| `CmsGraph`, `CmsNode` | type | Estrutura do grafo de conteúdo (exposta para a rota de debug de cada app). |

**Não reexportado no barrel principal**: `handleRevalidateWebhook` (só acessível via subpath, ver abaixo) e `calcXpLevel` (uso interno de `map-portfolio.ts`, não faz parte da fachada pública).

## Exports — subpath `./revalidate` (`./src/revalidate.ts`)

| Export | Tipo | Descrição |
|---|---|---|
| `handleRevalidateWebhook(request: Request, config: RevalidateConfig)` | function → `Promise<Response>` | Implementação completa do endpoint de revalidação (HMAC + filtro de branch + disparo do deploy hook). |
| `RevalidateConfig` | type | `{ secret: string \| undefined; deployHookUrl: string \| undefined; branch: string }`. |

### Contrato HTTP de `handleRevalidateWebhook` (consumido via wrapper em `/api/revalidate` de cada app)

| Condição | Resposta |
|---|---|
| Assinatura `X-Hub-Signature-256` ausente ou inválida | `401` |
| `ref` do payload ≠ `refs/heads/${config.branch}` | `200 { triggered: false }` |
| `config.secret` ou `config.deployHookUrl` ausente | `503` |
| Assinatura válida + branch correta + config completa | Dispara `POST` para `config.deployHookUrl`, responde `200 { triggered: true }` |

## Garantias do contrato

- **Zero ocorrências de `@/env`** dentro do pacote (toda configuração é injetada via `CmsClientConfig`/`RevalidateConfig`) — verificável por `grep -r "@/env" packages/portfolio-cms-client/src`.
- **`import 'server-only'`** no topo de `index.ts` — importar este pacote num Client Component deve falhar o build.
- **Cache por chave `${owner}/${repo}/${branch}/${locale}`** — duas instâncias de `createCmsClient` com configs diferentes não compartilham cache incorretamente.
- **`getPortfolio(locale)` é a única API de alto nível necessária** — nenhum app deveria precisar chamar `getCmsGraph`/`mapPortfolioToData` diretamente para montar a página principal (só a rota de debug usa `getCmsGraph`).

## Verificação do contrato

```bash
grep -r "@/env" packages/portfolio-cms-client/src   # deve retornar vazio
npx pnpm --filter portfolio-cms-client exec tsc --noEmit
```

Teste manual mínimo: instanciar `createCmsClient({ owner, repo, branch })` com valores de teste e chamar `getPortfolio('pt-BR')`, confirmando que o resultado passa em `parsePortfolioData` do pacote `portfolio-content-model`.
