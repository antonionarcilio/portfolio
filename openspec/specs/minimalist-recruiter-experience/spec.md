## Purpose

Offer a minimalist, accessible, and navigable portfolio presentation for recruiters, with full-viewport sections and consistent behavior across locales and appearances.

## Requirements

### Requirement: Profile portrait frame fidelity

The About section's portrait frame (corner brackets and image) SHALL match the reference's dimensions, corner-mark geometry, and image aspect ratio in both light and dark appearance.

#### Scenario: Portrait frame rendering

- **WHEN** the About section renders the profile portrait frame
- **THEN** its size, corner-mark length/offset, and image proportions match the reference

### Requirement: About section typography fidelity

The About section's kicker, name, role, location, and biography text SHALL match the reference's font size, weight, color, and spacing in both light and dark appearance.

#### Scenario: About content typography

- **WHEN** the About section renders its text content
- **THEN** the kicker, name+role line, location line, and biography paragraph use the font sizes, weights, and colors from the reference

### Requirement: Recruiter section experience

The minimalist recruiter route SHALL present the portfolio as an ordered set of full-viewport sections covering introduction, profile, experience, projects, skills, education, and contact. The active section SHALL occupy the central viewport and be reachable through circular wheel or explicit navigation without horizontal overflow. The projects section SHALL additionally contain an independent card viewport whose consumed scroll does not change the active global section.

#### Scenario: Section viewport contract

- **WHEN** a recruiter opens the minimalist route
- **THEN** the active section occupies the viewport without horizontal overflow and the next section can be reached through scroll or an explicit navigation control

#### Scenario: Projects card viewport

- **WHEN** the active section is projects and the user scrolls over its card viewport
- **THEN** only the adjacent card row changes while the active global section and persistent shell remain unchanged

#### Scenario: Circular section transition

- **WHEN** the user navigates beyond either endpoint of the ordered sections outside the card viewport
- **THEN** navigation wraps to the opposite endpoint and the selected section is centered in the viewport

#### Scenario: Expanded project locks global navigation
- **WHEN** a project card is expanded
- **THEN** page scroll is ignored, side dots are hidden and footer navigation is not interactive until the card is collapsed

### Requirement: Section navigation

The route SHALL expose accessible controls for moving to the previous, next, and selected sections while preserving the active section state. Previous and next navigation SHALL be circular, and the active section context SHALL remain centered after wheel, keyboard, pointer, or pagination navigation.

#### Scenario: Keyboard section change

- **WHEN** a keyboard user activates a section control or navigation hint
- **THEN** focus moves to the selected section context, the active step is updated, and the control exposes its current state to assistive technology

#### Scenario: Endpoint navigation

- **WHEN** a keyboard user activates previous on the first section or next on the last section
- **THEN** the route selects the opposite endpoint, centers that section, and leaves the navigation control enabled

#### Scenario: Wheel section change

- **WHEN** the user performs an intentional upward or downward wheel gesture over the route
- **THEN** exactly one adjacent section is selected per gesture, with endpoint wrapping and a centered final position

### Requirement: Recruiter presentation modes

The route SHALL support the minimalist light and dark appearances and SHALL keep the recruiter composition independent from the gamified layout and runtime state.

#### Scenario: Appearance change

- **WHEN** the user changes the minimalist appearance
- **THEN** all recruiter sections and controls update to the corresponding visual tokens without changing the section order or content

### Requirement: Responsive recruiter layout

The route SHALL preserve readable hierarchy and access to every section on narrow and wide viewports.

#### Scenario: Narrow viewport

- **WHEN** the route is rendered on a narrow viewport
- **THEN** content reflows within the viewport, controls remain reachable, and no section creates horizontal scrolling

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

O painel de detalhe da experiência selecionada SHALL ser expansível através do botão "Expandir" do rodapé, usando a mesma técnica de captura de geometria real e overlay (quadros "First"/"Last", quadro de seed, retorno pela mesma trajetória no recolhimento) especificada para o card expandido da seção Projetos em `minimalist-card-flip-expansion`, animando o crescimento do painel colapsado até ocupar toda a área da seção Experiências (lista + detalhe combinadas).

O cabeçalho colapsado (kicker + período), o resumo truncado (`excerpt`) e os campos expandidos (cabeçalho com aliases/modalidade, "Cargo", "Experiência", "Um pouco sobre") SHALL permanecer todos presentes na árvore DOM independentemente do estado de expansão; apenas a visibilidade de cada bloco SHALL alternar conforme o estado colapsado/expandido, sem desmontar e remontar subárvores de conteúdo distintas a cada transição. O conteúdo expandido SHALL substituir visualmente o resumo colapsado replicando o layout de campos do painel "Sobre mim": uma linha de cabeçalho com o kicker `// ` seguido de todos os `aliases` da empresa unidos por " | " à esquerda, e a modalidade de trabalho (`employment_type`) à direita quando presente; um campo "Cargo" com o cargo (`role`); um campo "Experiência" com o período; um campo "Um pouco sobre" com a descrição completa (`details`), cortada por rolagem interna com gradiente de suavização no rodapé quando excede a área visível; e um rodapé com dica de navegação e o botão "Recolher".

#### Scenario: Expand grows the panel via geometry capture

- **WHEN** a pessoa aciona o botão "Expandir" no painel de detalhe colapsado
- **THEN** o painel anima a partir da geometria observada da célula colapsada até preencher toda a área da seção Experiências, e o conteúdo expandido fica visível ao final da animação

#### Scenario: Collapsed and expanded content stay mounted

- **WHEN** o painel de detalhe alterna entre colapsado e expandido
- **THEN** o cabeçalho colapsado, o resumo truncado e os campos expandidos permanecem presentes na árvore DOM durante toda a transição, sem remontagem de subárvores de conteúdo, apenas com a visibilidade de cada bloco alternada pelo estado

#### Scenario: Expanded header shows all aliases and work mode

- **WHEN** o painel de detalhe está expandido e a experiência selecionada possui mais de um `alias` de empresa
- **THEN** o kicker exibe todos os aliases unidos por " | ", e a modalidade de trabalho é exibida alinhada à direita na mesma linha quando presente

#### Scenario: Expanded header omits missing work mode

- **WHEN** o painel de detalhe está expandido e a experiência selecionada não possui modalidade de trabalho definida
- **THEN** a linha de cabeçalho exibe apenas o kicker, sem espaço reservado vazio perceptível para a modalidade

#### Scenario: Expanded description scrolls with a gradient

- **WHEN** a descrição completa (`details`) da experiência excede a altura visível do campo "Um pouco sobre"
- **THEN** o conteúdo é rolável dentro do campo e um gradiente de suavização é exibido no rodapé enquanto houver conteúdo abaixo da posição de rolagem atual

#### Scenario: Collapse retracts the panel via geometry capture

- **WHEN** a pessoa aciona o botão "Recolher" no painel de detalhe expandido
- **THEN** o painel anima pela mesma trajetória de geometria em sentido inverso até a célula colapsada, e o conteúdo colapsado (kicker + período + resumo truncado) fica visível ao final da animação
