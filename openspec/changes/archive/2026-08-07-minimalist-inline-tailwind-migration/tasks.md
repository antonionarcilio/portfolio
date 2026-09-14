## 1. Contrato e inventário

- [x] 1.1 Atualizar `CLAUDE.md` com a divisão explícita entre utilities Tailwind locais no JSX, variantes CVA e CSS complexo/contextual da feature.
- [x] 1.2 Inventariar `src/features/minimalist/components/`, `src/features/minimalist/variants.ts` e `src/features/minimalist/styles.css`, classificando cada regra candidata como utility local, variante CVA, regra complexa, regra responsiva ou token.
- [x] 1.3 Registrar uma linha de base com `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, `git diff --check` e os testes/checagens visuais Minimalist disponíveis, sem modificar alterações não relacionadas do worktree. (8 testes do footer: 7 passaram; 1 falha pré-existente no atraso de navegação de 1,5s.)

## 2. Primitives e controles reutilizáveis

- [x] 2.1 Migrar alinhamentos, display, gaps e espaçamentos simples de `button.tsx`, `anchor.tsx`, `divider.tsx`, `navigation.tsx`, `navigation-menu.tsx`, `switch-btn.tsx`, `switches.tsx` e `a11y-trigger.tsx` para utilities no JSX quando não forem regras contextuais.
- [x] 2.2 Revisar `src/features/minimalist/variants.ts` e as definições CVA nos componentes para garantir que appearance/state/variant permaneçam tipados por CVA, sem mapas paralelos ou ternários de classe equivalentes.
- [x] 2.3 Remover de `src/features/minimalist/styles.css` somente as regras tornadas redundantes pelo lote de primitives, preservando tokens, estados, foco, tema e regras de breakpoint.
- [x] 2.4 Validar o lote de primitives em light/dark, foco de teclado, estados disabled/hover, locale e viewport estreito, executando format, typecheck, lint e `git diff --check`. (E2E do footer: 7 passaram; a falha conhecida do atraso de 1,5s permaneceu igual à linha de base.)

## 3. Shell, header, footer e navegação

- [x] 3.1 Migrar utilities locais simples do shell em `recruiter.tsx`, incluindo header, ferramentas, conteúdo, páginas, footer e viewport, mantendo em CSS a geometria do track, overflow, layering e media queries.
- [x] 3.2 Revisar a composição da rota em `src/app/[locale]/portfolios/minimalist/` e confirmar que a marcação continua com classes semânticas estáveis para regras responsivas e estados contextuais.
- [x] 3.3 Remover regras redundantes do shell em `src/features/minimalist/styles.css` e verificar que não restaram seletores CSS dependentes de utilities que foram retiradas ou renomeadas.
- [x] 3.4 Validar navegação de seções, footer, paginação, tema, viewport estreito e ausência de overflow horizontal com os testes/checagens focados existentes. (E2E do footer: 7 passaram; a falha conhecida do atraso de 1,5s permaneceu igual à linha de base.)

## 4. Conteúdo recruiter e cards

- [x] 4.1 Migrar utilities locais simples de `recruiter.tsx`, `card.tsx` e `about-bio-panel.tsx` para o JSX, mantendo no CSS a expansão FLIP, scroll, gradientes, cantos, layering e geometria de cards.
- [x] 4.2 Remover regras redundantes de conteúdo, experiência, educação, projetos e bio em `src/features/minimalist/styles.css`, sem alterar tokens tipográficos ou estados de aparência.
- [x] 4.3 Confirmar que a expansão/retração de cards, links, botões, conteúdo CMS e foco acessível mantêm o mesmo comportamento e composição visual.
- [x] 4.4 Validar o lote em estados collapsed/expanded, light/dark, dados reais CMS, locale, teclado e viewport reduzido; corrigir apenas regressões introduzidas pelo lote. (Specs focados: 8/9 passaram; a falha restante usa duas rodas de 60px contra o limiar global atual de 420px e não foi introduzida pelo lote.)

## 5. Painéis e auditoria final

- [x] 5.1 Migrar utilities locais simples de `a11y-panel.tsx` e componentes relacionados, preservando scroll, gradientes, layering, estados selecionados e foco.
- [x] 5.2 Remover regras CSS redundantes restantes e auditar `src/features/minimalist/styles.css` em busca de utilities simples duplicadas e seletores como `.flex` usados apenas para estilização local.
- [x] 5.3 Auditar todos os `className` do Minimalist para confirmar que não foram introduzidas variantes arbitrárias de breakpoint, inline animation/transition ou classes incompatíveis com CVA.
- [x] 5.4 Executar a validação final com `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, `git diff --check`, testes Playwright focados e inspeção da rota Gamified para confirmar isolamento. (Técnico passou; Playwright combinado 18/20, com duas falhas de contratos pré-existentes: lista de a11y ainda espera a opção `upscale` removida do Minimalist e wheel global espera 60px contra limiar 420px.)
- [x] 5.5 Registrar no resumo da implementação os lotes concluídos, validações executadas, limitações de validação visual e qualquer regra simples deliberadamente mantida por dependência contextual. (Mantidos CSS de tokens, temas, estados, breakpoints, scroll, gradientes, pseudo-elementos, FLIP e geometria composta; mantido `.flex` quando carrega tipografia contextual do `MarkdownText`.)

## 6. Correção pós-validação visual

- [x] 6.1 Corrigir o breakpoint do header Minimalist para manter logo centralizado e ferramentas laterais separadas em viewport mobile, evitando sobreposição entre logo e trigger de acessibilidade.
- [x] 6.2 Ajustar Education para remover a margem de `.minimalist__education-item h2` e aplicar `flex`, direção de coluna e gap de `10px` diretamente no item.
- [x] 6.3 Revalidar format, typecheck, lint, diff check e o spec de paginação de conteúdo após a correção; registrar a falha conhecida do limiar global de wheel.
