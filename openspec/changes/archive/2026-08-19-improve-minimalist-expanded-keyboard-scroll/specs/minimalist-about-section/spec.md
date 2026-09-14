## ADDED Requirements

### Requirement: Keyboard scrolling in expanded biography

Quando o painel expandido da biografia possuir conteúdo além da área visível, as teclas `ArrowUp` e `ArrowDown` SHALL rolar o painel na direção correspondente mesmo quando o foco estiver no controle de recolhimento ou em outro elemento interativo dentro da expansão. A tecla SHALL ser consumida somente enquanto houver conteúdo interno disponível nessa direção.

#### Scenario: Scroll expanded biography down without content focus

- **WHEN** a biografia expandida possui conteúdo abaixo do viewport e o foco está em um controle do painel, e o usuário pressiona `ArrowDown`
- **THEN** o painel da biografia avança verticalmente sem alterar a seção global ativa

#### Scenario: Scroll expanded biography up without content focus

- **WHEN** a biografia expandida possui conteúdo acima do viewport e o foco está fora do viewport de texto, e o usuário pressiona `ArrowUp`
- **THEN** o painel da biografia recua verticalmente sem alterar a seção global ativa

#### Scenario: Expanded biography keyboard boundary

- **WHEN** o painel está no topo ao pressionar `ArrowUp`, ou no fim ao pressionar `ArrowDown`
- **THEN** o scroll interno permanece no limite e o evento não produz deslocamento interno adicional
