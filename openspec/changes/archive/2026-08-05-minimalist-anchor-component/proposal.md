## Why

Os componentes de UI do minimalist (button, anchor, divider, toggle etc.) estão todos centralizados em `src/features/minimalist/variants.ts` (10 `cva()` num único arquivo), dificultando manutenção e revisão isolada. Além disso, o componente Anchor atual (`MinimalistLink`) diverge do padrão definido no Figma: falta o eixo `variant` (primary/secondary/tertiary), os estados hover/focus/disable não têm tratamento de cor completo, o eixo `uppercase` tem default divergente (`false` vs. `true` no Figma), e a paleta de cores usa apenas 2 tokens (`--minimalist-foreground`/`--minimalist-accent`) em vez dos tokens de alpha (black/white em 100/80/70/60/50/40/30) que o Figma define por variant+state+appearance — tokens esses que já existem em `.minimalist-theme` desde `minimalist-design-tokens-parity`, mas que o Anchor ainda não consome.

## What Changes

- Extrair o Anchor (`linkVariants` + `MinimalistLink`) de `variants.ts` para um arquivo dedicado e autocontido: `src/features/minimalist/components/minimalist-anchor.tsx` (cva no topo do arquivo, como já é convenção do projeto para variantes usadas por 1 único componente). **BREAKING** (interno): remove `linkVariants`/`LinkVariantProps` de `variants.ts`; renomeia `MinimalistLink` → `MinimalistAnchor` e o arquivo `minimalist-links.tsx` é substituído.
- Adicionar o eixo `variant: 'primary' | 'secondary' | 'tertiary'` (ausente hoje), controlando peso de fonte (regular/bold/medium) e cor base, conforme o node Figma.
- Corrigir a paleta de cores: em vez de `var(--minimalist-foreground)`/`var(--minimalist-accent)` fixos, aplicar por combinação `variant` × `state` × `appearance` os tokens de alpha já disponíveis em `.minimalist-theme` (`--minimalist-alpha-black-{30,40,50,60,70,80,100}`/`--minimalist-alpha-white-{...}`, introduzidos pelo change `minimalist-design-tokens-parity`, já implementado) — reaproveitando `--minimalist-foreground` (100%) e `--minimalist-muted` (60%) onde já coincidem com o degrau necessário, sem criar nenhum token novo.
- Usar os tokens de peso de fonte já existentes (`--minimalist-weight-regular/medium/bold`, também de `minimalist-design-tokens-parity`) para o eixo `variant`, em vez de literais numéricos ou classes utilitárias do Tailwind.
- Implementar os estados via CSS nativo do elemento `<a>` (não como prop booleana): `:hover`, `:focus-visible` e `[aria-disabled="true"]` para o estado "disable" (âncoras HTML não têm atributo `disabled`; usa-se `aria-disabled="true"` + `pointer-events-none` + `tabIndex={-1}` quando `disabled` for `true`).
- Replicar o sublinhado (`underline`) exatamente como no Figma: aparece apenas em `appearance="dark"` + `variant` `primary` ou `secondary` + estado `hover`/`focus` (o Figma não define sublinhado para `light` nem para `tertiary` em nenhum estado — comportamento assimétrico intencional, confirmado nó a nó).
- Corrigir o default de `uppercase` de `false` para `true`, alinhado ao Figma (`uppecase = true` no node de referência; o nome do prop já estava correto no código, sem o typo do Figma).
- Renomear a classe BEM `.minimalist-link` → `.minimalist-anchor` (bloco) com modificadores `--primary`/`--secondary`/`--tertiary` e `--uppercase`; mover regras de `:hover`/`:focus-visible` para o bloco do Anchor (hoje agrupadas com `.minimalist-a11y-trigger`).
- Atualizar os 7 call sites existentes (`minimalist-showcase.tsx`, `minimalist-recruiter.tsx`) para o novo nome/props.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `minimalist-component-system`: o requirement "Anchor component fidelity" passa a exigir o eixo `variant` (primary/secondary/tertiary), tratamento de cor por estado (default/hover/focus/disable) com os 10 tokens alpha do Figma, sublinhado condicional (dark + primary/secondary + hover/focus) e default `uppercase = true`.

## Impact

- `src/features/minimalist/variants.ts` — remove `linkVariants`/`LinkVariantProps`.
- `src/features/minimalist/components/minimalist-links.tsx` — removido; substituído por `minimalist-anchor.tsx`.
- `src/features/minimalist/components/minimalist-anchor.tsx` — novo, cva + componente `MinimalistAnchor`.
- `src/features/minimalist/styles.css` — bloco `.minimalist-anchor` (renomeado de `.minimalist-link`), variantes de cor por `variant`/estado, regra de sublinhado condicional.
- `src/features/minimalist/components/minimalist-showcase.tsx`, `minimalist-recruiter.tsx` — atualizar import/uso (`MinimalistLink` → `MinimalistAnchor`).
- Mudança visual: os dois call sites sem `uppercase` explícito — `item.companyUrl` (`minimalist-recruiter.tsx`) e o link `navigation.link` (`minimalist-showcase.tsx`, não identificado na análise original) — passam a renderizar em maiúsculas por causa do novo default; intencional, para paridade com o Figma.
