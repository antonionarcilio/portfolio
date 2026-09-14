## ADDED Requirements

### Requirement: Keyboard scrolling from any expanded-card focus

Quando um projeto estiver expandido e seu conteúdo ultrapassar a área disponível, as teclas `ArrowUp` e `ArrowDown` SHALL rolar a área de conteúdo do projeto na direção correspondente mesmo quando o foco estiver em outro elemento interativo pertencente à expansão. A tecla SHALL ser consumida somente enquanto houver conteúdo interno disponível nessa direção; no limite, o evento SHALL permanecer disponível para o comportamento de navegação de limite já definido.

#### Scenario: Scroll expanded project down without content focus

- **WHEN** um projeto expandido possui conteúdo abaixo do viewport e o foco está no controle de recolhimento ou em outro controle da expansão, e o usuário pressiona `ArrowDown`
- **THEN** a área de conteúdo do projeto avança verticalmente e a lista de projetos permanece estática

#### Scenario: Scroll expanded project up without content focus

- **WHEN** um projeto expandido possui conteúdo acima do viewport e o foco está fora do viewport de conteúdo, e o usuário pressiona `ArrowUp`
- **THEN** a área de conteúdo do projeto recua verticalmente e a lista de projetos permanece estática

#### Scenario: Expanded project keyboard boundary

- **WHEN** a área de conteúdo do projeto está no topo ao pressionar `ArrowUp`, ou no fim ao pressionar `ArrowDown`
- **THEN** o scroll interno não ultrapassa o limite e a navegação global não é bloqueada além do contrato existente de limite
