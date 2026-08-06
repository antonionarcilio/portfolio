## MODIFIED Requirements

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
