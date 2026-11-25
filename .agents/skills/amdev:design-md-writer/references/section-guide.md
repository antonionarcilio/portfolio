# Guia por seção

Para cada seção: **o que deve conter**, **de onde tirar**, **pergunta se faltar** e **quando omitir**. Escreva
sempre em inglês, com tokens citados em crases. A prosa existe para orientar decisões. Se uma frase não muda
nenhuma escolha do agente, corte.

---

## Overview (obrigatória)
- **Conteúdo:** 2 ou 3 parágrafos (personalidade, como a hierarquia é construída, densidade, profundidade e
  geometria) + uma lista **Key Characteristics** com 5 a 8 bullets, cada um ligado a tokens.
- **Origem:** inferida da varredura (paleta, escala tipográfica, espaçamento) + confirmada pelo usuário.
- **Pergunta:** "Qual descrição melhor define a personalidade?" (3 opções derivadas do que você viu).
- **YAML:** `description` com um parágrafo denso, que resume esta seção.

## Colors (obrigatória)
- **Conteúdo:** grupos por papel (Brand/Interaction, Text, Surface, Status/Accents, State) e, para cada token,
  nome legível, `token`, hex e **onde é usado**. Regras de pareamento (`on-primary` sobre `primary`).
- **Ponte com o código:** como o token aparece no projeto (classe ou CSS var).
- **Origem:** arquivos de tokens + contagem de uso.
- **Pergunta:** papel de cores ambíguas; qual é a cor de foco/ação.
- **YAML:** precisa ter `primary`. Se o projeto usa uma escala (`brand-50…900`), inclua só os degraus
  realmente usados e mapeie `primary` → o degrau de ação via prosa ou referência.
- **Omitir:** nunca.

## Typography (obrigatória)
- **Conteúdo:** famílias (e o papel de cada uma), uma tabela da hierarquia (token, tamanho, peso, line-height,
  tracking e uso) e os princípios (pesos fixos por nível, tracking negativo em display, etc.).
- **Origem:** tokens de fonte e tamanho, `next/font`/`@font-face` e uso em headings.
- **Pergunta:** quando um nível não tem uso claro, perguntar se existe ou se pode sair.
- **YAML:** cada nível usado vira um objeto `typography`. Prefira de 8 a 15 níveis.

## Layout (obrigatória)
- **Conteúdo:** escala de espaçamento (base 4/8px se houver), ritmo entre seções (desktop e mobile), padding
  e max-width do container, grid e colunas, gaps típicos, breakpoints usados e a filosofia de whitespace.
- **Origem:** tokens `spacing` + **contagem de uso real** (é onde mais falta token).
- **Pergunta:** consolidar valores dispersos em regra ("seções: 96 desktop / 64 mobile?").
- **YAML:** `spacing` com a escala e tokens de layout nomeados (`section-y`, `section-y-mobile`,
  `container-x`, `container-max`). Breakpoints podem ir em `spacing` como grupo ou só na prosa.
- **Omitir:** nunca. Se não houver tokens, documente os valores observados e diga isso.

## Elevation & Depth (opcional)
- **Conteúdo:** tabela de níveis (flat, hairline, soft, deep, focus) com o tratamento CSS e o uso, e a
  filosofia de sombra.
- **Omitir quando:** o projeto é flat, sem sombras nem bordas de separação relevantes. Nesse caso, uma linha
  "Flat by design" em Layout e `omitted` com o motivo.

## Shapes (opcional, quase sempre útil)
- **Conteúdo:** escala de radius com o uso por tipo de objeto, e a regra semântica (controles × cards × pills).
- **YAML:** `rounded`.
- **Omitir quando:** um único radius global ou tudo reto. Diga isso em uma linha em Overview.

## Motion & Micro-interaction (opcional)
- **Conteúdo:** durações e easings nomeados, o que anima (enter/exit, hover, troca de estado), a coreografia e
  o respeito a `prefers-reduced-motion`.
- **YAML:** `motion` (`state-change`, `surface-enter`, …).
- **Omitir quando:** não há sistema de animação além de defaults.

## Voice & Content Strategy (opcional)
- **Conteúdo:** tom, capitalização (Sentence case?), terminologia, padrões de labels, estados vazios e de erro,
  formatos de número e data, i18n.
- **Omitir quando:** a cópia vem de CMS sem padrão, ou o usuário não quer.

## Components (obrigatória)
- **Formato por componente** (sem recipes HTML/CSS):
  ```
  ### Button
  Role: … When to use / when not to.
  - Variants: `button-primary` (…), `button-secondary` (…), `button-ghost` (…)
  - Anatomy: label (`label-md`), optional leading icon 16px.
  - States: hover → `{colors.primary-pressed}`; focus-visible → 2px ring `primary`, offset 2px; disabled → 40% opacity.
  - Code: `src/shared/components/button.tsx` (CVA `variant`, `size`).
  ```
- **YAML:** uma entrada por variante e estado relevante, referenciando tokens.
- **Priorize** primitivos e componentes de assinatura. Um catálogo tipo "componente → quando usar / quando não
  usar" vale mais que medidas.
- **Omitir:** nunca. No modo do zero, documente os componentes iniciais planejados.

## Do's and Don'ts (opcional, recomendada)
- **Conteúdo:** de 5 a 10 itens em cada lista, concretos e com tokens. Traga as proibições do AGENTS.md e os
  anti-padrões observados (hex cru, valores arbitrários).
- **Omitir quando:** realmente não houver regras. É raro.

## Seções extras (após Do's and Don'ts)
- **Responsive Behavior:** o que muda no mobile, touch targets e escala tipográfica mobile. Inclua se houver
  variação relevante.
- **Iteration Guide:** de 5 a 8 regras numeradas sobre como estender o sistema sem quebrá-lo. Opcional.
- **Known Gaps (sempre):** o que não foi verificado ou medido, divergências código × Figma, valores observados
  e não tokenizados, warnings do linter (contraste) não resolvidos.
