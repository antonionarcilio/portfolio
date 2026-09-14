## Why

O `Value.tokens.json` já define a referência de tipografia do portfólio, mas o Minimalist ainda expõe poucos tokens ao Tailwind e mantém muitos estilos simples de tipografia, alinhamento e composição em `styles.css`. É necessário criar uma camada de aliases Tailwind previsível e concluir a migração incremental sem misturar tokens, variantes CVA e estilos contextuais.

## What Changes

- Expor fonte, tamanhos, pesos, line-heights e cores semânticas do Minimalist por aliases `@theme inline` com namespace `minimalist`.
- Usar os aliases no JSX para tipografia, cores, display, flex/grid, alinhamento, gaps, espaçamento e dimensões locais simples.
- Manter as custom properties `--minimalist-*` como fonte interna dos valores e da troca light/dark.
- Migrar incrementalmente os estilos simples restantes de `src/features/minimalist/styles.css` por famílias visuais.
- Manter CVA para variantes de aparência, estado e variante dos componentes.
- Preservar no CSS breakpoints, pseudo-elementos, gradientes, overflow, layering, geometrias compostas, estados contextuais e efeitos visuais.
- Documentar a exceção dos keyframes da View Transition API; animações novas continuam em Framer Motion.
- Auditar a rota Minimalist e confirmar que o Gamified permanece isolado.

## Non-goals

- Não alterar o Gamified, suas rotas, componentes, mensagens ou estilos.
- Não usar aliases genéricos como `text-sm` ou `font-regular` que possam alterar utilities globais de outras features.
- Não criar componentes genéricos apenas para aplicar uma fonte, cor ou tamanho.
- Não substituir CVA por mapas paralelos ou ternários de classes para variantes de design.
- Não migrar regras responsivas para variantes arbitrárias de breakpoint no JSX.
- Não alterar intencionalmente a aparência, navegação, acessibilidade, CMS ou comportamento do Minimalist.

## Capabilities

### New Capabilities

- `minimalist-token-aliases-and-css-audit`: Define aliases Tailwind derivados dos tokens do portfólio e a fronteira de responsabilidade entre JSX, CVA e CSS contextual no Minimalist.

### Modified Capabilities

- Nenhuma. Os contratos existentes de `minimalist-design-tokens` e dos componentes permanecem válidos; esta mudança adiciona a camada de consumo inline e o processo de auditoria.

## Impact

- `Value.tokens.json`, como referência dos tokens de tipografia.
- `src/features/minimalist/styles.css`, para aliases `@theme inline`, tokens internos e remoção seletiva de regras redundantes.
- `src/features/minimalist/components/**/*.tsx`, para consumo inline dos aliases e utilities locais.
- `CLAUDE.md`, para esclarecer a convenção de aliases, CVA, utilities e exceção de View Transition.
- Testes e checagens visuais Minimalist, com regressão da rota Gamified.
