---
name: amdev:design-md-writer
description: >-
  Cria (ou atualiza) o DESIGN.md de um projeto frontend no formato da spec oficial (google-labs-code/design.md,
  alpha): frontmatter YAML com tokens (colors, typography, rounded, spacing, motion, components) + seções
  canônicas em ordem (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Motion, Voice, Components,
  Do's and Don'ts). Funciona para projeto com design system já existente (varre a fundo tokens, CSS, Tailwind,
  temas, componentes, Figma) e para projeto do zero (entrevista e depois gera DESIGN.md e, opcionalmente, os
  tokens no código). Pergunta só as lacunas, apresenta um plano para aprovação, escreve, roda o linter
  `@google/design.md` e liga o arquivo ao AGENTS.md/CLAUDE.md. Use sempre que o usuário pedir para criar,
  gerar, escrever, documentar ou atualizar um DESIGN.md, "documentar o design system", "doc de design para
  agentes de IA", "guia visual/estilo para o agente seguir", "extrair o DS do projeto", ou quiser que o agente
  pare de inventar cores/espaçamentos — mesmo sem dizer "DESIGN.md".
---

# DESIGN.md Writer

Gera um `DESIGN.md` que dá a agentes de IA uma compreensão persistente e estruturada do design do projeto.
Os **tokens** (YAML) trazem os valores exatos; a **prosa** explica *por que* existem e *como* aplicar.

O valor do arquivo está em duas coisas: ser **fiel ao que o projeto realmente é** e ser **enxuto** o
suficiente para caber no contexto de um agente. Um DESIGN.md inventado ou inchado é pior que nenhum. Por isso
o fluxo é: varrer → perguntar só lacunas → planejar → aprovar → escrever → validar → ligar.

## Referências (leia sob demanda)

- `references/spec-cheatsheet.md`: schema do frontmatter, ordem das seções, refs `{a.b}`, regras do linter e
  `omitted`. **Leia antes de escrever** qualquer coisa.
- `references/scan-checklist.md`: onde procurar tokens e padrões por stack (Tailwind v3/v4, CSS vars, CSS-in-JS,
  MUI/Chakra, Style Dictionary, Storybook, Figma MCP). Leia na Fase 2.
- `references/section-guide.md`: para cada seção, o que preencher, de onde tirar, que pergunta fazer se faltar
  e quando omitir. Leia nas Fases 3 e 5.
- `references/example-condensed.md`: um DESIGN.md de referência (Notion, condensado) para calibrar tom e
  densidade. Leia na Fase 5; não copie valores.
- `assets/design-md-template.md`: esqueleto para começar o arquivo.

## Regras de saída (decididas com o dono da skill)

- **Idioma:** o DESIGN.md é escrito **sempre em inglês** (prosa, nomes de seção e tokens). A conversa com o
  usuário segue o idioma dele.
- **Fidelidade à spec, com pragmatismo:** frontmatter YAML válido e seções na ordem canônica. **Não** inclua
  "recipes" HTML/CSS por componente nem medidas de cada `<span>` (como no export bruto do Notion). Componentes
  são descritos por papel, anatomia curta, variantes, estados e tokens.
- **Alvo de tamanho:** de 150 a 400 linhas. Passou disso, corte detalhe que um agente não usaria para decidir.
- **Seções:** Overview, Colors, Typography, Layout e Components são quase sempre necessárias. As demais
  (Elevation & Depth, Shapes, Motion & Micro-interaction, Voice & Content Strategy, Do's and Don'ts) entram só
  se houver substância real. Omitidas vão em `omitted:` com `reason`, para o linter não reclamar (exceto Voice e Motion, que o linter 0.4 não aceita lá; veja a cheatsheet).
- **Sempre inclua** `## Known Gaps` no fim (seção desconhecida pela spec, preservada pelo linter). Ela lista o
  que não foi verificado: estados não medidos, breakpoints inferidos, componentes não lidos.
- **Nunca invente valores.** Todo valor no YAML tem origem: arquivo do projeto, Figma ou resposta do usuário.
  O que não dá para confirmar vira pergunta ou item de Known Gaps.

## Fonte da verdade: depende do modo

