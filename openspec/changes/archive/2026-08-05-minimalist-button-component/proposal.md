## Why

O Minimalist atualmente possui botões nativos espalhados pela feature e não tem uma abstração independente para o componente visual `button/collapse` do Figma. Isso causa divergência entre o botão “VER MAIS” implementado e as oito combinações aprovadas de aparência e estado; agora o componente precisa ser isolado com o nome público `Button`.

## What Changes

- Criar `src/features/minimalist/components/button.tsx`, exportando o componente `Button`.
- Implementar exatamente as oito variantes do Figma `button/collapse`: `default`, `hover`, `focus` e `disable`, cada uma em `light` e `dark`.
- Reproduzir o texto, tipografia, paleta, opacidades, colchetes, espaçamento e alinhamento registrados nas variantes do nó `2099:1949`; o contorno tracejado roxo do `COMPONENT_SET` será tratado como moldura de inspeção do Figma, não como borda do botão.
- Usar comportamento semântico de botão nativo, incluindo foco acessível e estado disabled, sem inventar estados ou eixos visuais ausentes no Figma.
- Migrar os controles “VER MAIS” equivalentes para `Button`, mantendo toggles, anchors, dividers, paginação e demais controles fora deste componente.
- Validar a implementação com Playwright em estados reais de ponteiro, teclado, foco e disabled, além das rotas Minimalist e Gamified.

## Capabilities

### New Capabilities

- `minimalist-button`: Componente `Button` para o contrato visual `button/collapse` do Minimalist.

### Modified Capabilities

- `minimalist-component-system`: A família `button/collapse` passa a ser uma primitiva independente do sistema de componentes Minimalist.

## Impact

- Afeta `src/features/minimalist/components/`, `src/features/minimalist/variants.ts` e as regras correspondentes em `src/features/minimalist/styles.css`.
- Afeta somente consumidores Minimalist do controle “VER MAIS”; a superfície Gamified permanece isolada.
- Não altera APIs externas, CMS, persistência ou dependências de runtime.

## Non-goals

- Não abstrair Anchor, Divider, Toggle, Pagination, Card ou qualquer outro componente neste change.
- Não adicionar variantes `pressed`, `size`, `icon`, `loading` ou outras que não estejam no nó Figma `2099:1949`.
- Não alterar o layout, estilos, mensagens ou comportamento da superfície Gamified.
- Não criar uma nova dependência de runtime com o Figma.
