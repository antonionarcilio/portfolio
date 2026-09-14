## Context

`Value.tokens.json` contém a referência de fonte, pesos, escala tipográfica e line-heights do portfólio. Atualmente `src/features/minimalist/styles.css` define custom properties internas, mas expõe apenas a família de fonte ao Tailwind e ainda concentra utilities locais junto com tokens, temas, estados e geometria visual.

Os consumidores principais estão em `src/features/minimalist/components/`, com a composição da rota em `src/app/[locale]/portfolios/minimalist/`. A aplicação usa Tailwind CSS v4, CVA e Framer Motion, e o CSS da feature é importado globalmente junto com os estilos do Gamified.

## Goals / Non-Goals

**Goals:**

- Expor tokens Minimalist por aliases Tailwind namespaceados.
- Aplicar aliases e utilities locais diretamente na marcação quando forem simples.
- Preservar custom properties internas para troca light/dark.
- Reduzir regras CSS redundantes sem remover âncoras semânticas ou regras complexas.
- Validar cada lote e manter o Gamified isolado.

**Non-Goals:**

- Criar uma biblioteca global de tokens compartilhada entre as features.
- Criar componentes genéricos apenas para tipografia ou cor.
- Migrar breakpoints, pseudo-elementos, gradientes ou geometrias compostas para JSX.
- Trocar a arquitetura de animação baseada em Framer Motion.

## Decisions

### 1. `Value.tokens.json` é a referência semântica

Os nomes e valores tipográficos serão conferidos contra `Value.tokens.json`. As custom properties internas continuam escopadas ao tema Minimalist; o arquivo não será convertido em um import runtime nem duplicado em TypeScript sem consumidor real.

### 2. Aliases Tailwind usam namespace `minimalist`

O `@theme inline` em `src/features/minimalist/styles.css` expõe aliases como `font-minimalist`, `text-minimalist-sm`, `leading-minimalist-text-sm`, `font-weight-minimalist-regular`, `text-minimalist-muted` e `bg-minimalist-background`. O namespace evita colisões com utilities genéricas consumidas pelo Gamified.

Mapa conferido no inventário:

| Fonte | Token interno | Alias Tailwind |
| --- | --- | --- |
| `Font family/font-family-portfolio` | `--font-jetbrains-mono` | `font-minimalist` |
| `Font size/text-*` | `--minimalist-font-size-text-*` | `text-minimalist-text-*` |
| `Font size/display-*` | `--minimalist-font-size-display-*` | `text-minimalist-display-*` |
| `Line height/*` | `--minimalist-line-height-*` | `leading-minimalist-*` |
| `Font weight/regular..bold` | `--minimalist-weight-*` | `font-weight-minimalist-*` |
| Semantic theme colors | `--minimalist-background` through `--minimalist-divider-inner` | `bg/text/border-minimalist-*` |
| Alpha colors | `--minimalist-alpha-black/white-*` | `text/bg/border-minimalist-alpha-*` |

The numeric values in the map are sourced from the untracked `Value.tokens.json` present in this checkout; legacy `small`, `body`, and `large` properties remain as compatibility aliases for the existing Minimalist selectors.

### 3. Tokens internos continuam controlando aparência

Aliases semânticos apontam para variáveis como `--minimalist-background`, `--minimalist-foreground`, `--minimalist-muted` e `--minimalist-accent`. As classes dos componentes não mudam para trocar light/dark; somente os valores resolvidos pelo tema mudam.

### 4. Classificação usa a regra completa

Uma declaração só será removida do CSS depois de verificar se não depende de breakpoint, estado, tema, pseudo-elemento, gradiente, overflow, layering, geometria calculada ou composição. `display` e `gap` podem migrar isoladamente, mas permanecem no CSS quando fazem parte de uma geometria contextual.

### 5. CVA não será usado como wrapper de utility isolada

Variantes de design continuam em CVA, podendo retornar aliases Tailwind. Um estilo local único fica no JSX; um componente reutilizável é criado apenas quando há markup, comportamento ou semântica compartilhada.

### 6. Animações preservam a regra existente

Novas animações permanecem em Framer Motion. `minimalist-view-reveal-in` e `minimalist-view-reveal-out` continuam como exceção restrita para View Transition API e devem ser documentadas no contrato do repositório.

## Risks / Trade-offs

- [Risk] Um alias `@theme` pode afetar utilities fora do Minimalist → [Mitigation] usar somente namespace `minimalist` e validar a rota Gamified.
- [Risk] A troca de token CSS por utility pode alterar especificidade ou herança → [Mitigation] migrar por família, comparar light/dark e remover CSS redundante somente após validação.
- [Risk] Uma regra simples pode carregar dependência contextual escondida → [Mitigation] classificar o seletor completo e preservar a classe BEM quando ela for âncora de comportamento.
- [Risk] A tipografia definida no JSON pode divergir dos valores atualmente aprovados no Minimalist → [Mitigation] reconciliar os valores antes da migração e registrar qualquer diferença como decisão explícita.

## Migration Plan

1. Auditar `Value.tokens.json`, `styles.css` e os consumidores JSX; produzir o mapa token → alias.
2. Criar os aliases `@theme inline` e atualizar `CLAUDE.md` com a convenção e a exceção de View Transition.
3. Migrar shell e primitives de controle.
4. Migrar conteúdo recruiter, cards, projetos e painéis.
5. Remover regras CSS redundantes e auditar classes BEM, CVA e aliases.
6. Executar validação técnica, checagens visuais Minimalist e regressão Gamified.

Rollback é por lote: restaurar o lote que falhar sem reverter alterações anteriores validadas.
