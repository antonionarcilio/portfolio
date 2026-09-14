## 1. Inventário e contrato de migração

- [x] 1.1 Auditar `src/features/minimalist/styles.css` e mapear cada seletor para: utilitário local, estado simples, variante CVA, tema/contexto, responsividade, comportamento ou composição complexa.
- [x] 1.2 Auditar consumidores em `src/features/minimalist/components/` e registrar classes BEM usadas por JavaScript, testes, media queries, temas ou geometria.
- [x] 1.3 Confirmar que os aliases necessários `minimalist-*` existem no `@theme inline`; adicionar somente aliases namespaced ausentes, sem alterar tokens Gamified.

## 2. Migração de controles e estados simples

- [x] 2.1 Migrar estilos locais simples de botões, switches, paginação, anchors, triggers e navegação para `className` ou base/variantes CVA.
- [x] 2.2 Migrar estados locais simples de `hover`, `focus-visible`, `disabled`, `aria-expanded` e equivalentes para Tailwind/CVA.
- [x] 2.3 Remover apenas os seletores CSS que ficaram sem declarações ou consumidores após a migração e verificar foco, disabled e aparência nos dois temas.

## 3. Migração de conteúdo e composição local

- [ ] 3.1 Migrar alinhamento, display, gap, padding, margin e tipografia simples de About, Education, Experience, Projects e A11y para os componentes correspondentes.
- [x] 3.2 Preservar classes BEM necessárias para estados, temas, media queries, pseudo-elementos, scroll e geometria de expansão.
- [ ] 3.3 Verificar que cards, overlays, FLIP, gradients e painéis expandidos mantêm a mesma geometria, overflow e foco.

## 4. Responsividade e isolamento

- [x] 4.1 Manter ou ajustar media queries em `src/features/minimalist/styles.css` usando âncoras BEM estáveis, sem breakpoints arbitrários no JSX.
- [ ] 4.2 Validar viewport estreito, estados de acessibilidade, light/dark e navegação por teclado no Minimalist.
- [x] 4.3 Confirmar que nenhuma classe, alias ou regra migrada altera o layout Gamified.

## 5. Validação e limpeza

- [x] 5.1 Executar formatter, typecheck, lint e `git diff --check` com Node 24 e `npx pnpm`.
- [ ] 5.2 Executar testes focados de Minimalist para temas, acessibilidade, cards, scroll, wheel, expansão e responsividade.
- [x] 5.3 Revisar `styles.css` em busca de seletores que apenas duplicam utilitários e documentar exceções comportamentais mantidas.
