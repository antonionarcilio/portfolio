## ADDED Requirements

### Requirement: Keyboard scrolling in expanded experience

Quando o painel expandido de uma experiência possuir detalhes além da área visível, as teclas `ArrowUp` e `ArrowDown` SHALL rolar o campo de detalhes na direção correspondente mesmo quando o foco estiver no controle de recolhimento ou em outro elemento interativo dentro da expansão. A tecla SHALL ser consumida somente enquanto houver conteúdo interno disponível nessa direção, sem mudar a empresa selecionada.

#### Scenario: Scroll expanded experience down without content focus

- **WHEN** os detalhes da experiência expandida possuem conteúdo abaixo do viewport e o foco está em um controle do painel, e o usuário pressiona `ArrowDown`
- **THEN** o campo de detalhes avança verticalmente e a empresa selecionada permanece a mesma

#### Scenario: Scroll expanded experience up without content focus

- **WHEN** os detalhes da experiência expandida possuem conteúdo acima do viewport e o foco está fora do campo rolável, e o usuário pressiona `ArrowUp`
- **THEN** o campo de detalhes recua verticalmente e a empresa selecionada permanece a mesma

#### Scenario: Expanded experience keyboard boundary

- **WHEN** o campo de detalhes está no topo ao pressionar `ArrowUp`, ou no fim ao pressionar `ArrowDown`
- **THEN** o scroll interno permanece no limite e a seleção de empresa não muda
