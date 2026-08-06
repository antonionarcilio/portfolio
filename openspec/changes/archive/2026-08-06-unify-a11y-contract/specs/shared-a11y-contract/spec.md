## Purpose

Define um contrato único de estado, persistência e aplicação de classes de acessibilidade no elemento raiz, compartilhado pelos portfólios gamified e minimalist, com guarda de viewport para o upscale e sincronização de redução de movimento com animações.

## ADDED Requirements

### Requirement: Shared option state and persistence

O sistema SHALL manter as opções de acessibilidade (`upscale`, `greyscale`, `cursorLarge`, `highlightLinks`, `reduceMotion`, `soundEffects`) em um único estado compartilhado entre os portfólios, persistido sob a mesma chave de armazenamento. A persistência SHALL preservar valores desconhecidos presentes no armazenamento ao ler e ao gravar, sem apagar chaves reconhecidas de outro portfólio.

#### Scenario: Toggle persists across layouts

- **WHEN** a pessoa ativa a opção `highlightLinks` no portfólio minimalist
- **THEN** a preferência é persistida no armazenamento compartilhado
- **AND** ao visitar o portfólio gamified a mesma preferência permanece ativa, com a classe correspondente aplicada

#### Scenario: Unknown stored keys preserved

- **WHEN** o armazenamento contém uma chave não reconhecida pelo contrato atual
- **THEN** o contrato mantém essa chave ao ler e ao persistir, sem removê-la

### Requirement: Class application on the root element

O sistema SHALL aplicar uma classe `a11y-<opção>` correspondente no elemento raiz (`<html>`) para cada opção com efeito visual ativa, e SHALL removê-la quando a opção é desativada. A opção `soundEffects` SHALL também ser refletida como classe no elemento raiz, sem efeito visual.

#### Scenario: Enabling applies the class

- **WHEN** a pessoa ativa `greyscale` em qualquer portfólio
- **THEN** o elemento raiz recebe a classe `a11y-greyscale` e a preferência é persistida

#### Scenario: Disabling removes the class

- **WHEN** a pessoa desativa `greyscale`
- **THEN** a classe `a11y-greyscale` é removida do elemento raiz e a preferência é persistida

### Requirement: Upscale viewport guard

O sistema SHALL forçar a opção `upscale` como desativada quando a largura da viewport é menor ou igual a `399px`, mesmo que a opção esteja ativa ou persistida, removendo a classe correspondente e atualizando o estado. Quando a viewport ultrapassar `399px`, a opção SHALL voltar a poder ser ativada pela pessoa.

#### Scenario: Narrow viewport disables upscale

- **WHEN** a largura da viewport é menor ou igual a `399px`
- **AND** a opção `upscale` está ativa ou persistida como ativa
- **THEN** a opção é forçada a desativada, a classe `a11y-upscale` é removida e o estado persistido reflete a desativação

#### Scenario: Wide viewport re-enables upscale

- **WHEN** a largura da viewport ultrapassa `399px`
- **THEN** a opção `upscale` volta a poder ser ativada pela pessoa e o efeito de escala é aplicado quando ativa

### Requirement: Reduced motion sync with animations

O sistema SHALL sincronizar a opção `reduceMotion` com o flag global de animação do framer-motion, de modo que a opção ativa desative imediatamente as animações framer-motion em ambos os portfólios. O sistema SHALL ler a preferência de forma síncrona no carregamento da página para evitar a execução de animações no primeiro render, e SHALL inicializar a opção a partir da preferência do sistema (`prefers-reduced-motion: reduce`) quando não houver preferência persistida.

#### Scenario: Stored preference disables animations at load

- **WHEN** o armazenamento contém `reduceMotion` ativo
- **AND** a página carrega
- **THEN** as animações framer-motion são puladas desde o primeiro render, sem flash de conteúdo animado

#### Scenario: System preference seeds the default

- **WHEN** não há preferência persistida de `reduceMotion`
- **AND** o sistema operacional reporta `prefers-reduced-motion: reduce`
- **THEN** a opção `reduceMotion` inicia ativa e as animações são puladas

#### Scenario: Toggle reflects immediately

- **WHEN** a pessoa ativa `reduceMotion` no menu de acessibilidade
- **THEN** as animações framer-motion são puladas imediatamente, sem recarregar a página
- **AND** ao desativar, as animações voltam a ser executadas

### Requirement: Sound effects as a first-class option

O sistema SHALL tratar `soundEffects` como uma opção de primeira classe do contrato compartilhado: iniciada habilitada por padrão na ausência de preferência persistida, persistida junto às demais opções e refletida como classe `a11y-sound-effects` no elemento raiz, sem efeito visual associado.

#### Scenario: Default enabled

- **WHEN** não há preferência persistida de `soundEffects`
- **THEN** a opção inicia habilitada e a classe `a11y-sound-effects` está presente no elemento raiz

#### Scenario: Class reflects the activation state

- **WHEN** a pessoa desativa `soundEffects`
- **THEN** a classe `a11y-sound-effects` é removida do elemento raiz e a preferência é persistida
- **AND** ao reativar, a classe volta a ser aplicada
