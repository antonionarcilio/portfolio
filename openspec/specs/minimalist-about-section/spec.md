## Purpose

Definir o comportamento visual e interativo da seção “Sobre” do portfólio Minimalist, preservando a navegação persistente e usando exclusivamente os dados reais do portfólio.

## Requirements

### Requirement: Shell persistente da seção Sobre

A seção “Sobre” SHALL renderizar um header/navbar e um footer persistentes durante a navegação do modo recrutador. A área central de conteúdo SHALL ser a única região que muda ou desliza entre seções.

#### Scenario: Header e footer permanecem visíveis

- **WHEN** o usuário acessa a seção “Sobre” em viewport desktop
- **THEN** o header/navbar e o footer permanecem ancorados nas respectivas áreas superior e inferior da viewport enquanto o conteúdo central é navegado

#### Scenario: Conteúdo ocupa a região intermediária

- **WHEN** o usuário navega para outra seção pelo controle de paginação
- **THEN** somente a área central realiza o deslocamento visual, sem duplicar ou deslocar o shell persistente

### Requirement: Fidelidade visual ao artboard Sobre

A seção SHALL reproduzir a composição observável do artboard Figma `2097:20729`, incluindo fundo, largura do conteúdo, alinhamento, espaçamentos, tipografia, logo, controles de idioma/tema/acessibilidade, indicador de modo, paginação lateral, links sociais e controles de navegação do footer.

#### Scenario: Renderização em viewport de referência

- **WHEN** a seção é renderizada em viewport de 1280×826 CSS pixels
- **THEN** o conteúdo, header e footer respeitam a grade e os alinhamentos do artboard, sem overflow horizontal

#### Scenario: Tema claro e escuro

- **WHEN** o usuário alterna entre os temas disponíveis
- **THEN** a seção aplica a paleta correspondente do protótipo, mantendo contraste suficiente e a mesma geometria estrutural

### Requirement: Dados reais do portfólio

A seção SHALL exibir nome, cargo, biografia, localização e contatos derivados do objeto de portfólio carregado pelo CMS para o locale atual. A interface MUST NOT substituir esses dados por placeholders editoriais específicos da tela.

#### Scenario: Portfólio com dados completos

- **WHEN** o CMS fornece biografia, localização e contatos
- **THEN** a seção exibe esses valores no conteúdo principal e nos links correspondentes

#### Scenario: Campo opcional ausente

- **WHEN** um contato ou campo opcional não é fornecido pelo CMS
- **THEN** o campo ausente não gera link vazio, erro de renderização ou texto inventado

### Requirement: Expansão funcional da biografia

O estado compacto da seção Sobre SHALL exibir `bio.excerpt`. Quando `bio.description` contiver conteúdo além do excerpt, a seção SHALL exibir um controle de expansão que, ao ser ativado, exibe um painel cobrindo toda a área de conteúdo da seção com `bio.description` completo renderizado por `MarkdownText` (preservando parágrafos). O estado expandido SHALL expor um controle de recolhimento que retorna ao estado compacto. Quando `bio.description` não contiver conteúdo além de `bio.excerpt` (ou `bio.description` estiver ausente), a seção SHALL NOT exibir o controle de expansão.

#### Scenario: Biografia com conteúdo adicional

- **WHEN** `bio.description` contém conteúdo além de `bio.excerpt`
- **THEN** o controle de expansão é exibido no estado compacto

#### Scenario: Expandir a biografia

- **WHEN** o usuário ativa o controle de expansão pelo clique ou teclado
- **THEN** um painel cobrindo a área de conteúdo da seção é exibido, mostrando `bio.description` completo

#### Scenario: Recolher a biografia

- **WHEN** o usuário ativa o controle de recolhimento no estado expandido
- **THEN** o painel é fechado e a seção retorna ao estado compacto exibindo `bio.excerpt`

#### Scenario: Biografia sem conteúdo adicional

- **WHEN** `bio.description` é igual a `bio.excerpt` ou `bio.description` está ausente
- **THEN** nenhum controle de expansão é exibido

### Requirement: Navegação localizada e acessível

A seção SHALL fornecer labels localizados para os controles de navegação e SHALL expor estados ativos e inativos por semântica acessível, mantendo a alternância de locale dentro da mesma rota do portfólio.

#### Scenario: Troca de locale

- **WHEN** o usuário seleciona outro locale no header
- **THEN** a mesma seção é reaberta no locale selecionado com textos da interface e dados do portfólio correspondentes

#### Scenario: Navegação por teclado

- **WHEN** o usuário percorre os controles pelo teclado
- **THEN** os controles interativos possuem foco visível, nome acessível e estado coerente com a seção ativa

### Requirement: Keyboard scrolling in expanded biography

Quando o painel expandido da biografia possuir conteúdo além da área visível, as teclas `ArrowUp` e `ArrowDown` SHALL rolar o painel na direção correspondente mesmo quando o foco estiver no controle de recolhimento ou em outro elemento interativo dentro da expansão. A tecla SHALL ser consumida somente enquanto houver conteúdo interno disponível nessa direção.

#### Scenario: Scroll expanded biography down without content focus

- **WHEN** a biografia expandida possui conteúdo abaixo do viewport e o foco está em um controle do painel, e o usuário pressiona `ArrowDown`
- **THEN** o painel da biografia avança verticalmente sem alterar a seção global ativa

#### Scenario: Scroll expanded biography up without content focus

- **WHEN** a biografia expandida possui conteúdo acima do viewport e o foco está fora do viewport de texto, e o usuário pressiona `ArrowUp`
- **THEN** o painel da biografia recua verticalmente sem alterar a seção global ativa

#### Scenario: Expanded biography keyboard boundary

- **WHEN** o painel está no topo ao pressionar `ArrowUp`, ou no fim ao pressionar `ArrowDown`
- **THEN** o scroll interno permanece no limite e o evento não produz deslocamento interno adicional
