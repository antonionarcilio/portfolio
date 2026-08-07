## ADDED Requirements

### Requirement: Experience list circular navigation

A seção Experiências SHALL apresentar as empresas de `data.experience` em uma lista de janela circular (5 itens visíveis, item selecionado destacado com marcador `➤`, gradientes de suavização no topo e na base), reaproveitando o mesmo mecanismo de navegação circular por wheel e teclado (`ArrowUp`/`ArrowDown`) já usado pelo painel de acessibilidade, com o mesmo limiar de pressão e mudança de no máximo um item por gesto confirmado. Uma mudança de empresa confirmada por wheel ou teclado SHALL tocar o mesmo efeito sonoro de confirmação usado pela lista do painel de acessibilidade.

#### Scenario: Company list rendering

- **WHEN** a seção Experiências é exibida e há duas ou mais empresas em `data.experience`
- **THEN** a lista mostra uma janela de até 5 itens centrada na empresa selecionada, com o marcador `➤` e destaque tipográfico apenas no item selecionado, e gradientes de topo/base quando há itens fora da janela

#### Scenario: Wheel confirms next company

- **WHEN** o deslocamento acumulado do wheel sobre a lista de experiências atinge o limiar no sentido descendente
- **THEN** a seleção avança exatamente uma empresa, o painel de detalhe é atualizado para a empresa correspondente, e o efeito sonoro de confirmação toca

#### Scenario: Wheel confirms previous company

- **WHEN** o deslocamento acumulado do wheel sobre a lista de experiências atinge o limiar no sentido ascendente
- **THEN** a seleção retrocede exatamente uma empresa, o painel de detalhe é atualizado para a empresa correspondente, e o efeito sonoro de confirmação toca

#### Scenario: Keyboard navigation

- **WHEN** a lista de experiências está com foco e a pessoa pressiona `ArrowDown` ou `ArrowUp`
- **THEN** a seleção muda uma posição no sentido correspondente, respeita a circularidade, atualiza o detalhe exibido, e o efeito sonoro de confirmação toca

#### Scenario: Circular boundary

- **WHEN** a pessoa avança além da última empresa ou retrocede antes da primeira
- **THEN** a seleção continua na empresa oposta da lista sem espaço vazio nem perda do detalhe selecionado

#### Scenario: Single company

- **WHEN** `data.experience` contém exatamente uma empresa
- **THEN** a lista exibe apenas essa empresa já selecionada, sem controles de navegação circular ativos e sem efeito sonoro ao renderizar

### Requirement: Experience detail layout fidelity

O painel de detalhe da experiência selecionada, no estado colapsado, SHALL exibir, nesta ordem: uma linha com o kicker da empresa (`// Empresa`) à esquerda e o período (data de início–fim ou "atual") à direita, e o texto-resumo (`excerpt`) da experiência truncado em até 10 linhas via corte de texto (`line-clamp`), sem gradiente de suavização.

#### Scenario: Kicker and period row

- **WHEN** uma empresa é selecionada na lista de experiências
- **THEN** o painel de detalhe exibe o kicker `// Empresa` alinhado à esquerda e o período correspondente alinhado à direita, na mesma linha

#### Scenario: Long excerpt is line-clamped

- **WHEN** o texto-resumo da experiência selecionada excede 10 linhas
- **THEN** o conteúdo é truncado ao final da décima linha via `line-clamp`, sem reticências visíveis, sem gradiente e sem corte abrupto de uma palavra

### Requirement: Experience detail expansion

O painel de detalhe da experiência selecionada SHALL ser expansível através do botão "Expandir" do rodapé, usando a técnica FLIP (Framer Motion `layout`/`layoutId`) para animar o crescimento do painel colapsado até ocupar toda a área da seção Experiências (lista + detalhe combinadas), reaproveitando o mesmo padrão de captura de geometria e overlay já usado pelo card expandido da seção Projetos. O conteúdo expandido SHALL substituir o resumo colapsado pela seguinte estrutura, replicando o layout de campos do painel "Sobre mim": uma linha de cabeçalho com o kicker `// ` seguido de todos os `aliases` da empresa unidos por " | " à esquerda, e a modalidade de trabalho (`employment_type`) à direita quando presente; um campo "Cargo" com o cargo (`role`); um campo "Experiência" com o período; um campo "Um pouco sobre" com a descrição completa (`details`), cortada por rolagem interna com gradiente de suavização no rodapé quando excede a área visível; e um rodapé com dica de navegação e o botão "Recolher".

#### Scenario: Expand grows the panel via FLIP

- **WHEN** a pessoa aciona o botão "Expandir" no painel de detalhe colapsado
- **THEN** o painel anima via FLIP do tamanho/posição colapsados até preencher toda a área da seção Experiências, e o conteúdo expandido é exibido ao final da animação

#### Scenario: Expanded header shows all aliases and work mode

- **WHEN** o painel de detalhe está expandido e a experiência selecionada possui mais de um `alias` de empresa
- **THEN** o kicker exibe todos os aliases unidos por " | ", e a modalidade de trabalho é exibida alinhada à direita na mesma linha quando presente

#### Scenario: Expanded header omits missing work mode

- **WHEN** o painel de detalhe está expandido e a experiência selecionada não possui modalidade de trabalho definida
- **THEN** a linha de cabeçalho exibe apenas o kicker, sem espaço reservado vazio perceptível para a modalidade

#### Scenario: Expanded description scrolls with a gradient

- **WHEN** a descrição completa (`details`) da experiência excede a altura visível do campo "Um pouco sobre"
- **THEN** o conteúdo é rolável dentro do campo e um gradiente de suavização é exibido no rodapé enquanto houver conteúdo abaixo da posição de rolagem atual

#### Scenario: Collapse retracts the panel via FLIP

- **WHEN** a pessoa aciona o botão "Recolher" no painel de detalhe expandido
- **THEN** o painel anima via FLIP de volta ao tamanho/posição colapsados, e o conteúdo colapsado (kicker + período + resumo truncado) é exibido ao final da animação
