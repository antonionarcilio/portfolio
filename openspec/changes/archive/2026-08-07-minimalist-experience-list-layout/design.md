## Context

`src/features/minimalist/components/a11y-panel.tsx` já implementava a lista de janela circular (5 itens, marcador `➤`, gradientes de topo/base, wheel + teclado com `nextCircularIndex`/`consumeA11yWheel` de `src/features/minimalist/a11y.ts`). `ExperiencePage`, dentro de `src/features/minimalist/components/recruiter.tsx`, renderizava as empresas com `SectionSwitch` em um `grid`, sem janela, sem wheel/teclado circulares e sem gradientes — divergindo do Figma. Essa parte já foi implementada: a lista circular foi extraída para `MinimalistWindowedList` (`src/features/minimalist/components/windowed-list.tsx`), reaproveitada por ambos os painéis, com as classes renomeadas para o namespace `minimalist-windowed-list__*`.

O painel de detalhe colapsado também já foi implementado nesta iteração com um layout mais simples do que o desenho original do proposal: uma única linha kicker (`// Empresa`) + período, e o resumo (`excerpt`) truncado por `line-clamp` (sem gradiente no estado colapsado). O campo `employment_type` do CMS já é mapeado para `ExperienceEntry.employmentType`, mas hoje só é exibido no card expandido de Projetos — nesta seção ele passa a aparecer apenas no cabeçalho do painel **expandido** de Experiências (ver Decisions).

O botão "Expandir" do rodapé do painel de detalhe existe desde a primeira iteração, mas ficava desabilitado como placeholder. Este documento agora cobre a implementação real dessa expansão, usando a técnica FLIP já validada pelo card expandido da seção Projetos (`src/features/minimalist/components/card.tsx`, hook `src/features/minimalist/hooks/use-minimalist-flip.ts`), com a estrutura visual do conteúdo expandido replicando o painel "Sobre mim" (`src/features/minimalist/components/about-bio-panel.tsx`).

O layout expandido proposto está no Figma (nó `2131-2443`): kicker com `// ESCALLO | FUTUROTEC` (todos os `aliases` da empresa) + modalidade de trabalho à direita, campo "Cargo" com o cargo, campo "Experiência" com o período, campo "Um pouco sobre" com a descrição completa cortada por rolagem + gradiente, e rodapé com dica de navegação + botão de recolher.

No CMS, a "entidade" experiência (nó de empresa linkado por `experience_company`) já expõe `aliases` (lista, hoje só o primeiro item é usado via `nodeName`), `description` (markdown completo, hoje mapeado para `ExperienceEntry.details`), `excerpt` (resumo curto, já mapeado e usado no estado colapsado), `employment_type` (já mapeado), `start`/`end` (já mapeados).

## Goals / Non-Goals

**Goals:**

- Um único componente de lista circular usado pelo painel de acessibilidade e pela seção Experiências, sem duplicar wheel/teclado/gradientes. _(concluído)_
- Layout do painel de detalhe colapsado fiel ao que foi validado nesta iteração (kicker + período, resumo truncado por `line-clamp`). _(concluído)_
- Expor `employment_type` e `aliases` do CMS até a UI.
- Implementar a expansão real do painel de detalhe via técnica FLIP, reaproveitando a lógica já usada pelo card expandido de Projetos, com o conteúdo estruturado como o painel "Sobre mim".

**Non-Goals:**

- Alterar o comportamento, wording ou testes já cobertos pelo spec `minimalist-a11y-panel` — a extração da lista circular é comportamentalmente transparente para o painel de acessibilidade.
- Redesenhar a navegação de seções (`StepPagination`, footer) — fora do escopo desta mudança.
- Adicionar uma seção de stack/tecnologias ao painel expandido de Experiências (diferente do card expandido de Projetos, o Figma do painel expandido de Experiências não inclui essa seção).

## Decisions

**Extrair a lista circular como componente de apresentação parametrizado por itens.** _(concluído)_
`MinimalistWindowedList` recebe `items: { key: string; label: string }[]`, `selectedIndex`, `onSelect`, `onWheelConfirm`, `ariaLabel`, `idPrefix` e usa a marcação/CSS antes específica de `minimalist-a11y-panel__list`/`__option`/`__marker`/`__gradient-*`, agora sob o namespace `minimalist-windowed-list__*`. `a11y-panel.tsx` e `ExperiencePage` consomem o mesmo componente.

**Manter o hook de wheel/teclado (`consumeA11yWheel`, `nextCircularIndex`) como está, em `a11y.ts`.** _(concluído)_
Já é genérico, reutilizado diretamente sem mudanças de assinatura.

**Painel de detalhe colapsado: uma linha (kicker + período), sem gradiente.** _(concluído — substitui a decisão original de duas linhas cargo/período + empresa/modalidade com gradiente de corte)_
O layout de duas linhas (cargo+período, empresa+modalidade) do proposal original foi simplificado para uma única linha kicker+período durante a implementação; o resumo (`excerpt`) é truncado por `-webkit-line-clamp: 10` em vez de gradiente. `employment_type` deixou de aparecer no estado colapsado e passa a aparecer apenas no cabeçalho do painel expandido.

**Efeito sonoro de confirmação na lista de Experiências reaproveita o padrão do painel de acessibilidade.**
`ExperiencePage` instancia seu próprio `useMinimalistSoundEffects(MINIMALIST_DEFAULT_SOUND_KEY, soundEffectsEnabled)`, espelhando a instância própria do `MinimalistA11yPanel` (em vez de reutilizar o `playSectionChangeSound` do componente pai, que tem semântica diferente — troca de página, não de empresa). `soundEffectsEnabled` já é computado em `MinimalistRecruiter` e passa a ser propagado como prop para `ExperiencePage`.

