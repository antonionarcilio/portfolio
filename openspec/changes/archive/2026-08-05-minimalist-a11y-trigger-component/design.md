## Context

`a11yTriggerVariants` (cva) vive em `src/features/minimalist/variants.ts` e `A11yTrigger` em `src/features/minimalist/components/minimalist-navigation.tsx`, junto com `NavigationHint`, `Step`, `StepPagination` e `SectionSwitch` — mesmo arquivo, 4 componentes exportados (`A11yTrigger` é o 4º, além de `Step` ser interno a `StepPagination`). `a11yTriggerVariants` hoje resolve para a classe `.minimalist-a11y-trigger`, que compartilha o bloco de regras base com `.minimalist-section-switch` (`styles.css:171-183`: `display:inline-flex`, `gap:8px`, `font-size:14px`, sem borda/padding/fundo) e depois recebe overrides próprios (`styles.css:196-207`): `justify-content:flex-end`, tamanho de ícone fixo `16px` para todo `<img>` filho, e `color: var(--minimalist-accent)` em `:hover`/`--opened`. O cabeçalho do recruiter tem um terceiro override (`styles.css:396-399`) que só ali corrige `gap` para `4px` e `font-size` para `16px` — ou seja, o valor "certo" (Figma) só existia nesse um lugar, mascarando a classe base errada em todos os outros usos (showcase).

A leitura do node Figma (`fileKey=oaRNKV5sEnHE2gffqUbMJl`, `node-id=2109-3862`, componente `a11y-trigger`) via extensão Chrome (MCP do Figma indisponível nesta sessão: `get_design_context`/`get_figma_data` retornaram 429 — limite do plano Starter, cooldown de dias) — inspecionando o painel Design do Figma diretamente, nó a nó — encontrou 8 variantes: `state` (`regular`/`hover`/`focus`) × `appearance` (`light`/`dark`), todas com `opened=false`, mais 2 variantes extras só `regular` × `light`/`dark` com `opened=true` (sem `hover`/`focus` desenhados para o estado aberto). Confirmado clicando em cada variante e lendo o painel "Fill"/"Selection colors":

- Ícone (accessibility + chevrons, ambos dentro do mesmo grupo `Frame`/`icons/chevrons-up-down`): `alpha-black-100` em `regular` (light) e em `opened=true` (light); `alpha-black-40` em `hover`/`focus` com `opened=false` (light). Simétrico em dark: `alpha-white-100` em `regular`; a leitura de `hover`/`focus` em dark não foi confirmada pixel-a-pixel nesta sessão (chamadas ao Figma MCP bloqueadas no meio da varredura) — a implementação deve usar o degrau de alpha branco existente mais próximo de 40% (`--minimalist-alpha-white-40`, da escala completa 30-100 que `minimalist-design-tokens-parity` introduz) e conferir visualmente no `npx pnpm dev` antes de finalizar.
- Texto do badge (`(1)`, nó de texto separado do ícone): `alpha-black-100` / `alpha-white-100` em **todas** as variantes lidas (`regular`, `hover`, `focus`) — nunca dimmed, mesmo quando o ícone está em `hover`/`focus`. Confirmado com zoom lado a lado comparando o mesmo texto em `regular` e `hover`: pixels idênticos.
- Layout: `content-stretch flex gap-[4px] items-center` — sem padding, sem borda, sem fundo. Ícone de acessibilidade (`Frame`) 20×20; ícone de chevrons (`icons/chevrons-up-down` / `icons/chevrons-down-up`) 16×16. Tipografia do texto: `font-family-portfolio` (JetBrains Mono), `text-md` (16px), peso regular.
- O badge é controlado por uma propriedade de instância booleana `activedOption` no Figma (mostra/esconde o texto `(1)`) — não é uma contagem dinâmica no arquivo de design, é um placeholder de exemplo. Uma captura de tela real (`SCREENS > acessibilidiade`, cabeçalho) mostra o badge presente tanto no estado fechado (`⇕`) quanto aberto (`✕`), sempre com o valor `(1)` — não há evidência no Figma de um valor diferente de 1, então o contrato do componente deve aceitar qualquer contagem (`activeCount?: number`), sem assumir que só existem os valores 0/1.

Os ícones (`accessibility.svg`, `chevrons-up-down.svg`, `chevrons-down-up.svg`) já existem em `src/_assets/icons/` e já são os usados por `A11yTrigger` — nenhum asset novo.

## Goals / Non-Goals

**Goals:**

- Fazer o `a11y-trigger` bater com as variantes do node Figma (ícone dimming, geometria, tipografia) nos 2 usos atuais (recruiter, showcase).
- Isolar o átomo em arquivo dedicado, sem tocar nos outros componentes de `minimalist-navigation.tsx`.
- Expor o slot de badge visto no Figma como uma prop opcional, sem inventar uma fonte de dados para ele.

**Non-Goals:**

- Não implementar o painel de opções de acessibilidade nem uma contagem real de opções ativas — ver proposal.md § Non-goals.
- Não confirmar por leitura direta de API o valor exato de opacidade do ícone em `hover`/`focus` no tema escuro (bloqueado por rate limit do Figma MCP nesta sessão); a tarefa de implementação deve validar visualmente contra o Figma (aberto na aba do Chrome já usada nesta sessão, ou reabrindo quando o MCP voltar) antes de considerar o componente pronto.

