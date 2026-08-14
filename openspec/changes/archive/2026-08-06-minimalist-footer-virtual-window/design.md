## Context

Ver `proposal.md - Why`. O footer do Minimalist hoje implementa um carrossel físico infinito em `src/features/minimalist/components/recruiter.tsx` (track de 12 opções duplicadas, translate via framer-motion, lock de 1s, timer de wrap com `visibility:hidden`). O painel de a11y (`src/features/minimalist/components/a11y-panel.tsx`) já demonstra o padrão alvo: janela virtual de itens derivada do estado, circularidade aritmética e acumulador de wheel (`consumeA11yWheel` em `src/features/minimalist/a11y.ts`).

## Goals / Non-Goals

**Goals:**
- Substituir o maquinário físico do footer por uma janela virtual de 5 opções derivada de `activeIndex`, sem medição durante movimento e sem timer/lock.
- Preservar o visual estático: estrutura, posições, alinhamentos, tipografia, dividers, gradientes e centragem do ativo (±1px).
- Reutilizar o acumulador de wheel do painel de a11y, com limiar parametrizado.
- Contrato de foco: roving tabindex sobre a janela; navegação por opção refocaliza o ativo; controles não roubam foco.

**Non-Goals:**
- Não reintroduzir animação de slide no footer (swap instantâneo aprovado).
- Não alterar o content track (mantém slide de 0.55s), a paginação lateral nem o painel de a11y.

## Decisions

### 1. Janela virtual com raio 2 (5 opções)

Renderizar `WINDOW_RADIUS * 2 + 1 = 5` slots: `[page(active-2), page(active-1), ACTIVE, page(active+1), page(active+2)]`, com a opção ativa sempre no slot central (`offset === 0`) — invariante estrutural, como no painel de a11y. Chaves por posição (`${page.id}-${offset}`) para evitar chave duplicada da página que aparece nas duas pontas da janela.

- **Alternativa (descartada) Path A**: reparar o carrossel físico mantendo o slide — não atende a decisão de swap instantâneo.
- **Alternativa (descartada) slots de largura fixa**: garante centragem por simetria sem medição, mas regride a tipografia no mobile ("EXPERIÊNCIAS" ≈ 115px não cabe em slots de ~74px numa viewport de 390px).
- **Alternativa (descartada) Path C (janela + slide fake)**: reintroduz animação e medição de passo, violando o objetivo de simplificar.

Arquivo: `src/features/minimalist/components/recruiter.tsx`.

### 2. Centralização estática transform-imune (sem drift)

O item ativo precisa ficar no centro do viewport com ±1px, mas com larguras de label variáveis a janela não se centra por simetria. Solução: medição estática em `useLayoutEffect` usando `offsetLeft`/`offsetWidth` (imunes a `transform`), sem ler `getBoundingClientRect` do track traduzido:

- `.minimalist__footer-viewport` já é `position: relative` (`styles.css:447`) → vira `offsetParent` do track.
- `.minimalist__footer-track` ganha `position: relative` → vira `offsetParent` das options.
- Centro natural do ativo relativo ao viewport = `track.offsetLeft + active.offsetLeft + active.offsetWidth / 2`.
- `translate = viewport.clientWidth / 2 − centro natural do ativo`, aplicado num `<div style={{ transform: translateX(...) }}>` (sem framer-motion).

Converge em 1 passo e nunca deriva, porque não há movimento para medir. Recompor quando mudar: `activeIndex`, locale, appearance, resize (ResizeObserver no viewport) e `document.fonts.ready`.

- **Alternativa (descartada)**: `getBoundingClientRect` do ativo já traduzido e acúmulo `translate += C − activeCenter` — é exatamente o padrão atual, que não converge (drift).

Arquivos: `src/features/minimalist/components/recruiter.tsx`, `src/features/minimalist/styles.css`.

### 3. Acumulador de wheel compartilhado

Adicionar parâmetro `threshold` a `consumeA11yWheel` (`src/features/minimalist/a11y.ts`) com default `MINIMALIST_A11Y_WHEEL_THRESHOLD` (80) — o painel de a11y fica inalterado. O handler global de `.minimalist__main`, quando recebe wheel fora de um movimento interno da grid ou por handoff de um limite da grid, usa threshold de 120px e `preventDefault` ao confirmar. Direção invertida zera o acumulador (lógica já existente em `consumeA11yWheel`).

Arquivos: `src/features/minimalist/a11y.ts`, `src/features/minimalist/components/recruiter.tsx`.

### 4. Modelo de foco

