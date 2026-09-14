## REMOVED Requirements

### Requirement: Botão Ver Mais temporariamente desabilitado
**Reason**: A pré-condição referenciada por este requirement (animação flip) foi avaliada como incompatível com a estrutura atual de Sobre (card único, sem contexto de lista/grid) e substituída por um painel de conteúdo cheio; o controle de expansão passa a ser funcional, substituindo este placeholder.
**Migration**: Ver o novo requirement "Expansão funcional da biografia" nesta mesma capability.

### Requirement: Usuário tenta expandir a biografia
**Reason**: Cenário do requirement removido "Botão Ver Mais temporariamente desabilitado"; o comportamento de clique passa a expandir a biografia em vez de permanecer inerte.
**Migration**: Ver os cenários do novo requirement "Expansão funcional da biografia".

## ADDED Requirements

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
