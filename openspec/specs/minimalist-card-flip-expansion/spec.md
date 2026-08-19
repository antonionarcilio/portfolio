## Purpose

Define uma expansão de cards baseada em FLIP para preservar a continuidade espacial entre o estado compacto e o conteúdo completo e permitir reutilização futura em Sobre e Experiência.

## Requirements

### Requirement: Expanded card layout and content

O estado expandido SHALL seguir a composição visual do nó Figma `2130:3343`, exibindo a descrição completa do projeto a partir do campo CMS `desc`. Essa descrição SHALL ser renderizada pelo componente compartilhado `MarkdownText`, preservando parágrafos, ênfase e demais sintaxes Markdown suportadas.

O header e o footer do estado expandido SHALL permanecer fixos enquanto somente a área de conteúdo rola. Os corners SHALL permanecer ocultos enquanto o card estiver expandido, e a área de hint de navegação SHALL ser exibida somente no estado expandido.

Enquanto houver um card expandido, a navegação global por scroll SHALL ficar bloqueada, a paginação lateral por dots SHALL ficar oculta/inativa e o footer global SHALL rejeitar cliques e foco de navegação. O excerpt compacto e a âncora/status do projeto SHALL ficar ocultos no footer do card expandido.

O slot original do card expandido SHALL ser preservado no grid, sem remover ou reflowar os demais cards. O card SHALL crescer sobreposto horizontal e verticalmente até os limites do viewport e retornar ao slot original ao retrair; a área central do card ativo SHALL receber o scroll entre header e footer.

O card expandido SHALL não possuir padding próprio, a área central SHALL ter `max-height: 420px`, o viewport da lista SHALL ter `max-height: 610px`, e o gradiente/snap da lista SHALL ficar desativado durante a expansão.

#### Scenario: Expanded project content
- **WHEN** o usuário expande um projeto
- **THEN** o card apresenta o layout expandido de `2130:3343` e renderiza `desc` por meio de `MarkdownText`

#### Scenario: Expanded content scroll
- **WHEN** a descrição expandida ultrapassa a altura disponível
- **THEN** somente a área de conteúdo rola, enquanto header e footer permanecem visíveis

#### Scenario: Expanded visual details
- **WHEN** o card está expandido
- **THEN** os corners ficam ocultos, o hint de navegação fica disponível e o gradiente aparece apenas enquanto há conteúdo abaixo da posição atual

#### Scenario: Short or exhausted content
- **WHEN** o conteúdo não ultrapassa a área disponível ou o scroll chega ao fim
- **THEN** o gradiente da área de conteúdo fica oculto

### Requirement: Expansion persistence across sections

O estado expandido SHALL permanecer associado à identidade do projeto enquanto o usuário navega entre as seções do recruiter. A rolagem iniciada fora da área de conteúdo expandido SHALL continuar disponível para a navegação global e SHALL alterar a seção sem recolher o card.

#### Scenario: Navigate away from expanded card
- **WHEN** um card está expandido e o usuário rola fora da área de conteúdo do card
- **THEN** a seção global muda normalmente e o estado expandido do projeto é preservado

#### Scenario: Return to expanded project
- **WHEN** o usuário retorna à seção de projetos após navegar para outra seção
- **THEN** o mesmo projeto permanece expandido com seu conteúdo completo disponível

### Requirement: Card expansion semantics

Cada card expansível SHALL expor um controle semântico que alterna entre estado compacto e expandido, informando seu estado por `aria-expanded` e mantendo o conteúdo real do CMS.

#### Scenario: Expand card

- **WHEN** o usuário ativa o controle de um card compacto
- **THEN** o card entra no estado expandido, o conteúdo completo fica disponível e o controle informa `aria-expanded="true"`

#### Scenario: Collapse card

- **WHEN** o usuário ativa o controle de um card expandido
- **THEN** o card retorna ao estado compacto e o controle informa `aria-expanded="false"`

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

### Requirement: Reduced motion and accessibility

A expansão SHALL respeitar a configuração global de redução de movimento, manter foco e nomes acessíveis, e continuar funcional quando animações forem desabilitadas.

#### Scenario: Reduced motion

- **WHEN** a redução de movimento está ativa
- **THEN** o estado final é aplicado sem uma animação visual prolongada e o conteúdo continua acessível

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
