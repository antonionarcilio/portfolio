## 1. Flip simétrico

- [x] 1.1 Remover `scaleY` e `layout` do `motion.div` `.minimalist-card__expanded-content-shell` em `src/features/minimalist/components/card.tsx`, mantendo apenas `opacity` no `initial`/`animate`/`exit` com a mesma duração/easing do FLIP (0.45s, `[0.2, 0.7, 0.2, 1]`) e conservando o `AnimatePresence mode="popLayout"`
- [x] 1.2 Definir `data-project-scroll-lock={expandedScrollTopRef.current}` sempre que `expanded` (não apenas durante `isCollapsing`) em `src/features/minimalist/components/card.tsx`, para o `handleProjectScroll` da grid reverter qualquer rolagem durante a expansão
- [x] 1.3 No colapso, congelar o `scrollTop` com atribuição direta (`grid.scrollTop = preservedScrollTop`, comportamento instant) além do rAF atual, neutralizando smooth-scroll em voo, em `src/features/minimalist/components/card.tsx`

## 2. Destaque de hover/focus e corners

- [x] 2.1 Criar `src/features/minimalist/hooks/use-minimalist-card-emphasis.ts` com estado de card ativo (pointerenter/pointerleave, focusin/focusout) e computação dos cards visíveis a dim (intersecção de retângulos com o viewport da grid)
- [x] 2.2 Adicionar props `active` e `dimmed` em `MinimalistCardProps` em `src/features/minimalist/types.ts`
- [x] 2.3 Em `src/features/minimalist/components/card.tsx`, aplicar `animate={{ opacity: dimmed ? 0.8 : 1 }}` no `motion.article` e converter os corners em `motion.span` com `animate={{ opacity: active ? 1 : 0 }}` e fade ~0.2s
- [x] 2.4 Em `src/features/minimalist/components/recruiter.tsx`, integrar o hook no `ProjectsPage` e repassar `active`/`dimmed` para cada `MinimalistCard`, desativando o destaque quando `expandedProjectIds.size > 0`
- [x] 2.5 Em `src/features/minimalist/styles.css`, remover/substituir as regras de corners por hover/focus-within (linhas ~871-879) que passam a ser redundantes

## 3. Travar scroll da lista com card expandido

- [x] 3.1 Em `src/features/minimalist/components/recruiter.tsx`, guardar `onKeyDown`, `onWheel` e `onTouchStart/Move/End/Cancel` com `preventDefault()` e retorno quando `expandedProjectIds.size > 0`
- [x] 3.2 Ajustar `handleProjectWheel` para nunca chamar `snap.onWheel` com card expandido, preservando o scroll nativo da área de conteúdo

## 4. Verificação

- [x] 4.1 Testar no browser: expandir/retrair simétricos (sem salto), dim 60% só em cards visíveis com fade nos corners, e lista sem scroll por mouse/teclado/touch quando expandida
- [x] 4.2 Rodar `npx pnpm lint`, `npx pnpm typecheck` e `npx pnpm format`
- [x] 4.3 Rodar `openspec validate --change improve-project-card-expansion`