## Decisions

**1. Co-localizar cva + componente em `minimalist-a11y-trigger.tsx`, seguindo `minimalist-anchor.tsx`/`minimalist-switch-btn.tsx`.**
Mesmo padrão de arquivo por átomo já estabelecido nos 2 changes anteriores da mesma família. Não há composições adicionais (ao contrário do switch-btn, que gerou um segundo arquivo para `I18nToggle`/`ThemeToggle`/`ModeToggle`) — o `a11y-trigger` só tem um consumidor por tela (recruiter, showcase), sem variações de composição.

**2. (Revisado durante a implementação) Opacidade CSS na `span` dos ícones, em vez de tokens de cor por tema — sem seletor duplicado light/dark.**
Decisão original: seletor escopado por `.minimalist-theme--light`/`--dark .minimalist-a11y-trigger`, espelhando `switch-btn`. Na implementação isso se mostrou desnecessário: os ícones são `<img>` (SVG), não texto — `color` não os afeta, e o tema escuro já os inverte via `filter: var(--minimalist-icon-filter, none)` (`invert(1)` em `.minimalist-theme--dark`). Aplicar `opacity: 0.4` em vez de trocar entre `alpha-black-40`/`alpha-white-40` produz o mesmo pixel: um ícone preto a 40% de opacidade é `rgb(0 0 0 / 40%)` (= `alpha-black-40`); o mesmo ícone já invertido para branco a 40% de opacidade é `rgb(255 255 255 / 40%)` (= `alpha-white-40`). Uma única regra de `opacity` cobre os dois temas, sem duplicar seletores `--light`/`--dark`. Regra de aplicação, no wrapper `.minimalist-a11y-trigger__icons` (não no botão nem no badge):
  - `opened=true` (qualquer `state`) OU (`opened=false` e `state=regular`) → `opacity: 1`.
  - `opened=false` e `state=hover`/`focus` (via prop, para inspeção) OU `:hover`/`:focus-visible` nativo → `opacity: 0.4`.
  - O badge não precisa de seletor próprio: o `<button>` herda `color: var(--minimalist-foreground)` do tema (`.minimalist-theme` já resolve isso para `alpha-black-100`/`alpha-white-100` por appearance), e a `opacity` reduzida só é aplicada à `span` dos ícones — o badge nunca é afetado.

**3. Ícone de acessibilidade e ícone de chevrons deixam de compartilhar a mesma regra `img { width/height: 16px }`.**
Precisam de classes BEM distintas (`.minimalist-a11y-trigger__icon` 20×20 vs `.minimalist-a11y-trigger__chevrons` 16×16) ou dimensionamento direto via prop `width`/`height` do `next/image` (já suportado, só o valor está errado hoje). Preferir ajustar as props do `<Image>` diretamente (20 para o ícone de acessibilidade, mantém 16 para chevrons) e remover a regra CSS `img { width/height: 16px }` que hoje força os dois ao mesmo tamanho — mais simples que introduzir 2 classes BEM novas só para tamanho.

**4. `activeCount?: number` como prop nova, renderizada como `(${activeCount})` só quando definida.**
Espelha a propriedade `activedOption` (boolean, mostra/esconde) do Figma, mas usa o valor numérico em vez de um boolean solto — evita a necessidade de uma segunda prop `count` só para o texto. Sem consumidor real ainda (ver Non-Goals): os 2 call sites atuais (`minimalist-recruiter.tsx`, `minimalist-showcase.tsx`) continuam sem passar essa prop, então o badge fica invisível na prática até um change futuro cablar uma fonte de dados real — o componente só passa a estar pronto para recebê-la.

**5. Remover os overrides do cabeçalho do recruiter (`gap`/`font-size`) em vez de ajustá-los.**
Depois da Decision 2/3, a classe base já produz a geometria correta — o override se torna redundante. Mesma lógica de "consertar a base, não o caso especial" dos dois changes anteriores.

## Risks / Trade-offs

- [Degrau de alpha branco para `hover`/`focus` em dark não confirmado por leitura direta da API do Figma nesta sessão — só inspeção visual da extensão Chrome, e mesmo essa não cobriu o par dark/hover-focus antes do rate limit] → Mitigação: usar o degrau mais próximo de 40% já exposto pela escala 30-100 de `minimalist-design-tokens-parity` (`--minimalist-alpha-white-40`) e validar visualmente no `npx pnpm dev` contra a mesma aba do Figma antes de finalizar a tarefa; se divergir, é um ajuste de uma linha de CSS, não uma mudança de contrato.
- [Renomear `A11yTrigger` → `MinimalistA11yTrigger` e mover de arquivo é breaking a nível de código interno] → mitigado por ser um único change que já atualiza os 2 call sites na mesma revisão; sem consumidor externo ao repo.
- [Badge sem fonte de dados real pode ficar como código morto até o change do painel de opções] → aceito conscientemente (ver Non-Goals); o slot é barato de manter (uma prop opcional) e evita reabrir o componente quando o painel existir.
