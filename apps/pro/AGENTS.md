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

## Design tokens

Todos os tokens de cor, tipografia e peso de fonte estão definidos em
`src/shared/styles/tokens.css` como `@theme` do Tailwind v4.
Eles ficam disponíveis como classes Tailwind **e** como CSS custom properties.

### Regras obrigatórias

- **Cores** — use exclusivamente as classes `bg-*`, `text-*`, `border-*`, `ring-*`,
  `fill-*`, `stroke-*` derivadas dos tokens (`bg-brand-500`, `text-grey-700`,
  `border-alpha-black-10`, etc.). Nunca escreva valores hexadecimais, `rgb()`,
  `hsl()` ou nomes CSS (`red`, `white`) diretamente em `className` ou em
  propriedades CSS inline.
- **Font family** — use `font-portfolio` ou `font-portfolio-title`. Nunca
  especifique nomes de fonte literais (`font-['Poppins']`, `fontFamily: 'Poppins'`).
- **Font size** — use as classes `text-xs` a `text-xl` e `text-display-xs` a
  `text-display-2xl`. Nunca use `text-base`, `text-2xl`, `text-3xl` etc. (escala
  padrão do Tailwind) nem valores arbitrários (`text-[16px]`).
- **Line height** — não aplique `leading-*` separadamente para os tamanhos acima;
  cada `text-*` já carrega sua `line-height` pareada via token. Use `leading-*`
  avulso apenas para sobrescrever intencionalmente em casos de layout específico.
- **Font weight** — use `font-light`, `font-regular`, `font-medium`,
  `font-semibold` ou `font-bold`. Nunca use pesos numéricos arbitrários
  (`font-[300]`) nem `font-normal` (alias Tailwind; prefira `font-regular`).
- **CSS custom properties** — quando valores precisam ser usados em CSS puro
  (`:root`, animações, pseudo-elementos), referencie via `var(--color-*)`,
  `var(--text-*)`, `var(--font-*)`. Nunca duplique valores numéricos ou hex.

### Anti-patterns proibidos

```tsx
// ❌ cor hardcoded
<div className="bg-[#FFCC00]" />
<div style={{ color: '#171615' }} />

// ❌ família de fonte literal
<p className="font-['Poppins']" />

// ❌ tamanho fora da escala de tokens
<h1 className="text-5xl" />
<p className="text-[18px]" />

// ❌ peso numérico arbitrário
<span className="font-[600]" />
```

```tsx
// ✅ correto
<div className="bg-brand-500" />
<p className="text-grey-700" />
<h1 className="text-display-lg font-bold font-portfolio-title" />
<p className="text-md font-regular font-portfolio" />
```

## Regras deste app

- Não existe mais hub (`/portfolios`) — este app substitui essa rota. Nunca reintroduzir a lógica de seleção de layout.
- `not-found.tsx` deve sempre existir e responder 404 real (não erro de servidor) para qualquer URL antiga sem padrão de redirect conhecido.
