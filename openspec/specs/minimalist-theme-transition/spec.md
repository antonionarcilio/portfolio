# minimalist-theme-transition Specification

## Purpose

Adiciona uma transição circular de tema no portfolio Minimalist: ao trocar entre os temas claro e escuro, um círculo se expande a partir do botão clicado até cobrir a tela, revelando o novo tema. A transição respeita a preferência de redução de movimento e falha com segurança em browsers sem suporte à View Transition API.

## Requirements

### Requirement: Circular reveal on theme change

O sistema SHALL aplicar uma transição circular ao trocar o tema do Minimalist entre claro e escuro, com direção dependente do tema de destino. Ao mudar para o tema escuro, um círculo SHALL se expandir a partir do ponto de origem (o centro do botão clicado) até cobrir a tela inteira, revelando o tema escuro dentro do círculo enquanto o tema claro permanece visível fora dele. Ao mudar para o tema claro, um círculo formado pelo tema escuro anterior SHALL retrair a partir da tela inteira até o ponto de origem, revelando o tema claro progressivamente conforme o círculo escuro se recolhe, até desaparecer no ponto de origem.

#### Scenario: Switching to dark reveals circular wipe

- **WHEN** a pessoa clica no botão "Dark" do `ThemeToggle`
- **THEN** um círculo se expande a partir do centro do botão "Dark" até cobrir toda a tela
- **AND** dentro do círculo o layout é renderizado no tema escuro enquanto fora dele permanece o tema claro

#### Scenario: Switching to light reveals circular wipe

- **WHEN** a pessoa clica no botão "Light" do `ThemeToggle`
- **THEN** um círculo do tema escuro anterior retrai a partir de toda a tela até o centro do botão "Light", até desaparecer
- **AND** o tema claro fica visível progressivamente à medida que o círculo escuro retrai, revelando-se primeiro longe do botão e por último no próprio ponto de origem

#### Scenario: Theme state reflects the selected appearance

- **WHEN** a transição termina
- **THEN** o layout inteiro está no novo tema
- **AND** a preferência selecionada persiste em armazenamento local conforme o comportamento existente

### Requirement: View Transition API fallback

O sistema SHALL trocar o tema diretamente, sem a transição circular, quando o browser não suporta a View Transition API (`document.startViewTransition` ausente).

#### Scenario: Unsupported browser changes theme without transition

- **WHEN** a pessoa troca de tema em um browser sem suporte à View Transition API
- **THEN** o novo tema é aplicado imediatamente, sem animação

#### Scenario: Supported browser runs the transition

- **WHEN** a pessoa troca de tema em um browser com suporte à View Transition API
- **THEN** a transição circular é executada antes do tema final ser exposto

### Requirement: Reduced motion disables the transition

O sistema SHALL trocar o tema sem animação quando a opção de acessibilidade `reduceMotion` do menu a11y estiver ativa (classe `a11y-reduce-motion` presente no `<html>`) ou quando o sistema operacional indicar `prefers-reduced-motion: reduce`. A preferência de tema continua sendo persistida normalmente nesses casos.

#### Scenario: A11y reduce motion toggle skips the transition

- **WHEN** a opção `reduceMotion` do menu de acessibilidade está ativa
- **AND** a pessoa troca o tema clicando em Light ou Dark
- **THEN** o novo tema é aplicado imediatamente, sem a transição circular
- **AND** a preferência de tema é persistida em armazenamento local

#### Scenario: System reduced motion preference skips the transition

- **WHEN** o sistema operacional reporta `prefers-reduced-motion: reduce`
- **AND** a pessoa troca o tema
- **THEN** o novo tema é aplicado imediatamente, sem a transição circular

### Requirement: A11y reduce motion global flag

O sistema SHALL sincronizar a opção `reduceMotion` do menu de acessibilidade do Minimalist com o flag global do framer-motion (`MotionGlobalConfig.skipAnimations`), de modo que a opção desative também as animações gerenciadas por framer-motion nesse portfolio — espelhando o comportamento já existente no portfolio gamified.

#### Scenario: Enabling reduce motion stops framer animations

- **WHEN** a pessoa ativa a opção `reduceMotion` no menu de acessibilidade
- **THEN** as animações framer-motion do Minimalist passam a ser puladas imediatamente, sem reinicialização da página

#### Scenario: Disabling reduce motion restores framer animations

- **WHEN** a pessoa desativa a opção `reduceMotion` no menu de acessibilidade
- **THEN** as animações framer-motion do Minimalist voltam a ser executadas
