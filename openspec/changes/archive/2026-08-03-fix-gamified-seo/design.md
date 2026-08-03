## Context

Ver proposal.md — Why. Estado atual relevante:

- `public/og-image.png` (1200×630, 29 KB) já existe e foi preparado como imagem OG estática; precisa virar WebP e o PNG deve sumir.
- `src/app/[locale]/portfolios/gamified/page.tsx` referencia hoje `public/portfolios/gamified/og-gamified.webp` (gerado por `scripts/generate-og.mjs` + workflow `generate-og.yml`, que rodam Playwright no CI e no `build:local`).
- `src/shared/utils/location.ts` só aplica regex para separar `cidade, UF - país`, sem normalizar para ISO; `page.tsx` monta `PostalAddress` sempre, mesmo com campos vazios.
- Produção é 100% estática (build-time fetch); nenhuma geração de imagem deve depender de runtime.
- WebP 1200×630 de qualidade 90 via ImageMagick fica em ~3,7 KB (vs 29 KB do PNG) — conversão comprovada localmente.

## Goals / Non-Goals

**Goals:**
- Imagem OG estática, leve e commitada, sem pipeline de geração.
- JSON-LD `PostalAddress` com códigos ISO 3166 válidos (país alpha-2, estado 3166-2), emitido só quando completo e válido.
- Zerar dependência de Playwright para build/CI.

**Non-Goals:**
- Não automatizar a conversão WebP em build/CI (é conversão pontual, commitada).
- Não adicionar suporte genérico a todos os países — só o que o CMS pode emitir (mapa pequeno e extensível).
- Não alterar o texto visível de localização nas traduções.

## Decisions

**D1 — Conversão pontual com ImageMagick, sem script persistente.**
`public/og-image.png` → `public/og-image.webp` (qualidade 90, 1200×630) gerado uma vez e commitado; PNG removido. Alternativa considerada: manter um script de conversão no repo — rejeitada por não haver necessidade recorrente; o pipeline antigo é justamente o que se quer eliminar.

**D2 — Remover todo o pipeline de geração dinâmica.**
Apagar `scripts/generate-og.mjs`, `public/portfolios/gamified/og-gamified.webp`, o script `generate-og` do `package.json`, ajustar `build:local` para `next build` e remover `.github/workflows/generate-og.yml`. Alternativa: manter o script para regeneração manual — rejeitada: a imagem agora é estática e não precisa de regeneração.

**D3 — Metadados apontam para `/og-image.webp`.**
Em `page.tsx`, `openGraph.images` e `twitter.images` passam a usar `{ url: '/og-image.webp', width: 1200, height: 630, alt: name }`. Alternativa: usar o API route `opengraph-image` do Next — rejeitada: exige renderização dinâmica por build e reintroduz complexidade desnecessária.

**D4 — Normalização de localização com mapa de países + uppercase de região.**
Em `src/shared/utils/location.ts`:
- Manter a regex atual de parse.
- `addressRegion`: sempre `toUpperCase()`.
- `addressCountry`: se já for código alpha-2 (2 letras) → uppercase; senão consultar mapa (ex.: `Brasil`/`Brazil` → `BR`); se não mapeado → sinalizar como inválido.
- Retornar também um flag `isComplete`/expor uma função de validação, para `page.tsx` emitir `PostalAddress` **apenas** quando `addressLocality`, `addressRegion` e `addressCountry` estiverem todos presentes e válidos.
Alternativas consideradas: `Intl.DisplayNames` reverso (não resolve nome→código de forma confiável no Node), biblioteca `i18n-iso-countries` (dependência a mais para um caso único).

**D5 — `page.tsx` condiciona o bloco `address` do JSON-LD.**
Se a localização parseada não for completa/válida, o campo `address` é omitido do objeto `jsonLd` (spec: não emitir `PostalAddress` incompleto). Alternativa: emitir com campos vazios — rejeitada (comportamento atual, inválido para buscadores).

## Risks / Trade-offs

- [Crawler com cache antigo da URL `/portfolios/gamified/og-gamified.webp`] → URL é removida; og:image passa a apontar para `/og-image.webp`; plataformas re-crawl em novo compartilhamento.
- [Mapa de países incompleto para um país novo no CMS] → `address` é omitido (sem JSON-LD inválido) e o mapa é facilmente extensível; impacto aceitável.
- [Qualidade WebP percebida menor que PNG] → qualidade 90 em 1200×630 mantém fidelidade visual (verificado localmente em ~3,7 KB).
- [Remover `build:local` com `generate-og` pode quebrar quem usa o comando] → verificar uso em docs/CI antes de remover; comportamento de `next build` permanece.

## Migration Plan

1. Converter e commitar `public/og-image.webp`; remover `public/og-image.png` e `public/portfolios/gamified/og-gamified.webp`.
2. Atualizar `page.tsx` (metadados + JSON-LD condicional) e `location.ts` (normalização ISO).
3. Remover script/workflow e ajustar `package.json`.
4. Rodar `npx pnpm lint`, `npx pnpm typecheck`, `npx pnpm format:check` e um build local para validar.
5. Rollback: reverter o commit — o pipeline antigo pode ser restaurado do histórico (Playwright segue em `devDependencies`).

## Open Questions

Nenhuma.
