## Purpose

Garante que o usuário do portfólio minimalist retorne à seção ativa em que estava após recarregar a página, persistindo apenas a seção corrente e ignorando estado transitório de UI.

## Requirements

### Requirement: Restaurar seção ativa após reload

O sistema SHALL persistir a seção ativa do portfólio minimalist e restaurá-la na montagem inicial, de modo que, ao recarregar a página, o usuário permaneça na seção em que estava antes do reload.

#### Scenario: Reload mantém a seção atual

- **WHEN** o usuário está na seção "experience" (índice 2) do portfólio minimalist e recarrega a página
- **THEN** o portfólio é exibido novamente na seção "experience", não na primeira seção

#### Scenario: Navegação entre seções atualiza a persistência

- **WHEN** o usuário navega da seção "about" para a seção "projects"
- **THEN** a nova seção ativa é persistida, refletindo a seção em que o usuário passará a estar após um reload

### Requirement: Restaurar apenas a seção, não estado de UI transitório

O sistema SHALL persistir exclusivamente a seção ativa. Estado transitório de UI — modal de bio expandido, expansão de cards de projetos, expansão da lista de experiência, painel de acessibilidade aberto — NÃO deve ser persistido nem restaurado após reload.

#### Scenario: Modal de bio permanece fechado após reload

- **WHEN** o usuário expande o modal de bio na seção "about", recarrega a página
- **THEN** o portfólio abre na seção "about" com o modal de bio fechado

#### Scenario: Cards de projetos permanecem recolhidos após reload

- **WHEN** o usuário expande cards de projetos na seção "projects", recarrega a página
- **THEN** o portfólio abre na seção "projects" com todos os cards recolhidos

### Requirement: Validar valor persistido

O sistema SHALL validar o valor persistido antes de aplicá-lo. Valores ausentes, corrompidos ou fora dos limites de seções conhecidas DEVEM ser ignorados, com fallback para a primeira seção.

#### Scenario: Valor fora dos limites

- **WHEN** o valor persistido referencia um índice de seção maior que o número de seções existentes
- **THEN** o portfólio é exibido na primeira seção

#### Scenario: Valor inválido ou ausente

- **WHEN** não há valor persistido ou o valor armazenado é inválido (ex.: texto não numérico)
- **THEN** o portfólio é exibido na primeira seção