**Expansão via FLIP reaproveitando `useMinimalistFlipLayout` e o padrão de overlay do `MinimalistCard`, sem alterá-los.**
O hook `useMinimalistFlipLayout(layoutId, expanded)` já é genérico (recebe qualquer `layoutId`); a nova expansão de Experiências usa um `layoutId` próprio (ex.: `experience-detail-${selected}`), sem modificar o hook. A mecânica de `MinimalistCard` — capturar geometria do slot colapsado (`captureExpansionGeometry`), aplicar `position: absolute` com os bounds do container "cheio" (`isOverlay`/`expandedBounds`), preservar `cardSlotSize` para não colapsar o layout ao redor, e reverter com `useLayoutEffect` ao fechar — é replicada no painel de Experiências, mas capturando geometria relativa a um novo wrapper dedicado (ver decisão seguinte), não a `.minimalist__project-grid`.

**Novo wrapper `.minimalist__experience-viewport` define os bounds "cheios" da expansão.**
Diferente de Projetos, que já tem `.minimalist__project-viewport` (um contêiner de rolagem único que serve de referência para os bounds do card expandido), a seção Experiências hoje é apenas um `grid` de duas colunas (`minimalist__experience`) sem um contêiner único. Introduz-se `.minimalist__experience-viewport` envolvendo a `MinimalistWindowedList` e o painel de detalhe, com `position: relative; width: 100%; height: 100%;`, análogo ao papel de `.minimalist__project-viewport`. O painel de detalhe expandido usa `position: absolute` com bounds relativos a esse wrapper, cobrindo lista + detalhe combinados (não apenas a coluna de detalhe).

**Conteúdo expandido replica a estrutura de campos do `AboutBioPanel`, com rótulos e dados próprios de Experiência.**
Kicker: `// ${companyAliases.join(' | ')}` à esquerda, `employmentType` à direita quando presente (mesma regra de omissão sem espaço vazio já usada no estado colapsado). Campos, cada um com rótulo em negrito + valor: "Cargo" (`role`), "Experiência" (período formatado com a mesma função `period()` já usada), "Um pouco sobre" (`details`, renderizado em modo bloco via `MarkdownText`, não `inline`, já que aqui — diferente do resumo colapsado — o conteúdo completo com múltiplos parágrafos deve ser preservado). O campo "Um pouco sobre" usa o mesmo padrão de rolagem + gradiente de `AboutBioPanel.__content`/`__gradient` (scroll interno, `ResizeObserver` + `scroll` listener para decidir a visibilidade do gradiente). Rodapé com `NavigationHint` + botão "Recolher", reaproveitando a chave i18n `collapse` (`"Recolher"`) já usada pelo `MinimalistCard` e pelo `AboutBioPanel` — não a palavra "Retrair" do Figma, para manter consistência de vocabulário na aplicação.

**Novas chaves i18n dedicadas para os rótulos dos campos expandidos.**
`experienceRoleLabel` ("Cargo:"), `experiencePeriodLabel` ("Experiência"), `experienceAboutLabel` ("Um pouco sobre:") sob `minimalist.recruiter`, em vez de reaproveitar `workedAs`/`developmentPeriod`/`aboutProject` de Projetos (cujo texto menciona explicitamente "o projeto", não fazendo sentido para uma experiência profissional).

**`companyAliases` como novo campo em `ExperienceEntry`, mapeado de `node.frontmatter.aliases`.**
`mapExperience` já resolve `nodeName(node)` (primeiro alias) para `company`; adiciona-se `companyAliases: toArray(node.frontmatter.aliases as string | string[] | undefined)` para expor a lista completa usada no kicker expandido, sem alterar `company` (ainda usado pela lista circular colapsada e pelo kicker colapsado).

**Som de expandir/recolher reaproveita `'mouseClickClose'`, mesmo som já usado pelo `MinimalistCard` e pelo `AboutBioPanel`.**
Mantém consistência sonora entre as três interações de expandir/recolher já existentes na aplicação (Projetos, Sobre, e agora Experiências).

## Risks / Trade-offs

- [Renomear as classes `minimalist-a11y-panel__list/__option/__marker/__gradient-*` pode alterar seletores usados em testes e2e existentes] → _(concluído)_ testes de acessibilidade/experiência já atualizados.
- [O layout de detalhe colapsado mudou de duas linhas com gradiente (proposal original) para uma linha com `line-clamp` durante a implementação] → Esta revisão do spec/design já reflete o comportamento final; nenhuma ação pendente.
- [Adaptar a captura de geometria do `MinimalistCard` (relativa a um contêiner de rolagem existente, `.minimalist__project-grid`) para Experiências, que não tem um contêiner de rolagem equivalente] → Mitigado introduzindo `.minimalist__experience-viewport` como novo contêiner de referência, com o mesmo papel estrutural de `.minimalist__project-viewport`.
- [Projetos trata `Escape` e cliques fora do card expandido para fechar (`handleProjectGridKeyDown`, `hasExpandedProject`); não está definido se Experiências precisa do mesmo tratamento] → A implementação deve reaproveitar `hasExpandedContent`/`aria-hidden`/`inert` já usados em `MinimalistRecruiter` para bloquear a navegação de seções e o wheel global enquanto o painel está expandido (mesmo padrão de `expandedProjectIds`/`isAboutExpanded`), incluindo `Escape` para recolher, mantendo paridade com o comportamento já existente para Projetos e Sobre.
- [Duas fontes de rótulo para "recolher" já convivem na aplicação — este design escolhe reaproveitar `collapse`/"Recolher" em vez de introduzir "Retrair" do Figma, para não fragmentar o vocabulário] → Decisão confirmada com o usuário; sem ação pendente.
