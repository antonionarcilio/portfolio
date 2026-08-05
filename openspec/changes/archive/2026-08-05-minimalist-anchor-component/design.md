## Context

Hoje `linkVariants`/`MinimalistLink` vivem em `src/features/minimalist/variants.ts` (cva) + `src/features/minimalist/components/minimalist-links.tsx` (componente), junto com outras 9 variantes (button, divider, toggle, card, etc.) no mesmo arquivo `variants.ts`. A cor ainda é resolvida via 2 CSS custom properties (`--minimalist-foreground`, `--minimalist-accent`) — o componente em si não mudou.

O que mudou desde a primeira versão deste design: o change `minimalist-design-tokens-parity` (já implementado, ainda não arquivado) unificou os blocos `.minimalist-theme--light`/`--dark` em `src/features/minimalist/styles.css` e passou a expor, em `.minimalist-theme` (`styles.css:5-31`), a escala completa de alpha do Figma como custom properties reutilizáveis — `--minimalist-alpha-black-{30,40,50,60,70,80,100}` e `--minimalist-alpha-white-{30,40,50,60,70,80,100}` — e pesos de fonte nomeados `--minimalist-weight-{light,regular,medium,semibold,bold}` (300–700). Também removeu `tokens.ts`: cor/opacidade/peso agora só existem como CSS. Como efeito colateral, `--minimalist-foreground` já resolve para `var(--minimalist-alpha-black-100)`/`var(--minimalist-alpha-white-100)` e `--minimalist-muted` para `var(--minimalist-alpha-black-60)`/`var(--minimalist-alpha-white-60)`, dependendo da appearance.

O node de referência no Figma (`node-id=2101-1277`, arquivo `oaRNKV5sEnHE2gffqUbMJl`) define o Anchor com 4 eixos (`appearance`, `variant`, `state`, `uppercase`) e usa 5 desses degraus de opacidade (100/70/60/50/30) por variant+state+appearance — todos já cobertos pela escala acima. Ver proposal.md para a motivação completa e specs/minimalist-component-system/spec.md para o contrato de comportamento.

## Goals / Non-Goals

**Goals:**
- Isolar Anchor num arquivo autocontido (cva + componente), seguindo a convenção do projeto (CLAUDE.md § Variants: cva usado por 1 único componente fica local ao arquivo do componente).
- Fazer o Anchor bater pixel-a-pixel com os 32 estados do node Figma (2 appearance × 3 variant × 4 state × 2 uppercase, mais a variação de sublinhado).

**Non-Goals:**
- Não abstrair Button, Divider, Toggle e demais componentes de `variants.ts` neste change — o pedido do usuário é explicitamente "começar com o Anchor"; os demais ficam para changes futuros (evita um diff gigante e mistura de revisão).
- Não criar `src/shared/variants/` — a variante do Anchor tem hoje 1 único consumidor (`minimalist-anchor.tsx`); a regra do projeto só manda promover para shared quando há ≥2 arquivos consumindo a mesma definição.
- Não alterar `--minimalist-foreground`/`--minimalist-accent`/`--minimalist-muted` nem seus consumidores atuais (usados por outros componentes).
- Não recriar a escala de alpha ou de peso de fonte — ambas já existem em `.minimalist-theme` desde `minimalist-design-tokens-parity`; este change só consome.

## Decisions

**1. Co-localizar cva + componente em `minimalist-anchor.tsx`, não criar uma pasta `variants/` nova.**
Segue a convenção já usada no projeto para variantes de único consumidor (cva no topo do arquivo do componente). Alternativa considerada: mover para `src/shared/variants/anchor.ts` — rejeitada porque a regra do projeto reserva `src/shared/variants/` para variantes usadas em ≥2 arquivos, e hoje só há 1 arquivo de componente consumindo `linkVariants`.

