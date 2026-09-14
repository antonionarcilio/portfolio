## Why

O `Button` do Minimalist hoje só implementa a variante visual `button/collapse` do Figma. O design adicionou uma segunda variante (`button/secondary`, node `4173:5008`) que precisa ser exposta via uma nova prop `variant`, mantendo a variante atual como `primary` (padrão). Ao investigar o componente, também foi constatado que os estados de cor/hover/focus/disabled do `Button` estão implementados em `styles.css` (`.minimalist-button--light`/`--dark` + regras de `:hover`/`:focus-visible`/`:disabled`), o que viola a spec já existente `minimalist-style-boundary` (estados simples de cor/opacidade/decoração devem ser Tailwind/CVA no componente, não CSS). Esta mudança é o momento natural para corrigir isso, já que o componente será tocado de qualquer forma.

## What Changes

- Adiciona prop `variant: 'primary' | 'secondary'` ao `Button` (default `'primary'`), independente da prop `appearance` (`light`/`dark`) existente.
- Renomeia a variante visual atual para `primary` (nenhuma mudança visual).
- Implementa a variante `secondary` conforme Figma `button/secondary` (`4173:5008`): mesmo label, tipografia e escala de opacidade (100%/70%/30%) de `primary`, mas **sem os colchetes `[`/`]`** e **com `text-decoration: underline`** em `hover`/`focus`.
- Migra os estados de cor (`default`/`hover`/`focus`/`disable`) de `appearance` × `variant` de `styles.css` para classes Tailwind via `compoundVariants` do CVA, removendo as regras `.minimalist-button--light`/`--dark` e seus blocos de `:hover`/`:focus-visible`/`:disabled` de `styles.css`. A regra de fallback de opacidade dos colchetes (`.minimalist-button__bracket`) permanece em CSS — é um workaround documentado para uma particularidade do `AnimatePresence`, não um estado simples.
- Cria uma página de preview (dev-only) que renderiza a matriz completa `variant × appearance × state` do `Button` para validação visual manual contra o Figma.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `minimalist-button`: adiciona o eixo `variant` (`primary`/`secondary`) à matriz visual do componente e migra a implementação dos estados de cor/decoração de CSS para Tailwind/CVA, alinhando com `minimalist-style-boundary`.

## Impact

- `src/features/minimalist/components/button.tsx` — nova prop `variant`, `compoundVariants` no CVA, renderização condicional dos colchetes.
- `src/features/minimalist/types.ts` — novo tipo `MinimalistButtonVariant` (ou equivalente).
- `src/features/minimalist/styles.css` — remoção das regras de cor/hover/focus/disabled do `Button` (linhas ~220-254), mantendo apenas o fallback de opacidade dos colchetes.
- Nova rota de preview dev-only (ex.: `src/app/[locale]/dev/minimalist-button/page.tsx`) — não faz parte do portfólio público, existe só para QA visual.
- Nenhum consumidor existente do `Button` muda de comportamento (todos continuam recebendo `variant="primary"` por default).
- Uso do Figma MCP: 1 chamada (`get_figma_data` no node `4173:5008`, plano free com limite de 6/mês) — não são necessárias chamadas adicionais de imagem, pois a variante é só texto/tipografia.

## Non-goals

- Não adiciona novos eixos visuais (`size`, `icon`, `loading`, `pressed`) além do já existente `state`/`appearance` e do novo `variant`.
- Não migra outras famílias de controle Minimalist (toggle, pagination, card, etc.) para Tailwind — escopo limitado ao `Button`.
- Não altera o comportamento nem o texto do botão "VER MAIS" já usado no recrutador; a migração de CSS é puramente de implementação, sem mudança visual observável na variante `primary`.
