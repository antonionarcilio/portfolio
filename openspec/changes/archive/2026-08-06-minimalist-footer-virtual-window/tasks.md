## 1. Acumulador de wheel compartilhado

- [x] 1.1 Adicionar parâmetro `threshold` (default `MINIMALIST_A11Y_WHEEL_THRESHOLD` = 80) a `consumeA11yWheel` em `src/features/minimalist/a11y.ts`, mantendo o comportamento do painel inalterado
- [x] 1.2 Definir a constante `MINIMALIST_FOOTER_WHEEL_THRESHOLD = 60` no mesmo arquivo

## 2. Simplificação do estado do footer

- [x] 2.1 Remover de `src/features/minimalist/components/recruiter.tsx` o maquinário físico: `footerPosition`, `footerTranslate`, `footerTransitionEnabled`, `footerPages`, `navigationLock`, `footerFocusPending`, o `motion.div` do track e os dois `useLayoutEffect` de centragem/wrap (incluindo o timer de wrap de 600ms)
- [x] 2.2 Introduzir `FOOTER_WINDOW_RADIUS = 2` e derivar a janela de 5 slots a partir de `activeIndex` via `circularIndex`, com keys por posição (`${page.id}-${offset}`) e atributo `data-footer-offset`
- [x] 2.3 Unificar `selectPage`/`movePage` numa seleção direta de `activeIndex` (mantendo o guard de `hasExpandedProject`), sem lock de navegação

## 3. Centralização estática e markup do track

- [x] 3.1 Em `src/features/minimalist/styles.css`: adicionar `position: relative` ao `.minimalist__footer-track` e remover `visibility: hidden` + `.minimalist__footer-track--ready`
- [x] 3.2 Implementar `useLayoutEffect` de centralização transform-imune: `translate = viewport.clientWidth / 2 − (track.offsetLeft + active.offsetLeft + active.offsetWidth / 2)`, recompondo em mudança de `activeIndex`/locale/appearance/resize (`ResizeObserver` no viewport)/`document.fonts.ready`
- [x] 3.3 Trocar o `motion.div` do track por `<div style={{ transform: translateX(...) }}>` e conectar `viewportRef`, `trackRef` e `activeOptionRef`

## 4. Wheel e modelo de foco

- [x] 4.1 Substituir `handleWheel` de `.minimalist__main` pelo acumulador `consumeA11yWheel` com limiar do footer e `preventDefault` ao confirmar; remover o descarte `|deltaY| < 20`
- [x] 4.2 Implementar roving tabindex (ativo `tabIndex 0`, demais `-1`) com ref no botão central; flag `focusCenterPending` setada por navegação iniciada por opção (setas no item, clique em label) e refocus em `useLayoutEffect`
- [x] 4.3 Garantir que chevrons (`PaginationButton`) e `StepPagination` mudam `activeIndex` sem mover o foco para as opções do footer

## 5. e2e

- [x] 5.1 Atualizar `e2e/minimalist-footer-pagination.spec.ts`: `expectFooterReady` checar visibilidade do track (sem `--ready`); `expectFooterKeyboardWindow` → 5 botões (1 tabindex 0, 4 −1); `toHaveCount(12)` → 5; `data-footer-position` → `data-footer-offset`; ajustar `waitForTimeout` de acordo com a troca instantânea
- [x] 5.2 Atualizar `e2e/minimalist-content-pagination.spec.ts`: `toHaveCount(12)` → 5 nas linhas 55 e 97

## 6. Verificação

- [x] 6.1 Rodar `npx pnpm lint` e corrigir eventuais erros
- [x] 6.2 Rodar `npx pnpm typecheck` e corrigir eventuais erros
- [x] 6.3 Rodar `npx pnpm playwright test` em `minimalist-footer-pagination`, `minimalist-content-pagination` e `minimalist-a11y-panel`; ajustar até ficar verde
- [x] 6.4 Rodar `npx pnpm format`

## 7. Correção do scroll da lista de projetos

- [x] 7.1 Fazer o handler global de wheel do footer ignorar eventos cuja origem esteja dentro de `.minimalist__project-grid`, preservando o handler de snap da lista
- [x] 7.2 Garantir que o scroll por wheel da lista move a linha de projetos sem alterar `activeIndex` e sem ser bloqueado por `preventDefault()` do footer
- [x] 7.3 Adicionar ou atualizar teste E2E para validar scroll vertical da lista de projetos e isolamento da navegação do footer
- [x] 7.4 Rodar `npx pnpm lint`, `npx pnpm typecheck`, os testes E2E Minimalist relevantes e `npx pnpm format`

## 8. Handoff do wheel e delay do footer

- [x] 8.1 Diferenciar wheel interno consumido pela grid de wheel no limite: no topo com direção ascendente e no fim com direção descendente, deixar o evento chegar ao handler global da página
- [x] 8.2 Adicionar e usar threshold global de `120px` no acumulador da página, preservando o threshold de `80` do painel de a11y
- [x] 8.3 Aplicar delay/lock de `1500ms` às navegações do footer por wheel, chevron, teclado e clique, sem aplicar o lock à `StepPagination`
- [x] 8.4 Atualizar os testes E2E para validar handoff no topo/fim, threshold global e bloqueio temporário de 1,5s no footer
- [x] 8.5 Rodar `npx pnpm lint`, `npx pnpm typecheck`, os testes E2E Minimalist relevantes e `npx pnpm format`