**2. Estados hover/focus/disable via CSS nativo (`:hover`, `:focus-visible`, `[aria-disabled="true"]`), não via prop `state`.**
O node Figma modela `state` como enum (`default | hover | focus | disable`) porque é assim que o Figma representa variantes de interação para design, mas no código um `<a>` real já expõe hover/focus nativamente pelo browser — replicar isso como prop obrigaria o chamador (ou um listener JS) a sincronizar manualmente algo que o CSS já resolve sem JS. `disabled` é a exceção: âncoras HTML não têm atributo `disabled` nativo, então vira prop (`disabled?: boolean`) que aplica `aria-disabled="true"`, `pointer-events-none`, `tabIndex={-1}` e bloqueia navegação. Alternativa considerada: prop `state` explícita espelhando o Figma 1:1 — rejeitada por reintroduzir estado que o navegador já gerencia e por poder dessincronizar do hover real do mouse/teclado.

**3. Reaproveitar os tokens de alpha/peso já existentes (`--minimalist-alpha-black-*`/`--minimalist-alpha-white-*`, `--minimalist-weight-*`), sem criar nenhum token novo.**
Na primeira versão deste design, `minimalist-design-tokens-parity` ainda não existia e a escala de opacidade do Figma (preto/branco puro) não tinha nenhuma representação no CSS — a decisão original era criar `--minimalist-anchor-{100,70,60,50,30}` dedicados. Isso já não é necessário: aquele change introduziu a escala completa (`alpha-black/white-{30,40,50,60,70,80,100}`) e os pesos nomeados em `.minimalist-theme`, e `--minimalist-foreground`/`--minimalist-muted` já resolvem, por appearance, para os degraus 100% e 60% que o Anchor precisa. A regra de aplicação por variant/state:
  - `variant` `primary`/`secondary`, estado `default` → `var(--minimalist-foreground)` (100%, já resolvido por appearance).
  - `variant` `tertiary`, estado `default` → `var(--minimalist-muted)` (60%, já resolvido por appearance).
  - Estado `hover`/`focus` em `primary`/`secondary` (70%) e em `tertiary` (50%), e estado `disable` em qualquer variant (30%) → referenciar diretamente `var(--minimalist-alpha-black-{70,50,30})`/`var(--minimalist-alpha-white-{70,50,30})`, escopado por `.minimalist-theme--light`/`--dark .minimalist-anchor`, em vez de um alias semântico já existente que coincida numericamente (ex.: `--minimalist-divider-inner` também é 50%) — usar um alias de outro domínio (divider) para o Anchor acopla os dois sem relação conceitual; se o valor do divider mudar por razões próprias, o Anchor quebraria silenciosamente.
  - `--minimalist-weight-regular`/`--minimalist-weight-bold`/`--minimalist-weight-medium` para `variant` `primary`/`secondary`/`tertiary`, respectivamente.

**4. Sublinhado replicado exatamente como no Figma (assimétrico: só dark + primary/secondary + hover/focus), sem "corrigir" a assimetria.**
O pedido do usuário foi "deixá-lo no exato padrão proposto no Figma" — o Figma, nó a nó, não define sublinhado para `light` nem para `tertiary` em nenhum estado. Tratar isso como bug do Figma e "consertar" seria uma decisão de design não pedida; a spec registra o comportamento como está no arquivo de referência.

**5. Renomear `MinimalistLink` → `MinimalistAnchor` e `.minimalist-link` → `.minimalist-anchor`.**
Alinha nome do componente/BEM ao nome usado no Figma e evita ambiguidade com um futuro componente `Link` do Next.js (`src/i18n/navigation.ts`) que já existe no projeto para navegação interna — `Anchor` deixa claro que é para links externos/âncoras `<a>` cruas.

## Risks / Trade-offs

- [Renomear componente e BEM class é breaking a nível de código interno] → mitigado por ser um único change que já atualiza os 7 call sites (`minimalist-showcase.tsx`, `minimalist-recruiter.tsx`) na mesma revisão; não há consumidor externo ao repo.
- [Mudança de default `uppercase: false → true` altera visualmente o link `item.companyUrl`] → intencional (ver proposal.md § Impact); verificar visualmente nos dois locales/appearances antes de mergear (tarefa dedicada em tasks.md).
- [Este change depende de tokens introduzidos por `minimalist-design-tokens-parity`, que ainda não foi arquivado] → sem risco funcional: o código daquele change já está aplicado em `styles.css` (tokens existem hoje), esta nota é só para rastreabilidade caso ele seja revertido antes do archive.
