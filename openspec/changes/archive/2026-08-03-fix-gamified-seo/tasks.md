## 1. Imagem OG estática

- [x] 1.1 Converter `public/og-image.png` para `public/og-image.webp` (1200×630, qualidade 90, via ImageMagick) e remover o arquivo `public/og-image.png`
- [x] 1.2 Remover `public/portfolios/gamified/og-gamified.webp`
- [x] 1.3 Remover `scripts/generate-og.mjs` e o script `generate-og` do `package.json`, ajustando `build:local` para apenas `next build`
- [x] 1.4 Remover `.github/workflows/generate-og.yml`

## 2. Metadados da página gamified

- [x] 2.1 Em `src/app/[locale]/portfolios/gamified/page.tsx`, apontar `openGraph.images` e `twitter.images` para `/og-image.webp` (1200×630, `alt` com o nome do portfólio)

## 3. Normalização de localização

- [x] 3.1 Em `src/shared/utils/location.ts`, normalizar `addressRegion` para uppercase e `addressCountry` para ISO 3166-1 alpha-2 (mapa de nomes de país → código; valor já em código é mantido)
- [x] 3.2 Expor no utilitário a informação de se a localização está completa e válida (cidade + UF + país ISO)
- [x] 3.3 Em `page.tsx`, emitir o campo `address` do JSON-LD `PostalAddress` apenas quando a localização estiver completa e válida; caso contrário, omiti-lo

## 4. Verificação

- [x] 4.1 Rodar `npx pnpm lint`, `npx pnpm typecheck` e `npx pnpm format:check`
- [x] 4.2 Rodar `npx pnpm build` e confirmar que o build não depende de Playwright nem gera imagem OG
- [x] 4.3 Inspecionar o HTML gerado: `og:image`/`twitter:image` apontam para `/og-image.webp` e o JSON-LD `PostalAddress` contém `BR`/`MA`
