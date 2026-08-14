## Purpose

Fornecer ao layout Minimalist uma capacidade local e reutilizável de efeitos sonoros, com seleção explícita e controles previsíveis para que novas interações possam adotar áudio sem duplicar lógica.

## ADDED Requirements

### Requirement: Local sound catalog

O sistema SHALL disponibilizar um catálogo determinístico dos arquivos de áudio existentes em `src/_assets/sounds`, identificando cada efeito por uma chave estável e preservando o caminho local do arquivo. O catálogo SHALL permitir que o som padrão do experimento seja `plastic-bubble-click.wav`.

#### Scenario: Initial catalog

- **WHEN** o controlador de efeitos sonoros é inicializado
- **THEN** os arquivos de som disponíveis no diretório local podem ser selecionados sem requisição de rede e `plastic-bubble-click.wav` é o efeito ativo por padrão

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

O sistema SHALL aceitar um estado explícito de efeitos sonoros habilitados/desabilitados e SHALL impedir novas reproduções quando esse estado estiver desabilitado.

#### Scenario: Sound enabled

- **WHEN** os efeitos sonoros estão habilitados e uma interação solicita reprodução
- **THEN** o efeito selecionado pode ser reproduzido

#### Scenario: Sound disabled

- **WHEN** os efeitos sonoros estão desabilitados e uma interação solicita reprodução
- **THEN** nenhum áudio é iniciado, sem impedir a conclusão da interação visual ou semântica
