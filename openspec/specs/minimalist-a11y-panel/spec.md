## Purpose

Oferecer no portfólio Minimalist um menu de acessibilidade visualmente fiel ao Figma, com navegação circular controlada e ativação explícita das opções disponíveis.

## Requirements

### Requirement: Accessibility panel presentation

O sistema SHALL abrir um painel de acessibilidade a partir do acionador existente do Minimalist e SHALL apresentar uma lista de opções, o detalhe da opção selecionada e um controle de ativação YES/NO. O painel SHALL expor nome, descrição e pergunta da opção no idioma ativo.

#### Scenario: Open panel

- **WHEN** a pessoa aciona o botão de acessibilidade no cabeçalho do Minimalist
- **THEN** o painel é exibido, o acionador reflete o estado aberto e a opção selecionada possui foco ou indicação equivalente de seleção

#### Scenario: Close panel

- **WHEN** a pessoa aciona novamente o botão de acessibilidade ou o controle de saída do menu
- **THEN** o painel é ocultado, o foco retorna ao acionador e o conteúdo principal deixa de ser coberto pelo painel

#### Scenario: Localized option detail

- **WHEN** uma opção é selecionada em `pt-BR` ou `en`
- **THEN** o título, a descrição, a pergunta, os rótulos YES/NO e os nomes acessíveis dos controles correspondem ao idioma ativo sem texto de interface hardcoded no componente

### Requirement: Circular pressured option navigation

O sistema SHALL permitir percorrer a lista de opções verticalmente como uma sequência circular. O sistema SHALL acumular o deslocamento do wheel até atingir um limiar configurado e SHALL mudar no máximo uma opção por gesto confirmado; deslocamentos abaixo do limiar não SHALL mudar a opção. A lista SHALL exibir gradientes de suavização no topo e na base, sem impedir a interação com seus itens. Quando uma mudança de item for efetivada por wheel ou por tecla de seta (ArrowUp/ArrowDown), o sistema SHALL solicitar a reprodução do efeito sonoro configurado, desde que os efeitos sonoros estejam habilitados e não bloqueados pelo viewport. A lista percorrida por este mecanismo SHALL incluir a opção "Efeitos sonoros" junto às cinco opções de acessibilidade existentes, sujeita ao mesmo limiar de pressão e aos mesmos limites circulares.

#### Scenario: Wheel below threshold

- **WHEN** a pessoa move o wheel verticalmente com deslocamento absoluto menor que o limiar
- **THEN** a opção atual, seu detalhe e seu estado de ativação permanecem inalterados e nenhum efeito sonoro de mudança é reproduzido

#### Scenario: Wheel confirms next item

- **WHEN** o deslocamento acumulado do wheel atinge o limiar no sentido descendente
- **THEN** a seleção avança exatamente uma opção, o detalhe correspondente é atualizado e o efeito sonoro configurado é solicitado uma vez

#### Scenario: Wheel confirms previous item

- **WHEN** o deslocamento acumulado do wheel atinge o limiar no sentido ascendente
- **THEN** a seleção retrocede exatamente uma opção, o detalhe correspondente é atualizado e o efeito sonoro configurado é solicitado uma vez

#### Scenario: Circular boundary

- **WHEN** a pessoa avança além da última opção ou retrocede antes da primeira
- **THEN** a seleção continua na opção oposta da lista sem exibir espaço vazio ou perder o detalhe selecionado, e a mudança solicita o efeito sonoro uma vez

#### Scenario: Keyboard confirms next item

- **WHEN** a pessoa pressiona a seta para baixo
- **THEN** a seleção avança exatamente uma opção, o detalhe correspondente é atualizado e o efeito sonoro configurado é solicitado uma vez

#### Scenario: Keyboard confirms previous item

- **WHEN** a pessoa pressiona a seta para cima
- **THEN** a seleção retrocede exatamente uma opção, o detalhe correspondente é atualizado e o efeito sonoro configurado é solicitado uma vez

#### Scenario: Rapid keyboard repeat plays each confirmed change

- **WHEN** a pessoa mantém pressionada ou pressiona repetidamente a tecla de seta em sucessão rápida
- **THEN** cada mudança de item confirmada solicita o efeito sonoro configurado, sem que o cooldown aplicado ao wheel suprima nenhuma dessas reproduções

### Requirement: Accessibility sound preference

