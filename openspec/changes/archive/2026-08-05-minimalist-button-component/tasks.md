## 1. Contrato confirmado

- [x] 1.1 Registrar na referência Minimalist os dados confirmados do nó `2099:1949`: `button/collapse`, oito variantes, tipografia, cores, opacidades, espaçamento, distinção entre frame de inspeção e botão, e tratamento dos colchetes.
- [x] 1.2 Inventariar os controles “VER MAIS” e separar seus usos dos demais botões, toggles, anchors, dividers e paginação.

## 2. Componente Button

- [x] 2.1 Criar `src/features/minimalist/components/button.tsx` exportando `Button` com label localizado, `type="button"` padrão, callback, disabled e nome acessível.
- [x] 2.2 Implementar somente o contrato visual `default|hover|focus|disable` × `light|dark`, usando CVA para os eixos estáveis e estados nativos para interação real.
- [x] 2.3 Implementar em `src/features/minimalist/styles.css` a tipografia JetBrains Mono 14 px uppercase, paleta preto/branco, opacidades 100%/70%/30%, espaçamento e colchetes conforme as variantes do Figma, sem borda/radius do frame de inspeção.
- [x] 2.4 Garantir que os colchetes sejam decorativos para tecnologia assistiva, que o disabled seja nativo e que a API não introduza `pressed`, `size`, `icon` ou `loading`.

## 3. Migração isolada

- [x] 3.1 Migrar os controles “VER MAIS” de `minimalist-recruiter.tsx` para `Button`, preservando labels, callbacks e comportamento disabled.
- [x] 3.2 Remover somente classes, imports e variantes duplicadas do controle “VER MAIS”, sem alterar os contratos de Anchor, Divider, Toggle, Pagination ou outros componentes.

## 4. Validação Playwright

- [x] 4.1 Validar as oito combinações do Figma com screenshots, computed styles, bounding boxes e comparação visual 1:1 no viewport de referência.
- [x] 4.2 Validar hover, focus-visible, Enter, Space, nome acessível, disabled e ausência de ativação quando desabilitado.
- [x] 4.3 Verificar `en` e `pt-BR`, light e dark, ausência de overflow/erros de console na rota Minimalist e isolamento visual/funcional da rota Gamified.

## 5. Qualidade

- [x] 5.1 Executar `npx pnpm format`, `npx pnpm typecheck`, `npx pnpm lint`, `npx pnpm build` e `git diff --check` usando Node 24.
- [x] 5.2 Executar `openspec validate --changes "minimalist-button-component" --strict` e confirmar que todos os artefatos permanecem coerentes.
