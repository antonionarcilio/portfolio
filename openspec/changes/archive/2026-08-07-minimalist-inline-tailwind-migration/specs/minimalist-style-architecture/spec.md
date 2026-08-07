## Purpose

Estabelecer uma arquitetura de estilos previsível para o Minimalist, mantendo utilities simples próximas da marcação e reservando CSS de feature para regras complexas, responsivas e visuais.

## ADDED Requirements

### Requirement: Local layout utilities are composed in the component markup

Componentes do Minimalist SHALL aplicar diretamente na marcação as utilities Tailwind simples, locais e sem comportamento próprio, incluindo display, direção e alinhamento de flex/grid, gaps, espaçamentos, posicionamento simples e dimensões utilitárias quando esses valores não forem tokens ou parte de uma composição visual complexa.

#### Scenario: Simple alignment is changed in one component

- **WHEN** um elemento precisa apenas de `display`, alinhamento, direção ou `gap` para organizar seus filhos
- **THEN** essa responsabilidade fica expressa na marcação do componente por utilities Tailwind, sem um novo seletor CSS BEM equivalente em `src/features/minimalist/styles.css`

#### Scenario: A local utility is used with a semantic feature class

- **WHEN** o elemento também precisa de cor, estado, pseudo-elemento ou outra regra própria da feature
- **THEN** a marcação combina utilities Tailwind com a classe semântica Minimalist, mantendo cada responsabilidade separada

### Requirement: Complex and contextual styles remain feature-owned

Regras que dependem de tokens Minimalist, pseudo-elementos, gradientes, estados interativos, aparência light/dark, overflow/scroll, geometria calculada, composição estrutural, animação de transição da plataforma ou responsividade SHALL permanecer em `src/features/minimalist/styles.css` ou em um stylesheet de componente da mesma feature, conforme a convenção existente.

#### Scenario: Responsive behavior is migrated

- **WHEN** uma regra muda em um breakpoint ou depende de uma largura de viewport
- **THEN** a mudança permanece em uma media query do CSS da feature vinculada a uma classe estável, sem variante arbitrária de breakpoint no `className`

#### Scenario: A visual effect needs a pseudo-element or gradient

- **WHEN** a apresentação usa `::before`, `::after`, gradiente, máscara, outline contextual ou layering
- **THEN** a regra permanece no CSS da feature e não é substituída por uma sequência de utilities que perca a intenção visual

### Requirement: Component variants use CVA

Componentes Minimalist que expõem variantes de aparência, estado, densidade ou outra variação de design SHALL declarar essas variantes com CVA e SHALL evitar mapas paralelos de classes ou ternários inline para representar o mesmo eixo.

#### Scenario: A component receives a design variant

- **WHEN** um componente precisa expor uma propriedade `variant`, `appearance`, `state` ou equivalente de design
- **THEN** a API é tipada a partir da definição CVA e a classe resultante é composta com `clsx` somente para estados runtime que não sejam variantes de design

#### Scenario: A runtime state is not a design variant

- **WHEN** uma classe depende de uma condição transitória de runtime que não representa uma variante de design
- **THEN** ela pode ser composta separadamente, sem criar um novo eixo CVA artificial

### Requirement: Incremental migration preserves observable behavior

A migração SHALL ocorrer em lotes pequenos e verificáveis, preservando geometria, responsividade, temas, estados de foco/hover/disabled, acessibilidade, animações e comportamento de navegação do Minimalist.

#### Scenario: A migration batch is completed

- **WHEN** um lote de componentes é convertido
- **THEN** o lote passa pelas verificações proporcionais definidas no plano e não introduz regressão observável nas telas/estados Minimalist cobertos

#### Scenario: Gamified is checked after a batch

- **WHEN** um lote altera arquivos compartilhados, importações globais ou a documentação de convenções
- **THEN** a rota Gamified permanece funcional e visualmente intacta, e qualquer alteração fora de `src/features/minimalist/` é explicitamente justificada

### Requirement: New code follows the clarified project convention

O contrato de contribuição SHALL document que utilities Tailwind simples devem ser aplicadas no JSX, que CSS deve concentrar regras complexas/contextuais e que CVA gerencia variantes, mantendo a regra de breakpoints e o isolamento das features.

#### Scenario: A future Minimalist component is added

- **WHEN** um novo componente Minimalist é criado ou alterado
- **THEN** sua implementação pode ser revisada contra essa divisão sem depender de inferência ou de conhecimento histórico do projeto
