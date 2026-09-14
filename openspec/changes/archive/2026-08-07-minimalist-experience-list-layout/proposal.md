## Why

A seção Experiências do portfólio Minimalist não seguia o padrão visual do Figma: a lista de empresas usava botões empilhados em vez do mesmo padrão de lista circular (janela de 5 itens, marcador `➤`, gradientes de topo/base) já implementado no menu de acessibilidade, o painel de detalhe não replicava o layout aprovado, e o botão "Expandir" ficava desabilitado como placeholder. Corrigir isso alinha a seção ao design aprovado, evita duplicar a lógica de navegação circular que já existe para o painel de acessibilidade, e reaproveita a técnica FLIP já usada para expandir os cards da seção Projetos.

## What Changes

- Extrai a lista circular com wheel/teclado, marcador de seleção e gradientes de topo/base do `MinimalistA11yPanel` para um componente reutilizável (`MinimalistWindowedList`), parametrizado pelos itens e pelo conteúdo do item selecionado.
- Refatora `MinimalistA11yPanel` para consumir esse componente, sem alterar seu comportamento observável.
- Reescreve `ExperiencePage` (`recruiter.tsx`) para usar o componente extraído, listando as empresas de `data.experience` na mesma janela circular (5 itens visíveis, navegação por wheel/`ArrowUp`/`ArrowDown`, indicador `➤`), tocando o mesmo efeito sonoro de confirmação já usado pelo painel de acessibilidade.
- Painel de detalhe (estado colapsado) exibe uma única linha com o kicker da empresa (`// Empresa`) à esquerda e o período à direita, seguida do resumo (`excerpt`) truncado em até 10 linhas via `line-clamp` — sem gradiente de corte nesse estado.
- Mapeia o campo `employment_type`, hoje presente no frontmatter do CMS (`ExperienceFields`) mas não exposto, para `ExperienceEntry.employmentType`.
- Implementa a interação real do botão "Expandir" via técnica FLIP (Framer Motion `layout`/`layoutId`), reaproveitando o hook `useMinimalistFlipLayout` e o padrão de captura de geometria/overlay já usado pelo `MinimalistCard` na seção Projetos. O conteúdo expandido ocupa toda a área da seção Experiências (lista + detalhe), dentro de um novo wrapper `.minimalist__experience-viewport` análogo ao `.minimalist__project-viewport`.
- O conteúdo expandido replica a estrutura de campos do painel "Sobre mim" (`AboutBioPanel`): kicker com todos os `aliases` da empresa unidos por " | " + modalidade de trabalho à direita, campo "Cargo" (role), campo "Experiência" (período), campo "Um pouco sobre" com a descrição completa (`details`, não `excerpt`) cortada por scroll + gradiente de suavização quando excede a área visível, e rodapé com dica de navegação + botão "Recolher" (reaproveita a chave i18n `collapse` já usada em Projetos e no About).
- Expõe `ExperienceEntry.companyAliases: string[]`, mapeado do frontmatter `aliases` do nó de empresa no CMS, para montar o kicker expandido.

## Capabilities

### New Capabilities

(nenhuma — reaproveita a capability existente da seção de recrutador)

### Modified Capabilities

- `minimalist-recruiter-experience`: adiciona requisitos de fidelidade visual e de interação para o conteúdo da seção Experiências (lista circular reaproveitada do painel de acessibilidade, layout do painel de detalhe colapsado, modalidade de trabalho, e a expansão via FLIP do painel de detalhe com a estrutura de campos completa).

## Impact

- `src/features/minimalist/components/a11y-panel.tsx` — passa a consumir a lista extraída.
- `src/features/minimalist/components/recruiter.tsx` — `ExperiencePage` reescrita, incluindo a expansão via FLIP do painel de detalhe.
- `src/features/minimalist/components/` — novo componente de lista circular reutilizável (`windowed-list.tsx`).
- `src/features/minimalist/hooks/use-minimalist-flip.ts` — reaproveitado sem alterações pela nova expansão da seção Experiências.
- `src/features/minimalist/styles.css` — novas regras para o namespace compartilhado da lista circular, o layout do painel de detalhe colapsado, o novo `.minimalist__experience-viewport`, e o painel expandido (kicker, campos, gradiente).
- `src/shared/types/portfolio.ts` — novos campos `employmentType` e `companyAliases` em `ExperienceEntry`.
- `src/shared/data/map-portfolio.ts` — `mapExperience` passa a mapear `fields.employment_type` e `aliases`.
- `src/messages/pt-BR.json` / `en.json` — novas chaves de i18n para os rótulos dos campos expandidos (`experienceRoleLabel`, `experiencePeriodLabel`, `experienceAboutLabel`), sob `minimalist.recruiter`.
- Sem mudança de rota, API ou dependências novas.
