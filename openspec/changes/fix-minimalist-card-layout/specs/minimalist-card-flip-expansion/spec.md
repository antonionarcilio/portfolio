## Purpose

Define uma expansão de cards baseada em FLIP para preservar a continuidade espacial entre o estado compacto e o conteúdo completo e permitir reutilização futura em Sobre e Experiência.

## ADDED Requirements

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
