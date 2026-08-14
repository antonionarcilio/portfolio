## Purpose

Fornecer ao layout Minimalist uma capacidade local e reutilizável de efeitos sonoros, com seleção explícita e controles previsíveis para que novas interações possam adotar áudio sem duplicar lógica.

## Requirements

### Requirement: Local sound catalog

O sistema SHALL disponibilizar um catálogo determinístico dos arquivos de áudio locais servidos pelo Minimalist, identificando cada efeito por uma chave estável e preservando o caminho do arquivo. O catálogo SHALL permitir que o som padrão do experimento seja `plastic-bubble-click.wav`.

#### Scenario: Initial catalog

- **WHEN** o controlador de efeitos sonoros é inicializado
- **THEN** os arquivos de som disponíveis podem ser selecionados sem requisição de rede antes da reprodução e `plastic-bubble-click.wav` é o efeito ativo por padrão

#### Scenario: Missing selected sound

- **WHEN** uma chave selecionada não corresponde a um arquivo registrado no catálogo
- **THEN** o controlador não tenta reproduzir uma URL desconhecida e mantém o estado de áudio utilizável com o efeito padrão ou sem reprodução

### Requirement: Internal playback controls

O sistema SHALL expor controles internos de `play`, `pause` e `stop` para o efeito selecionado, SHALL permitir iniciar uma nova reprodução sem alterar a seleção e SHALL tratar a ausência de suporte ou falha de carregamento sem interromper a interação da página.

#### Scenario: Play selected effect

- **WHEN** o controlador recebe uma ordem de reprodução para o efeito selecionado
- **THEN** o arquivo local selecionado é reproduzido respeitando o estado atual de áudio

#### Scenario: Pause and stop

- **WHEN** o controlador recebe `pause` ou `stop`
- **THEN** a reprodução corrente é pausada ou interrompida e o controlador permanece pronto para uma reprodução posterior

#### Scenario: Playback failure

- **WHEN** o navegador bloqueia a reprodução automática ou o arquivo falha ao carregar
- **THEN** o erro é tratado internamente, nenhum erro não tratado é exposto à interface e a navegação do Minimalist continua operável

### Requirement: Sound activation state

O sistema SHALL derivar o estado de ativação de efeitos sonoros da opção `soundEffects` do contrato compartilhado de acessibilidade, iniciada habilitada por padrão na ausência de preferência persistida, e SHALL refletir esse estado como classe `a11y-sound-effects` no elemento raiz. O sistema SHALL impedir novas reproduções quando essa opção estiver desabilitada e SHALL manter a reprodução bloqueada em viewports com largura menor ou igual a `32rem`, independentemente do valor persistido, sem apagar o valor em nenhum dos casos.

#### Scenario: Sound enabled

- **WHEN** a opção `soundEffects` do contrato compartilhado está habilitada
- **AND** uma interação solicita reprodução em um viewport que permite áudio
- **THEN** o efeito selecionado pode ser reproduzido

#### Scenario: Sound disabled

- **WHEN** a opção `soundEffects` está desabilitada e uma interação solicita reprodução
- **THEN** nenhum áudio é iniciado, sem impedir a conclusão da interação visual ou semântica

#### Scenario: Default enabled

- **WHEN** não há preferência persistida de `soundEffects`
- **THEN** a opção inicia habilitada e a classe `a11y-sound-effects` está presente no elemento raiz

#### Scenario: Class reflects the activation state

- **WHEN** a pessoa desativa `soundEffects` pelo painel de acessibilidade
- **THEN** a classe `a11y-sound-effects` é removida do elemento raiz e o valor é persistido
- **AND** ao reativar, a classe volta a ser aplicada
