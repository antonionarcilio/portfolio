# minimalist-token-aliases-and-css-audit Specification

## Purpose

Definir como os tokens do portfólio são consumidos pelo Minimalist através de aliases Tailwind, mantendo a aparência light/dark, a tipagem dos componentes e a separação entre utilities locais e CSS contextual.

## Requirements

### Requirement: Minimalist tokens have stable Tailwind aliases

Os tokens de fonte, tamanho, peso, line-height e cor usados pelo Minimalist SHALL estar disponíveis como aliases Tailwind com namespace `minimalist`, sem exigir valores literais duplicados na marcação dos componentes.

#### Scenario: Typography token is consumed locally

- **WHEN** um elemento Minimalist precisa de fonte, tamanho, peso ou line-height definidos pelo sistema de tokens
- **THEN** a marcação pode consumir o alias Tailwind correspondente sem repetir o valor numérico ou o nome da fonte

#### Scenario: Semantic color token is consumed locally

- **WHEN** um elemento Minimalist precisa de background, foreground, muted, border, accent ou alpha token
- **THEN** a marcação pode consumir um alias semântico namespaceado e não contém um hexadecimal ou `rgb()` duplicado

### Requirement: Theme appearance remains token-driven

Os aliases Tailwind semânticos SHALL resolver os valores das custom properties internas do Minimalist, e a troca entre light e dark SHALL ocorrer sem alterar a composição de classes do componente.

#### Scenario: Light and dark use the same component markup

- **WHEN** o mesmo componente é renderizado com appearance light ou dark
- **THEN** sua marcação permanece equivalente e os aliases resolvem os valores definidos pelo tema correspondente

#### Scenario: Gamified tokens remain isolated

- **WHEN** os aliases Minimalist são carregados pela aplicação
- **THEN** eles não substituem aliases genéricos do Tailwind nem alteram tokens, utilities ou aparência da rota Gamified

### Requirement: Simple local styles are composed in markup

Estilos locais simples de display, direção, alinhamento, flex/grid, gaps, espaçamento, posicionamento, dimensões e tipografia SHALL ser expressos no JSX por utilities Tailwind quando não dependerem de breakpoint, estado contextual, token não exposto ou composição geométrica.

#### Scenario: Simple layout is changed in one component

- **WHEN** um elemento precisa apenas organizar seus filhos com flex/grid, alinhamento ou gap
- **THEN** essa responsabilidade fica na marcação e não em um seletor CSS BEM que apenas repete a utility

#### Scenario: Complex context is preserved in CSS

- **WHEN** uma regra depende de media query, pseudo-elemento, gradiente, overflow, layering, estado contextual ou geometria calculada
- **THEN** ela permanece no stylesheet da feature e mantém uma classe semântica estável quando necessário

### Requirement: Variants remain managed by CVA

Componentes Minimalist que expõem appearance, state, variant ou outro eixo de design SHALL continuar usando CVA para produzir suas classes, sem mapas paralelos de aliases ou ternários equivalentes.

#### Scenario: Component exposes an appearance variant

- **WHEN** um componente recebe uma variante de aparência ou estado de design
- **THEN** sua API é tipada a partir da definição CVA e a classe resultante pode combinar aliases Tailwind namespaceados

#### Scenario: Local runtime state is not promoted to a variant

- **WHEN** uma classe depende de estado transitório de runtime que não é uma variante de design
- **THEN** ela pode ser composta separadamente sem criar um eixo CVA artificial

### Requirement: Incremental audit preserves observable behavior

A migração dos aliases e dos estilos simples SHALL ocorrer em lotes verificáveis, preservando geometria, responsividade, acessibilidade, temas, interação, conteúdo CMS e isolamento do Gamified.

#### Scenario: Batch passes focused validation

- **WHEN** um lote de componentes é migrado
- **THEN** formatação, typecheck, lint, diff check e as checagens Minimalist aplicáveis passam sem regressão observável introduzida pelo lote

#### Scenario: Animation ownership is preserved

- **WHEN** uma regra de animação é criada ou migrada
- **THEN** novas animações de componentes usam Framer Motion, enquanto os keyframes existentes da View Transition API permanecem apenas como exceção documentada
