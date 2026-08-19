## Why

A expansão dos cards da seção Projetos só anima corretamente quando o card está na célula superior esquerda do grid. Nas demais posições o card **salta** instantaneamente para a origem do grid e apenas o tamanho interpola — não há continuidade espacial a partir da posição real do card, que é justamente o que a técnica FLIP deveria garantir.

Reproduzido em `http://localhost:3001/en/portfolios/minimalist` (card "GO", linha 1 / coluna 2, transição de 2000 ms), com **clique real** — eventos sintéticos disparados no mesmo tick não reproduzem o defeito, porque `pointerdown` e `click` acabam no mesmo commit do React:

| t | retângulo do card | esperado |
| --- | --- | --- |
| 0 ms | `t103 l730 b336 r1153` (a célula) | — |
| 2 ms | `t103 l730 b713 **r1580**` | `t103 l303 b713 r1153` |

O card salta para o tamanho final (850×610) **ancorado no canto da própria célula**, jogando a borda direita 427 px para fora da lista, e permanece assim: 2 estados distintos em 7,6 s, zero interpolação.

Causa: em `src/features/minimalist/components/card.tsx` o `animate` do `motion.article` usa `collapsedPosition?.top ?? 0` / `collapsedPosition?.left ?? 0`. Enquanto o card está recolhido, `collapsedPosition` é `null`, então o valor conhecido pelo Framer Motion é `0/0`. No commit em que `isOverlay` vira `true` o elemento passa a `position: absolute` dentro de `.minimalist__project-grid`, onde `0/0` significa **o canto superior esquerdo do grid**, não a célula do card. Para o card superior esquerdo esse valor coincide com a origem correta — daí ser o único que parece certo.

Dois fatores mascaram o diagnóstico e precisam ser controlados ao medir:

- **`reduceMotion`**: se `a11y-opts.reduceMotion` estiver `true` no `localStorage`, `MotionGlobalConfig.skipAnimations` zera *todas* as animações do Framer e tanto expandir quanto retrair viram salto instantâneo — indistinguível do defeito de geometria.
- **Eventos sintéticos**: `dispatchEvent(pointerdown)` + `.click()` no mesmo tick alteram a ordem de commit entre a captura de geometria e a troca de estado, e podem produzir uma animação de aparência correta sobre o código defeituoso.

O problema é estrutural, não pontual: a geometria é medida à mão em seis peças de estado (`cardSlotSize`, `expandedBounds`, `collapsedPosition`, `isOverlay`, `isCollapsing`, `expandedScrollTopRef`), o "First" do FLIP depende da ordem de commits entre `onPointerDown` e `onClick`, e o scroll da lista precisa ser preso por um laço de `requestAnimationFrame` durante o recolhimento. É esse conjunto que precisa ser simplificado.

## What Changes

- Corrigir a origem da animação: expandir e recolher SHALL partir/chegar na geometria real da célula do card, em qualquer posição do grid e com a lista rolada.
- Continuar animando geometria real (`top`/`left`/`width`/`height`) em vez de migrar para o `layout` do Framer. O `layout` é baseado em `transform`: a caixa do DOM assume o tamanho final no primeiro frame e só a escala interpola, o que quebra a fluidez do recolhimento (ver `design.md — D1`).
- Corrigir a origem com um **frame de semeadura**: o overlay entra ancorado no retângulo da própria célula e só é liberado para o retângulo expandido no frame seguinte. Substitui os fallbacks `collapsedPosition?.top ?? 0`, que faziam o card partir da origem do grid.
- Guardar os dois retângulos juntos (`overlayGeometry = { collapsed, expanded }`) em vez de três estados de geometria separados, de modo que o alvo da animação seja sempre uma escolha entre dois valores medidos.
- Trocar o teardown por `onAnimationComplete` por um timeout com a duração da transição, e remontar o card ao final do ciclo para o Framer soltar os valores de movimento do overlay.
- Remover o laço de `requestAnimationFrame` que prendia o `scrollTop` durante o recolhimento — verificado desnecessário: o scroll permanece estável sem ele.
- Consolidar duração e easing da expansão num único valor exportado em `src/features/minimalist/animations.ts`, hoje duplicados entre o literal inline `{ duration: 2 }` em `card.tsx` e `flipTransition` (`0.4`) em `use-minimalist-flip.ts`.
- Manter a duração em **2 s** neste change, a pedido do usuário, para inspeção manual.
- Manter a árvore JSX de `card.tsx` inalterada: só mudam props do `motion.article`, classes e CSS.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `minimalist-card-flip-expansion`: o requisito **FLIP continuity** passa a exigir explicitamente que a origem/destino da animação seja a geometria observada da célula do card (independente de linha, coluna e `scrollTop` da lista), que as bordas interpolem monotonicamente, e que o conteúdo do card reflua junto com a caixa em vez de assumir o layout final de uma vez.

## Non-goals

- Não alterar a estrutura JSX de `MinimalistCard` (requisito explícito do usuário).
- Não redesenhar o layout expandido, o conteúdo, o gradiente de scroll ou os corners.
- Não mexer na expansão da seção Experiência (`section.tsx` / `useMinimalistFlipLayout`) além do necessário para compartilhar a transição extraída.
- Não fixar a duração final de produção — 2 s é valor de teste, ajustado num change posterior.
- Não tocar em `reduceMotion`: o `MotionGlobalConfig.skipAnimations` global já cobre `layout`.

## Impact

- `src/features/minimalist/components/card.tsx` — props do `motion.article`, remoção dos estados de geometria e do laço rAF.
- `src/features/minimalist/hooks/use-minimalist-flip.ts` — passa a expor apenas o contrato de layout compartilhado.
- `src/features/minimalist/animations.ts` — **novo**: duração e easing compartilhados da expansão.
- `src/features/minimalist/components/section.tsx` — sem alteração no final (o `layoutScroll` avaliado na D1 foi revertido junto com o `layout`).
- `src/features/minimalist/styles.css` — nenhuma alteração necessária. A regra `:has(.minimalist-card-slot--collapsing)` foi avaliada para remoção junto com o laço rAF, mas **é mantida**: ela continua bloqueando o scroll da lista durante o recolhimento, o que impede o usuário de rolar no meio do voo e dessincronizar a projeção (verificado: `overflow-y` fica `hidden` durante os 2 s e volta a `auto` ao fim).
- Sem impacto em CMS, i18n, rotas ou dependências (`framer-motion` já é dependência).
