## 1. Shared keyboard-scroll contract

- [x] 1.1 Criar em `src/features/minimalist/` um utilitário tipado que converta `ArrowUp`/`ArrowDown` em deslocamento vertical, verifique os limites de `scrollTop`/`scrollHeight` e retorne se o evento foi consumido.
- [x] 1.2 Adicionar testes unitários ou cobertura equivalente para direção, conteúdo sem overflow e limites superior/inferior do utilitário, conforme a infraestrutura de testes existente.

## 2. Conectar as expansões Minimalist

- [x] 2.1 Atualizar `src/features/minimalist/components/about-bio-panel.tsx` para encaminhar setas recebidas no painel expandido ao viewport da biografia, preservando o tratamento de wheel e Escape.
- [x] 2.2 Atualizar `src/features/minimalist/components/card.tsx` e `src/features/minimalist/components/section.tsx` para rolar o conteúdo expandido de Projetos e Experiência a partir de qualquer foco interno, sem liberar o scroll da lista de projetos nem alterar a empresa selecionada.
- [x] 2.3 Verificar que a lógica só chama `preventDefault()` quando há movimento interno possível e que controles de recolhimento continuam operando com foco e teclado.

## 3. Validação E2E

- [x] 3.1 Adicionar `e2e/minimalist-expanded-keyboard-scroll.spec.ts` com cenários de Sobre, Projetos e Experiência: expandir conteúdo real, manter foco fora do viewport rolável, pressionar ambas as setas e verificar `scrollTop`.
- [x] 3.2 Cobrir limites de topo/fim e confirmar que o scroll da lista de Projetos, a seleção de Experiência e a seção global permanecem estáveis quando o conteúdo interno pode consumir a tecla.
- [x] 3.3 Executar o teste E2E focado e registrar limitações quando o CMS atual não fornecer conteúdo com overflow, sem inserir fixtures na produção.

## 4. Quality gates

- [x] 4.1 Executar `npx pnpm typecheck`, `npx pnpm lint` e `npx pnpm format:check`, corrigindo regressões introduzidas pela mudança.
- [x] 4.2 Executar `git diff --check` e `openspec validate --type change "improve-minimalist-expanded-keyboard-scroll" --strict`.
