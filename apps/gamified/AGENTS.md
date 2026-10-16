## App `gamified`

Layout gamificado do portfólio, publicado em `gamified.antoniomascarenhas.com.br`. Rotas: `/{locale}` (página principal), `/{locale}/minigames/snake` (easter egg).

## Comandos

- `npx pnpm --filter gamified dev` — modo dev (Turbopack).
- `npx pnpm --filter gamified build` / `start` — build e start de produção.
- `npx pnpm --filter gamified lint` / `typecheck` — lint e checagem de tipos isolados deste app.

## Estrutura

```
src/
  env.ts, middleware.ts, i18n/{routing,navigation,request}.ts
  lib/cms-client.ts
  shared/               — cópias locais de utilitários compartilhados com `minimalist`
                          (a11y/store.ts, markdown-text.tsx, json-ld.ts, portfolio-og-image.ts,
                          styles/a11y.css) + componentes exclusivos deste app (dropdown-base,
                          modal-base, overlay-base, svg-icon, tooltip-base, use-is-mobile,
                          cloudinary-url)
  features/
    gamified/**          — UI do layout gamificado
    minigame/snake/**     — easter egg, autocontido (sem imports cross-cutting)
  app/
    globals.css, robots.ts, sitemap.ts
    api/{revalidate,cms-debug}/route.ts
    [locale]/{layout.tsx,page.tsx,not-found.tsx,minigames/snake/page.tsx}
messages/{pt-BR,en}.json  — root keys "gamified" e "minigame"
```

## Pipeline de dados do CMS

Igual ao `minimalist` — ver `src/lib/cms-client.ts` e o pacote `portfolio-cms-client`. Nunca importar os pacotes `portfolio-content-model`/`portfolio-cms-client` por caminho relativo.

## i18n

Root keys `"gamified"` (página principal) e `"minigame"` (snake). `useTranslations('gamified.<namespace>')` / `useTranslations('minigame.snake')`.

## Regras deste app

- A rota do minigame é **`/minigames/snake`** (plural) — decisão confirmada explicitamente durante a migração, não renomear para singular mesmo que outra documentação sugira o contrário.
- A fonte Chakra Petch e o `A11yProvider` ficam escopados à página principal (`[locale]/page.tsx`), não ao layout — `minigames/snake` nunca os recebeu e deve continuar sem eles, para preservar o comportamento original.
- Paridade total com o estado pré-migração é obrigatória.
