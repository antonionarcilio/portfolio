## 1. Inspeção e contrato do acordeão

- [x] 1.1 Mapear no painel atual a relação entre opção selecionada, detalhe, header `//...`, descrição, pergunta e controles YES/NO.
- [x] 1.2 Definir os identificadores semânticos e atributos de disclosure necessários para conectar cada cabeçalho mobile ao seu conteúdo.

## 2. Implementação do painel mobile

- [x] 2.1 Adaptar `src/features/minimalist/components/a11y-panel.tsx` para renderizar cabeçalho mobile com plus à esquerda, nome à direita e estado expandido acessível.
- [x] 2.2 Garantir que a expansão/recolhimento preserve a seleção, os estados dos toggles, o foco e a navegação por teclado existentes.
- [x] 2.3 Remover do conteúdo mobile o header `//...` sem remover descrição, questionamento ou alternativas/toggles da funcionalidade.
- [x] 2.4 Implementar a rotação de 45 graus do plus no estado expandido, respeitando a preferência de redução de movimento do projeto.

## 3. Estilos responsivos

- [x] 3.1 Adicionar em `src/features/minimalist/styles.css` as regras mobile do acordeão usando classes BEM e sem alterar a apresentação desktop.
- [x] 3.2 Validar quebra de texto, espaçamento, foco visível e ausência de overflow horizontal em viewports estreitas.

## 4. Verificação automatizada

- [x] 4.1 Atualizar `e2e/minimalist-a11y-panel.spec.ts` com cenários mobile de summary, expansão, rotação do plus e conteúdo sem `//...`.
- [x] 4.2 Cobrir teclado, foco/semântica, idiomas `pt-BR` e `en`, fechamento do painel e persistência dos toggles sem regressão.
- [x] 4.3 Executar os testes E2E focados em mobile e desktop e registrar separadamente qualquer falha preexistente ou dependente do ambiente.
- [x] 4.4 Executar `npx pnpm format:check`, `npx pnpm lint`, `npx pnpm typecheck` e `git diff --check`.