| Modo | Quando | Fonte da verdade | Consequência |
|---|---|---|---|
| **Existente** | Há tokens/tema/estilos no código ou no Figma | **O código** | O YAML espelha os valores; cada seção cita o arquivo-fonte (`Source: src/styles/tokens.css`). Em divergência, o código vence e o DESIGN.md é corrigido. Não altere tokens do código. |
| **Do zero** | Não há DS (ou só defaults do framework) | **O DESIGN.md** | Depois de escrito e aprovado, ofereça gerar os tokens no código com `npx @google/design.md export --format css-tailwind\|json-tailwind\|dtcg DESIGN.md`, adaptado à stack. Só aplica após OK. |
| **Atualização** | Já existe um DESIGN.md | O código (se modo Existente) | Compare o arquivo atual com a varredura e proponha um diff por seção, em vez de reescrever. Preserve a prosa autoral que continua verdadeira. |

Se o projeto tiver **só alguns tokens** (por exemplo, cores definidas e espaçamento solto), trate como
Existente para o que existe e como do zero para as lacunas. Diga isso no plano.

## Fluxo

### Fase 1: Detectar o contexto

1. Identifique o alvo: raiz do repo, ou o app certo num monorepo. Se houver vários apps com visuais distintos,
   pergunte qual. **Um DESIGN.md por identidade visual**, ao lado do `package.json` do app.
2. Leia `AGENTS.md`/`CLAUDE.md` do repositório e do app. Eles podem já conter regras de design, convenções de
   arquivo e restrições (por exemplo, "nunca use hex"), e isso alimenta Do's and Don'ts e a Fase 7.
3. Veja se já existe `DESIGN.md` (ou `docs/design*.md`, `STYLEGUIDE.md`). Se existir, o modo é Atualização.
4. Determine o modo (Existente, do zero ou misto) com uma varredura rápida (`tokens`, `@theme`, `tailwind.config`,
   `theme.ts`, `:root {`). Anuncie o modo ao usuário em uma linha.

### Fase 2: Varrer a fundo (modo Existente/Atualização)

Siga `references/scan-checklist.md`. A meta é **extrair, não resumir**: valores literais com arquivo de origem.

- Para varreduras amplas (muitos componentes ou features), use **um** subagente Explore com uma lista
  objetiva do que trazer (tokens com arquivo:linha, lista de componentes com variantes, breakpoints, valores
  de espaçamento mais frequentes). Leia você mesmo os arquivos de tokens: eles são a fonte e cabem no contexto.
- **Meça o uso real, não só a definição.** Conte ocorrências de espaçamento (`gap-*`, `py-*`, `px-*`,
  `max-w-*`) e de radius e sombra nas features. Isso revela a escala de fato, que muitas vezes não está
  tokenizada. Registre "token definido mas não usado" e "valor usado mas não tokenizado".
- Se houver Figma MCP conectado e o usuário tiver um arquivo, puxe variáveis e estilos de lá e compare com o
  código. As divergências vão para o plano.
- Componentes: liste os do diretório compartilhado (`components/`, `ui/`, `shared/components`) com props de
  variante (CVA, `variant=`, `size=`). Leia o suficiente para descrever papel, variantes e estados, não o JSX
  inteiro.

Monte internamente um **inventário**: para cada chave YAML e cada seção, o valor ou texto, a origem e a
confiança (confirmado, inferido ou ausente).

### Fase 3: Perguntar as lacunas (múltipla escolha)

Use a ferramenta de perguntas (AskUserQuestion), em **rodadas de até 4 perguntas**, só para o que o código não
responde. Monte as opções a partir do que você encontrou, para o usuário escolher em vez de redigir:

- **Overview / intenção:** personalidade e tom. Ofereça 3 descrições plausíveis derivadas do que viu (por
  exemplo, "editorial e monocromático", "lúdico e colorido").
- **Papéis semânticos ambíguos:** "a cor `brand-500` é a cor de ação (CTA/foco) ou só de marca?"
- **Escalas inferidas:** "o gap entre seções varia entre 80 e 120px; qual é a regra: 96 desktop / 64 mobile?"
- **Seções opcionais:** quais incluir (pré-marque as que têm substância).
- **Proibições:** confirme Do's and Don'ts candidatos vindos do AGENTS.md e de padrões observados.

No modo **do zero**, a entrevista substitui a varredura. Cubra, em 2 ou 3 rodadas: público e personalidade,
referências visuais, cor primária e neutros, família tipográfica e escala, densidade e espaçamento, radius e
elevação, e componentes iniciais. Ofereça opções concretas (por exemplo, pares de fontes, escalas 4/8px),
não perguntas abertas.

Pare de perguntar quando cada seção obrigatória tiver fonte. O resto vira Known Gaps.

### Fase 4: Plano e aprovação

Antes de escrever, apresente um plano curto e **espere aprovação**:

