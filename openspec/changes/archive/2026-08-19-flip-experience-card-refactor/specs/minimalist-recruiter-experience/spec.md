## MODIFIED Requirements

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
