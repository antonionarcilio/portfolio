## Why

Na área de conteúdo (`AboutPage`) do portfólio minimalista, o tamanho das fontes, a imagem de perfil, a moldura com os cantos (frame), o botão "VER MAIS"/"EXPANDIR" e os links de contato (âncora) não são fiéis aos componentes reais do Figma — foram implementados anteriormente por aproximação visual, sem medir os valores exatos (tamanho de fonte, peso, cor, espaçamento) dos componentes `button/collapse`, `anchor`, e da moldura/imagem do bloco "Sobre". O usuário forneceu os links exatos dos 4 componentes/telas que precisam ser reconferidos.

## What Changes

- Reconstruir o componente `button/collapse` (Figma node `2099-1949`) — usado hoje como `.minimalist-recruiter__more` ("VER MAIS"/"VIEW MORE", "EXPANDIR"/"EXPAND") — com o tamanho de fonte, peso, cor e tratamento de estado (regular/hover/focus/disabled) reais do Figma.
- Reconstruir o componente `anchor` (Figma node `2101-1277`) — usado hoje como `MinimalistLink`/`.minimalist-link` (GitHub, LinkedIn, E-Mail, "Visit company") — com tamanho de fonte, cor, sublinhado e tratamento do ícone de seta (`↗`) reais do Figma.
- Corrigir a moldura de cantos (`.minimalist-recruiter__portrait`) e a imagem de perfil (Figma node `2113-3357`): dimensões, espessura/comprimento dos traços de canto e proporção da imagem.
- Corrigir a tipografia do restante do conteúdo do bloco "Sobre" (Figma node `2113-3356`): tamanho de fonte, peso, cor e espaçamento do kicker, nome+cargo, localização e biografia.
- Validar visualmente (Playwright/browser automation) o resultado contra os 4 nós do Figma, em light/dark e en/pt-BR.

## Capabilities

### New Capabilities

(nenhuma — esta mudança refina fidelidade visual de capabilities já propostas, não introduz comportamento novo)

### Modified Capabilities

<!-- minimalist-component-system e minimalist-recruiter-experience ainda não existem em openspec/specs/ (propostas por
     minimalist-portfolio-components e minimalist-recruiter-screens, ainda não arquivadas). Como não há spec canônica
     para modificar, os deltas abaixo são registrados como ADDED Requirements sob os mesmos nomes de capability,
     assim como em minimalist-header-content-parity. -->
- `minimalist-component-system`: a "Figma component fidelity" de `button/collapse` e `anchor` (requisito já proposto) ganha verificação concreta de tipografia/cor/estado contra os nós Figma `2099-1949` e `2101-1277`.
- `minimalist-recruiter-experience`: a apresentação da seção de perfil (requisito já proposto) ganha verificação concreta da moldura/imagem de perfil e da tipografia do restante do conteúdo contra os nós Figma `2113-3357` e `2113-3356`.

## Impact

- `src/features/minimalist/components/minimalist-controls.tsx` (não deve precisar de mudança estrutural — só CSS/variants)
- `src/features/minimalist/components/minimalist-links.tsx` (`MinimalistLink`)
- `src/features/minimalist/components/minimalist-recruiter.tsx` (`AboutPage`, botão "more")
- `src/features/minimalist/variants.ts` (`linkVariants`)
- `src/features/minimalist/styles.css` (`.minimalist-link`, `.minimalist-recruiter__more`, `.minimalist-recruiter__portrait`, `.minimalist-recruiter__about-copy`, `.minimalist-kicker` quando aplicado no contexto do "Sobre")
- Sem mudança de schema de dados ou API — mudança é puramente visual/CSS + ajustes pontuais de marcação.
