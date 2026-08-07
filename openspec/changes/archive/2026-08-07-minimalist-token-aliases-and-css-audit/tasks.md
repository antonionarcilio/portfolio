## 1. Inventário e contrato

- [x] 1.1 Comparar `Value.tokens.json`, `src/features/minimalist/styles.css` e `src/features/minimalist/reference.ts`, registrando o mapa de fonte, tamanho, peso, line-height, paleta e aliases `minimalist`.
- [x] 1.2 Atualizar `CLAUDE.md` para documentar aliases `@theme inline`, utilities locais no JSX, fronteira do CSS contextual, CVA e a exceção dos keyframes da View Transition API.
- [x] 1.3 Registrar a linha de base com `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, `git diff --check` e os testes/checagens Minimalist disponíveis.

## 2. Fundação de tokens Tailwind

- [x] 2.1 Adicionar em `src/features/minimalist/styles.css` os aliases `@theme inline` namespaceados para fonte, tamanhos, pesos e line-heights derivados do `Value.tokens.json`.
- [x] 2.2 Adicionar aliases semânticos de cor para paleta, alpha, background, foreground, muted, border, accent e divider, apontando para as custom properties internas do tema.
- [x] 2.3 Confirmar que os aliases não substituem utilities genéricas nem alteram os tokens da rota Gamified.
- [x] 2.4 Validar a fundação em light/dark com format, typecheck, lint e diff check.

## 3. Shell e primitives

- [x] 3.1 Migrar fonte, tipografia local, display, flex/grid, alinhamento, gaps, espaçamentos e dimensões simples do shell, header, footer e conteúdo para JSX.
- [x] 3.2 Migrar o consumo de aliases nos componentes de botão, anchor, divider, navigation, switches e paginação, preservando as variantes CVA e estados de interação.
- [x] 3.3 Remover somente regras CSS redundantes desse lote, mantendo media queries, foco, temas, pseudo-elementos e geometria composta.
- [x] 3.4 Validar shell e primitives em light/dark, foco, disabled, locale e viewport estreito.

## 4. Conteúdo e componentes compostos

- [x] 4.1 Migrar tipografia, cores e utilities locais de About, Experience e Education para aliases e utilities Tailwind no JSX.
- [x] 4.2 Migrar tipografia, cores e utilities locais de Projects e cards, preservando expansão FLIP, overflow, gradientes, layering e dimensões calculadas no CSS.
- [x] 4.3 Migrar os painéis de acessibilidade e bio sem remover regras de scroll, gradiente, tema, foco ou posicionamento contextual.
- [x] 4.4 Revisar CVA e `clsx` dos componentes afetados para evitar mapas paralelos e variantes artificiais.
- [x] 4.5 Validar conteúdo collapsed/expanded, light/dark, CMS, locale, teclado, viewport reduzido e scroll nativo dos projetos.

## 5. Auditoria e animações

- [x] 5.1 Auditar `src/features/minimalist/styles.css` e remover seletores que apenas duplicam utilities locais já migradas.
- [x] 5.2 Confirmar que regras responsivas continuam em media queries vinculadas a classes semânticas estáveis e que não foram introduzidos breakpoints arbitrários no JSX.
- [x] 5.3 Confirmar que novas animações continuam em Framer Motion e documentar os keyframes existentes da View Transition API como exceção restrita.
- [x] 5.4 Executar auditoria de aliases sem valores literais duplicados e de classes BEM que permanecem por comportamento ou contexto visual.

## 6. Validação final

- [x] 6.1 Executar `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint` e `git diff --check`.
- [x] 6.2 Executar os testes Playwright focados do Minimalist e registrar falhas preexistentes separadamente das regressões introduzidas.
- [x] 6.3 Verificar visualmente Minimalist em light/dark, desktop/mobile, `en`/`pt-BR`, foco de teclado, estados expandidos e ausência de overflow horizontal.
- [x] 6.4 Verificar a rota Gamified para confirmar isolamento funcional e visual.
- [x] 6.5 Validar o change com `openspec validate --changes "minimalist-token-aliases-and-css-audit" --strict` e preparar sincronização/arquivamento após aprovação.
