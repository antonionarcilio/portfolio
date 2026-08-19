## Context

Ver `proposal.md — Why` para a motivação e a medição que reproduz o defeito.

Estado atual em `src/features/minimalist/components/card.tsx`:

- O card vive em `.minimalist-card-slot` (célula do grid). Ao expandir, o `<motion.article>` recebe `.minimalist-card--overlay` (`position: absolute`) e passa a ser posicionado dentro de `.minimalist__project-grid` (`position: relative`, `overflow-y: auto`, `max-height: 610px`).
- O slot congela `width`/`height` em pixels (`cardSlotSize`) para o grid não reflowar quando o card sai do fluxo.
- Toda a interpolação é manual: `animate={{ top, left, width, height }}` alimentado por `expandedBounds`, `collapsedPosition` e `isOverlay`, medidos em `captureExpansionGeometry()` no `onPointerDown` do botão.
- O recolhimento prende `grid.scrollTop` num laço de `requestAnimationFrame` (`preserveScrollPosition`), sustentado pela regra CSS `.minimalist__project-grid:has(.minimalist-card-slot--collapsing) { overflow: hidden }`.

Restrições que moldam a solução:

- A árvore JSX de `MinimalistCard` não pode mudar (pedido explícito do usuário). Só props, `className` e CSS.
- `framer-motion` `^12.40.0` já é dependência (`package.json:31`), e a feature já tem um contrato FLIP declarado mas praticamente não usado: `src/features/minimalist/hooks/use-minimalist-flip.ts` (consumido só por `section.tsx:158`, na Experiência).
- CLAUDE.md: toda animação por Framer Motion; timings/easings compartilhados por ≥2 componentes vão para `src/features/minimalist/animations.ts`; easing do projeto é `[0.2, 0.7, 0.2, 1]`.
- `reduceMotion` já é global via `MotionGlobalConfig.skipAnimations` — cobre `layout` sem código extra.

## Goals / Non-Goals

**Goals:**

- Origem/destino da animação = retângulo real da célula, em qualquer posição do grid e com a lista rolada.
- Menos estado e menos geometria à mão: o "First"/"Last" passa a ser responsabilidade do motor de projeção do Framer Motion.
- Um único ponto de verdade para duração e easing da expansão Minimalist.

**Non-Goals (nível de design):**

- Não introduzir `layoutId`/`AnimatePresence` com dois elementos (card compacto + card expandido). Isso mudaria a árvore JSX.
- Não migrar a expansão da Experiência para o novo mecanismo neste change — ela só passa a importar a transição compartilhada.
- Não perseguir 60 fps: a 2 s de duração o custo de projeção é irrelevante para validação visual.

## Decisions

> **Revisão após implementação.** A D1 original (delegar ao `layout` do Framer) foi implementada, medida e
> **revertida** — ela quebra a fluidez do recolhimento. A D1 abaixo está reescrita com o resultado. A D2
> (`layout="position"`) caiu junto, por ter deixado de existir o problema que resolvia.

### D1. Animar geometria real, corrigindo a origem com um frame de semeadura

O `layout` do Framer é baseado em `transform`: a caixa do DOM muda de uma vez e só a escala interpola.
Medido no recolhimento do card superior-esquerdo, 7 ms após o clique:

| | expandido | dt = 7 ms |
| --- | --- | --- |
| `offsetWidth × offsetHeight` | 850×610 | **423×233** (já final) |
| shell do conteúdo | 798×366 | **371×0** |
| retângulo visual | 850×610 | 839×600 (animando) |

Todo o layout interno colapsa em um frame e apenas a moldura escala — lido como "o card fecha de repente",
pior justamente na célula superior-esquerda, onde não há translação para mascarar. Animar `top/left/width/height`
reais faz o navegador refluir os filhos a cada frame, que é a origem da fluidez do comportamento anterior.

A correção da origem não vem então do motor do Framer, e sim de garantir o quadro "First":

1. `captureExpansionGeometry()` mede **os dois** retângulos de uma vez —
   `overlayGeometry = { collapsed, expanded }` — no espaço de scroll do grid.
2. Ao entrar no overlay, `overlayTarget` começa em `'collapsed'` com `transition: { duration: 0 }`: o card é
   pintado exatamente sobre a própria célula.
