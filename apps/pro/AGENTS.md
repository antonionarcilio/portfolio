## App `pro`

App mínimo publicado no domínio raiz (apex `antoniomascarenhas.com.br`). Renderiza dados reais do CMS (nome, papel, e-mail, GitHub, LinkedIn) com JSON-LD e OG, e é o dono dos redirects 301 das URLs antigas do app único anterior (hub + `/portfolios/<layout>`).

## Comandos

- `npx pnpm --filter pro dev` / `build` / `start` / `lint` / `typecheck`.

## Estrutura

```
src/
  env.ts, middleware.ts, i18n/{routing,navigation,request}.ts, lib/cms-client.ts
  shared/utils/{json-ld.ts,portfolio-og-image.ts} — cópias locais
  app/
    globals.css, robots.ts, sitemap.ts
    api/{revalidate,cms-debug}/route.ts
    [locale]/{layout.tsx,page.tsx,not-found.tsx}
messages/{pt-BR,en}.json  — root key "pro"
next.config.ts            — contém os redirects 301 (ver abaixo)
```

## Redirects 301 (`next.config.ts` → `redirects()`)

| Origem | Destino |
|---|---|
| `/portfolios/minimalist/:path*` | `https://minimalist.antoniomascarenhas.com.br/:path*` |
| `/:locale/portfolios/minimalist/:path*` | idem, preservando `:locale` |
| `/portfolios/gamified/:path*` | `https://gamified.antoniomascarenhas.com.br/:path*` |
| `/:locale/portfolios/gamified/:path*` | idem, preservando `:locale` |
| `/portfolios` | `/` |
| `/:locale/portfolios` | `/:locale` |

Não mover essa lógica para middleware ou route handler — `redirects()` é declarativo, roda antes do roteamento e não compete com o matcher do middleware de i18n.

## Pipeline de dados do CMS

Igual aos outros apps — `cmsClient.getPortfolio(locale)` via `src/lib/cms-client.ts`.

## Regras deste app

- Não existe mais hub (`/portfolios`) — este app substitui essa rota. Nunca reintroduzir a lógica de seleção de layout.
- `not-found.tsx` deve sempre existir e responder 404 real (não erro de servidor) para qualquer URL antiga sem padrão de redirect conhecido.
