## 1. Componente `switch-btn`

- [x] 1.1 Criar `src/features/minimalist/components/minimalist-switch-btn.tsx` com `switchBtnVariants` (cva) no topo e `MinimalistSwitchBtn` abaixo, props `appearance`, `current`, `label`, `onClick?`, `state?` (`regular`/`hover`/`focus`, default `regular`), renderizando `aria-pressed={current}`
- [x] 1.2 Remover `switchButtonVariants`/`SwitchButtonVariantProps` de `src/features/minimalist/variants.ts`
- [x] 1.3 Remover `SwitchButton` de `src/features/minimalist/components/minimalist-controls.tsx`

## 2. Composições de switch

- [x] 2.1 Criar `src/features/minimalist/components/minimalist-switches.tsx` movendo `I18nToggle` e `ThemeToggle` de `minimalist-controls.tsx` (atualizando o import para `MinimalistSwitchBtn`)
- [x] 2.2 Adicionar `ModeToggle` em `minimalist-switches.tsx`: `minimalist-control-group` com label i18n (`recruiter.mode`), dois `MinimalistSwitchBtn` (`R`/`C`) separados por `Divider` `variant="v1"` vertical; `C` recebe `disabled`
- [x] 2.3 Remover `I18nToggle`/`ThemeToggle` de `minimalist-controls.tsx`

## 3. CSS (BEM)

- [x] 3.1 Renomear bloco `.minimalist-switch` → `.minimalist-switch-btn` em `src/features/minimalist/styles.css`: remover `border`, `padding`, `background`; manter `font-size: var(--minimalist-font-size-large)`, `text-transform: uppercase`, `cursor: pointer`
- [x] 3.2 Aplicar cor por estado, escopada por appearance: `.minimalist-theme--light .minimalist-switch-btn--current` → `var(--minimalist-alpha-black-100)` + `text-decoration: underline`; `.minimalist-theme--dark .minimalist-switch-btn--current` → `var(--minimalist-alpha-white-100)` + underline
- [x] 3.3 `.minimalist-theme--light .minimalist-switch-btn--idle` → `var(--minimalist-alpha-black-40)`; `.minimalist-theme--dark .minimalist-switch-btn--idle` → `var(--minimalist-alpha-white-50)`
- [x] 3.4 Hover/focus não-corrente — tanto via `:hover`/`:focus-visible` nativos quanto via `--hover`/`--focus` (prop `state`, para o showcase): `.minimalist-theme--light .minimalist-switch-btn--idle:hover, ...--hover, ...--focus` → `var(--minimalist-alpha-black-80)`; equivalente dark → `var(--minimalist-alpha-white-80)`; sem `text-decoration`, sem `border-color`
- [x] 3.5 Remover o override `.minimalist-recruiter__header .minimalist-switch` (linhas ~338-351) e as classes `.minimalist-recruiter__mode`, `.minimalist-recruiter__mode-label`, `.minimalist-recruiter__mode--active` (linhas ~359-377)

## 4. Call sites

- [x] 4.1 Atualizar `src/features/minimalist/components/minimalist-showcase.tsx`: importar `MinimalistSwitchBtn` de `minimalist-switch-btn.tsx` e `I18nToggle`/`ThemeToggle` de `minimalist-switches.tsx`
- [x] 4.2 Atualizar `src/features/minimalist/components/minimalist-recruiter.tsx`: importar `I18nToggle`/`ThemeToggle`/`ModeToggle` de `minimalist-switches.tsx`; substituir o bloco `minimalist-recruiter__mode*` (linhas ~264-277) por `<ModeToggle appearance={appearance} current="R" onChange={...} />` (ou props equivalentes definidas em 2.2)
- [x] 4.3 Confirmar que `src/messages/en.json` e `src/messages/pt-BR.json` já cobrem o label do `ModeToggle` (`recruiter.mode` existe: `"MODE:"`/`"Mode:"`); adicionar chave nova apenas se `ModeToggle` precisar de um texto que não exista

## 5. Verificação

- [x] 5.1 `npx pnpm typecheck`
- [x] 5.2 `npx pnpm lint`
- [x] 5.3 `npx pnpm format:check`
- [x] 5.4 Conferir visualmente contra o node Figma (`node-id=2099-1997`): os 3 switches (idioma, tema, modo) no cabeçalho do recruiter, em `npx pnpm dev`, light e dark — sem chip/borda, `current` sublinhado a 100%, `idle` a 40%/50% opacidade. `MinimalistShowcase` (8 estados regular/hover/focus/current) não está montada em nenhuma rota do app (pré-existente a este change) — a paridade de CSS foi verificada por leitura de código contra os tokens do design, não em navegador.
- [x] 5.5 Correção pós-review (Figma MCP indisponível por rate limit; validado via Playwright abrindo o arquivo Figma diretamente + comparação de pixels com ImageMagick): (a) `.minimalist-switch-btn--current` estava sem `text-underline-offset` — o valor `3px` do antigo override do header (removido em 3.5) não tinha sido incorporado à regra base; medição de pixel confirmou gap de sublinhado ~3px no Figma contra ~2px (padrão do browser) no local antes da correção. (b) O `C` do `ModeToggle` renderizava desbotado demais: a opacidade global `.minimalist-theme button:disabled` (0.4) multiplicava sobre a cor `--idle` (já 40%/50% alpha), resultando em ~16% de opacidade efetiva; a referência Figma mostra `C` na mesma cor idle plana de qualquer outra opção não-corrente, sem desbotamento extra. Adicionado `.minimalist-theme .minimalist-switch-btn:disabled { opacity: 1; cursor: not-allowed; }` para neutralizar o dimming global só neste átomo.
