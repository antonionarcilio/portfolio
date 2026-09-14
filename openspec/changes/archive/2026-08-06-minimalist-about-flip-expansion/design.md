## Context

A infraestrutura FLIP vive em dois lugares: `src/features/minimalist/hooks/use-minimalist-flip.ts` (contrato fino: `layout`/`layoutId`/`transition` do Framer Motion) e `src/features/minimalist/components/card.tsx` (`MinimalistCard` — dono real da mecânica: mede `getBoundingClientRect` para congelar geometria, renderiza o estado expandido como overlay posicionado por `expandedBounds`, mantém o slot original no grid via `.minimalist-card-slot`). Essa mecânica **pressupõe um viewport-container já dimensionado** de onde tirar a geometria expandida: em Projetos, `.minimalist__project-grid` já é grande (múltiplos cards vizinhos, `max-height: 610px`), então o card expandido tem espaço real para crescer.

**Correção pós-implementação:** a primeira tentativa deste change reutilizou essa infraestrutura para Sobre, generalizando `card.tsx` com uma prop `scrollContainerSelector` e apontando-a para um wrapper dedicado (`.minimalist__about-bio`). Sobre não tem um "grid de vizinhos" — é um único card. Sem essa vizinhança, o container de referência não tem uma altura natural grande; a implementação precisou de um `min-height` fixo arbitrário em CSS só para o texto expandido não ficar cortado numa única linha, sem relação real com o tamanho da biografia. Isso confirma que a estrutura atual (single-item, sem lista) não comporta uma transição FLIP coerente — o mecanismo foi desenhado para congelar/interpolar geometria entre um item pequeno e um viewport grande pré-existente, que Sobre não tem.

A correção abandona o reuso de FLIP para Sobre. Em vez disso, segue o padrão já usado por `MinimalistA11yPanel` (`src/features/minimalist/components/a11y-panel.tsx`): um painel montado condicionalmente via `AnimatePresence`, posicionado `position: absolute; inset: 0` sobre `.minimalist__main` (`position: relative`, já o container do menu de acessibilidade), com fundo sólido (`var(--minimalist-background)`) e transição simples de opacidade/`y` (`initial`/`animate`/`exit`, sem `layout`/geometria FLIP). Esse padrão não depende de medir nenhum elemento — o painel simplesmente cobre toda a área de conteúdo enquanto está montado.

A seção Sobre (`AboutPage`, mesmo arquivo `recruiter.tsx`) já computa `fullBio`/`shortBio` a partir de `data.bio.description`/`data.bio.excerpt` (`PortfolioData.bio: { description: string; excerpt: string } | null`, `src/shared/types/portfolio.ts`, populado por `mapBio` em `src/shared/data/map-portfolio.ts`). Nenhuma mudança de CMS é necessária (ver proposal.md - Why).

## Goals / Non-Goals

**Goals:**
- Reverter a reutilização de `MinimalistCard`/`useMinimalistFlipLayout` e a prop `scrollContainerSelector` em `card.tsx` — Sobre deixa de depender da infraestrutura FLIP.
- Apresentar a biografia completa num painel que ocupa toda a área de conteúdo da seção Sobre, seguindo o mesmo padrão estrutural do `MinimalistA11yPanel` (overlay absoluto, fundo sólido, fade simples).
- Manter a fidelidade visual aos estados `content/about/collapsed` e `content/about/expanded` do Figma (`node-id 2131:2873`).
- Preservar o bloqueio de navegação global/paginação lateral/footer já implementado (`hasExpandedContent`), que independe do mecanismo de exibição.

**Non-Goals:**
- Não generalizar para Experiência nesta mudança (fora de escopo, ver proposal.md - Non-goals).
- Não usar `MinimalistCard`/FLIP para o painel de bio — é um componente/bloco próprio, sem geometria congelada.
- Não alterar o comportamento de Projetos (a reversão de `scrollContainerSelector` em `card.tsx` deve ser neutra para `ProjectsPage`, que volta a usar apenas o default).

