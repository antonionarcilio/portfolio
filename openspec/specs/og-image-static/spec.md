# og-image-static Specification

## Purpose

Fornece uma imagem Open Graph estática otimizada em WebP servida de `/og-image.webp`, eliminando a geração dinâmica de imagem por build na página gamified.

## Requirements

### Requirement: Imagem OG estática em WebP

O sistema DEVE (MUST) disponibilizar a imagem Open Graph da página gamified como um arquivo estático `og-image.webp` em `/public`, no formato WebP, com dimensões 1200×630, sem geração em tempo de build ou no pipeline de CI.

#### Scenario: Imagem servida sem geração dinâmica

- **WHEN** a aplicação é construída e a imagem OG é solicitada em `/og-image.webp`
- **THEN** o arquivo estático WebP é servido diretamente, sem execução de script de geração

#### Scenario: PNG de origem não persiste

- **WHEN** a otimização para WebP é concluída
- **THEN** o arquivo `public/og-image.png` é removido do repositório e nenhum asset OG permanece em formato PNG

### Requirement: Metadados referenciam a imagem estática

Os metadados de Open Graph e Twitter Card da página gamified DEVEM (MUST) apontar para `/og-image.webp`.

#### Scenario: Open Graph usa a imagem estática

- **WHEN** um crawler (ex.: Facebook/WhatsApp) solicita a página gamified
- **THEN** o `og:image` aponta para `/og-image.webp` com `width` e `height` 1200×630 e um `alt` derivado do nome do portfólio

#### Scenario: Twitter Card usa a imagem estática

- **WHEN** a página é compartilhada em plataformas que leem `twitter:card`
- **THEN** a imagem referenciada é `/og-image.webp` e o card é `summary_large_image`

### Requirement: Pipeline de geração dinâmica removido

O sistema NÃO DEVE (MUST NOT) mais conter scripts, comandos de package ou workflows de CI destinados a gerar a imagem OG dinamicamente.

#### Scenario: Nenhuma geração no build

- **WHEN** `npx pnpm build` (ou `npx pnpm build:local`) é executado
- **THEN** nenhum script de geração de OG é executado e o build não depende de Playwright

#### Scenario: CI sem geração de OG

- **WHEN** o repositório recebe um push em `main`
- **THEN** nenhum workflow de geração/commit de imagem OG é acionado

### Requirement: Imagem antiga removida

A imagem OG gerada anteriormente NÃO DEVE (MUST NOT) mais existir no repositório.

#### Scenario: Asset legado ausente

- **WHEN** o repositório é inspecionado após a mudança
- **THEN** `public/portfolios/gamified/og-gamified.webp` não existe
