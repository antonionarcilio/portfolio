## Why

O componente de acessibilidade (`a11y-trigger` no Figma, `node-id=2109-3862`) hoje só existe como `a11yTriggerVariants` dentro de `src/features/minimalist/variants.ts` (1 de 9 `cva()` no mesmo arquivo) e como `A11yTrigger` dentro de `src/features/minimalist/components/minimalist-navigation.tsx` (1 de 4 componentes no mesmo arquivo, junto com `NavigationHint`, `Step` e `SectionSwitch`) — sem arquivo dedicado, ao contrário do que já foi feito para o Anchor (`minimalist-anchor-component`) e o Switch (`minimalist-switch-btn-component`). A leitura direta do node Figma (via MCP do Figma até o limite do plano Starter ser atingido, complementada pela extensão Chrome apontada para o mesmo arquivo, conforme a ordem de fallback pedida) mostra 8 variantes (`state` × `appearance` × `opened`) e confirma divergências na implementação atual:

- **Cor errada no hover/opened**: o CSS atual usa `--minimalist-accent` (roxo) em `:hover`/`--opened`; o Figma nunca usa a cor de destaque neste componente — o ícone dimming em `hover`/`focus` para 40% (claro) / equivalente escuro, e volta a 100% quando `opened=true` (mesmo tom do estado `regular`).
- **Espaçamento errado**: `gap: 8px` no bloco base (`styles.css:171-183`, compartilhado com `.minimalist-section-switch`) contra `gap: 4px` no Figma; o cabeçalho do recruiter já tem um override local (`gap: 4px`) que na prática mascarava o valor base errado.
- **Tamanho de fonte errado por padrão**: `font-size: 14px` herdado do seletor compartilhado com `.minimalist-section-switch`, contra os 16px (`--minimalist-font-size-large`) do Figma — de novo mascarado por um override só no cabeçalho do recruiter.
- **Ícone de acessibilidade sem tamanho próprio**: o `<Image>` do ícone `accessibility.svg` usa `width=16 height=16`, igual ao ícone de chevrons; no Figma o ícone de acessibilidade tem 20×20 e o de chevrons 16×16.
- **Badge de contagem ausente**: o Figma tem um terceiro elemento opcional — um texto (`(1)`, tipografia igual ao resto do componente, sempre 100% de opacidade mesmo quando o ícone está dimmed) controlado pela propriedade booleana `activedOption`. A implementação atual não tem esse slot.

## What Changes

- Extrair `a11yTriggerVariants` + o componente para um arquivo dedicado: `src/features/minimalist/components/minimalist-a11y-trigger.tsx` (cva no topo, mesma convenção de `minimalist-anchor.tsx`/`minimalist-switch-btn.tsx`). **BREAKING** (interno): remove `a11yTriggerVariants`/`A11yTriggerVariantProps` de `variants.ts`; renomeia `A11yTrigger` → `MinimalistA11yTrigger`.
- Corrigir a paleta para bater com o Figma, reaproveitando somente tokens de alpha já existentes/planejados em `.minimalist-theme` (`--minimalist-alpha-black-*`/`--minimalist-alpha-white-*`, de `minimalist-design-tokens-parity`) — sem criar nenhum token novo:
  - Ícone (accessibility + chevrons) a 100% de opacidade em `regular` e em `opened=true` (qualquer `state`); dimmed (~40%/tom equivalente) em `hover`/`focus` quando `opened=false`.
  - Nunca usar `--minimalist-accent` neste componente.
  - Texto do badge opcional sempre a 100% de opacidade, independente do estado do ícone.
- Corrigir geometria: `gap: 4px` (era 8px), `font-size: var(--minimalist-font-size-large)` (16px, era 14px) como valor base — remove o override hoje restrito ao cabeçalho do recruiter, que deixa de ser necessário.
- Corrigir o tamanho do ícone de acessibilidade para 20×20 (mantendo o ícone de chevrons em 16×16).
- Adicionar o slot de badge opcional (`(N)`) visto no Figma, controlado por uma prop nova (ex.: `activeCount?: number`) — renderiza apenas quando definido, com a mesma tipografia do restante do componente, sempre a 100% de opacidade.
- Atualizar os call sites (`minimalist-showcase.tsx`, `minimalist-recruiter.tsx`) para o novo nome/arquivo.

## Non-goals

- Não construir o painel/menu de opções de acessibilidade do tema minimalista — hoje `A11yTrigger` só alterna um `boolean` local (`a11yOpen`/`a11yOpened`) sem nenhum painel de opções por trás; este change cobre apenas o botão-gatilho.
- Não conectar o badge `activeCount` a uma contagem real de opções ativas — não existe hoje, no tema minimalista, um equivalente ao `A11yProvider`/`useA11y` do tema `gamified` (que vive em `src/features/gamified/contexts/a11y-context.tsx` e não é consumido por `minimalist`). O componente expõe o slot visual; ligar isso a um estado real fica para um change futuro que trate o painel de opções em si.
- Não abstrair `NavigationHint`, `Step`, `StepPagination` ou `SectionSwitch` (os demais componentes de `minimalist-navigation.tsx`) neste change — o pedido do usuário é explicitamente focado no componente de acessibilidade.
- Não criar `src/shared/variants/` — `a11yTriggerVariants` continua com um único arquivo de componente consumidor.

## Capabilities

### Modified Capabilities

- `minimalist-component-system`: o requirement "Figma component fidelity" (que já lista `a11y-trigger` genericamente) ganha uma nova requirement dedicada, "A11y trigger component fidelity", com a paleta exata por estado (regular/hover/focus × opened=false/true × light/dark), geometria (gap, tamanhos de ícone, tipografia) e o comportamento do badge opcional, capturados do node `2109:3862`.

## Impact

- `src/features/minimalist/variants.ts` — remove `a11yTriggerVariants`/`A11yTriggerVariantProps`.
- `src/features/minimalist/components/minimalist-a11y-trigger.tsx` — novo: `a11yTriggerVariants` (cva) + `MinimalistA11yTrigger`.
- `src/features/minimalist/components/minimalist-navigation.tsx` — perde `A11yTrigger`/`a11yTriggerVariants`; mantém `NavigationHint`, `Step`, `StepPagination`, `SectionSwitch`.
- `src/features/minimalist/components/minimalist-recruiter.tsx` — atualiza import e passa o novo prop de badge quando aplicável.
- `src/features/minimalist/components/minimalist-showcase.tsx` — atualiza import (`MinimalistA11yTrigger`).
- `src/features/minimalist/styles.css` — renomeia bloco relevante de `.minimalist-a11y-trigger` (hoje compartilhado com `.minimalist-section-switch`) para ter suas próprias regras de `gap`/`font-size`/cor; remove `color: var(--minimalist-accent)` de `:hover`/`--opened`; remove o override `.minimalist-recruiter__header .minimalist-a11y-trigger` (deixa de ser necessário); adiciona classe de tamanho para o ícone de acessibilidade (20×20) distinta do ícone de chevrons (16×16).
- Mudança visual: o gatilho de acessibilidade deixa de ficar roxo em hover/aberto; passa a esmaecer o ícone em hover/foco (sem mudar o texto do badge) e mantém opacidade total quando aberto, igual ao Figma.
