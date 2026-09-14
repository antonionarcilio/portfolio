## 1. Auditoria e contrato visual

- [x] 1.1 Comparar a implementação atual com o artboard `2097:20729`, registrando medidas de referência, áreas fixas, controles e estados visuais.
- [x] 1.2 Confirmar os campos disponíveis em `PortfolioData` para nome, cargo, bio, localização e contatos, incluindo o comportamento de campos ausentes.

## 2. Shell persistente Minimalist

- [x] 2.1 Reestruturar `src/features/minimalist/components/minimalist-recruiter.tsx` para manter um único header/navbar e um único footer fora da área central deslizável.
- [x] 2.2 Corrigir `src/features/minimalist/components/minimalist-controls.tsx` e `minimalist-navigation.tsx` para reproduzir os controles, estados ativo/inativo, labels e foco do protótipo.
- [x] 2.3 Implementar a navegação da área central com slide entre seções sem deslocar o shell persistente, preservando locale e estado de seção.

## 3. Conteúdo da seção Sobre

- [x] 3.1 Ajustar o conteúdo de “Sobre” para a composição do artboard, incluindo portrait 168×168, cargo, nome, bio, localização e links de contato.
- [x] 3.2 Reutilizar o asset de perfil existente e eliminar placeholders ou textos editoriais hardcoded da seção.
- [x] 3.3 Renderizar `VER MAIS` apenas quando houver conteúdo adicional, mantendo o botão visível porém `disabled` e sem expansão.

## 4. Estilos e localização

- [x] 4.1 Reescrever os estilos escopados em `src/features/minimalist/styles.css` para a geometria, paleta, tipografia, espaçamento e responsividade do artboard.
- [x] 4.2 Garantir que as alterações não vazem para `src/features/gamified/` nem para outras rotas não Minimalist.
- [x] 4.3 Atualizar mensagens em `src/messages/en.json` e `src/messages/pt-BR.json` para todos os labels visíveis do shell e da seção.

## 5. Validação

- [x] 5.1 Executar `npx pnpm format:check`, `npx pnpm lint`, `npx pnpm typecheck` e build com Node 24.
- [x] 5.2 Validar no Chrome MCP em 1280×826 e viewport desktop menor: fidelidade estrutural, ausência de overflow, navegação, tema, locale, foco e botão desabilitado.
- [x] 5.3 Verificar a rota gamified e o console do navegador para confirmar ausência de regressões e erros runtime.
