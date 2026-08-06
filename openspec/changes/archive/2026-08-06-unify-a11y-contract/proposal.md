## Why

Hoje o portfólio tem duas implementações independentes de acessibilidade compartilhando o mesmo contrato implícito (`localStorage['a11y-opts']` + classes `a11y-*` no `<html>`): o Context `A11yProvider`/`useA11y` do gamified (`src/features/gamified/contexts/a11y-context.tsx`) e o hook `useMinimalistA11y` do minimalist (`src/features/minimalist/a11y.ts`). Isso gera drift de comportamento — o CSS de a11y vive só no `gamified/styles.css` (importado globalmente) e vaza para o minimalist, e a guarda de viewport <400px do upscale existe apenas no gamified, quebrando o layout móvel do minimalist. O futuro `MinimalistClient` (mesmo layout em modo cliente) exige estado único por página, então o contrato precisa ser centralizado.

## What Changes

- Criar um contrato de acessibilidade compartilhado em `src/shared/a11y/store.ts`: chave de storage única, conjunto de opções (`upscale`, `greyscale`, `cursorLarge`, `highlightLinks`, `reduceMotion`, `soundEffects`), defaults, leitura/persistência com merge por chave, mapa de classes aplicadas no `<html>` e guarda de viewport para upscale.
- `soundEffects` passa a adotar o mesmo padrão das demais opções: chave de primeira classe no contrato compartilhado, classe `a11y-sound-effects` sincronizada no `<html>` e default `true` — mantendo o bloqueio de viewport mobile `<= 32rem`.
- Refatorar `useMinimalistA11y` e `A11yProvider` (gamified) para consumirem o mesmo store, sem alterar as APIs públicas (`useA11y`, `useMinimalistA11y`, props do painel/trigger) nem os consumidores existentes.
- Em viewport com largura `<= 399px`, a opção "Enlarged Font" do painel Minimalist fica bloqueada (mesmo padrão do bloqueio de efeitos sonoros) e o upscale é forçado a desligado, corrigindo a paridade com o gamified.
- Dividir a apresentação CSS por layout: efeitos genéricos (greyscale, cursor grande, zoom do `.a11y-zoom-wrapper`) em `src/shared/styles/a11y.css`; efeitos específicos do tema (highlight de links, breakpoints de upscale, reduce-motion) em cada `styles.css` de feature. No Minimalist, o destaque de links passa a usar `var(--minimalist-accent)`.
- Subir o estado de acessibilidade do Minimalist do shell para o `page.tsx` da rota, preparando a troca de modo R↔C sem remontar estado.

## Capabilities

### New Capabilities

- `shared-a11y-contract`: contrato único de estado, armazenamento e aplicação de classes de acessibilidade no `<html>`, consumido pelos portfólios gamified e minimalist, com guarda de viewport para upscale e sincronização de reduceMotion com framer-motion.

### Modified Capabilities

- `minimalist-a11y-panel`: a opção "Enlarged Font" (upscale) passa a ser bloqueada em viewports `<= 399px` (controle desabilitado e efeito forçado a desligado), e o estado das opções passa a ser gerenciado pelo contrato compartilhado.
- `minimalist-sound-effects`: a preferência de efeitos sonoros passa a ser uma opção de primeira classe do contrato compartilhado (classe `a11y-sound-effects` no `<html>`, default habilitada), mantendo o bloqueio de reprodução em viewport mobile.

## Non-goals

- Não criar nova opção de acessibilidade, novo visual de painel ou renomear a chave `a11y-opts` (a continuidade de preferência entre layouts é preservada).
- Não alterar as APIs públicas dos consumidores (`useA11y`, `useMinimalistA11y`, props de painel/trigger) nem os componentes que leem o estado.
- Não implementar o `MinimalistClient` — apenas preparar o estado para a troca de modo.
- Não alterar o catálogo/controlador de sons, os tokens de tema, o CSS do painel ou a rota de minigames.

## Impact

- `src/shared/a11y/store.ts` (novo) e `src/shared/styles/a11y.css` (novo).
- `src/features/minimalist/a11y.ts`, `a11y-panel.tsx`, `hooks/use-minimalist-mobile-lock.ts`, `styles.css`, `app/[locale]/portfolios/minimalist/page.tsx`, `components/recruiter.tsx`, `contexts/sound-preference-context.tsx`.
- `src/features/gamified/contexts/a11y-context.tsx` e `src/features/gamified/styles.css`.
- `src/app/globals.css` (imports dos novos CSS).
- Base: branch `feature/minimalist-portfolio` com o change `add-theme-circle-transition` ainda não commitado.
