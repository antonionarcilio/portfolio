## 1. Contratos e modelo de estado

- [x] 1.1 Mapear as opções de acessibilidade existentes e seus efeitos/persistência, identificando o contrato compatível que o Minimalist pode consumir sem importar o contexto do gamificado.
- [x] 1.2 Definir tipos, constantes e dados traduzíveis da lista de opções, incluindo limiar de wheel, estado selecionado e estados YES/NO.
- [x] 1.3 Implementar a lógica testável de navegação circular, acumulação de delta, troca de sentido e consumo de no máximo um item por gesto.

## 2. Painel Minimalist

- [x] 2.1 Criar o componente do painel com landmark/nome acessível, fechamento, retorno de foco e integração ao `MinimalistA11yTrigger`.
- [x] 2.2 Renderizar a lista lateral com janela circular, seleção atual, gradientes decorativos sem captura de ponteiro e foco sem itens clonados interativos.
- [x] 2.3 Renderizar o detalhe da opção conforme o Figma, com título, descrição, pergunta e YES/NO usando `MinimalistSwitchBtn` e `aria-pressed`.
- [x] 2.4 Integrar wheel com limiar e teclado (`ArrowUp`/`ArrowDown`), anunciando a opção selecionada e sincronizando o detalhe com a lista.
- [x] 2.5 Conectar cada toggle ao efeito/persistência de acessibilidade mapeado, mantendo continuidade ao fechar e reabrir o painel.

## 3. Visual, responsividade e i18n

- [x] 3.1 Adicionar as mensagens do painel, descrições, perguntas, rótulos, anúncios e nomes acessíveis em `src/messages/pt-BR.json` e `src/messages/en.json` com chaves simétricas.
- [x] 3.2 Implementar os estilos BEM em `src/features/minimalist/styles.css`, incluindo composição desktop próxima dos frames Figma `2138:3525`, `2138:3750` e `2138:3757`, foco, estados, gradientes e dark mode.
- [x] 3.3 Adicionar regras responsivas no stylesheet da feature para viewport estreita, sem overflow horizontal e sem variantes de breakpoint arbitrárias no JSX.
- [x] 3.4 Aplicar transições somente com Framer Motion e garantir que redução de movimento não introduza animação alternativa fora do contrato existente.

## 4. Validação automatizada e visual

- [x] 4.1 Executar Playwright MCP em `pt-BR` e `en` para validar abertura/fechamento, snapshot de acessibilidade, foco, localização e estados YES/NO.
- [x] 4.2 Executar Playwright MCP para validar wheel abaixo/acima do limiar, troca ascendente/descendente, troca de sentido, circularidade e teclado.
- [x] 4.3 Capturar screenshots Playwright MCP em viewport desktop e estreita, conferir gradientes, composição, dark mode, ausência de overflow e console sem erros.
- [x] 4.4 Repetir uma verificação mínima na rota gamificada para confirmar isolamento e executar `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, `npx pnpm build` e `openspec validate --changes "add-minimalist-a11y-panel" --strict`.
