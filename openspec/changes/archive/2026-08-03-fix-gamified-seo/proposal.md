## Why

A página gamified (`src/app/[locale]/portfolios/gamified/page.tsx`) ainda depende de uma imagem OG gerada dinamicamente via Playwright (`scripts/generate-og.mjs` + workflow GitHub), um pipeline frágil e caro que roda a cada push em `main`. Além disso, o JSON-LD `PostalAddress` emite localização em formato inválido para SEO — país como nome por extenso ("Brasil") e estado sem padronização ("Ma") — o que prejudica o reconhecimento local pelos buscadores.

## What Changes

- Adotar a imagem estática `public/og-image.png` (1200×630) como fonte da imagem Open Graph da página gamified.
- Otimizar essa imagem para WebP (`public/og-image.webp`), reduzindo o peso de download, e remover o arquivo `.png` ao final.
- Atualizar os metadados (`openGraph.images`, `twitter.images`) para apontar para a nova imagem `/og-image.webp` em vez da gerada dinamicamente.
- Desativar/remover o pipeline de geração dinâmica de OG (`scripts/generate-og.mjs`, script `generate-og` no `package.json` e workflow `.github/workflows/generate-og.yml`) e a imagem antiga `public/portfolios/gamified/og-gamified.webp`.
- Corrigir a normalização de localização no JSON-LD: emitir `addressCountry` em ISO 3166-1 alpha-2 ("BR") e `addressRegion` em ISO 3166-2 ("MA"), normalizando a string do CMS ("São Luís, Ma - Brasil").
- Ajustar `src/shared/utils/location.ts` para mapear nomes de país/estado para códigos ISO válidos e manter o `addressLocality` correto.

## Capabilities

### New Capabilities

- `og-image-static`: imagem Open Graph estática otimizada em WebP servida de `/og-image.webp`, sem geração dinâmica por build, usada nos metadados da página gamified.
- `seo-location-normalization`: normalização da localização do CMS para códigos ISO 3166 (país alpha-2, região 3166-2) usados no JSON-LD `PostalAddress`.

### Modified Capabilities

Nenhuma — não há specs pré-existentes em `openspec/specs/`.

## Impact

- `src/app/[locale]/portfolios/gamified/page.tsx` — metadados OG/Twitter e JSON-LD.
- `src/shared/utils/location.ts` — normalização de país/estado para ISO.
- `public/og-image.png` → `public/og-image.webp` (PNG removido ao final).
- `public/portfolios/gamified/og-gamified.webp` — removido.
- `scripts/generate-og.mjs` — removido.
- `package.json` — script `generate-og` removido; `build:local` ajustado.
- `.github/workflows/generate-og.yml` — removido.
- `src/messages/en.json` e `src/messages/pt-BR.json` — apenas se o texto de localização exibido mudar.

## Non-goals

- Não alterar o layout, a estética nem o conteúdo visual da página gamified.
- Não mexer em outras páginas (`minigames/snake`, homepage).
- Não adicionar novas rotas ou funcionalidades de SEO (ex.: breadcrumbs, FAQ).
- Não alterar a fonte dos dados do CMS (a string de localização continua vinda do `index.md`).
