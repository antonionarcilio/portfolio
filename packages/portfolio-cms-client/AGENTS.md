## Pacote `portfolio-cms-client`

Pipeline único de leitura do CMS markdown (GitHub). Marcado `server-only`. Depende de `portfolio-content-model` (`workspace:*`).

## Exports

- `.` (barrel): `createCmsClient(config: CmsClientConfig)`, `CmsClient`, `CmsClientConfig`, `CmsGraph`, `CmsNode`.
- `./revalidate`: `handleRevalidateWebhook(request: Request, config: RevalidateConfig)` — **não** reexportado no barrel principal.

## Regras

- **Zero** `import ... from '@/env'` ou qualquer leitura de `process.env` fora de `fetch-cms-file.ts`'s `CMS_BUILD_CACHE_BUSTER` (que lê `VERCEL_DEPLOYMENT_ID`, não config de CMS). Toda configuração de CMS (`owner`/`repo`/`branch`) é injetada via `CmsClientConfig` — cada app monta a sua a partir do próprio `env.ts`.
- O cache do grafo de conteúdo vive no closure de `createCmsClient`, não em um `Map` de módulo — cada chamada à fábrica tem seu próprio cache isolado.
- Nunca buscar nada fora do que é alcançável via BFS a partir de `content/index.md` — root é a única fonte de verdade.
- Wikilinks sempre resolvidos por caminho completo (`content/<collection>/<slug>/index`), nunca por nome curto.

## Comandos

- `npx pnpm --filter portfolio-cms-client exec tsc --noEmit`
- `grep -r "@/env" packages/portfolio-cms-client/src` deve sempre retornar vazio.
