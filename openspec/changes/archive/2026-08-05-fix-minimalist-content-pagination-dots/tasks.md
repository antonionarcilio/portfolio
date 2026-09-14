## 1. Auditar referência e contrato atual

- [x] 1.1 Auditar os nós Figma `2101-1921` (`step`) e `2101-1924` (`pagination`) e registrar medidas, gaps, alinhamento, tokens e estados light/dark necessários para a implementação.
- [x] 1.2 Comparar a referência registrada em `src/features/minimalist/reference.ts` com `src/features/minimalist/components/navigation.tsx`, `src/features/minimalist/components/recruiter.tsx`, `src/features/minimalist/variants.ts` e `src/features/minimalist/styles.css`, identificando seletores compartilhados com o footer.
- [x] 1.3 Definir atributos estáveis para o contêiner lateral e os dots e confirmar que a paginação do footer não será selecionada pelos mesmos locators.

## 2. Corrigir o componente de dots da área de conteúdo

- [x] 2.1 Ajustar `Step`/`StepPagination` para representar os estados e a geometria dos nós Figma sem duplicar a fonte de verdade do índice ativo.
- [x] 2.2 Separar o bloco BEM da paginação lateral em `src/features/minimalist/components/navigation.tsx` e `src/features/minimalist/styles.css`, preservando os estilos e controles do footer.
- [x] 2.3 Ajustar variantes, tokens, aparência light/dark, foco visível, labels localizados e `aria-current` para que exatamente um dot represente a página ativa.
- [x] 2.4 Verificar a posição responsiva ao lado do conteúdo e corrigir clipping/overflow sem usar breakpoints arbitrários no JSX nem transições CSS.

## 3. Validar comportamento e fidelidade com Playwright

- [x] 3.1 Criar o spec `e2e/minimalist-content-pagination.spec.ts` conforme a decisão 6 do design, com screenshots e medições de bounding box, dimensões, gaps e posição comparadas aos valores auditados do Figma.
- [x] 3.2 Validar click, Enter, Space, foco, `aria-current`, mudança de página, estados regular/current/hover/focus, light/dark e locales `en`/`pt-BR`.
- [x] 3.3 Executar a validação em 1280x826, 900x800 e viewport estreito, confirmando visibilidade, `scrollWidth === clientWidth` e ausência de erros no console.
- [x] 3.4 Confirmar no mesmo fluxo que a paginação do footer permanece inalterada e que a rota Gamified continua funcional e sem erros.

## 4. Verificação final

- [x] 4.1 Executar `npx pnpm format`, `npx pnpm typecheck`, `npx pnpm lint` e `npx pnpm build` usando Node 24.
- [x] 4.2 Executar os testes Playwright relevantes, `openspec validate --changes "fix-minimalist-content-pagination-dots" --strict` e `git diff --check`.
- [x] 4.3 Revisar o diff para confirmar que somente a paginação lateral de conteúdo, seus testes e os artefatos desta mudança foram alterados.
