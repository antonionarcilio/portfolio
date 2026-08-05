## 1. Auditar referência e contratos atuais

- [x] 1.1 Mapear os estados e medidas dos nós Figma de gatilho de paginação e rodapé, confrontando-os com `reference.ts`, `controls.tsx`, `navigation.tsx` e `styles.css`.
- [x] 1.2 Definir seletores/atributos estáveis para o estado ativo, o trilho do rodapé e os controles Playwright sem expor duplicatas no tab order.

## 2. Implementar navegação circular

- [x] 2.1 Extrair a normalização circular de índice e aplicar a wheel, aos botões anterior/próximo, às opções do rodapé e à navegação por teclado.
- [x] 2.2 Ajustar a transição do trilho central para manter a seção ativa centralizada, inclusive nos wraps primeiro/último, preservando `aria-hidden` e `inert` nas páginas inativas.
- [x] 2.3 Remover o bloqueio visual de endpoints dos controles e garantir que o lock de wheel aceite uma mudança por gesto sem deixar a navegação presa.

## 3. Corrigir rodapé e gatilho visual

- [x] 3.1 Implementar o trilho visual do rodapé com centralização do item ativo, vizinhança contínua e sem controles duplicados acessíveis.
- [x] 3.2 Ajustar componentes, variantes e estilos Minimalist para geometria, espaçamento, tipografia, marcadores, ícones e estados light/dark dos nós Figma.
- [x] 3.3 Verificar responsividade, clipping controlado e ausência de overflow horizontal em desktop, tablet e viewport estreito.

## 4. Validar com Playwright

- [x] 4.1 Criar ou estender testes Playwright da rota Minimalist para validar screenshot do footer/gatilho em `en` e `pt-BR`, light/dark e viewports representativos.
- [x] 4.2 Testar wrap por wheel, clique e teclado, centralização geométrica do item ativo, foco/ARIA, uma mudança por gesto e `scrollWidth === clientWidth`.
- [x] 4.3 Confirmar ausência de erros no console, validar a composição Minimalist na rota pública e verificar que a rota Gamified permanece inalterada visual e funcionalmente.

## 5. Verificação final

- [x] 5.1 Executar `npx pnpm format`, `npx pnpm typecheck`, `npx pnpm lint` e `npx pnpm build` com Node 24.
- [x] 5.2 Executar `openspec validate --changes "fix-minimalist-footer-pagination" --strict` e `git diff --check`, registrando qualquer ajuste necessário nos artefatos ou testes.