O painel SHALL expor "Efeitos sonoros" como uma opção navegável da mesma lista circular usada pelas demais opções de acessibilidade, com título e descrição próprios. A opção SHALL ser alternada pelos mesmos controles YES/NO usados pelas demais opções, SHALL ser persistida junto às opções de acessibilidade, SHALL iniciar habilitada por padrão na ausência de preferência persistida e SHALL refletir o estado atual para tecnologias assistivas. Em viewports com largura menor ou igual a `32rem`, a opção SHALL permanecer visível na lista, mas SHALL ficar bloqueada: o controle de alternância SHALL impedir ativação e desativação, e a reprodução do efeito sonoro SHALL permanecer desligada nesse viewport, independentemente do valor persistido.

#### Scenario: Sound effects option in the list

- **WHEN** a pessoa navega até a opção "Efeitos sonoros" por wheel ou teclado
- **THEN** a opção é exibida com o mesmo título, descrição e formato das demais opções da lista, incluindo o marcador de seleção

#### Scenario: Disable sound effects

- **WHEN** a pessoa seleciona "Efeitos sonoros" e ativa o controle NO
- **THEN** o estado é persistido, o controle reflete "NO" para tecnologias assistivas e mudanças posteriores de seleção não iniciam áudio

#### Scenario: Re-enable sound effects

- **WHEN** a pessoa seleciona "Efeitos sonoros" e ativa o controle YES
- **THEN** o estado é persistido, o controle reflete "YES" para tecnologias assistivas e uma mudança posterior de seleção pode reproduzir o efeito configurado

#### Scenario: Restore sound preference

- **WHEN** o painel é carregado após uma preferência de som ter sido persistida
- **THEN** o estado salvo é restaurado sem tocar áudio automaticamente; na ausência de preferência persistida, a opção inicia habilitada

#### Scenario: Sound effects locked on mobile viewport

- **WHEN** a pessoa abre o painel em um viewport com largura menor ou igual a `32rem`
- **THEN** a opção "Efeitos sonoros" aparece na lista com o controle de alternância desabilitado e nenhuma mudança de seleção reproduz áudio

#### Scenario: Desktop preference stays silent after resizing into mobile

- **WHEN** a preferência de efeitos sonoros está habilitada e o viewport é redimensionado para uma largura menor ou igual a `32rem`
- **THEN** a reprodução do efeito passa a ficar bloqueada sem apagar o valor persistido, e o controle é exibido desabilitado até o viewport voltar a ultrapassar o limite

### Requirement: Keyboard and semantic interaction

O sistema SHALL oferecer a mesma navegação por teclado, SHALL expor a opção atual e o estado YES/NO a tecnologias assistivas e SHALL manter foco visível conforme o sistema de foco do Minimalist.

#### Scenario: Keyboard navigation

- **WHEN** o foco está na lista e a pessoa pressiona `ArrowDown` ou `ArrowUp`
- **THEN** a seleção muda uma posição no sentido correspondente, respeita a circularidade e anuncia o novo detalhe sem recarregar a página

#### Scenario: Toggle accessibility option on

- **WHEN** a pessoa aciona YES para uma opção desligada
- **THEN** a opção passa a ativa, YES recebe a indicação de estado atual e o efeito de acessibilidade correspondente é aplicado

#### Scenario: Toggle accessibility option off

- **WHEN** a pessoa aciona NO para uma opção ligada
- **THEN** a opção passa a inativa, NO recebe a indicação de estado atual e o efeito de acessibilidade correspondente é removido

#### Scenario: Focus and semantics

- **WHEN** a pessoa navega pelo painel usando teclado ou leitor de tela
- **THEN** o painel possui nome acessível, os controles são operáveis como botões, a opção atual é identificável e itens inativos não recebem foco interativo

### Requirement: Minimalist isolation and responsive fidelity

O sistema SHALL aplicar o painel somente ao portfólio Minimalist, SHALL manter a navegação e o cabeçalho existentes fora do painel funcionais e SHALL adaptar a composição sem overflow horizontal nos tamanhos de viewport suportados.

#### Scenario: Gamified isolation

- **WHEN** a pessoa visita o portfólio gamificado
- **THEN** nenhum painel, estilo, estado ou mensagem do painel Minimalist é carregado ou aplicado àquela rota

#### Scenario: Narrow viewport

- **WHEN** o painel é aberto em uma viewport estreita suportada
- **THEN** seus controles permanecem acessíveis, a lista e o conteúdo continuam identificáveis e não há overflow horizontal causado pelo painel

#### Scenario: Preference continuity

- **WHEN** a pessoa troca de opção, fecha e reabre o painel na mesma sessão
- **THEN** a seleção e os estados de ativação permanecem consistentes com as preferências aplicadas
