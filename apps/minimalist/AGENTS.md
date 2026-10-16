## App `minimalist`

Layout minimalista do portfólio, publicado em `minimalist.antoniomascarenhas.com.br`. Rotas: `/{locale}` (página principal), `/{locale}/labs/posts/flip`, `/{locale}/dev/*` (escondidas em produção via redirect em `next.config.ts`).

## Comandos

- `npx pnpm --filter minimalist dev` — modo dev (Turbopack).
- `npx pnpm --filter minimalist build` / `start` — build e start de produção.
- `npx pnpm --filter minimalist lint` / `typecheck` — lint e checagem de tipos isolados deste app.
- `npx pnpm --filter minimalist exec playwright test` — roda os 7 specs e2e (`e2e/minimalist-*.spec.ts`).

## Estrutura

```
src/
  env.ts              — variáveis de ambiente deste app (ver seção abaixo)
  middleware.ts        — roteamento de locale (next-intl)
  i18n/{routing,navigation,request}.ts
  lib/cms-client.ts     — instância única de createCmsClient(...) deste app
  shared/               — cópias locais de utilitários compartilhados com `gamified`
                          (a11y/store.ts, components/markdown-text.tsx, utils/json-ld.ts,
                          utils/portfolio-og-image.ts, styles/a11y.css) — editar aqui NÃO propaga
                          para `apps/gamified`, são cópias independentes por decisão de produto
  features/minimalist/** — toda a lógica de UI do layout
  _assets/               — ícones/logos usados só por labs/dev
  app/
    globals.css, robots.ts, sitemap.ts
    api/{revalidate,cms-debug}/route.ts
    [locale]/{layout.tsx,page.tsx,not-found.tsx,labs/**,dev/**}
messages/{pt-BR,en}.json  — root keys "minimalist" e "labs"
```

## Pipeline de dados do CMS

Este app **não** lê o CMS diretamente — consome `cmsClient` (instanciado em `src/lib/cms-client.ts` a partir do pacote `portfolio-cms-client`):

```ts
import { cmsClient } from '@/lib/cms-client';
const data = await cmsClient.getPortfolio(locale); // PortfolioData | null
```

O contrato de dados (`PortfolioData`, `SupportedLocale`, `parseLocation`, etc.) vem de `portfolio-content-model`. Nunca importe esses dois pacotes por caminho relativo — sempre pelo nome (`workspace:*` no `package.json`).

## i18n

Strings de interface vêm de `src/messages/{pt-BR,en}.json`, sob os root keys `"minimalist"` (seções da página) e `"labs"` (rota `/labs/posts/flip`). Use `useTranslations('minimalist.<namespace>')`. Nunca hardcode texto de UI.

## Variáveis de ambiente

Ver `src/env.ts` (`MY_DOMAIN`, `CMS_GITHUB_OWNER`, `CMS_GITHUB_REPO`, `CMS_GITHUB_BRANCH`, `CMS_GITHUB_WEBHOOK_SECRET`, `VERCEL_DEPLOY_HOOK_URL`). Seguir o processo de "Adding environment variables" do `AGENTS.md` da raiz, mas registrando a variável em **este** `env.ts`, não no da raiz (não existe mais um `env.ts` compartilhado).

## Regras deste app

- Paridade total com o estado pré-migração é obrigatória — nenhuma mudança visual/comportamental perceptível.
- `/dev/*` só é acessível em desenvolvimento; `next.config.ts` redireciona para 404 em produção.
- Specs e2e (`e2e/`) devem continuar passando após qualquer mudança nas rotas principais.
