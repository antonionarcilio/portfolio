## Why

Hoje a troca de tema no portfólio minimalista (Light/Dark) acontece instantaneamente: o estado React muda e a classe `.minimalist-theme--dark/light` é aplicada sem nenhuma transição. O usuário pediu uma revelação circular a partir do botão clicado até cobrir a tela, como no CodePen (View Transition API).

## What Changes

- Adicionar transição circular de tema usando a **View Transition API** (`document.startViewTransition`), com direção dependente do tema de destino: ao mudar para escuro, um círculo **expande** a partir do botão clicado até cobrir a tela; ao mudar para claro, o círculo do tema anterior **retrai** a partir da tela inteira até o botão clicado.
- Fazer o commit do estado React de forma síncrona (`flushSync`) dentro do callback da transição, para o browser capturar o DOM já no tema novo.
- Respeitar o toggle de acessibilidade `reduceMotion` do menu a11y (classe `a11y-reduce-motion` no `<html>`) e a preferência do sistema (`prefers-reduced-motion`): quando ativos, a troca de tema é feita sem transição.
- Adicionar fallback quando a View Transition API não é suportada (Firefox): trocar o tema diretamente.
- Espelhar o `MotionGlobalConfig.skipAnimations` no hook `useMinimalistA11y` (hoje presente só no gamified), tornando o mecanismo de reduceMotion uniforme entre os portfolios.

## Capabilities

### New Capabilities
- `minimalist-theme-transition`: comportamento da troca de tema do portfolio minimalista — aplicação da transição circular via View Transition API, origem a partir do botão clicado, fallback para browsers sem suporte e desativação quando reduceMotion estiver ativo.

### Modified Capabilities
<!-- Nenhum requisito de spec existente muda; a troca de tema atual não possui spec própria. -->

## Non-goals

- Não reimplementar a transição com framer-motion (rota A/B descartadas: "color sweep" degrada o efeito; duplicar o DOM é caro e frágil).
- Não aplicar a transição a outros portfolios (gamified/minigame) — apenas ao minimalista.
- Não animar o conteúdo interno (textos, cards) — o efeito é apenas a revelação da tela inteira.
- Não alterar o visual dos botões de toggle (Light/Dark) nem o sistema de tokens de tema.

## Impact

- `src/features/minimalist/hooks/use-minimalist-appearance.ts`: `changeAppearance` passa a receber origem e usar o helper de transição.
- `src/features/minimalist/components/switches.tsx`: `ThemeToggle` calcula o ponto de origem a partir do botão clicado.
- `src/features/minimalist/utils/theme-transition.ts`: novo helper com a lógica da View Transition API, fallback e guarda de reduceMotion.
- `src/features/minimalist/styles.css`: keyframes e regras `::view-transition-*` para a revelação circular.
- `src/features/minimalist/a11y.ts`: espelhamento de `MotionGlobalConfig.skipAnimations` a partir da opção `reduceMotion`.
- Dependência: nenhuma nova — API nativa do browser (Chrome/Edge 111+, Safari 18+), sem pacotes adicionais.
