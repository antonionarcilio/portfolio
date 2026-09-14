## 1. Infraestrutura compartilhada

- [x] 1.1 Extrair a detecção de viewport mobile de `a11y-panel.tsx` para `src/features/minimalist/hooks/use-minimalist-mobile-lock.ts` (`useIsMinimalistSoundLocked()`), preservando a inicialização segura para SSR (`useState(false)` + correção em `useEffect`, nunca ler `window` durante o render) e migrar `a11y-panel.tsx` para consumi-lo sem mudar comportamento.
- [x] 1.2 Criar `MinimalistSoundPreferenceContext`/`useMinimalistSoundPreference()` em `src/features/minimalist/contexts/sound-preference-context.tsx`, análogo a `A11yProvider`/`useA11y()` do gamified: sem estado próprio, só expõe o booleano combinado (`soundEffects && !isMobileLocked`) recebido via prop; lançar erro se usado fora do provider.
- [x] 1.3 Prover o contexto em `recruiter.tsx`, alimentado por `a11yOptions.soundEffects` (já existente) e `useIsMinimalistSoundLocked()`, envolvendo a árvore onde os novos consumidores (switches, triggers, cards, âncoras) são renderizados.

## 2. Som de switches

- [x] 2.1 Integrar `useMinimalistSoundEffects` dentro de `MinimalistSwitchBtn` (`switch-btn.tsx`), tocando `clearMouseClicks` no `onClick` quando o botão não estiver `disabled` e o contexto de preferência estiver habilitado — cobre `ThemeToggle`, `I18nToggle`, `ModeToggle` e os YES/NO de opção automaticamente, sem editar cada consumidor.
- [x] 2.2 Adicionar testes de interação cobrindo: clique em switch habilitado toca o som; switch `disabled` não toca; preferência desabilitada não toca; viewport mobile não toca.

## 3. Som de abrir/fechar/expandir

- [x] 3.1 Integrar `useMinimalistSoundEffects` em `MinimalistA11yTrigger` (`a11y-trigger.tsx`), tocando `mouseClickClose` no `onClick` de abrir o painel, condicionado ao contexto de preferência.
- [x] 3.2 Integrar o mesmo efeito no botão "Sair do menu de acessibilidade" (inline em `recruiter.tsx`).
- [x] 3.3 Integrar o mesmo efeito no controle de expansão de `MinimalistCard` (`card.tsx`), tocando tanto ao expandir quanto ao retrair.
- [x] 3.4 Adicionar testes de interação cobrindo: abrir o painel toca o som; fechar toca o som; expandir e retrair um card tocam o som; preferência desabilitada e viewport mobile silenciam os três.

## 4. Som de âncoras

- [x] 4.1 Integrar `useMinimalistSoundEffects` em `MinimalistAnchor` (`anchor.tsx`), tocando `fastDoubleClickOnMouse` no `onClick` de uma âncora habilitada, sem adiar a navegação; âncoras `disabled`/`aria-disabled` não tocam.
- [x] 4.2 Adicionar testes de interação cobrindo: âncora habilitada toca o som e navega; âncora desabilitada não toca; preferência desabilitada e viewport mobile silenciam a âncora.

## 5. Validação visual e de regressão

- [x] 5.1 Verificar cada superfície (switches, triggers, cards, âncoras) em `en` e `pt-BR`, com efeitos ligados e desligados, incluindo o viewport mobile bloqueado.
- [x] 5.2 Confirmar que a rota gamified não carrega o novo contexto, hook ou comportamento de áudio do Minimalist.
- [x] 5.3 Executar `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, a validação OpenSpec estrita e `git diff --check`, corrigindo qualquer falha introduzida pela mudança.

## 6. Som de mudança de seção

- [x] 6.1 Adicionar um prop `playClickSound` (default `true`) a `MinimalistSwitchBtn` (`switch-btn.tsx`), permitindo suprimir o som padrão do switch quando o chamador for responsável por tocar seu próprio som.
- [x] 6.2 Tocar `plasticBubbleClick` em `recruiter.tsx` sempre que `selectPage`/`movePage` confirmarem uma mudança de seção — cobre os pontos de paginação lateral, wheel e teclado por já convergirem para essas funções, reaproveitando o `acquireNavigationLock` existente sem cooldown novo.
- [x] 6.3 Passar `playClickSound={false}` nas instâncias do switch de página do rodapé, garantindo que apenas o som de mudança de seção toque nesse clique.
- [x] 6.4 Adicionar testes de interação cobrindo: ponto de paginação lateral, switch do rodapé (sem som duplicado), wheel, teclado, preferência desabilitada e viewport mobile silenciando os quatro caminhos.
- [x] 6.5 Executar `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, a validação OpenSpec estrita e `git diff --check`, corrigindo qualquer falha introduzida pela mudança.
