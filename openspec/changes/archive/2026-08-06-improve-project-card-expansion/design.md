## Context

O recruiter Minimalist expande cards de projeto via FLIP (layoutId/layout do Framer Motion em `src/features/minimalist/hooks/use-minimalist-flip.ts`), com o card tornando-se overlay do viewport da lista. Medições no browser mostraram:

- Expansão: card cresce ancorado (topo fixo), conteúdo desdobra via `scaleY` (única animação de altura própria) — suave.
- Colapso: a restauração do `scrollTop` disputa com o smooth-scroll e o card muda de âncora durante o encolhimento (salto perceptível).
- Não há dimming de cards por hover/focus; corners alternam via CSS puro sem transição.
- `ArrowDown`/`ArrowUp`/touch ainda rolam a lista com card expandido, pois os handlers de snap não checam o estado expandido.

Motivação completa: ver `proposal.md` — Why. Requisitos: `specs/minimalist-card-flip-expansion/spec.md`.

## Goals / Non-Goals

**Goals:**
- Expandir e retrair se tornam espelhos exatos: único movimento de tamanho é o FLIP; conteúdo só faz fade de opacidade.
- Congelar o `scrollTop` da lista durante toda a expansão e colapso, sem disputa com smooth-scroll.
- Destaque de hover/focus com dim 60% (apenas cards visíveis) e fade nos corners, via Framer Motion (regra do projeto).
- Travar scroll da lista por mouse, teclado e touch enquanto houver card expandido, mantendo o scroll nativo da área de conteúdo.

**Non-Goals:**
- Não alterar a geometria expandida (header/footer fixos, `max-height: 420px` da área central, viewport `610px`).
- Não mudar o contrato de navegação global (sections, footer, dots).
- Não introduzir nova dependência externa.

## Decisions

### D1. Conteúdo expandido: remover `scaleY`, fade de opacidade apenas

Em `src/features/minimalist/components/card.tsx:164-189`, o `motion.div` `.minimalist-card__expanded-content-shell` usa `initial/animate/exit = { opacity, scaleY }` com `transformOrigin: 'top center'` e `layout`. Remover o `scaleY` e o `layout` do shell, mantendo apenas `opacity` 0→1 no `animate` (e 1→0 no `exit`), mesma duração/easing do FLIP (0.45s, `[0.2, 0.7, 0.2, 1]`). O `AnimatePresence mode="popLayout"` permanece para montar/desmontar o shell.

Rationale: o `scaleY` é a única animação de tamanho além do FLIP — ao removê-lo, o crescimento do conteúdo passa a ser o próprio FLIP (que escala o artigo inteiro), tornando expandir/retrair simétricos. O `layout` no shell é desnecessário porque o artigo já anima layout. Alternativa considerada: manter `scaleY` e espelhar o colapso — rejeitada porque mantém duas fontes de movimento e o usuário confirmou remover.

### D2. Congelar `scrollTop` durante expansão e colapso

Em `src/features/minimalist/components/card.tsx`:

- Definir `data-project-scroll-lock={expandedScrollTopRef.current}` sempre que `expanded` (não só `isCollapsing`, como hoje na linha 142). O `handleProjectScroll` em `src/features/minimalist/components/recruiter.tsx:219-224` já força `scrollTop` de volta quando o atributo existe — isso neutraliza qualquer smooth-scroll em voo e impede nova rolagem da lista.
- No colapso, além do rAF atual, usar atribuição direta `grid.scrollTop = preservedScrollTop` (comportamento `instant`), que cancela smooth-scroll do navegador, em vez de competir com ele.

Rationale: o salto no colapso vem de o alvo do FLIP (slot) mudar de posição enquanto o scroll restaura. Travando o `scrollTop` num único valor durante todo o estado expandido, a âncora fica estável. Alternativa considerada: esperar o scroll assentar antes do FLIP — mais complexo e frágil.

### D3. Destaque hover/focus: estado no ProjectsPage + prop de card

Novo hook `src/features/minimalist/hooks/use-minimalist-card-emphasis.ts` gerenciando:

- `activeProjectId` (setado por `pointerenter`/`focusin`, limpo por `pointerleave`/`focusout` dos slots).
- Visibilidade: quando `activeProjectId` muda, computar quais cards interceptam o viewport da grid (retângulos relativos ao grid) e derivar o conjunto de ids a dim (siblings visíveis). Sem observer contínuo — a lista é pequena (≤ ~10 cards) e a mudança é discreta.

`ProjectsPage` em `src/features/minimalist/components/recruiter.tsx` passa `dimmed` e `active` para cada `MinimalistCard` (novos props em `src/features/minimalist/types.ts`):

- `motion.article` do card ganha `animate={{ opacity: dimmed ? 0.8 : 1 }}` (transição curta ~0.2s). Cards fora do viewport ou sem sibling ativo ficam 1.
- Corners viram `motion.span` com `animate={{ opacity: active ? 1 : 0 }}` e fade ~0.2s; as regras CSS atuais de hover/focus-within em `src/features/minimalist/styles.css:871-879` são substituídas pela prop.
- Com `expandedProjectIds.size > 0`, `dimmed`/`active` não são aplicados (CSS já força corners ocultos no expandido via `!important`).

Rationale: a regra do projeto exige Framer Motion para animações — dim e fade de corners não podem ficar em CSS puro. Alternativa considerada: `:has()` na grid + transition CSS — rejeitada por violar a regra e não permitir filtrar cards visíveis.

### D4. Travar scroll da lista com card expandido

Em `src/features/minimalist/components/recruiter.tsx:239-245`, guardar todos os handlers de snap:

- `onKeyDown`: se `expandedProjectIds.size` → `event.preventDefault()` e retorno (hoje `snap.onKeyDown` rola a lista).
- `onWheel`: se expandido → retorno (o scroll do conteúdo fica nativo na área de conteúdo).
- `onTouchStart/Move/End/Cancel`: se expandido → retorno, para gestos na lista não moverem a grid.

O `handleProjectWheel` atual também é ajustado para nunca chamar `snap.onWheel` quando expandido. A área de conteúdo já usa `overflow-y: auto` + `stopPropagation` (`card.tsx:175-183`), então seu scroll nativo é preservado.

Rationale: os handlers de `use-minimalist-snap-scroll.ts` não conhecem o estado expandido; o guard fica no ponto de uso, sem mudar o contrato do hook. Combinado com D2, cobre mouse, teclado e touch.

## Risks / Trade-offs

- Remover o `scaleY` reduz o "efeito de desdobrar" → Mitigação: o FLIP já cresce o conteúdo visualmente; o fade mantém a transição suave.
- Travar `scrollTop` por todo o estado expandido pode reverter rolagens legítimas se algum evento de scroll da grid escapar → Mitigação: conteúdo usa `stopPropagation`; handlers de snap guardados em D4 impedem novas rolagens.
- Dim computado no momento do hover/focus pode ficar desatualizado se o usuário rolar mantendo o mouse parado → Mitigação: irrelevante na prática (grid trava o scroll com card expandido e o dim só é ativo sem expansão); aceitável para a interação.
- Redução de movimento (`MotionConfig reducedMotion="user"`) pode desativar o FLIP → o estado final permanece correto; fade de opacidade ainda é aplicado.

## Migration Plan

- Mudança única de UI no mesmo PR; nenhum dado persistido. Rollback: reverter o PR.

## Open Questions

Nenhuma.
