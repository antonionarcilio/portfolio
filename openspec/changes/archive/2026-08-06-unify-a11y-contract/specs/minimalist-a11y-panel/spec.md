## ADDED Requirements

### Requirement: Upscale viewport lock

Em viewports com largura menor ou igual a `399px`, a opção "Enlarged Font" (upscale) do painel de acessibilidade SHALL permanecer visível na lista circular, mas SHALL ficar bloqueada: o controle de alternância SHALL impedir ativação e desativação, e o efeito de escala SHALL permanecer desligado, independentemente do valor persistido.

#### Scenario: Option visible but locked on narrow viewport

- **WHEN** a pessoa abre o painel em um viewport com largura menor ou igual a `399px`
- **AND** seleciona a opção "Enlarged Font"
- **THEN** a opção aparece na lista com o controle de alternância desabilitado
- **AND** nenhuma mudança de seleção aplica ou remove o efeito de escala

#### Scenario: Stored upscale stays off on narrow viewport

- **WHEN** a preferência de escala está habilitada ou persistida como ativa
- **AND** a viewport tem largura menor ou igual a `399px`
- **THEN** o efeito de escala permanece desligado, a classe `a11y-upscale` não é aplicada no elemento raiz e o valor persistido é atualizado para desativado

#### Scenario: Option unlocked on wider viewport

- **WHEN** a largura da viewport ultrapassa `399px`
- **THEN** o controle de alternância da opção "Enlarged Font" volta a ficar habilitado
- **AND** a pessoa pode ativar ou desativar o efeito de escala normalmente
