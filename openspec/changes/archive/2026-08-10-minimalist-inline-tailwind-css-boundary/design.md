## Context

Consulte `proposal.md` para a motivação. O estado atual combina classes utilitárias no JSX com regras locais em `src/features/minimalist/styles.css`, além de regras que sustentam temas, media queries, scroll e expansão de cards.

Arquivos primariamente afetados:

- `src/features/minimalist/styles.css`
- `src/features/minimalist/components/*.tsx`
- aliases Tailwind do bloco `@theme inline` em `src/features/minimalist/styles.css`
- testes do Minimalist em `e2e/` e eventuais verificações visuais

## Goals / Non-Goals

**Goals:**

- Tornar o JSX a fonte dos estilos simples e locais.
- Usar Tailwind/CVA para estados simples de elementos interativos.
- Reduzir seletores CSS que apenas duplicam utilitários.
- Preservar tokens, temas, responsividade e comportamento complexo.
- Validar que Gamified não sofre alterações.

**Non-Goals:**

- Reescrever toda a arquitetura visual ou alterar a composição Figma.
- Mover breakpoints arbitrários para JSX.
- Criar utilities genéricas para substituir classes locais sem necessidade.
- Alterar animações Framer Motion ou a exceção da View Transition API.

## Decisions

### Classify complete rules before migrating

Cada seletor será avaliado como unidade. Uma declaração simples será migrada somente se não depender de tema, breakpoint, pseudo-elemento, seletor ancestral, estado composto, geometria ou comportamento. Isso evita separar uma regra aparentemente simples de suas dependências.

### Use Tailwind aliases for Minimalist tokens

O JSX consumirá aliases namespaced, como `font-minimalist`, `text-minimalist-*`, `leading-minimalist-*`, `font-weight-minimalist-*` e `text-minimalist-*`. As custom properties internas continuarão em `styles.css`; aliases genéricos não serão criados.

### Use CVA for component variants

Componentes com variantes de aparência ou estado usarão CVA para compor classes base e estados simples. `clsx` ficará restrito à composição de estados runtime que não representam uma variante de design.

### Keep semantic BEM anchors where they carry meaning

Classes BEM permanecerão quando forem usadas por media queries, estado/tema, pseudo-elementos, seletores comportamentais, scripts de interação ou geometria. Um BEM que só duplica `flex`, `gap`, `p-*` ou tipografia local será removido após a migração.

### Migrate in validated batches

A migração será dividida por componente ou grupo visual: controles, navegação, cards, About, Experience, Projects e A11y. Cada lote deverá preservar a aparência nos temas, viewport estreito, estados de foco e fluxos de expansão/scroll antes do próximo lote.

### Responsive rules remain in feature CSS

As media queries continuarão em `src/features/minimalist/styles.css`, dentro do escopo BEM apropriado. Breakpoints arbitrários ou customizados não serão introduzidos diretamente em `className`.

## Risks / Trade-offs

- [Risk] Remover uma classe simples pode quebrar um seletor contextual ou uma âncora usada por JavaScript. → [Mitigation] Pesquisar consumidores CSS, JSX e scripts antes de remover o seletor.
- [Risk] Classes Tailwind podem resolver para tokens incorretos ou genéricos. → [Mitigation] Usar somente aliases namespaced e validar o CSS servido.
- [Risk] A migração pode alterar geometria de FLIP, scroll ou overflow. → [Mitigation] Manter essas regras em CSS e executar testes focados de interação após cada lote.
- [Risk] Diferenças entre light/dark e narrow viewport podem passar em revisão estática. → [Mitigation] Comparar os dois temas, viewport estreito, foco, disabled, expansão e colapso nos testes visuais/E2E.
