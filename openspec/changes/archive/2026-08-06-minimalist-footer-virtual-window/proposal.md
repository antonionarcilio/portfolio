## Why

O footer do Minimalist usa um carrossel físico infinito (track de 12 opções duplicadas, animação de translate, lock de navegação de 1s e timer de wrap que esconde o track via `visibility:hidden`). Isso torna o scroll por wheel imprevisível: deltas de trackpad `< 20px` são descartados, a maioria dos eventos é engolida pelo lock, o item central pisca/desaparece no wrap e itens demoram a aparecer. O painel de a11y já resolve a mesma classe de problema com janela virtual + acumulador; o footer deve adotar esse padrão.

## What Changes

- **BREAKING** (transição visual): o footer deixa de animar a troca de seção (slide de 0.55s) e passa a trocar instantaneamente, preservando integralmente a estrutura, posições, alinhamentos, tipografia e gradientes atuais em repouso.
- Substitui o track físico (12 opções duplicadas) por uma **janela virtual de 5 opções** derivada da seção ativa, com a opção ativa sempre no slot central (`offset === 0`).
- Remove o `navigationLock` de 1s e o descarte de `|deltaY| < 20`; a navegação por wheel passa a usar **acumulador + limiar** (mesmo mecanismo do painel de a11y), restabelecendo o funcionamento em trackpad.
- Remove o timer de wrap e o `visibility:hidden`/`--ready`; o track fica sempre visível e a centralização é feita por medição estática (offsetLeft, transform-imune, convergente em 1 passo).
- Modelo de foco: roving tabindex sobre as 5 opções renderizadas; navegação iniciada por opção refocaliza a opção ativa; chevrons e paginação lateral não movem o foco.
- Isola os eventos de wheel da lista de projetos para que o handler global do footer não bloqueie o scroll vertical interno da grid.
- Quando a lista de projetos atingir o topo ou o fim e o usuário continuar o wheel nessa direção, o evento passa ao handler global da página, que usa acumulador com threshold de 120px.
- A navegação do footer por wheel, chevron, teclado ou clique respeita delay de 1,5s entre mudanças.
- e2e atualizados para o DOM de 5 opções.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `minimalist-footer-pagination`: comportamento de wheel (acumulador com limiar em vez de lock de transição), track em janela com atualização instantânea, contrato de foco sobre a janela de opções.

## Impact

- `src/features/minimalist/components/recruiter.tsx` — substituição do estado/handlers físicos do footer pela janela virtual.
- `src/features/minimalist/a11y.ts` — `consumeA11yWheel` parametrizado por limiar (padrão 80 preserva o painel).
- `src/features/minimalist/styles.css` — remoção de `visibility:hidden`/`--ready`; `position: relative` no track.
- `src/features/minimalist/components/recruiter.tsx` — isolamento do wheel da lista de projetos em relação ao handler do footer.
- `src/features/minimalist/components/recruiter.tsx` — handoff do wheel nos limites da lista, threshold global de 120px e delay da navegação do footer.
- `e2e/minimalist-footer-pagination.spec.ts` e `e2e/minimalist-content-pagination.spec.ts` — contagens de opções, modelo de foco e timings.
- e2e da lista de projetos — validação do scroll vertical sem mudança indevida de seção.

## Non-goals

- Não reimplementar animação de slide no footer (swap instantâneo aprovado pelo usuário).
- Não alterar o content track (continua deslizando 0.55s) nem a paginação lateral.
- Não alterar o painel de a11y (limiar padrão e comportamento preservados).
- Não mudar o visual estático do footer (estrutura, posições, alinhamentos, tipografia, gradientes).
- Não alterar o comportamento de expansão, FLIP ou snap dos cards; apenas impedir que o footer intercepte o wheel da lista.
- Não aplicar o delay de 1,5s à paginação lateral (`StepPagination`), que permanece uma navegação de controle externo ao footer.
