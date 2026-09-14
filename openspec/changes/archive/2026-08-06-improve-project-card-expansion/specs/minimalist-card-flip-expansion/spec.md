## MODIFIED Requirements

### Requirement: FLIP continuity

A transição entre os estados compacto e expandido SHALL preservar a posição inicial e final do card por uma sequência FLIP (First, Last, Invert, Play), sem salto perceptível de layout. As transições de expansão e recolhimento SHALL ser simétricas: o FLIP do card SHALL ser a única animação de tamanho, e a área de conteúdo expandido SHALL aparecer/sumir apenas por fade de opacidade, sem animação de altura própria. Durante o recolhimento, o scroll da lista SHALL permanecer congelado na posição preservada, sem mudança de âncora do card em movimento.

#### Scenario: Expand transition

- **WHEN** um card é expandido
- **THEN** a animação parte da geometria compacta observada, interpola para a geometria expandida e mantém o card visualmente ancorado no contexto da lista

#### Scenario: Collapse transition

- **WHEN** um card é recolhido
- **THEN** a animação retorna à geometria compacta sem reposicionar abruptamente os cards vizinhos e sem deslocar o card devido à restauração de scroll

#### Scenario: Content reveal uses fade only

- **WHEN** um card expande ou recolhe
- **THEN** a área de conteúdo aparece e some somente por fade de opacidade, sem animação de altura independente do FLIP

## ADDED Requirements

### Requirement: List scroll lock while expanded

Enquanto houver um card expandido, a lista de projetos SHALL não rolar — nem por wheel do mouse, nem por teclas de navegação (ArrowUp, ArrowDown, PageUp, PageDown), nem por gestos de touch na área da lista. A área de conteúdo expandido SHALL continuar rolando nativamente quando o conteúdo ultrapassar a altura disponível.

#### Scenario: Keyboard scroll attempt while expanded

- **WHEN** um card está expandido e o usuário pressiona ArrowUp, ArrowDown, PageUp ou PageDown com foco na lista
- **THEN** o scroll da lista permanece inalterado e o evento não provoca rolagem em outro contêiner

#### Scenario: Wheel scroll while expanded

- **WHEN** um card está expandido e o usuário gira a roda do mouse sobre a lista, fora da área de conteúdo expandido
- **THEN** o scroll da lista permanece inalterado

#### Scenario: Touch scroll attempt while expanded

- **WHEN** um card está expandido e o usuário arrasta o dedo sobre a área da lista, fora da área de conteúdo expandido
- **THEN** o scroll da lista permanece inalterado

#### Scenario: Expanded content still scrolls

- **WHEN** um card está expandido e o usuário rola sobre a área de conteúdo expandido
- **THEN** somente essa área rola, enquanto header, footer e lista permanecem estáticos

### Requirement: Card focus and hover emphasis

A lista de projetos SHALL exibir destaque de hover/focus: no estado regular, todos os cards SHALL ter opacidade de 100%. Quando um card recebe hover ou foco e não há card expandido, os demais cards que interceptam a área visível da lista SHALL reduzir a opacidade para 60%, e o card ativo SHALL permanecer em 100%. Cards que não interceptam a área visível da lista SHALL não ser afetados. Os corners SHALL aparecer e desaparecer com fade suave no card ativo e SHALL permanecer ocultos enquanto houver um card expandido.

#### Scenario: Hover highlights active card

- **WHEN** o usuário passa o mouse sobre um card da lista, sem card expandido
- **THEN** os cards visíveis restantes ficam com 60% de opacidade e o card sob o cursor permanece em 100%

#### Scenario: Focus highlights active card

- **WHEN** o usuário navega por teclado e um card da lista recebe foco
- **THEN** o mesmo destaque de opacidade se aplica, mantendo o card focado em 100%

#### Scenario: Off-viewport cards unaffected

- **WHEN** um card recebe hover ou foco e há cards fora da área visível da lista
- **THEN** os cards fora do viewport permanecem com 100% de opacidade

#### Scenario: No emphasis while expanded

- **WHEN** um card está expandido
- **THEN** a lista não aplica dim de opacidade e os corners permanecem ocultos

#### Scenario: Corner fade

- **WHEN** um card recebe hover ou foco
- **THEN** seus corners aparecem suavemente, e desaparecem suavemente quando o hover ou foco termina
