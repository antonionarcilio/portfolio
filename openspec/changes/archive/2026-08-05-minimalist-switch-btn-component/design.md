## Context

`switchButtonVariants` (cva) vive em `src/features/minimalist/variants.ts` e `SwitchButton`/`I18nToggle`/`ThemeToggle` em `src/features/minimalist/components/minimalist-controls.tsx`, junto com `OnOffToggle`, `PaginationButton` e `Divider` — mesmo arquivo, 5 componentes. `switchButtonVariants` hoje resolve para a classe `.minimalist-switch` (`styles.css:540-568`): borda 1px, padding `6px 9px`, `font-size` pequeno (12px), e cor de destaque roxa (`--minimalist-accent`) em `current`/`hover`/`focus`. Essa classe é sobrescrita dentro do cabeçalho do recruiter (`.minimalist-recruiter__header .minimalist-switch`, `styles.css:338-351`) para zerar borda/padding e trocar a cor de destaque por `--minimalist-foreground`/`--minimalist-muted` com sublinhado — ou seja, o cabeçalho já usa uma aproximação visual diferente da usada no showcase/inventário, sinal de que a classe base nunca bateu com o Figma.

A leitura direta do node Figma (`fileKey=oaRNKV5sEnHE2gffqUbMJl`, `node-id=2099-1997`, componente `SwitchBtn`) via `get_design_context`/`get_metadata` retornou 8 variantes (`appearance` × `current` × `state`, sem `state` quando `current=true`) e via `get_variable_defs` os tokens exatos: `alpha-black-100`/`alpha-white-100` (current, com sublinhado), `alpha-black-40`/`alpha-white-50` (regular, não current), `alpha-black-80`/`alpha-white-80` (hover ou focus, não current). Nenhuma borda, padding ou fundo aparece em nenhuma das 8 variantes — o botão é só texto. `src/features/minimalist/styles.css` já expõe exatamente esses tokens (`--minimalist-alpha-black-{40,80,100}`, `--minimalist-alpha-white-{50,80,100}`, de `minimalist-design-tokens-parity`), então nenhum token novo é necessário — ver proposal.md § Impact.

O divisor entre as duas opções de um grupo (ex. `PT`/`EN`) já é renderizado como componente `Divider` real (`variant="v1"`, `orientation="vertical"`) entre os dois `SwitchButton`s em `I18nToggle`/`ThemeToggle` — não como borda do botão. A requirement existente "Switch component divider fidelity" (de `minimalist-header-content-parity`, já arquivado) descrevia esse divisor como "borda" do botão; esta é uma imprecisão da spec anterior, corrigida na delta deste change (ver specs/minimalist-component-system/spec.md).

O modo `R`/`C` no cabeçalho do recruiter (`minimalist-recruiter.tsx:264-277`) não usa `SwitchButton` — é markup solto com classes próprias (`.minimalist-recruiter__mode`, `--active`), `aria-current="page"` no `R` e `disabled aria-disabled="true"` (redundante) no `C`.

## Goals / Non-Goals

**Goals:**

- Fazer o `switch-btn` bater pixel-a-pixel com as 8 variantes do node Figma, nos 3 usos (idioma, tema, modo).
- Isolar o átomo e as 3 composições em arquivos dedicados, sem tocar nos outros componentes de `minimalist-controls.tsx`.

**Non-Goals:**

- Não implementar a funcionalidade real do modo `C` — ver proposal.md § Non-goals.
- Não mudar o anel de foco global (`.minimalist-theme button:focus-visible`), que já cobre a indicação de foco por teclado independente da cor de texto do `switch-btn`.

## Decisions

**1. Co-localizar cva + componente em `minimalist-switch-btn.tsx`; composições em `minimalist-switches.tsx`.**
Mesmo padrão já usado para o Anchor (`minimalist-anchor.tsx`): cva no topo do arquivo de único consumidor. As composições (`I18nToggle`/`ThemeToggle`/`ModeToggle`) ganham arquivo próprio porque compartilham uma dependência (`MinimalistSwitchBtn` + `Divider`) e uma forma (`minimalist-control-group`) que não faz sentido dividir entre 3 arquivos separados — juntá-las em um só evita o extremo oposto (1 arquivo por componente de 10-15 linhas).

