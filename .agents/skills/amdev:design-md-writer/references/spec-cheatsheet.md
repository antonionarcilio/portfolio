# DESIGN.md spec: cheatsheet (alpha)

Fonte: google-labs-code/design.md `docs/spec.md` e o README do pacote npm `@google/design.md` (v0.4.x). O
formato é alpha e muda. Se algo aqui contradisser o linter, o linter vence. Para ler a spec completa:
`npx -y @google/design.md spec --rules`.

## Estrutura do arquivo

```
---            ← frontmatter YAML (tokens normativos)
...
---
# <Name>       ← h1 opcional, não é parseado
## Overview    ← seções ##, na ordem canônica
...
```

- Tokens também podem ir em blocos ```yaml dentro das seções. Todos se fundem numa árvore só, e **cada chave
  de topo pode ser definida uma única vez** no documento (duplicata = erro).
- Seção `##` duplicada = erro (arquivo rejeitado).

## Chaves de topo do YAML

| Chave | Tipo | Obs. |
|---|---|---|
| `version` | string | `"alpha"` |
| `name` | string | trate como obrigatória |
| `description` | string | 1 parágrafo denso: personalidade, paleta, tipo, geometria |
| `omitted` | lista de `string` ou `{section, reason}` | silencia avisos de seções ausentes |
| `colors` | `name: Color` (aceita grupos aninhados) | precisa de `primary` |
| `typography` | `name: Typography` | |
| `rounded` | `level: Dimension` | |
| `spacing` | `level: Dimension \| number` | |
| `motion` | `name: Motion` | **linter 0.4 ainda não reconhece** (warning "not a recognized schema key"); ver nota abaixo |
| `components` | `name: { prop: valor \| "{ref}" }` | |

### Tipos

- **Color:** string CSS. Prefira `"#RRGGBB"` (aceita `#RRGGBBAA`, `rgb()`, `hsl()`, `oklch()`, `color-mix()`).
  Sempre entre aspas no YAML.
- **Dimension:** número com `px`, `rem` ou `em` (`"16px"`, `"-0.02em"`).
- **Duration:** número com `ms`.
- **Typography:** `fontFamily`, `fontSize`, `fontWeight` (número), `lineHeight` (sem unidade é o recomendado),
  `letterSpacing`, `fontFeature`, `fontVariation`.
- **Motion:** `duration`, `delay`, `timingFunction` (`ease-out`, `cubic-bezier(...)`).
- **Token reference:** `"{colors.primary}"`. Fora de `components`, precisa apontar para um valor primitivo
  (não para um grupo). Dentro de `components`, pode apontar para um composto (`"{typography.label-md}"`).

### Propriedades válidas em `components`

`backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Qualquer
outra (por exemplo, `borderColor`) é aceita com warning. Prefira descrevê-la na prosa.

**Não declare `backgroundColor: transparent`.** O linter calcula contraste contra `#00000000` e acusa 1:1
(falso positivo). Omita a propriedade e diga "transparent" na prosa.

Estados e variantes são **chaves irmãs**: `button-primary`, `button-primary-hover`, `button-primary-disabled`.

### Grupos

`colors`, `typography`, `rounded` e `spacing` aceitam submapas (por exemplo, `colors.light.surface`).
Convenções: grupos `light`/`dark`, e breakpoints `sm`/`md`/`lg`/`xl` para valores responsivos. Erro: um nome
plano e um agrupado que geram o mesmo caminho (`primary-light` × `primary.light`).

### Nomes recomendados (não normativos)

- colors: `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error` (+ `on-*`, `*-tint`)
- typography: `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`,
  `label-md`, `label-sm`
- rounded: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `full`
- motion: `state-change`, `surface-enter`, `surface-exit`

### Divergência spec × linter (v0.4.x)

A spec lista `motion` e as seções Motion/Voice, mas o linter 0.4 só reconhece `colors`, `typography`,
`spacing`, `rounded` e `components`, e rejeita `Voice & Content Strategy` em `omitted`. Até o linter
alcançar a spec:
- documente motion **só na prosa** da seção `## Motion & Micro-interaction` (durações e easings em tabela), sem a
  chave `motion:` no YAML;
- para Voice ou Elevation & Depth omitidas, não liste em `omitted` (o linter 0.4 acusa `unknown-omission`). Basta não ter a seção.
- **Fundos translúcidos** (`#000000xx`) em `components.*.backgroundColor` geram `contrast-ratio` falso (o linter não compõe sobre a superfície). Omita o `backgroundColor` translúcido no YAML e descreva-o na prosa.
Rode `npx -y @google/design.md spec --rules` para checar se a versão instalada já mudou.

**Alpha em cores:** escreva `"#RRGGBBAA"` (por exemplo, `"#0000001A"`), nunca a opacidade solta (`.9`) nem
`rgba()` com variável. O baseline errou isso 23 vezes.

## Seções do corpo (ordem obrigatória para as presentes)

| # | Seção (aliases) | Chave YAML |
|---|---|---|
| 1 | Overview (Brand & Style) | `description` |
| 2 | Colors | `colors` |
| 3 | Typography | `typography` |
| 4 | Layout (Layout & Spacing) | `spacing` |
| 5 | Elevation & Depth (Elevation) | (prosa) |
| 6 | Shapes | `rounded` |
| 7 | Motion & Micro-interaction (Motion) | `motion` |
| 8 | Voice & Content Strategy | (prosa) |
| 9 | Components | `components` |
| 10 | Do's and Don'ts | (prosa) |

Seções desconhecidas (por exemplo, `Responsive Behavior`, `Iteration Guide`, `Known Gaps`) são preservadas sem
erro. Coloque-as **depois** de Do's and Don'ts, para não disparar `section-order`.

### `omitted`

```yaml
omitted:
  - section: Motion & Micro-interaction
    reason: "No animation system; transitions are framework defaults."
  - section: Voice & Content Strategy
    reason: "Copy is CMS-driven; tone documented elsewhere."
```

## Linter: `npx -y @google/design.md lint DESIGN.md`

Saída em JSON `{ findings[], summary{errors,warnings,info} }`. Exit code 1 se houver erros.

| Regra | Severidade | Ação |
|---|---|---|
| `broken-ref` | error | corrigir a referência |
| (seção/chave duplicada) | error | corrigir |
| `section-order` | warning | corrigir |
| `missing-primary` | warning | definir `primary` |
| `missing-typography` | warning | definir tipografia |
| `contrast-ratio` | warning | **reportar**, não alterar a cor do projeto |
| `orphaned-tokens` | warning | aceitável para cores de texto, superfície e acento usadas fora de componentes; mencionar |
| `missing-sections` | info | usar `omitted` se for intencional |
| `token-summary` | info | — |

Outros comandos úteis:
- `diff A.md B.md`: regressões de tokens entre versões (útil no modo Atualização).
- `export --format css-tailwind|json-tailwind|dtcg DESIGN.md`: gera tokens para o código (modo do zero).