3. Dois `requestAnimationFrame` depois, `overlayTarget` vira `'expanded'` e a transição de 2 s roda a partir de
   um valor que o Framer já conhece.

O passo 2 é o que substitui os fallbacks `?? 0`. Ele também torna o comportamento independente da ordem de
commit entre `onPointerDown` e `onClick` — o que importa porque ativação por teclado não dispara `pointerdown`
e faz a captura cair no mesmo commit da troca de estado (verificado: parte da célula, sem salto).

*Alternativa considerada — `layout` + `layoutScroll`:* menos código e origem correta de graça, mas com o custo de
fluidez medido acima. Rejeitada.

### D1-bis. Teardown por duração, e remontagem para soltar os valores do Framer

Dois problemas apareceram só na medição do ciclo completo:

- **`onAnimationComplete` dispara cedo.** A definição de animação deste elemento muda no meio do ciclo
  (semeadura → execução, mais a transição independente de `opacity`), e o callback disparou ~70 ms após o início
  do recolhimento, desmontando o overlay com o card ainda em 818 px. O teardown passa a ser um `setTimeout` com
  `MINIMALIST_EXPANSION_DURATION_MS` — mesmo padrão que `section.tsx:197` já usa para o painel de Experiência —
  com atraso 0 quando `MotionGlobalConfig.skipAnimations` está ativo.
- **Remover as chaves do `animate` não libera os valores.** O Framer anima `width`/`height` *de volta* ao
  retângulo expandido (medido: 423 px → 832 px no segundo seguinte ao teardown) e reescreve o estilo inline a
  cada frame, então limpar à mão perde a corrida. O card é remontado por `key={overlayCycle}` ao fim do ciclo;
  o elemento novo nasce sem geometria inline e sem valores de movimento. A restauração de foco migrou para um
  `useEffect` porque o botão original deixa de existir na remontagem.

### D1-original (revertida). Delegar o FLIP ao `layout` do Framer Motion em vez de medir à mão

`<motion.article layout>` + `layoutScroll` no `.minimalist__project-grid`.

O Framer mede o retângulo antes do commit (`willUpdate`) e depois do commit (`didUpdate`) e interpola a diferença via transform. A troca de `position: static` → `absolute` provocada pela classe `.minimalist-card--overlay` é exatamente o tipo de mudança de layout que o `layout` foi feito para absorver: o "First" é sempre o retângulo observado, nunca um valor derivado de estado React.

`layoutScroll` na lista é obrigatório: sem ele o Framer não desconta o `scroll.offset` do contêiner e a animação salta proporcionalmente ao `scrollTop` (`applyTransform` no `create-projection-node.ts` só aplica o offset negativo em nós marcados com `layoutScroll`).

Consequências diretas:

- Somem `expandedBounds`, `collapsedPosition`, `isOverlay` e o `animate` de `top/left/width/height`.
- Some `preserveScrollPosition` e a regra `:has(.minimalist-card-slot--collapsing)`: a medição já é relativa ao scroller.
- `cardSlotSize` **permanece** — congelar a célula continua sendo necessário para o grid não reflowar quando o card sai do fluxo.
- `isCollapsing` **permanece** — controla `showExpandedLayout`, que mantém o conteúdo expandido montado durante o recolhimento; o fim do ciclo passa a ser `onLayoutAnimationComplete` em vez de `onAnimationComplete`.

*Alternativa considerada — corrigir só a origem (`collapsedPosition ?? 0`):* diff de duas linhas, preserva a animação de `width`/`height` reais (sem distorção de texto). Rejeitada como solução principal porque não remove nada: o "First" continua dependendo de a medição do `onPointerDown` ser commitada antes do `onClick`, ordem que não é garantida e que é a origem do defeito. Fica registrada como plano de rollback (ver Migration Plan).

### D2 (descartada com a D1 original). `layout="position"` nos blocos internos

O `layout` anima tamanho por `scale`, o que estica o texto durante os 2 s. O Framer aplica correção de escala inversa a filhos que também projetam; filhos sem projeção herdam a distorção.

Aplicar `layout="position"` em header, main e footer do card **não muda a árvore JSX** — os três já existem e viram `motion.header` / `motion.div` / `motion.footer`, mesmos filhos, mesmas classes. Eles animam posição e assumem tamanho final instantaneamente, que é o comportamento correto: o conteúdo expandido já é revelado por fade (requisito existente), não por altura.

