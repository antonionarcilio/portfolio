## 1. Helper de transição

- [x] 1.1 Criar `src/features/minimalist/utils/theme-transition.ts` com tipo `ThemeTransitionPoint { x: number; y: number }` e função `startAppearanceTransition(apply: () => void, target: MinimalistAppearance, origin?: ThemeTransitionPoint)` que: aplica `apply()` direto quando `document.startViewTransition` não existe ou reduceMotion está ativo; senão seta `--minimalist-vt-x/y` (px) e `data-minimalist-vt-target={target}` no `document.documentElement` e chama `document.startViewTransition(() => flushSync(apply))`, limpando as custom properties e o atributo em `transition.finished`
- [x] 1.2 Exportar de `theme-transition.ts` a função `shouldSkipAppearanceTransition(): boolean` que retorna true se `html` tem a classe `a11y-reduce-motion` ou `prefers-reduced-motion: reduce` (usa `matchMedia`), e usá-la na guarda da task 1.1

## 2. Hook de appearance

- [x] 2.1 Em `src/features/minimalist/hooks/use-minimalist-appearance.ts`, estender `changeAppearance` para aceitar `(next: MinimalistAppearance, origin?: ThemeTransitionPoint)` e delegar ao `startAppearanceTransition` (via `flushSync`) em vez de `setAppearance` direto; manter `writeStoredPreference` inalterado

## 3. Origem no toggle

- [x] 3.1 Em `src/features/minimalist/components/switches.tsx`, atualizar o `ThemeToggle` para calcular o ponto de origem do clique (`event.currentTarget.getBoundingClientRect()` → centro) e repassar no `onChange('light' | 'dark', origin)`

## 4. CSS da revelação circular

- [x] 4.1 Em `src/features/minimalist/styles.css`, adicionar dois keyframes — `minimalist-view-reveal-in` (`circle(0%...)` → `circle(150%...)`) e `minimalist-view-reveal-out` (`circle(150%...)` → `circle(0%...)`) — e aplicá-los condicionalmente via `[data-minimalist-vt-target='dark']`/`='light'`: `reveal-in` em `::view-transition-new(root)` (com `z-index` acima de `old`) para expandir ao entrar no tema escuro; `reveal-out` em `::view-transition-old(root)` para retrair ao entrar no tema claro. Ambos ~1s, `forwards`, `mix-blend-mode: normal`; `::view-transition-image-pair(root)` com `isolation: isolate`

## 5. ReduceMotion global no Minimalist

- [x] 5.1 Em `src/features/minimalist/a11y.ts`, sincronizar `MotionGlobalConfig.skipAnimations = options.reduceMotion` durante o render do `useMinimalistA11y` (espelhando `src/features/gamified/contexts/a11y-context.tsx`), importando `MotionGlobalConfig` de `framer-motion`
- [x] 5.2 Em `src/features/minimalist/a11y.ts`, adicionar leitura síncrona no load do módulo (localStorage + `prefers-reduced-motion`) para setar `MotionGlobalConfig.skipAnimations = true` antes do primeiro render, evitando flash de opacity:0 (como no gamified)

## 6. Verificação

- [x] 6.1 Rodar `npx pnpm lint` e `npx pnpm typecheck` e corrigir erros
- [x] 6.2 Rodar o e2e de tema/interação (`npx pnpm test:e2e:minimalist`) e confirmar que o toggle de tema persiste classe e a opção reduceMotion continua funcional
