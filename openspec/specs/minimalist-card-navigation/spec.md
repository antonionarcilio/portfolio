## Purpose

Define uma navegação de cards previsível e visualmente suave dentro da seção de projetos Minimalist, sem competir com a navegação global entre seções.

## Requirements

### Requirement: Linear card viewport

A área de projetos SHALL apresentar os cards em uma sequência linear no eixo de navegação definido pelo layout aprovado, com cada linha de cards sendo uma unidade navegável.

#### Scenario: Card sequence renders

- **WHEN** a seção de projetos contém um ou mais projetos
- **THEN** os cards são exibidos na ordem dos dados reais e cada linha ocupa uma posição determinística na sequência

### Requirement: Card snap navigation

O gesto de rolagem sobre a área de cards SHALL avançar ou retroceder exatamente uma linha por vez e SHALL terminar alinhado à linha selecionada, usando snap consistente com a direção do gesto.

#### Scenario: Next card row

- **WHEN** o usuário faz uma rolagem intencional para baixo sobre a área de cards
- **THEN** somente a próxima linha é selecionada e o viewport termina alinhado a ela

#### Scenario: Previous card row

- **WHEN** o usuário faz uma rolagem intencional para cima sobre a área de cards
- **THEN** somente a linha anterior é selecionada e o viewport termina alinhado a ela

#### Scenario: Card boundary

- **WHEN** o usuário tenta ultrapassar o primeiro ou o último item da lista
- **THEN** a lista permanece no limite correspondente sem alterar a seção global

### Requirement: Isolated card scrolling

A rolagem iniciada e consumida pela área de cards SHALL NOT alterar a seção global ativa nem deslocar o shell persistente do recruiter.

#### Scenario: Wheel over cards

- **WHEN** o ponteiro está sobre a área navegável de cards e o usuário faz uma rolagem
- **THEN** o gesto é consumido pela sequência de cards enquanto houver uma linha adjacente disponível

#### Scenario: Global section navigation outside cards

- **WHEN** o usuário rola fora da área de cards
- **THEN** a navegação global continua selecionando uma seção por gesto conforme o contrato existente

### Requirement: Hidden scrollbar and soft list ending

A área de cards SHALL ocultar visualmente a scrollbar sem remover a capacidade de navegação por teclado, roda, touch ou controles semânticos, e SHALL aplicar um gradiente no final visível da lista para evitar um corte seco.

#### Scenario: Scrollbar presentation

- **WHEN** a lista de cards é renderizada em um navegador compatível
- **THEN** nenhuma barra de rolagem visível ocupa o layout, mas a área permanece rolável e acessível

#### Scenario: End gradient

- **WHEN** o final da lista se aproxima do limite visível
- **THEN** o conteúdo desaparece gradualmente sob o gradiente, sem encobrir controles essenciais do último card
