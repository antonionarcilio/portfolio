## Purpose

Estende a linguagem de efeitos sonoros validada no menu de acessibilidade para os demais controles interativos do layout Minimalist — switches, botões de abrir/fechar/expandir e âncoras — reaproveitando o catálogo e o controlador já existentes.

## Requirements

### Requirement: Switch click sound

O sistema SHALL solicitar a reprodução de `clear-mouse-clicks.wav` sempre que um switch do Minimalist for ativado por clique — incluindo `ThemeToggle`, `I18nToggle`, `ModeToggle` (R|C) e os botões YES/NO usados nos toggles de opção — desde que os efeitos sonoros estejam habilitados e o viewport não esteja bloqueado. Um switch desabilitado (`disabled`) SHALL NOT solicitar reprodução.

#### Scenario: Enabled switch click plays sound

- **WHEN** a pessoa clica em um switch habilitado (tema, idioma, modo ou uma opção YES/NO)
- **THEN** o efeito `clear-mouse-clicks.wav` é solicitado uma vez

#### Scenario: Disabled switch click plays no sound

- **WHEN** a pessoa clica em um switch desabilitado
- **THEN** nenhum efeito sonoro é solicitado

### Requirement: Trigger open, close, and expand sound

O sistema SHALL solicitar a reprodução de `mouse-click-close.wav` ao abrir o menu de acessibilidade, ao fechá-lo pelo controle de saída, e ao expandir ou retrair um card de projeto, desde que os efeitos sonoros estejam habilitados e o viewport não esteja bloqueado.

#### Scenario: Opening the accessibility menu plays sound

- **WHEN** a pessoa aciona o botão que abre o menu de acessibilidade
- **THEN** o efeito `mouse-click-close.wav` é solicitado uma vez

#### Scenario: Closing the accessibility menu plays sound

- **WHEN** a pessoa aciona o controle de saída do menu de acessibilidade
- **THEN** o efeito `mouse-click-close.wav` é solicitado uma vez

#### Scenario: Expanding or retracting a project card plays sound

- **WHEN** a pessoa aciona o controle de expansão de um card de projeto, seja para expandir ou para retrair
- **THEN** o efeito `mouse-click-close.wav` é solicitado uma vez

### Requirement: Anchor click sound

O sistema SHALL solicitar a reprodução de `fast-double-click-on-mouse.wav` ao ativar uma âncora habilitada do Minimalist, desde que os efeitos sonoros estejam habilitados e o viewport não esteja bloqueado. Uma âncora desabilitada (`disabled`/`aria-disabled`) SHALL NOT solicitar reprodução, e a navegação da âncora SHALL NOT ser adiada para aguardar o efeito terminar.

#### Scenario: Enabled anchor click plays sound

- **WHEN** a pessoa clica em uma âncora habilitada
- **THEN** o efeito `fast-double-click-on-mouse.wav` é solicitado e a navegação prossegue sem aguardar o efeito terminar

#### Scenario: Disabled anchor click plays no sound

- **WHEN** a pessoa clica em uma âncora desabilitada
- **THEN** nenhum efeito sonoro é solicitado

### Requirement: Section change sound

O sistema SHALL solicitar a reprodução de `plastic-bubble-click.wav` sempre que a seção ativa do recrutador (Sobre, Projetos, Experiência, Educação) for efetivamente alterada — pelos pontos de paginação lateral, pelo switch de página do rodapé, por wheel ou por tecla de seta (ArrowLeft/ArrowRight) —, desde que os efeitos sonoros estejam habilitados e o viewport não esteja bloqueado. O switch de página do rodapé é uma instância de `MinimalistSwitchBtn` e, antes desta mudança, já solicita `clear-mouse-clicks.wav` em todo clique (requisito "Switch click sound"). Quando a mudança for efetivada por esse switch, o efeito de switch SHALL NOT ser solicitado nesse clique; apenas o efeito de mudança de seção soa — o switch do rodapé passa a ser a única instância de `MinimalistSwitchBtn` sem o som de switch padrão.

#### Scenario: Side pagination dot confirms section change

- **WHEN** a pessoa clica em um ponto de paginação lateral que representa uma seção diferente da ativa
- **THEN** a seção ativa muda e o efeito `plastic-bubble-click.wav` é solicitado uma vez

#### Scenario: Footer switch confirms section change without a duplicate switch sound

- **WHEN** a pessoa clica no switch de página do rodapé que representa uma seção diferente da ativa
- **THEN** a seção ativa muda, o efeito `plastic-bubble-click.wav` é solicitado uma vez e o efeito de switch (`clear-mouse-clicks.wav`) não é solicitado

#### Scenario: Wheel confirms section change

- **WHEN** o deslocamento do wheel sobre o conteúdo ultrapassa o limiar de mudança de seção
- **THEN** a seção ativa muda e o efeito `plastic-bubble-click.wav` é solicitado uma vez

#### Scenario: Keyboard confirms section change

- **WHEN** a pessoa pressiona a seta para a esquerda ou para a direita com o foco no switch de página do rodapé
- **THEN** a seção ativa muda e o efeito `plastic-bubble-click.wav` é solicitado uma vez

#### Scenario: Navigation lock prevents a duplicate sound within one gesture

- **WHEN** uma nova tentativa de mudança de seção ocorre enquanto o bloqueio de navegação de 1s já iniciado por uma mudança anterior ainda está ativo
- **THEN** nenhuma mudança de seção adicional ocorre e nenhum efeito sonoro extra é solicitado

### Requirement: Shared sound preference and mobile lock across interaction sounds

Todos os efeitos sonoros de switches, triggers, âncoras e mudanças de seção SHALL respeitar a mesma preferência `soundEffects` já persistida pelo menu de acessibilidade e o mesmo bloqueio de viewport mobile (largura ≤ `32rem`) já definido para o efeito sonoro do painel. Desabilitar a preferência ou estar em um viewport bloqueado SHALL impedir a reprodução de qualquer um desses efeitos sem alterar o valor persistido.

#### Scenario: Preference disabled silences every surface

- **WHEN** a preferência de efeitos sonoros está desabilitada
- **THEN** nenhum clique em switch, trigger, âncora ou mudança de seção solicita reprodução de áudio

#### Scenario: Mobile viewport silences every surface without erasing the preference

- **WHEN** o viewport tem largura menor ou igual a `32rem`
- **THEN** nenhum clique em switch, trigger, âncora ou mudança de seção solicita reprodução de áudio, e o valor persistido da preferência permanece inalterado

#### Scenario: Resizing back to desktop resumes sound

- **WHEN** o viewport volta a ultrapassar `32rem` e a preferência permanece habilitada
- **THEN** cliques e mudanças de seção subsequentes voltam a solicitar reprodução normalmente
