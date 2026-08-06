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

#### Scenario: Expand transition

- **WHEN** um card é expandido
- **THEN** a animação parte da geometria compacta observada, interpola para a geometria expandida e mantém o card visualmente ancorado no contexto da lista

#### Scenario: Collapse transition

- **WHEN** um card é recolhido
- **THEN** a animação retorna à geometria compacta sem reposicionar abruptamente os cards vizinhos

### Requirement: Reusable FLIP contract

A implementação FLIP SHALL ser separada da composição específica de projetos e aceitar uma referência de elemento, estado de expansão e callbacks suficientes para ser reutilizada nas áreas Sobre e Experiência.

#### Scenario: Future section reuse

- **WHEN** outra seção Minimalist adota o mesmo contrato de expansão
- **THEN** ela pode usar a mesma infraestrutura FLIP sem duplicar a lógica de medição e interpolação

### Requirement: Reduced motion and accessibility

A expansão SHALL respeitar a configuração global de redução de movimento, manter foco e nomes acessíveis, e continuar funcional quando animações forem desabilitadas.

#### Scenario: Reduced motion

- **WHEN** a redução de movimento está ativa
- **THEN** o estado final é aplicado sem uma animação visual prolongada e o conteúdo continua acessível
