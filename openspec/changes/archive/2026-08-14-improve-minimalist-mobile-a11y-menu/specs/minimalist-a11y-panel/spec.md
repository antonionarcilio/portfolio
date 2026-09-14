## MODIFIED Requirements

### Requirement: Accessibility panel presentation

O sistema SHALL abrir um painel de acessibilidade a partir do acionador existente do Minimalist e SHALL apresentar uma lista de opções, o detalhe da opção selecionada e um controle de ativação YES/NO. O painel SHALL expor nome, descrição e pergunta da opção no idioma ativo. Em viewports mobile suportados, o painel SHALL apresentar cada funcionalidade como uma seção de acordeão; seu cabeçalho semântico SHALL exibir o ícone plus à esquerda e o nome da funcionalidade à direita. Quando a seção estiver expandida, o ícone SHALL estar rotacionado 45 graus e a área de conteúdo SHALL conter somente a descrição, o questionamento e as alternativas/toggles da funcionalidade, sem o header `//...`.

#### Scenario: Open panel

- **WHEN** a pessoa aciona o botão de acessibilidade no cabeçalho do Minimalist
- **THEN** o painel é exibido, o acionador reflete o estado aberto e a opção selecionada possui foco ou indicação equivalente de seleção

#### Scenario: Close panel

- **WHEN** a pessoa aciona novamente o botão de acessibilidade ou o controle de saída do menu
- **THEN** o painel é ocultado, o foco retorna ao acionador e o conteúdo principal deixa de ser coberto pelo painel

#### Scenario: Localized option detail

- **WHEN** uma opção é selecionada em `pt-BR` ou `en`
- **THEN** o título, a descrição, a pergunta, os rótulos YES/NO e os nomes acessíveis dos controles correspondem ao idioma ativo sem texto de interface hardcoded no componente

#### Scenario: Mobile accordion summary

- **WHEN** o painel é exibido em uma viewport mobile suportada
- **THEN** cada funcionalidade é apresentada em uma seção de acordeão com o ícone plus à esquerda e o nome da funcionalidade à direita em seu cabeçalho semântico

#### Scenario: Mobile accordion expansion indicator

- **WHEN** a pessoa expande uma funcionalidade no painel mobile
- **THEN** o ícone plus correspondente é rotacionado 45 graus e a seção expõe seu conteúdo associado

#### Scenario: Mobile detail content

- **WHEN** uma funcionalidade está expandida no painel mobile
- **THEN** a área de conteúdo contém a descrição, o questionamento e as alternativas/toggles existentes da funcionalidade, e não contém o header `//...`

#### Scenario: Desktop presentation remains available

- **WHEN** o painel é exibido fora do layout mobile
- **THEN** a apresentação desktop existente permanece disponível, incluindo sua lista/detalhe e o comportamento funcional já especificado
