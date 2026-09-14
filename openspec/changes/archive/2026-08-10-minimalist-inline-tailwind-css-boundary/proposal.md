## Why

O `src/features/minimalist/styles.css` ainda concentra declarações locais simples que já podem ser expressas com utilitários Tailwind no JSX. Isso dificulta identificar quais regras são comportamento visual complexo e aumenta a duplicação entre `className` e CSS.

## What Changes

- Estabelecer uma fronteira explícita entre utilitários Tailwind locais e CSS específico do Minimalist.
- Migrar para `className` declarações simples de layout, espaçamento, tipografia, alinhamento e dimensões locais.
- Aplicar estados simples (`hover`, `focus-visible`, `disabled`, `aria-expanded` e equivalentes) por Tailwind/CVA quando forem locais ao elemento.
- Manter no CSS tokens, aliases `minimalist-*`, temas, media queries, pseudo-elementos, scroll, geometria, gradients, máscaras e seletores contextuais.
- Preservar classes BEM que funcionem como âncoras de comportamento, responsividade, tema ou estado complexo.
- Remover seletores CSS somente quando não houver dependência contextual ou comportamental remanescente.
- Manter o isolamento completo entre Minimalist e Gamified.

## Non-goals

- Não alterar a aparência, responsividade ou comportamento funcional do layout.
- Não migrar breakpoints arbitrários para `className`.
- Não substituir tokens Figma ou custom properties por valores genéricos.
- Não alterar o layout Gamified.
- Não introduzir animações CSS; animações continuam sob a política existente de Framer Motion, exceto a integração documentada com View Transition API.

## Capabilities

### New Capabilities

- `minimalist-style-boundary`: Define e aplica a separação entre utilitários Tailwind/CVA locais e estilos CSS contextuais ou comportamentais do layout Minimalist.

### Modified Capabilities

- Nenhuma.

## Impact

- Componentes em `src/features/minimalist/components/`.
- `src/features/minimalist/styles.css`.
- Possíveis aliases Tailwind no bloco `@theme inline` do Minimalist.
- Testes visuais, de acessibilidade, responsividade e interação do Minimalist.
