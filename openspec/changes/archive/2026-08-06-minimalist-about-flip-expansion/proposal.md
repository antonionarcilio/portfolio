## Why

O botão `VER MAIS` da seção Sobre está desabilitado propositalmente (`minimalist-about-section`, requirement "Botão Ver Mais temporariamente desabilitado") até que a expansão fosse implementada em um change posterior — este é esse change. O design Figma (`node-id 2131:2873`, estados `content/about/collapsed` e `content/about/expanded`) já especifica a composição final: no estado compacto, retrato + nome/cargo + localização + excerpt (`bio.excerpt`) + links sociais; no estado expandido, nome/cidade/biografia completa (`bio.description`, markdown multi-parágrafo) com controle de recolher.

**Correção pós-implementação:** a primeira tentativa deste change reutilizou a infraestrutura FLIP de `minimalist-card-flip-expansion` (`MinimalistCard`/`useMinimalistFlipLayout`). Essa infraestrutura pressupõe um contexto de lista/grid: ela congela a geometria do *viewport atual* e expande o card dentro dela — funciona em Projetos porque o grid já é naturalmente grande (múltiplos cards vizinhos). Sobre é um card único, sem essa vizinhança, então reaproveitar o mecanismo resultou em uma área expandida artificialmente pequena, contornada apenas com uma altura mínima fixa arbitrária (`min-height` em CSS) sem relação com o tamanho real da biografia. A estrutura atual não comporta uma transição FLIP coerente para um item único. A correção abandona o reuso de FLIP para Sobre e adota um painel de conteúdo cheio para a biografia expandida — cobrindo toda a área de conteúdo da seção, no mesmo padrão estrutural já usado pelo menu de acessibilidade (`MinimalistA11yPanel`: `AnimatePresence` + posicionamento absoluto cobrindo a área de conteúdo + fundo sólido + fade simples, sem medição de geometria).

## What Changes

- Substituir o botão `VER MAIS` desabilitado da seção Sobre por um controle de expansão funcional que abre um painel de conteúdo cheio para a biografia — sem reutilizar a infraestrutura FLIP (`MinimalistCard`/`useMinimalistFlipLayout`).
- Estado compacto: mantém retrato, nome/cargo, localização e `bio.excerpt` renderizados diretamente (sem envolver em `MinimalistCard`), com o controle de expandir substituindo o botão desabilitado.
- Estado expandido: um painel cobre toda a área de conteúdo da seção Sobre (mesmo escopo do menu de acessibilidade — `.minimalist__main`/`.minimalist__content`), exibindo `bio.description` completo via `MarkdownText` (preservando parágrafos), com controle de recolher (`RETRAIR`/`COLLAPSE`), seguindo a composição do artboard `content/about/expanded`.
- Reverter a generalização de `card.tsx` (`scrollContainerSelector`) introduzida na primeira tentativa — deixa de ser necessária, já que Sobre não usa mais `MinimalistCard`.
- Estado de expansão da seção Sobre continua controlado por `MinimalistRecruiter`/`AboutPage` (`isAboutExpanded`), reaproveitando o mesmo bloqueio de navegação global, paginação lateral e footer já usado por Projetos (`hasExpandedContent`) — esse bloqueio independe do mecanismo de exibição (FLIP ou painel).
- Manter as chaves i18n de expandir/recolher já reaproveitadas (`minimalist.recruiter.expand`/`collapse`) e a remoção da chave `more`.

## Capabilities

### New Capabilities

<!-- Nenhuma capability nova é introduzida nesta mudança. -->

### Modified Capabilities

- `minimalist-about-section`: substitui o requirement "Botão Ver Mais temporariamente desabilitado" por um requirement de expansão funcional em painel de conteúdo cheio (não FLIP), com estado compacto (excerpt) e expandido (descrição completa cobrindo a área de conteúdo da seção), controle acessível de expandir/recolher.

<!-- `minimalist-card-flip-expansion` não é modificada — e, com esta correção, Sobre deixa de depender dela por completo (nenhuma reutilização de MinimalistCard/useMinimalistFlipLayout). O requirement "Reusable FLIP contract" continua servindo apenas Projetos (e, potencialmente, Experiência, fora de escopo aqui). -->

## Impact

- `src/features/minimalist/components/recruiter.tsx`: `AboutPage` reverte para renderizar retrato/nome/cargo/localização/excerpt diretamente (sem `MinimalistCard`); adiciona um painel de biografia completa (bloco JSX próprio ou componente extraído) controlado por `isAboutExpanded`, seguindo o padrão estrutural de `MinimalistA11yPanel` (`AnimatePresence`, overlay absoluto sobre a área de conteúdo, fundo sólido, fade simples).
- `src/features/minimalist/components/card.tsx` / `src/features/minimalist/types.ts`: reverter a prop `scrollContainerSelector` adicionada na primeira tentativa — não é mais necessária, pois Sobre não usa mais `MinimalistCard`.
- `src/features/minimalist/styles.css`: remover as classes específicas do card Sobre da primeira tentativa (`.minimalist__about-bio` e overrides de `.minimalist-card__header`/`__footer` escopados a Sobre); adicionar classes BEM para o novo painel de bio, seguindo o padrão visual de `.minimalist-a11y-panel`.
- `src/messages/pt-BR.json` / `src/messages/en.json`: sem mudança adicional além da já feita (chave `more` removida, `expand`/`collapse` reaproveitadas).
- Sem mudanças em `src/shared/data/map-portfolio.ts`, `src/shared/types/portfolio.ts` ou no schema do CMS — `bio.description`/`bio.excerpt` já cobrem os dois estados.

## Non-goals

- Não alterar o conteúdo ou schema do campo `bio` no CMS.
- Não introduzir paginação lateral, grid ou múltiplos cards na seção Sobre — permanece uma única biografia expansível.
- Não alterar a seção Experiência (fica fora de escopo, mesmo sendo outro reuse previsto na spec de FLIP).
- Não modificar o comportamento de expansão de Projetos.
- Não reintroduzir dependência da infraestrutura FLIP de `card.tsx`/`use-minimalist-flip.ts` na seção Sobre.
