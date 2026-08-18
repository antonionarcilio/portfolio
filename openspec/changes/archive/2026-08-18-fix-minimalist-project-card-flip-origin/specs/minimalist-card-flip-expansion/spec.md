## MODIFIED Requirements

### Requirement: FLIP continuity

A transição entre os estados compacto e expandido SHALL preservar a posição inicial e final do card por uma sequência FLIP (First, Last, Invert, Play), sem salto perceptível de layout.

O quadro "First" SHALL ser a geometria observada da célula ocupada pelo card no momento da interação — sua posição **e** seu tamanho — para qualquer linha, qualquer coluna e qualquer `scrollTop` da lista. O quadro "Last" SHALL ser a área visível da lista. Em nenhum ponto da transição o card SHALL assumir uma origem fixa da lista (por exemplo, o canto superior esquerdo) que não corresponda à sua própria célula.

Durante toda a transição as quatro bordas do card SHALL interpolar monotonicamente entre as bordas do quadro "First" e as do quadro "Last": uma borda que já coincide nos dois quadros SHALL permanecer ancorada, e as demais SHALL se afastar simultaneamente, sem que largura e altura se completem antes da posição. O recolhimento SHALL ser a inversão exata desse percurso.

As transições de expansão e recolhimento SHALL ser simétricas: o FLIP do card SHALL ser a única animação de tamanho, e a área de conteúdo expandido SHALL aparecer/sumir apenas por fade de opacidade, sem animação de altura própria. Durante o recolhimento, o scroll da lista SHALL permanecer congelado na posição preservada, sem mudança de âncora do card em movimento.

#### Scenario: Expand transition

- **WHEN** um card é expandido
- **THEN** a animação parte da geometria compacta observada, interpola para a geometria expandida e mantém o card visualmente ancorado no contexto da lista

#### Scenario: Expand from any grid cell

- **WHEN** um card fora da célula superior esquerda (coluna direita, linha inferior ou centro do grid) é expandido
- **THEN** o primeiro quadro da animação coincide com o retângulo que o card ocupava no grid, e as bordas se afastam progressivamente até a área visível da lista — sem que o card seja reposicionado na origem do grid

#### Scenario: Anchored edge stays put

- **WHEN** um card da coluna direita é expandido e sua borda direita já coincide com a borda direita da lista
- **THEN** a borda direita permanece imóvel durante toda a transição, enquanto as bordas esquerda, superior e inferior se afastam simultaneamente

#### Scenario: Expand with the list scrolled

- **WHEN** a lista de projetos está rolada e um card visível é expandido
- **THEN** o primeiro quadro coincide com a posição visível do card e o card cresce até a área visível da lista, sem salto vertical proporcional ao `scrollTop`

#### Scenario: Collapse transition

- **WHEN** um card é recolhido
- **THEN** a animação retorna à geometria compacta sem reposicionar abruptamente os cards vizinhos e sem deslocar o card devido à restauração de scroll

#### Scenario: Collapse mirrors expand

- **WHEN** um card fora da célula superior esquerda é recolhido
- **THEN** a animação percorre o mesmo caminho da expansão em sentido inverso, terminando exatamente no retângulo da célula original

#### Scenario: Content reveal uses fade only

- **WHEN** um card expande ou recolhe
- **THEN** a área de conteúdo aparece e some somente por fade de opacidade, sem animação de altura independente do FLIP

### Requirement: Reusable FLIP contract

A implementação FLIP SHALL ser separada da composição específica de projetos e aceitar uma referência de elemento, estado de expansão e callbacks suficientes para ser reutilizada nas áreas Sobre e Experiência.

A duração e a curva de easing da expansão SHALL ser definidas em um único ponto compartilhado pela feature Minimalist, e SHALL ser as mesmas para expandir e recolher em todas as áreas que adotem o contrato.

#### Scenario: Future section reuse

- **WHEN** outra seção Minimalist adota o mesmo contrato de expansão
- **THEN** ela pode usar a mesma infraestrutura FLIP sem duplicar a lógica de medição e interpolação

#### Scenario: Single source for timing

- **WHEN** a duração ou o easing da expansão é alterado
- **THEN** a mudança se aplica a todas as áreas que usam o contrato, sem edição de valores literais espalhados por componentes
