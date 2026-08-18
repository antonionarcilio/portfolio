## 1. Baseline mensurável

- [x] 1.1 Subir `npx pnpm dev`, abrir `/en/portfolios/minimalist`, navegar até PROJECTS e registrar o retângulo de cada célula do grid (`.minimalist-card-slot`) e o do viewport da lista.
- [x] 1.2 Escrever o script de amostragem descrito em `design.md` (D4): clica no controle de um card, amostra `getBoundingClientRect()` do card em `t ≈ 0 / 500 / 1000 / 1500 / 2100 ms` e devolve as quatro bordas em coordenadas de página.
- [x] 1.3 Rodar o script no código atual para as células superior-esquerda, superior-direita, meio e inferior-direita, com `scrollTop = 0` e com a lista rolada. Salvar o resultado como baseline de falha (esperado: o retângulo final já aparece em `t = 500 ms` fora da célula superior-esquerda).

## 2. Timing compartilhado

- [x] 2.1 Criar `src/features/minimalist/animations.ts` exportando `MINIMALIST_EASE`, `minimalistExpansionTransition` (`duration: 2`, com comentário marcando que é valor de teste) e `MINIMALIST_CORNER_FADE_DURATION`.
- [x] 2.2 Trocar o literal `{ duration: 2, ease: [...] }` de `src/features/minimalist/components/card.tsx` e o fade dos corners pelos valores importados.
- [x] 2.3 Fazer `src/features/minimalist/hooks/use-minimalist-flip.ts` importar `minimalistExpansionTransition` no lugar do `flipTransition` local (`0.4`).

## 3. Origem correta com geometria real

> O `layout` do Framer foi implementado, medido e revertido — ver `design.md — D1`. As tarefas abaixo
> refletem a solução final.

- [x] 3.1 Implementar e medir a alternativa `layout` + `layoutScroll`; registrar a medição que a reprova (caixa do DOM em 423×233 a 7 ms enquanto o visual estava em 839×600) e reverter `section.tsx` ao `div` original.
- [x] 3.2 Fazer `captureExpansionGeometry()` medir os dois retângulos de uma vez em `overlayGeometry = { collapsed, expanded }`, no espaço de scroll do grid.
- [x] 3.3 Adicionar o frame de semeadura: `overlayTarget` entra em `'collapsed'` com `transition: { duration: 0 }` e é liberado para `'expanded'` dois `requestAnimationFrame` depois.
- [x] 3.4 Confirmar que a semeadura funciona nas duas ordens de commit — clique de mouse (`pointerdown` separado) e ativação por teclado (sem `pointerdown`, captura no mesmo commit).
- [x] 3.5 Manter `.minimalist-card--overlay` atrelada a `isOverlay`, que agora só cai no fim do ciclo.

## 3-bis. Fechamento do ciclo

- [x] 3b.1 Substituir o teardown por `onAnimationComplete` (disparava ~70 ms após o início do recolhimento) por `setTimeout` com `MINIMALIST_EXPANSION_DURATION_MS`, com atraso 0 sob `MotionGlobalConfig.skipAnimations`.
- [x] 3b.2 Remontar o card com `key={overlayCycle}` ao fim do ciclo, para o Framer soltar os valores de movimento — remover as chaves do `animate` o faz animar `width` de volta a 832 px.
- [x] 3b.3 Mover a restauração de foco para um `useEffect`, já que o botão original não sobrevive à remontagem.

## 4. Remoção do andaime de scroll

- [x] 4.1 Remover o laço `preserveScrollPosition` / `collapseFrameRef` do `useLayoutEffect` de recolhimento em `card.tsx`.
- [x] 4.2 Avaliada a remoção da regra `.minimalist__project-grid:has(.minimalist-card-slot--collapsing)`. **Mantida**: independente do laço rAF, ela bloqueia o scroll da lista durante o recolhimento (medido: `overflow-y: hidden` durante os 2 s, `auto` depois). A classe `.minimalist-card-slot--collapsing` segue em uso.
- [x] 4.3 Verificar que o `scrollTop` da lista permanece na posição preservada durante e após o recolhimento, sem o laço rAF.

## 5. Distorção e fluidez do conteúdo

- [x] 5.1 Medir a distorção sob `layout` (eyebrow em `scaleX 0.506 / scaleY 0.392` aos 102 ms) e confirmar que `layout="position"` a zera — depois descartar ambos junto com a D1: sem `transform`, a distorção é impossível por construção (`transform: none`, razão de escala `1`).
- [x] 5.2 Verificar que a caixa de layout do DOM acompanha a caixa visual durante toda a animação (`layoutSnap: false` nos dois sentidos, nas quatro células) — é isso que dá a fluidez do recolhimento.

## 6. Validação

- [x] 6.1 Rerodar o script de 1.2 nas quatro células, com e sem scroll, e confirmar o critério de aceite: em cada amostra intermediária as quatro bordas ficam estritamente entre a célula e o viewport da lista (±2 px).
- [x] 6.2 Confirmar o cenário "Anchored edge stays put": card da coluna direita mantém a borda direita imóvel durante toda a transição.
- [x] 6.3 Confirmar o recolhimento como espelho da expansão nas mesmas quatro células.
- [x] 6.4 Verificar `reduceMotion` ativo: estado final aplicado sem animação prolongada, conteúdo acessível.
- [x] 6.5 Verificar que o dim de opacidade (`useMinimalistCardEmphasis`) e o bloqueio de scroll da lista com card expandido continuam funcionando.
- [x] 6.6 Verificar a expansão da seção Experiência, que passa a herdar a duração de 2 s.

## 7. Fechamento

- [x] 7.1 Rodar `npx pnpm lint`, `npx pnpm typecheck` e `npx pnpm format:check`.
- [x] 7.2 Registrado em `src/features/minimalist/animations.ts` e em `proposal.md` que a duração de 2 s é provisória e precisa de um change de ajuste antes de ir para produção.