Roving tabindex sobre a janela: ativo `tabIndex 0`, demais `-1`. Flag `focusCenterPending` (ref) setada apenas pela navegação iniciada por opção (setas no item, clique em label); um `useLayoutEffect` em `activeIndex` refocaliza o botão central com `preventScroll: true`. Chevrons (`PaginationButton`) e `StepPagination` movem `activeIndex` **sem** setar a flag — foco permanece no controle acionado. O botão central é alcançado via ref no slot `data-footer-offset="0"` (estender `MinimalistSwitchBtn` para aceitar ref ou consultar o botão dentro do slot).

Arquivo: `src/features/minimalist/components/recruiter.tsx`.

### 5. Simplificação de estado e markup

Remover de `recruiter.tsx`: `footerPosition`, `footerTranslate`, `footerTransitionEnabled`, `footerPages`, `navigationLock`, `footerFocusPending`, os dois `useLayoutEffect` de centragem/wrap, o timer de wrap (600ms) e o `motion.div` do track. `activeIndex` passa a ser a única fonte de verdade do footer (já dirige content track e paginação lateral). Remover `visibility:hidden`/`--ready` de `styles.css` (o track fica sempre visível; a continuidade visual vem da medição exata).

Arquivos: `src/features/minimalist/components/recruiter.tsx`, `src/features/minimalist/styles.css`.

### 6. e2e

- `e2e/minimalist-footer-pagination.spec.ts`: `expectFooterReady` (checava `--ready`) → checar visibilidade do track; `expectFooterKeyboardWindow` 12→5 botões (1 tabindex 0, 4 −1); `toHaveCount(12)`→5; `data-footer-position`→`data-footer-offset`.
- `e2e/minimalist-content-pagination.spec.ts`: `toHaveCount(12)`→5 (linhas 55 e 97).
- `e2e/minimalist-a11y-panel.spec.ts`: inalterado (limiar padrão 80).

### 7. Isolamento do wheel da lista de projetos

O listener nativo do footer é registrado em `.minimalist__main` para permitir `preventDefault()` não-passivo quando o limiar é confirmado. Como eventos de wheel da `.minimalist__project-grid` borbulham para esse elemento, o handler do footer deve retornar imediatamente quando `event.target` estiver dentro da grid. O handler existente da grid continua responsável pelo acumulador de linha, `scrollTo` com snap e `preventDefault` apenas quando uma linha válida for consumida.

- Não alterar `useMinimalistSnapScroll`, a expansão FLIP ou o `onScroll` que preserva a posição durante o colapso.
- Validar que wheel na grid muda somente `scrollTop`/linha ativa e wheel fora da grid continua alterando a seção pelo footer.

Arquivos: `src/features/minimalist/components/recruiter.tsx` e teste E2E da lista de projetos.

### 8. Handoff nos limites e delay do footer

O handler da grid deve consumir e impedir a propagação apenas quando `useMinimalistSnapScroll` encontrar uma linha válida. Se a grid estiver no topo e a direção for para cima, ou no fim e a direção for para baixo, o evento deve permanecer disponível para o listener global da página. O listener global usa o acumulador de 120px para confirmar a troca de seção.

O footer terá um lock de navegação de 1,5s aplicado somente às interações do próprio footer: wheel global, chevrons, teclado nas opções e clique em opção. Durante o lock, novas interações do footer não mudam `activeIndex`; `StepPagination` continua sem esse delay.

- Reintroduzir somente o estado/constante de lock necessário para o delay, sem reintroduzir o carrossel físico, wrap timer ou animação do footer.
- A troca confirmada deve iniciar o delay uma única vez, independentemente de ter vindo de wheel ou click.

Arquivos: `src/features/minimalist/components/recruiter.tsx`, `src/features/minimalist/a11y.ts` e testes E2E de footer/content pagination.

## Risks / Trade-offs

- [Footer troca instantânea enquanto o content desliza 0.55s] → pequeno descompasso visual de ~0.5s na troca de seção. Aceito pelo usuário; mitigar depois com fade sutil no label central (fora de escopo).
- [Label duplicada nas pontas da janela (4 páginas × 5 slots)] → mesmo comportamento acessível de hoje (3 cópias no track físico); as pontas ficam sob o gradiente.
- [Janela mais estreita que o viewport mostraria itens ±2 sem fade] → para `en`/`pt-BR` a janela (~560-590px) supera a viewport (≤550px); risco apenas para locais futuros com labels curtas.
- [Foco no nó central remontado a cada rotação (keys por posição)] → mitigado pelo refocus explícito via `focusCenterPending`.
- [`offsetLeft` arredonda para px inteiro] → dentro da tolerância de ±1px do e2e de centralização.

## Migration Plan

Sem migração de dados. O footer é client-rendered; a troca é atômica em `recruiter.tsx` + `styles.css`. Rollback: reverter o commit. Verificação: `npx pnpm lint`, `npx pnpm typecheck`, `npx pnpm format` e `npx playwright test e2e/minimalist-footer-pagination.spec.ts e2e/minimalist-content-pagination.spec.ts`.

## Open Questions

Nenhuma.