- Modo e fonte da verdade.
- Caminho do arquivo.
- Tabela de seções: incluída ou omitida (com motivo), as fontes principais e a confiança.
- Divergências encontradas (código × Figma, token não usado, valor não tokenizado). Elas são **reportadas**,
  não corrigidas.
- Mudanças fora do DESIGN.md: o link no AGENTS.md, as regras a mover (Fase 7) e, no modo do zero, a geração
  de tokens.
- Itens que irão para Known Gaps.

Em plan mode, escreva o plano no arquivo de plano. Fora dele, mostre o plano na conversa e aguarde o OK.

### Fase 5: Escrever

Parta de `assets/design-md-template.md`. Siga a cheatsheet e o section-guide. Pontos que mais erram:

- **Nomes de token semânticos** (`primary`, `on-primary`, `surface`, `ink`, `body-md`, `label-sm`), não
  `blue-500`, a menos que o projeto exponha uma escala de paleta que o código usa diretamente. Nesse caso,
  espelhe os nomes do código (por exemplo, `brand-500`) para o agente achar a classe correspondente, e
  explique o papel na prosa.
- **Em `components`, referencie tokens** (`"{colors.primary}"`, `"{typography.label-md}"`, `"{rounded.sm}"`)
  em vez de repetir literais. Use só as propriedades válidas: `backgroundColor`, `textColor`, `typography`,
  `rounded`, `padding`, `size`, `height`, `width`. Variantes de estado entram como chaves irmãs
  (`button-primary-hover`).
- **Prosa que decide.** Cada seção diz quando usar o quê e por quê, com os tokens citados entre crases. Evite
  descrições que não mudam nenhuma decisão do agente.
- **Ponte com o código** (modo Existente): diga em cada seção como o token vira código no projeto (por
  exemplo, "`primary` → class `bg-brand-500`, CSS var `--color-brand-500`"). É isso que impede o agente de
  escrever hex cru.
- Unidades: `px`, `rem` ou `em` em dimensões, `ms` em durações, `lineHeight` sem unidade quando possível,
  hex `#RRGGBB` como padrão.

### Fase 6: Validar

1. Rode `npx -y @google/design.md lint DESIGN.md` no diretório do arquivo. Em monorepo com Node gerenciado,
   use o runner do projeto (por exemplo, `npx pnpm dlx @google/design.md lint DESIGN.md`) se `npx` puro falhar.
2. Corrija todos os `error` (`broken-ref`, seção ou chave duplicada). Para os `warning`:
   - `contrast-ratio`: não "conserte" a cor do projeto. Reporte ao usuário e registre em Known Gaps.
   - `orphaned-tokens`: aceitável para cores usadas fora de componentes; mencione no resumo.
   - `section-order`: corrija sempre.
3. Se o linter não rodar (sem rede ou Node), faça a checagem manual pela cheatsheet e diga isso explicitamente.
4. Confira por amostragem 3 a 5 valores do YAML contra os arquivos de origem.

### Fase 7: Ligar ao projeto

1. **Link no AGENTS.md/CLAUDE.md** do mesmo escopo (o arquivo que o agente já carrega): adicione uma seção
   curta, como "Before any visual/layout change, read `DESIGN.md`. Tokens there mirror `<source file>`; the
   code wins on conflict." (ajuste "code wins" ao modo). Se só existir `CLAUDE.md`, use `@DESIGN.md` ou a
   mesma frase.
2. **Mover regras duplicadas:** se o AGENTS.md tiver regras **descritivas** de design (paleta, escala
   tipográfica, quando usar componente X), proponha movê-las para o DESIGN.md. Mantenha no AGENTS.md só as
   **regras de código** (por exemplo, "nunca use hex em className", "use classes `text-display-*`") e um
   ponteiro. Mostre o diff proposto e aplique só com OK. Não apague comentários de proveniência.
3. **Modo do zero:** ofereça o `export` para gerar os tokens na stack do projeto (veja a tabela de modos).

### Fase 8: Resumo final

Diga em poucas linhas: o caminho do arquivo, as seções incluídas e omitidas, o resultado do linter (erros,
warnings), as divergências encontradas e os Known Gaps principais. Não cole o arquivo inteiro na conversa.

## Respeite o projeto

- Siga as convenções do repositório alvo (git, nomes de arquivo, formatação). Não faça commit nem stage, a
  menos que pedido.
- Se o projeto proíbe algo (por exemplo, "nunca valores hex em código"), isso **não** proíbe hex no YAML do
  DESIGN.md, que é documentação. Mas a prosa deve mandar o agente usar as classes ou variáveis do projeto,
  nunca o hex.
