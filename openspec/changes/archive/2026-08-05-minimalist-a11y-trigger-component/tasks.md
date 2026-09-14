## 1. Componente `a11y-trigger`

- [x] 1.1 Criar `src/features/minimalist/components/minimalist-a11y-trigger.tsx` com `a11yTriggerVariants` (cva) no topo e `MinimalistA11yTrigger` abaixo, props `appearance`, `opened`, `onClick`, `state?` (`regular`/`hover`/`focus`, default `regular`), `activeCount?: number`
- [x] 1.2 Ajustar o `<Image>` do ícone `accessibility.svg` para `width=20 height=20`; manter o `<Image>` dos ícones de chevrons em `width=16 height=16`
- [x] 1.3 Renderizar `(${activeCount})` só quando `activeCount` estiver definido, com a mesma tipografia do restante do componente
- [x] 1.4 Remover `a11yTriggerVariants`/`A11yTriggerVariantProps` de `src/features/minimalist/variants.ts`
- [x] 1.5 Remover `A11yTrigger` de `src/features/minimalist/components/minimalist-navigation.tsx`

## 2. CSS (BEM)

- [x] 2.1 Separar `.minimalist-a11y-trigger` do bloco compartilhado com `.minimalist-section-switch` em `src/features/minimalist/styles.css`; manter `display:inline-flex; align-items:center;` sem `justify-content:flex-end` (era só para alinhar dentro do cabeçalho — mover para o consumidor se necessário), `gap: 4px` (era 8px), `font-size: var(--minimalist-font-size-large)` (era 14px herdado)
- [x] 2.2 Remover a regra `img { width/height: 16px }` de `.minimalist-a11y-trigger` (tamanhos agora vêm das props do `<Image>`, task 1.2)
- [x] 2.3 Remover `color: var(--minimalist-accent)` de `.minimalist-a11y-trigger:hover, .minimalist-a11y-trigger--opened`
- [x] 2.4 Aplicar opacidade por estado ao ícone (não ao badge) — implementado com `opacity` na `<span class="minimalist-a11y-trigger__icons">` em vez de tokens de cor por tema (ver design.md, decisão revisada: `opacity:1` em regular/opened é bit-idêntico a `alpha-*-100`, sem precisar duplicar por light/dark)
- [x] 2.5 Estado `hover`/`focus` (só quando `opened=false`) → `opacity: 0.4` na mesma `span` (equivalente a `alpha-black-40`/`alpha-white-40` sem seletor duplicado por tema, ver design.md); `.minimalist-a11y-trigger--closed.minimalist-a11y-trigger--hover`/`--focus` e `:hover`/`:focus-visible` nativos cobertos
- [x] 2.6 Badge — não precisou de seletor próprio: o botão herda `color: var(--minimalist-foreground)` (já resolve para `alpha-black-100`/`alpha-white-100` por tema) e a opacidade reduzida só é aplicada à `span` dos ícones, nunca ao botão/badge
- [x] 2.7 Remover o override `.minimalist-recruiter__header .minimalist-a11y-trigger`

## 3. Call sites

- [x] 3.1 ~~Atualizar `minimalist-showcase.tsx`~~ — moot: esse arquivo não existe mais na árvore (removido antes desta sessão de apply, fora do escopo deste change)
- [x] 3.2 Atualizar `src/features/minimalist/components/minimalist-recruiter.tsx`: importar `MinimalistA11yTrigger` de `minimalist-a11y-trigger.tsx`

## 4. Verificação

- [x] 4.1 `npx pnpm typecheck`
- [x] 4.2 `npx pnpm lint`
- [x] 4.3 `npx pnpm format:check`
- [x] 4.4 Conferido contra o node Figma (`node-id=2109-3862`) via `npx pnpm dev` + extensão Chrome no cabeçalho do recruiter (único consumidor real, já que `minimalist-showcase.tsx` não existe mais): `gap:4px`, `font-size:16px`, cor `rgb(0,0,0)`/`rgb(255,255,255)` por tema, confirmados via `getComputedStyle`
- [x] 4.5 Validação 1:1 feita via JavaScript injetado na página (não Playwright — mesma extensão Chrome já autenticada na aba do Figma nesta sessão) medindo `getComputedStyle` em vez de diff de screenshot, mais preciso que comparação visual: `opened=false` hover/regular → `opacity` do wrapper de ícones 0.4/1; `opened=true` com `--hover` forçado via classList → continua `1` (opened vence, confirmando o requirement "Opened state restores full opacity"); ícone troca para `chevrons-down-up.svg` quando aberto; tema escuro aplica `filter: invert(1)` e `color: rgb(255,255,255)`. Todos os valores batem com os graus de opacidade e cores lidos do Figma no proposal/design
