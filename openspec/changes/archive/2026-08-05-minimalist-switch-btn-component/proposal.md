## Why

O componente `switch-btn` (usado nos switches de idioma, tema e modo `R`/`C`) hoje só existe como `switchButtonVariants` dentro de `src/features/minimalist/variants.ts` (1 de 10 `cva()` no mesmo arquivo) e como `SwitchButton` dentro de `src/features/minimalist/components/minimalist-controls.tsx` (1 de 5 componentes no mesmo arquivo), junto com `I18nToggle`/`ThemeToggle` que o consomem — sem nenhum arquivo dedicado, ao contrário do que já foi feito para o Anchor (`minimalist-anchor-component`). Além disso, a leitura precisa do node Figma (`switch-btn`, `node-id=2099-1997`) mostra que a implementação atual diverge da referência: usa uma "chip" com borda/padding/fundo e cor de destaque roxa (`--minimalist-accent`) no estado corrente/hover/focus, enquanto o Figma não tem borda/padding/fundo nenhum — é só texto 16px com sublinhado no estado corrente e variação de opacidade preto/branco (40/50/80/100%) nos demais estados. O switch de modo (`R`/`C`) no cabeçalho do recruiter nem usa esse componente: é markup e CSS bespoke (`.minimalist-recruiter__mode`) duplicando um comportamento que deveria vir do mesmo átomo.

## What Changes

- Extrair `switchButtonVariants` + o componente para um arquivo dedicado: `src/features/minimalist/components/minimalist-switch-btn.tsx` (cva no topo, como já é convenção do projeto para variantes de único consumidor). **BREAKING** (interno): remove `switchButtonVariants`/`SwitchButtonVariantProps` de `variants.ts`; renomeia `SwitchButton` → `MinimalistSwitchBtn` (alinhado ao nome do componente no Figma, mesmo padrão usado em `MinimalistAnchor`).
- Extrair as composições de switch (`I18nToggle`, `ThemeToggle`) de `minimalist-controls.tsx` para um segundo arquivo dedicado: `src/features/minimalist/components/minimalist-switches.tsx`, e adicionar uma terceira composição nova, `ModeToggle`, para o switch `R`/`C`.
- Substituir o markup bespoke do modo `R`/`C` em `minimalist-recruiter.tsx` (`.minimalist-recruiter__mode*`) pelo novo `ModeToggle`, reaproveitando `MinimalistSwitchBtn` + `Divider` (mesmo padrão estrutural de `I18nToggle`/`ThemeToggle`) — `C` continua desabilitado (`disabled` nativo do `<button>`, funcionalidade "C" ainda não implementada), mas passa a herdar o tratamento visual/`disabled` do átomo em vez de CSS próprio.
- Corrigir a paleta e a geometria do `switch-btn` para bater com o Figma, reaproveitando somente tokens de alpha já existentes em `.minimalist-theme` (`--minimalist-alpha-black-{40,80,100}` / `--minimalist-alpha-white-{50,80,100}`, de `minimalist-design-tokens-parity`) — sem criar nenhum token novo:
  - Remove borda, padding e fundo do botão (hoje um "chip"); mantém apenas texto uppercase 16px (`--minimalist-font-size-large`), sem alterar o divisor interno "|" entre as opções de um grupo (esse já é o componente `Divider`, não a borda do botão).
  - Estado corrente (`current`): cor 100% (preto em light, branco em dark) + sublinhado — nunca cor de destaque (`--minimalist-accent`).
  - Estado regular, não corrente: 40% (light) / 50% (dark).
  - Estado hover/focus, não corrente: 80% (light e dark) — sem sublinhado, sem borda de foco colorida de destaque (o anel de foco visível já vem da regra global `:focus-visible` do tema).
- Padroniza a semântica de acessibilidade dos três switches: `aria-pressed` (átomo `MinimalistSwitchBtn`) em vez do atual `aria-current="page"` usado só no modo `R`/`C` (que não é navegação de página).
- Atualiza os call sites (`minimalist-showcase.tsx`, `minimalist-recruiter.tsx`) para os novos nomes/arquivos.

## Non-goals

- Não abstrair Button, Toggle (on/off), Pagination, Divider, Card ou os demais `cva()` de `variants.ts` neste change — o pedido do usuário é explicitamente focar no `switch-btn` (idioma/tema/modo); os demais ficam para changes futuros.
- Não redesenhar o comportamento funcional do modo `C` (ainda não implementado) — só a casca visual/estrutural do controle que hoje está desabilitado.
- Não criar `src/shared/variants/` — `switchBtnVariants` continua com um único arquivo de componente consumidor.
- Não alterar `--minimalist-accent` nem seus outros consumidores (ex.: focus ring global, `MinimalistCard`).

## Capabilities

### Modified Capabilities

- `minimalist-component-system`: os requirements "Switch, i18n, theme, and mode component parity" e "Switch component divider fidelity" passam a exigir a paleta exata por estado (regular/hover/focus/current × light/dark) capturada do node `2099-1997`, a ausência de borda/padding/fundo no botão, e a composição do modo `R`/`C` sobre o mesmo átomo `switch-btn` usado por idioma e tema.

## Impact

- `src/features/minimalist/variants.ts` — remove `switchButtonVariants`/`SwitchButtonVariantProps`.
- `src/features/minimalist/components/minimalist-switch-btn.tsx` — novo: `switchBtnVariants` (cva) + `MinimalistSwitchBtn`.
- `src/features/minimalist/components/minimalist-switches.tsx` — novo: `I18nToggle`, `ThemeToggle`, `ModeToggle` (movidos/criado), removidos de `minimalist-controls.tsx`.
- `src/features/minimalist/components/minimalist-controls.tsx` — perde `SwitchButton`/`switchButtonVariants`/`I18nToggle`/`ThemeToggle`; mantém `OnOffToggle`, `PaginationButton`, `Divider`.
- `src/features/minimalist/components/minimalist-recruiter.tsx` — troca o markup bespoke `.minimalist-recruiter__mode*` por `ModeToggle`.
- `src/features/minimalist/components/minimalist-showcase.tsx` — atualiza imports (`MinimalistSwitchBtn`, `I18nToggle`/`ThemeToggle` do novo arquivo).
- `src/features/minimalist/styles.css` — renomeia bloco `.minimalist-switch` → `.minimalist-switch-btn`, remove borda/padding/fundo, aplica cor por estado com os tokens de alpha existentes, remove o override `.minimalist-recruiter__header .minimalist-switch` (deixa de ser necessário) e as classes `.minimalist-recruiter__mode*`.
- Mudança visual: os switches de idioma/tema deixam de ter "chip" com borda e cor roxa de destaque; o modo `R`/`C` passa a ter a mesma aparência tipográfica dos outros dois switches.
