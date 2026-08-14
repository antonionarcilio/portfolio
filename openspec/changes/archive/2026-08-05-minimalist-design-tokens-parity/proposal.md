## Why

`src/features/minimalist/tokens.ts` e `src/features/minimalist/reference.ts` registram a paleta clara como `#f5f5f5`/`#111111`, mas `src/features/minimalist/styles.css` já sobrescreve essas mesmas variáveis (`.minimalist-theme--light`/`--dark`, bloco "Recruiter shell", linhas 288-304) com `#fffae5`/`#000000` — e é esse segundo bloco que vence a cascata e define a cor real renderizada hoje. Consultando o Figma (`get_variable_defs` no board de componentes, nó `4012:4142`, arquivo `oaRNKV5sEnHE2gffqUbMJl`) confirma-se que `primary/base = #fffae5` é o token de referência: o bloco novo do CSS está correto, mas `tokens.ts`/`reference.ts` ficaram defasados e ainda existe um bloco morto duplicado/conflitante em `styles.css`. O Figma também define uma escala completa de alpha (`alpha-black/white` 30/40/50/60/70/80/100) e pesos de fonte nomeados (regular/medium/semibold/bold, além de "Light" em uso pontual) que hoje não têm nenhuma representação centralizada no código — `--minimalist-muted`/`--minimalist-border` cobrem só 2 dos 7 degraus, e os pesos de fonte estão espalhados como números mágicos (300/400/500/600/700) direto nos seletores.

## What Changes

- Remover o bloco duplicado/obsoleto de `.minimalist-theme--light`/`--dark` em `styles.css` (linhas 32-39 e 23-31), mantendo um único bloco por tema, com os valores confirmados no Figma (`#fffae5`/`#000000` claro, `#000000`/`#ffffff` escuro — nomenclatura a ajustar conforme a paleta real, não mais cinza).
- Adicionar em `styles.css` a escala completa de alpha do Figma (`alpha-black-30..100`, `alpha-white-30..100`) e expor os pesos de fonte nomeados (`regular`, `medium`, `semibold`, `bold`, `light`) como custom properties, substituindo os números mágicos de `font-weight` espalhados pelos seletores.
- Atualizar `src/features/minimalist/reference.ts` (node-id `4012:4142`) — continua sendo o registro histórico "captured at design time", não consumido em runtime.
- **Remover `src/features/minimalist/tokens.ts`**: nenhum arquivo em `src/` importa `minimalistTokens` ou `appearanceClass` — é código morto que duplicava à mão os mesmos valores já vivos em `styles.css`, exatamente o tipo de divergência que esta proposta corrige. Não recriar um "registro paralelo" em TS sem um consumidor real.

## Capabilities

### New Capabilities
- `minimalist-design-tokens`: contrato de paleta de cores (claro/escuro), escala de opacidade e escala tipográfica (família, tamanhos, pesos) do tema minimalista, definidos uma única vez em `styles.css`, com o Figma como fonte de verdade e sem cópias não consumidas em TS.

### Modified Capabilities
(nenhuma — `minimalist-component-system` descreve fidelidade por componente e não muda; esta proposta cobre a camada de tokens que os componentes consomem)

## Impact

- `src/features/minimalist/styles.css`: remoção do bloco `.minimalist-theme--light`/`--dark` obsoleto; novas custom properties de alpha e peso de fonte.
- `src/features/minimalist/tokens.ts`: removido (dead code, zero consumidores).
- `src/features/minimalist/reference.ts`: node-id atualizado para o board vigente.
- Nenhuma mudança de API, rota ou dado de CMS. Sem impacto em `gamified`.
