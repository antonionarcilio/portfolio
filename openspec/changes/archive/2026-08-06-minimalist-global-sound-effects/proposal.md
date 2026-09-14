## Why

O experimento de `minimalist-accessibility-sound-effects` validou a linguagem sonora em uma única superfície (o scroll/teclado do menu de acessibilidade) e deixou pronta, de propósito, uma API reutilizável (`sound-catalog.ts` + `useMinimalistSoundEffects`) para que outras interações adotassem áudio sem duplicar lógica. Com o experimento validado, é hora de expandir para os demais controles interativos do layout Minimalist definidos pelo usuário: switches, botões de abrir/fechar/expandir e âncoras.

## What Changes

- Tocar `clear-mouse-clicks.wav` em todo clique de switch: `ThemeToggle`, `I18nToggle`, `ModeToggle` (R|C) e os botões YES/NO usados nos toggles de opção (incluindo o próprio YES/NO de "Efeitos sonoros"), integrando no componente compartilhado `MinimalistSwitchBtn` em vez de em cada consumidor.
- Tocar `mouse-click-close.wav` ao abrir/fechar o menu de acessibilidade (`MinimalistA11yTrigger` e o botão "Sair do menu de acessibilidade") e ao expandir/retrair um card de projeto (`MinimalistCard`'s controle de expansão).
- Tocar `fast-double-click-on-mouse.wav` ao clicar em uma âncora (`MinimalistAnchor`), exceto quando ela estiver desabilitada (`disabled`/`aria-disabled`).
- Introduzir um contexto de preferência de som (`MinimalistSoundPreferenceContext`/`useMinimalistSoundPreference()`), análogo ao `A11yProvider`/`useA11y()` já existente no gamified para `reduceMotion`, para que esses componentes — muitos reutilizados em vários pontos da árvore — leiam a preferência `soundEffects` já persistida pelo painel de acessibilidade sem herdar a prop `options` inteira por várias camadas.
- Extrair a detecção de viewport mobile (hoje inline em `a11y-panel.tsx`) para um hook compartilhado, para que os novos consumidores respeitem o mesmo bloqueio em `≤ 32rem` já decidido para o efeito sonoro do painel.
- Manter cada ponto de integração com sua própria instância do controlador (`useMinimalistSoundEffects` por consumidor), sem introduzir um provedor de áudio global compartilhado.
- Tocar `plastic-bubble-click.wav` — o mesmo efeito já usado pela navegação do painel de acessibilidade — sempre que a seção ativa do recrutador (Sobre, Projetos, Experiência, Educação) for efetivamente alterada: pelos pontos de paginação lateral, pelo switch de página do rodapé, por wheel ou por teclado (ArrowLeft/ArrowRight). Quando a mudança for efetivada pelo switch do rodapé, o som padrão de switch (`clear-mouse-clicks.wav`) é suprimido nesse clique, para não soar duas vezes.

## Non-goals

- Alterar o catálogo de sons, o controlador de reprodução (`play`/`pause`/`stop`) ou a preferência já existente `options.soundEffects` — esta mudança só adiciona consumidores.
- Adicionar uma nova opção de UI para desativar apenas os sons de interação (o mesmo toggle "Efeitos sonoros" do painel de acessibilidade continua sendo a única fonte de verdade).
- Atrasar a navegação de uma âncora para aguardar o efeito sonoro terminar — a reprodução é best-effort e pode ser interrompida pela navegação.
- Adicionar sons ao botão de "ver mais" (carregar mais conteúdo), a dropdowns ou a qualquer controle não listado acima — mudança de seção é a única forma de paginação coberta por esta mudança.
- Introduzir um cooldown novo para a mudança de seção — o bloqueio de navegação de 1s já existente (`acquireNavigationLock`) já impede que um único gesto contínuo confirme mais de uma mudança.
- Aplicar sons ao layout gamified.

## Capabilities

### New Capabilities

- `minimalist-interaction-sound-effects`: efeitos sonoros para switches, para os botões de abrir/fechar/expandir e para âncoras do layout Minimalist, todos condicionados à preferência `soundEffects` já existente e ao mesmo bloqueio de viewport mobile.

### Modified Capabilities

- (nenhuma) — `minimalist-a11y-panel` e `minimalist-sound-effects` não têm requisitos alterados; esta mudança apenas adiciona novos consumidores da API já especificada em `minimalist-sound-effects`.

## Impact

- Novos arquivos: um hook de preferência de som (contexto) e um hook de detecção de viewport mobile compartilhado em `src/features/minimalist/`.
- Componentes afetados: `switch-btn.tsx`, `a11y-trigger.tsx`, `card.tsx`, `anchor.tsx`, `recruiter.tsx` (botão de sair do painel e provedor do novo contexto).
- Usa os arquivos WAV já catalogados em `sound-catalog.ts` (`clear-mouse-clicks`, `mouse-click-close`, `fast-double-click-on-mouse`); nenhum arquivo novo é necessário.
- Não requer mudanças de API, CMS ou dependências de produção.
- A validação deverá cobrir cada superfície (switches, triggers, âncoras) com efeitos ligados/desligados, bloqueio em mobile, ausência de alteração no gamified e checks de formato, tipos e lint.