## Decisions

**Painel de bio expandida como bloco próprio (inline em `AboutPage` ou componente extraído, ex. `AboutBioPanel`), seguindo o padrão estrutural do `MinimalistA11yPanel`.** Alternativa considerada: manter FLIP e apenas ajustar as dimensões manualmente (ex. calcular uma altura dinâmica a partir do texto). Rejeitada — a geometria capturada de um único item sem vizinhança grande é inerentemente pequena; qualquer altura fixa não escalaria com o tamanho real de biografias diferentes (locale/conteúdo variável), e o mecanismo de congelamento de geometria do FLIP não resolve esse problema estrutural. Um painel `position: absolute; inset: 0` sobre `.minimalist__main` cobre toda a área de conteúdo disponível automaticamente, qualquer que seja o tamanho do texto, sem depender de medição.

**Estado de expansão da seção Sobre continua em `AboutPage`/`MinimalistRecruiter`, como um `boolean` (não um `Set`).** Ao contrário de Projetos (N cards, IDs), Sobre tem exatamente uma biografia expansível — um `Set<string>` seria over-engineering. Esta decisão não muda com a correção.

**Bloqueio de navegação global (`hasExpandedContent = hasExpandedProject || isAboutExpanded`) é mantido como já implementado.** Independe do mecanismo de exibição (FLIP ou painel) — continua bloqueando paginação lateral e footer enquanto a bio está expandida, mesmo comportamento já garantido para Projetos.

**`bio.description` continua renderizado por `MarkdownText`**, mesmo componente já usado no estado compacto e no painel expandido — mantém consistência de parsing/estilo Markdown.

**Chaves i18n**: mantém `minimalist.recruiter.expand`/`collapse` (já reaproveitadas de Projetos) para o controle da seção Sobre. A chave `more` (`VER MAIS`, `minimalist.recruiter.more`) permanece removida de `pt-BR.json`/`en.json`.

**Reverter `scrollContainerSelector` em `card.tsx`/`types.ts`.** Foi introduzida na primeira tentativa especificamente para o reuso de FLIP em Sobre; sem esse reuso, a prop e a generalização deixam de ter propósito — `ProjectsPage` volta a ser o único consumidor de `MinimalistCard`, usando sempre o default `.minimalist__project-grid`.

## Risks / Trade-offs

- **[Risco] Painel `position: absolute; inset: 0` sobre `.minimalist__main` pode cobrir a paginação lateral (`.minimalist__side-pagination`) mesmo Sobre não sendo uma lista.** → Mitigação: comportamento aceitável e consistente — `hasExpandedContent` já oculta/`inert` a paginação lateral e o footer durante qualquer expansão (Projetos ou Sobre), então cobri-los visualmente também não introduz um estado divergente do que já é imposto via `aria-hidden`/`inert`.
- **[Risco] Painel próprio duplica algum CSS de overlay já existente em `.minimalist-a11y-panel`.** → Mitigação: extrair apenas o necessário (posicionamento, fundo, fade) para uma classe BEM nova do painel de bio; não é esperado reuso de classe 1:1 com o a11y panel, já que os dois têm conteúdo/lógica de interação bem diferentes (lista navegável por teclado vs. texto longo com scroll).
- **[Trade-off] Manter estado `boolean` simples em vez de reusar o mesmo `Set<string>` de Projetos** reduz reuso de código de estado, mas evita indireção desnecessária para uma única biografia (YAGNI). Não muda com esta correção.

## Migration Plan

Mudança aditiva de UI, sem dado migrado nem endpoint alterado. Deploy padrão (build + Vercel); nenhuma mudança de schema CMS a coordenar. Rollback = reverter o commit/PR, já que não há estado persistido novo (sem localStorage novo, sem migração de dados). Como já existe uma implementação da tentativa anterior (baseada em FLIP), esta correção implica reverter parte do código já escrito (`card.tsx`/`types.ts`/`styles.css`/`recruiter.tsx`) antes de aplicar a nova abordagem — ver tasks.md.