*Alternativa considerada — deixar distorcer:* inaceitável a 2 s; a 0,4 s passaria despercebido, mas a duração de teste é justamente 2 s.

**Resultado:** funcionou para a distorção (razão de escala dos filhos exatamente `1.000` durante toda a animação),
mas piorou o problema da D1 — `layout="position"` faz o filho assumir o tamanho final instantaneamente, o que é
exatamente o salto de conteúdo relatado. Com geometria real não há `transform` algum (`transform: none`,
razão de escala `1`), então a distorção deixa de ser possível por construção e esta decisão foi removida.

### D3. Duração e easing em `src/features/minimalist/animations.ts`

Hoje o valor está duplicado: literal `{ duration: 2, ease: [0.2, 0.7, 0.2, 1] }` em `card.tsx:182` e `flipTransition` com `duration: 0.4` em `use-minimalist-flip.ts:4`. Dois componentes, mesmo conceito → arquivo central, conforme CLAUDE.md ("Shared animation values").

Novo módulo exporta:

- `MINIMALIST_EASE = [0.2, 0.7, 0.2, 1] as const`
- `minimalistExpansionTransition: Transition` — `duration: 2` neste change (valor de teste solicitado), com comentário registrando que é temporário.
- `MINIMALIST_CORNER_FADE_DURATION = 0.2` — o fade dos corners em `card.tsx:196` usa o mesmo easing e será a segunda referência ao token.

`use-minimalist-flip.ts` passa a importar a transição em vez de declarar a sua, o que alinha Projetos e Experiência numa duração só (hoje 2 s vs 0,4 s).

### D4. Verificação por medição, não por olho

O defeito só foi visível porque foi medido. A validação de aceite roda no navegador (Chrome DevTools MCP), amostrando `getBoundingClientRect()` do card em `t ≈ 0 / 25 / 50 / 75 / 100 %` de uma transição de 2000 ms, para os cards das células **superior-esquerda, superior-direita, meio e inferior-direita**, com a lista em `scrollTop = 0` e rolada.

Critério: em cada amostra intermediária o retângulo SHALL estar estritamente entre o retângulo da célula e o retângulo do viewport da lista, em cada uma das quatro bordas (tolerância ±2 px). O sintoma atual — retângulo final já em `t = 25 %` — falha nesse critério.

## Risks / Trade-offs

- **`layout` anima por transform; `overflow: hidden` no card recorta o conteúdo durante a escala** → `layout="position"` nos blocos internos (D2) mantém o conteúdo em tamanho final; validar visualmente que o recorte durante o crescimento é o desejado (o card cresce revelando conteúdo, não o comprimindo).
- **`border-radius` / bordas de 1 px podem distorcer sob escala** → o Framer corrige `borderRadius` automaticamente em nós projetados; o card Minimalist não usa raio, então o risco é baixo. Verificar os `.minimalist-card__corner`, que são `position: absolute` dentro do card projetado.
- **`layoutScroll` exige que o scroller seja um `motion.*`** → `.minimalist__project-grid` em `section.tsx:419` já é um `div` simples; vira `motion.div` com a mesma classe e os mesmos filhos (sem mudança de árvore).
- **Regressão na Experiência ao compartilhar a transição** → a Experiência passa de 0,4 s para 2 s. É consequência intencional do valor de teste; anotar em `tasks.md` para reavaliar quando a duração final for definida.
- **Interação com o `useMinimalistCardEmphasis` (dim de opacidade)** → o `animate={{ opacity }}` do card convive com `layout`; são propriedades independentes, sem conflito, mas deve entrar na checagem visual.

## Migration Plan

Mudança puramente client-side, sem dados nem API. Deploy normal.

Rollback: se o `layout` do Framer não produzir fidelidade aceitável (distorção residual, jitter no scroller), reverter para o `animate` manual e aplicar apenas a correção mínima da alternativa de D1 — semear `top`/`left` com `collapsedPosition` medido antes do commit que liga o overlay, em vez de `?? 0`. Isso corrige o sintoma reportado sem a reescrita, e o critério de aceite de D4 continua válido para ambos os caminhos.