**2. Manter a prop `state` (`regular`/`hover`/`focus`) no átomo, em vez de removê-la como foi feito no Anchor.**
O Anchor é um `<a>` e removeu `state` porque hover/focus reais já são CSS nativo e não há necessidade de forçar visualização de um estado sem interação real. O `switch-btn`, assim como `PaginationButton` (que já mantém `state` no mesmo arquivo `minimalist-controls.tsx`), precisa continuar exibindo os 4 estados lado a lado no showcase (`minimalist-inventory__states`, `minimalist-showcase.tsx:56-59`) sem exigir hover/foco real do usuário — a prop força a classe visualmente. A interação real (mouse/teclado) continua resolvida por seletores CSS nativos `:hover`/`:focus-visible` na mesma classe, independentemente da prop. Alternativa considerada: remover `state` e recriar o showcase com pseudo-elementos ou Storybook-like forçamento via CSS `:has()` — rejeitada por exigir infraestrutura nova para um showcase interno que já resolve isso com uma prop.

**3. Paleta via seletor CSS escopado por `.minimalist-theme--light`/`--dark .minimalist-switch-btn`, reaproveitando os tokens de alpha existentes — nenhum token novo.**
Mesma técnica já usada em `minimalist-anchor-component` (Decision 3 daquele design). Regra de aplicação:
  - `current=true` (qualquer `state`) → `var(--minimalist-alpha-black-100)` (light) / `var(--minimalist-alpha-white-100)` (dark) + `text-decoration: underline`.
  - `current=false`, `state=regular` → `var(--minimalist-alpha-black-40)` (light) / `var(--minimalist-alpha-white-50)` (dark).
  - `current=false`, `state=hover`/`focus` (via prop) OU `:hover`/`:focus-visible` nativo → `var(--minimalist-alpha-black-80)` (light) / `var(--minimalist-alpha-white-80)` (dark).

**4. `ModeToggle` reaproveita `MinimalistSwitchBtn` + `Divider` com a mesma estrutura de `I18nToggle`/`ThemeToggle` (`minimalist-control-group`), trocando `aria-current="page"` por `aria-pressed` e o CSS bespoke `.minimalist-recruiter__mode*` pela classe compartilhada `.minimalist-switch-btn`.**
Unifica os 3 switches no mesmo átomo, eliminando a duplicação de CSS (`styles.css:359-377`) que só existia porque o modo nunca usou o componente. `C` continua desabilitado via atributo nativo `disabled` do `<button>` — o dimming já vem de `.minimalist-theme button:disabled { opacity: var(--minimalist-disabled-opacity); }`, regra global já aplicada a todo botão do tema; nenhum CSS de disable específico do `switch-btn` é necessário (o Figma também não define uma variante "disable" para este componente). Alternativa considerada: manter `aria-current="page"` por já estar em produção — rejeitada porque não é semanticamente navegação de página, e os outros dois switches (que têm o mesmo padrão de seleção exclusiva) já usam `aria-pressed`.

**5. Remover o override `.minimalist-recruiter__header .minimalist-switch` (`styles.css:338-351`) em vez de ajustá-lo.**
Depois da correção da Decision 3, a classe base já produz exatamente a aparência que o override tentava simular (sem borda/padding, 16px, sublinhado só em `current`) — o override se torna redundante. Mesma lógica de "consertar a base, não o caso especial" já registrada no design de `minimalist-header-content-parity`.

## Risks / Trade-offs

- [Remover borda/padding do `.minimalist-switch-btn` reduz a área de toque/clique do botão em telas touch] → Mitigação: o Figma não define padding para este componente; não é uma regressão introduzida por este change, é a paridade pedida. Fica registrado aqui caso vire um change de acessibilidade dedicado no futuro.
- [Renomear `SwitchButton` → `MinimalistSwitchBtn` e mover `I18nToggle`/`ThemeToggle` de arquivo é breaking a nível de código interno] → mitigado por ser um único change que já atualiza os 2 call sites (`minimalist-showcase.tsx`, `minimalist-recruiter.tsx`) na mesma revisão; sem consumidor externo ao repo.
- [A requirement "Switch component divider fidelity" está sendo reescrita para corrigir uma imprecisão de um change já arquivado] → sem risco funcional: o comportamento observável (divisor visível, sem borda no botão) já é o que o Figma sempre definiu; só a descrição do mecanismo estava errada.
