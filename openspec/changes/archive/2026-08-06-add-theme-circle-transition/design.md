## Context

Ver `proposal.md` — Why/What. Estado atual relevante:

- Tema escopado à classe `.minimalist-theme--light|dark` no `<main>` (`src/features/minimalist/components/recruiter.tsx`), que ocupa `100dvh` — o snapshot de `root` da View Transition API cobre a tela inteira do tema.
- Estado em `src/features/minimalist/hooks/use-minimalist-appearance.ts` (`changeAppearance` faz `writeStoredPreference` + `setAppearance`). Troca é instantânea hoje.
- Toggle são 2 botões (`ThemeToggle` em `src/features/minimalist/components/switches.tsx` → `MinimalistSwitchBtn`), não um checkbox — origem deve vir do botão clicado.
- reduceMotion: `useMinimalistA11y` (`src/features/minimalist/a11y.ts`) aplica a classe `a11y-reduce-motion` no `<html>`. O `MotionConfig reducedMotion="user"` em `recruiter.tsx` lê apenas a preferência do OS; o flag global `MotionGlobalConfig.skipAnimations` é sincronizado hoje só no gamified (`src/features/gamified/contexts/a11y-context.tsx:75`).

## Goals / Non-Goals

**Goals:**
- Revelação circular idêntica à do CodePen (View Transition API), a partir do botão clicado.
- Uma única fonte de verdade para reduceMotion desligar a transição.
- Fallback seguro em browsers sem `startViewTransition`.

**Non-Goals:**
- Animar conteúdo interno (framer-motion) — o efeito é a revelação da tela.
- Reimplementar o efeito duplicando o DOM (rota B) ou com "color sweep" degradado (rota A).
- Alterar tokens/visual dos switches.

## Decisions

### 1. View Transition API + `flushSync` para o swap de tema

`document.startViewTransition(() => flushSync(apply))`. O `flushSync` é obrigatório: sem ele, o commit do `setAppearance` do React é assíncrono e o browser captura o DOM ainda no tema antigo como "nova" snapshot. `flushSync` commita síncrono antes da captura. Alternativa considerada: framer-motion puro (rota A) — rejeitada por degradar o efeito; e duplicar o DOM (rota B) — rejeitada por custo/fragilidade (2x estado e hooks).

### 2. Novo helper `src/features/minimalist/utils/theme-transition.ts`

`startAppearanceTransition(apply, target, origin)`:
- Se `!document.startViewTransition` ou reduceMotion ativo → `apply()` e retorna.
- Seta `--minimalist-vt-x/y` (px) no `document.documentElement` a partir do `origin { x, y }` (centro do botão via `getBoundingClientRect`), com fallback para `50%` se ausente.
- Seta `data-minimalist-vt-target={target}` (`'light' | 'dark'`) no `document.documentElement`, sinal que o CSS usa para escolher a direção da transição (expandir para escuro, retrair para claro) via seletor de atributo em `::view-transition-*`.
- `document.startViewTransition(() => flushSync(apply))` e remove as custom properties e o atributo em `finished` (evita resíduo). reduceMotion é lido de `document.documentElement.classList.contains('a11y-reduce-motion')` + `matchMedia('(prefers-reduced-motion: reduce)')` — fonte única, funcionando mesmo fora de React.

### 3. Origem no botão clicado

`ThemeToggle` passa `onChange` com `(event) => { const r = event.currentTarget.getBoundingClientRect(); onChange('dark', { x: r.left + r.width/2, y: r.top + r.height/2 }) }`. `changeAppearance(next, origin?)` no hook repassa ao helper. A origem por botão (não o centro do grupo) dá o efeito mais fiel ao pen.

### 4. CSS: direção da transição depende do tema de destino (2 animações)

Em `src/features/minimalist/styles.css`, perto das regras de tema (linha ~334), condicionadas ao atributo `data-minimalist-vt-target` setado pelo helper (Decisão 2):

- Baseline obrigatória: `::view-transition-old(root)` e `::view-transition-new(root)` recebem `animation: none` incondicionalmente antes de qualquer regra por direção. Sem isso, o cross-fade padrão do browser (~250ms, opacidade) continua ativo no snapshot que NÃO é animado pela nossa regra de direção, fazendo-o desaparecer sozinho bem antes do fim da nossa animação de 1s e expondo o canvas em branco por baixo — bug observado no light→dark (fundo virava branco) e no dark→light (fundo saltava para a cor do tema claro antes da hora).
- **Para escuro** (`[data-minimalist-vt-target='dark']`): keyframe `minimalist-view-reveal-in` de `circle(0% at var(--minimalist-vt-x, 50%) var(--minimalist-vt-y, 50%))` → `circle(150% at ...)` (cresce), aplicado a `::view-transition-new(root)` com `z-index: 1`; `::view-transition-old(root)` recebe `z-index: 0` explicitamente (não depender do empilhamento padrão do browser, que não é confiável entre os dois casos).
- **Para claro** (`[data-minimalist-vt-target='light']`): keyframe `minimalist-view-reveal-out` de `circle(150% at ...)` → `circle(0% at ...)` (encolhe), aplicado a `::view-transition-old(root)` com `z-index: 1` — o tema escuro remanescente retrai de volta para o botão clicado, revelando o tema claro estático abaixo (`::view-transition-new(root)` com `z-index: 0` explícito).
- Em ambos, duração ~1s, `forwards`, `mix-blend-mode: normal` (aplicado à baseline, não repetido por direção). `::view-transition-image-pair(root) { isolation: isolate }` evita blend entre as camadas.

### 5. Espelhamento do `MotionGlobalConfig.skipAnimations` no Minimalist

Em `src/features/minimalist/a11y.ts` (`useMinimalistA11y`), setar `MotionGlobalConfig.skipAnimations = options.reduceMotion` durante o render, espelhando `src/features/gamified/contexts/a11y-context.tsx:75`. Leitura síncrona no load do módulo (como no gamified, linha 27-37) para evitar flash de opacity:0 no primeiro render. Isso torna o toggle a11y do Minimalist efetivo sobre animações framer — hoje ele só adiciona classe sem efeito.

## Risks / Trade-offs

- **[Commit assíncrono quebra a captura]** → `flushSync` obrigatório dentro do callback; sem ele a transição captura tema errado.
- **[Flicker de blend-mode entre snapshots]** → `mix-blend-mode: normal` + `isolation: isolate` no `image-pair` (mesma prática do pen).
- **[Botão com transição CSS interrompida no fim do congelamento]** → imperceptível na prática: o centro de expansão é o próprio botão, último ponto coberto.
- **[Firefox (sem suporte) não anima]** → fallback direto; comportamento segue correto, apenas sem a transição.
- **[Testes e2e de tema]** → com `flushSync` a classe `minimalist-theme--dark` muda síncrono; `expect(...).toHaveClass` continua passando.
- **[Var/atributo leak no `documentElement`]** → `--minimalist-vt-x/y` e `data-minimalist-vt-target` limpos em `transition.finished`.

## Migration Plan

Sem migração de dados. Rollback: reverter os commits do helper, hook, switches e CSS; a troca volta a ser instantânea sem regressão funcional.

## Open Questions

Nenhuma — as decisões de arquitetura (rota C) e timing (~1s) já foram acordadas com o usuário.
