## 1. Dados

- [x] 1.1 Adicionar `employmentType?: string` a `ExperienceEntry` em `src/shared/types/portfolio.ts`
- [x] 1.2 Mapear `fields.employment_type` para `employmentType` em `mapExperience` (`src/shared/data/map-portfolio.ts`)

## 2. Componente de lista circular reutilizável

- [x] 2.1 Extrair a marcação/lógica de janela circular (itens, marcador `➤`, gradientes topo/base) de `MinimalistA11yPanel` (`src/features/minimalist/components/a11y-panel.tsx`) para um novo componente em `src/features/minimalist/components/` que recebe `items`, `selectedIndex`, `onSelect` e os handlers de wheel/teclado
- [x] 2.2 Renomear as classes `minimalist-a11y-panel__list/__option/__marker/__gradient-*` para o namespace compartilhado (ex. `minimalist-windowed-list__*`) em `src/features/minimalist/styles.css`, preservando o CSS existente
- [x] 2.3 Atualizar `MinimalistA11yPanel` para consumir o novo componente, mantendo comportamento e textos idênticos
- [x] 2.4 Rodar `e2e/minimalist-a11y-panel.spec.ts` e ajustar seletores que dependiam das classes antigas, sem alterar as expectativas de comportamento

## 3. Seção Experiências — lista

- [x] 3.1 Reescrever `ExperiencePage` em `src/features/minimalist/components/recruiter.tsx` para renderizar `data.experience` com o componente de lista circular extraído (substituindo o `grid` de `SectionSwitch`)
- [x] 3.2 Ligar wheel/teclado (`ArrowUp`/`ArrowDown`) da lista de experiências ao `consumeA11yWheel`/`nextCircularIndex` existentes em `src/features/minimalist/a11y.ts`
- [x] 3.3 Tratar o caso de uma única empresa (lista sem navegação circular ativa)

## 4. Seção Experiências — detalhe

- [x] 4.1 Reorganizar o painel de detalhe em duas linhas (`cargo` + `período` / `empresa` + `employmentType`) com utilitários Tailwind `flex justify-between`
- [x] 4.2 Omitir a modalidade de trabalho sem deixar espaço vazio perceptível quando `employmentType` estiver ausente
- [x] 4.3 ~~Adicionar o gradiente de corte no rodapé do texto descritivo~~ — implementado como `-webkit-line-clamp: 10` em `.minimalist__experience-description` (sem gradiente no estado colapsado); decisão revisada durante a implementação, ver `design.md`
- [x] 4.4 Confirmar que o botão "Expandir" continua desabilitado — revertido pela seção 8 abaixo, que implementa a expansão real

## 5. Verificação

- [x] 5.1 Escrever/atualizar teste e2e cobrindo navegação circular da lista de experiências (wheel, teclado, limites) e o layout do detalhe (cargo/período, empresa/modalidade, gradiente)
- [x] 5.2 Rodar `npx pnpm lint`, `npx pnpm typecheck` e `npx pnpm format:check`
- [x] 5.3 Validar visualmente contra o Figma (nós `2130-3818`, `2113-3456`, `2097-26037`) em light e dark, incluindo viewport estreito — validado estruturalmente no navegador (light/dark/viewport estreito); sem URL do arquivo Figma disponível no repo para diff pixel-a-pixel.

## 6. Dados adicionais para o painel expandido

- [x] 6.1 Adicionar `companyAliases: string[]` a `ExperienceEntry` em `src/shared/types/portfolio.ts`
- [x] 6.2 Mapear `toArray(node.frontmatter.aliases as string | string[] | undefined)` para `companyAliases` em `mapExperience` (`src/shared/data/map-portfolio.ts`), sem alterar `company` (continua usando `nodeName(node)`)

## 7. Painel expandido — estrutura e estilo

- [x] 7.1 Adicionar as chaves `experienceRoleLabel` ("Cargo:"), `experiencePeriodLabel` ("Experiência"), `experienceAboutLabel` ("Um pouco sobre:") em `src/messages/pt-BR.json` e `src/messages/en.json`, sob `minimalist.recruiter`
- [x] 7.2 Introduzir `.minimalist__experience-viewport` (`position: relative; width: 100%; height: 100%;`) envolvendo `MinimalistWindowedList` + `.minimalist__experience-detail` em `ExperiencePage`, análogo a `.minimalist__project-viewport`
- [x] 7.3 Construir a marcação do conteúdo expandido: linha de cabeçalho (`// ${companyAliases.join(' | ')}` + `employmentType` à direita quando presente, omitido sem espaço vazio quando ausente), campo "Cargo" (`experienceRoleLabel` + `role`), campo "Experiência" (`experiencePeriodLabel` + período via `period()`), campo "Um pouco sobre" (`experienceAboutLabel` + `MarkdownText` em modo bloco com `current.details`), rodapé com `NavigationHint` + botão `collapse`
- [x] 7.4 Estilizar os novos elementos em `src/features/minimalist/styles.css`, reaproveitando os padrões visuais de `.minimalist__about-bio-panel__field`/`__content`/`__gradient` (rótulo em negrito, valor, rolagem interna, gradiente de suavização) adaptados ao namespace de Experiências

## 8. Painel expandido — FLIP e interação

- [x] 8.1 Adicionar estado de expansão da experiência selecionada (ex.: `isExperienceExpanded`), levantado até `MinimalistRecruiter` no mesmo padrão de `isAboutExpanded`/`expandedProjectIds`, para poder compor `hasExpandedContent` e bloquear navegação de seções/wheel global enquanto expandido
- [x] 8.2 Aplicar `useMinimalistFlipLayout` com um `layoutId` próprio (ex.: `experience-detail-${selected}`) ao painel de detalhe, sem alterar o hook
- [x] 8.3 Replicar a lógica de captura de geometria e overlay do `MinimalistCard` (`captureExpansionGeometry`, `cardSlotSize`, `expandedBounds`, `isOverlay`, reversão via `useLayoutEffect` ao recolher), capturando bounds relativos ao novo `.minimalist__experience-viewport`
- [x] 8.4 Tocar o som `'mouseClickClose'` (mesmo do `MinimalistCard`/`AboutBioPanel`) ao expandir e ao recolher
- [x] 8.5 Tratar `Escape` para recolher o painel expandido, e `aria-hidden`/`inert` na navegação de seções enquanto expandido, com paridade ao comportamento já existente para Projetos e Sobre

## 9. Verificação da expansão

- [x] 9.1 Escrever/atualizar teste e2e cobrindo: abrir a expansão via clique no botão "Expandir", conteúdo expandido exibindo kicker com todos os aliases, modalidade omitida sem espaço vazio quando ausente, campos "Cargo"/"Experiência"/"Um pouco sobre", gradiente de rolagem quando a descrição excede a área visível, recolher via botão "Recolher" e via `Escape`
- [x] 9.2 Rodar `npx pnpm lint`, `npx pnpm typecheck` e `npx pnpm format:check`
- [x] 9.3 Validar visualmente contra o Figma (nó `2131-2443`) em light e dark, incluindo viewport estreito
