## Why

Em viewports mobile, a composição atual do menu de acessibilidade ocupa espaço e mantém uma estrutura de lista/detalhe que não aproveita bem o fluxo vertical disponível. Um acordeão torna cada funcionalidade mais clara e reduz a densidade visual, mantendo descrição, questionamento e controles acessíveis no contexto da opção expandida.

## What Changes

- Adaptar o painel de acessibilidade do Minimalist para um layout de acordeão em viewports mobile.
- Representar cada funcionalidade com um `summary`/cabeçalho semântico: ícone plus à esquerda e nome da funcionalidade à direita.
- Rotacionar o ícone plus em 45 graus quando a funcionalidade estiver expandida, comunicando visualmente o estado aberto.
- Manter na área expandida somente a descrição, o questionamento e as alternativas/toggles já existentes para a funcionalidade.
- Remover do conteúdo expandido mobile o header `//...`, sem alterar o conteúdo funcional ou a localização das alternativas/toggles.
- Preservar a navegação, os estados persistidos, a semântica de acessibilidade e o comportamento do painel fora do layout mobile.

## Non-goals

- Não redesenhar o painel para desktop.
- Não alterar as funcionalidades de acessibilidade, suas preferências, textos traduzidos ou regras de bloqueio por viewport.
- Não modificar o acionador, o fechamento do painel, a navegação do portfólio ou o painel equivalente do Gamified.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `minimalist-a11y-panel`: adaptar a apresentação responsiva mobile do painel para acordeão, incluindo cabeçalho semântico, indicador de expansão e conteúdo reduzido sem o header `//...`.

## Impact

- Componentes e estilos do painel de acessibilidade do Minimalist, especialmente a composição da lista de funcionalidades e da área de detalhe em viewports mobile.
- Especificação existente `openspec/specs/minimalist-a11y-panel/spec.md`, com novos requisitos/scenarios de apresentação responsiva.
- Testes de interação e acessibilidade mobile, incluindo expansão/recolhimento, estado visual do plus, conteúdo do detalhe, foco/teclado e ausência de overflow horizontal.
- Nenhuma API externa, dependência ou contrato de persistência será alterado.
