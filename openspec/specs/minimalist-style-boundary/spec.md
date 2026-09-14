## Purpose

Define a verifiable boundary so Minimalist local and simple styles are declared with the component, while contextual, behavioral, and visually composed rules remain in feature-scoped CSS.

## Requirements

### Requirement: Local simple styles are declared with component utilities

Componentes do layout Minimalist SHALL declarar no próprio componente os estilos locais e simples de layout, espaçamento, alinhamento, tipografia, dimensões estáveis e posicionamento que não dependam de contexto externo.

#### Scenario: Local layout is rendered

- **WHEN** um elemento precisa apenas de `display`, direção de flex/grid, alinhamento, gap, padding, margin ou dimensões locais
- **THEN** o elemento SHALL expressar essas propriedades por classes utilitárias do componente, sem um seletor CSS dedicado que apenas replique essas utilidades

#### Scenario: Local typography is rendered

- **WHEN** um elemento precisa de tamanho, peso, altura de linha, transformação ou alinhamento textual simples
- **THEN** o elemento SHALL usar classes utilitárias baseadas nos aliases de tokens `minimalist-*`, preservando a escala visual existente

### Requirement: Simple element states are declared inline

Estados simples e locais SHALL ser expressos por utilitários de estado ou variantes CVA no componente, incluindo `hover`, `focus-visible`, `disabled`, `aria-expanded` e estados equivalentes.

#### Scenario: Interactive state changes

- **WHEN** um estado altera somente propriedades simples do próprio elemento, como cor, opacidade, cursor, outline ou decoração de texto
- **THEN** o componente SHALL aplicar a mudança por classes Tailwind/CVA no JSX

#### Scenario: State requires contextual composition

- **WHEN** um estado depende de tema, breakpoint, seletor ancestral, pseudo-elemento, múltiplos elementos ou composição visual complexa
- **THEN** o estado SHALL permanecer em CSS sem duplicar uma versão local incompleta no JSX

### Requirement: Contextual and behavioral CSS remains feature-scoped

O CSS do Minimalist SHALL manter regras necessárias para tokens, temas, responsividade, pseudo-elementos, gradients, masks, overflow, scroll, geometria calculada, camadas, seletores contextuais e comportamento visual composto.

#### Scenario: Scroll or expansion behavior is preserved

- **WHEN** uma regra controla overflow, scrollbar, handoff de wheel, expansão, overlay, FLIP ou geometria calculada
- **THEN** a regra SHALL permanecer em `src/features/minimalist/styles.css` e o comportamento SHALL continuar observável

#### Scenario: Responsive behavior is preserved

- **WHEN** uma regra varia por breakpoint ou por estado de acessibilidade refletido no HTML
- **THEN** a regra SHALL permanecer em media query/CSS contextual com uma âncora BEM estável

### Requirement: Minimalist styling remains isolated

Aliases, classes semânticas e regras migradas SHALL permanecer com escopo Minimalist e não poderão alterar o layout Gamified.

#### Scenario: Gamified layout is rendered

- **WHEN** o layout Gamified é renderizado após a migração
- **THEN** suas classes, tokens, estados e aparência SHALL permanecer inalterados

#### Scenario: Minimalist tokens are consumed

- **WHEN** uma classe Tailwind usa cor, tipografia ou espaçamento específico do Minimalist
- **THEN** ela SHALL resolver para alias namespaced `minimalist-*` ou para custom properties internas `--minimalist-*`
