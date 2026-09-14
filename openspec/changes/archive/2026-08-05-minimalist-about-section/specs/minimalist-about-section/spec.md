## Purpose

Definir o comportamento visual e interativo da seção “Sobre” do portfólio Minimalist, preservando a navegação persistente e usando exclusivamente os dados reais do portfólio.

## ADDED Requirements

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

### Requirement: Botão Ver Mais temporariamente desabilitado

O botão `VER MAIS` SHALL permanecer visível quando houver conteúdo adicional, mas SHALL estar desabilitado e não SHALL alterar a biografia até que a animação flip seja implementada em um change posterior.

#### Scenario: Usuário tenta expandir a biografia

- **WHEN** o usuário clica ou aciona `VER MAIS` pelo teclado
- **THEN** nenhuma expansão, flip ou alteração de conteúdo ocorre e o controle informa ao navegador que está desabilitado

### Requirement: Navegação localizada e acessível

A seção SHALL fornecer labels localizados para os controles de navegação e SHALL expor estados ativos e inativos por semântica acessível, mantendo a alternância de locale dentro da mesma rota do portfólio.

#### Scenario: Troca de locale

- **WHEN** o usuário seleciona outro locale no header
- **THEN** a mesma seção é reaberta no locale selecionado com textos da interface e dados do portfólio correspondentes

#### Scenario: Navegação por teclado

- **WHEN** o usuário percorre os controles pelo teclado
- **THEN** os controles interativos possuem foco visível, nome acessível e estado coerente com a seção ativa
