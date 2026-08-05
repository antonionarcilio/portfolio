## 1. Auditar contratos e preparar a composição

- [ ] 1.1 Mapear a renderização atual de projetos em `src/features/minimalist/components/recruiter.tsx`, `card.tsx`, `styles.css` e `hooks/use-minimalist-snap-scroll.ts`, preservando alterações não relacionadas.
- [ ] 1.2 Comparar os estados compacto, expandido e de lista com os nós Figma `2212:3607`, `2097:20992`, `2097:21133` e `2097:21131`, registrando dimensões e espaçamentos necessários para a implementação.
- [ ] 1.3 Definir a marcação BEM do viewport, track, linha e gradiente dos cards sem introduzir seletores globais ou dependências novas.

## 2. Implementar navegação isolada dos cards

- [ ] 2.1 Criar o modelo de posições/linhas navegáveis e atualizar suas medidas em mudanças de viewport, quantidade de colunas e expansão de card.
- [ ] 2.2 Integrar snap por linha ao viewport de projetos, com avanço/retrocesso de uma unidade por gesto e permanência nos limites.
- [ ] 2.3 Coordenar o consumo de wheel/touch/teclado para impedir que uma rolagem interna mude a seção global enquanto houver linha adjacente.
- [ ] 2.4 Aplicar scrollbar visualmente oculta, snap CSS e gradiente de término sem bloquear foco, leitura ou controle do último card.

## 3. Implementar expansão FLIP reutilizável

- [ ] 3.1 Extrair uma abstração FLIP em `src/features/minimalist/` com identidade estável, medição First/Last/Invert e execução Play via Framer Motion.
- [ ] 3.2 Conectar o card aos estados compacto/expandido, mantendo conteúdo real, `aria-expanded`, foco e posição da linha ativa.
- [ ] 3.3 Adicionar labels de expandir/recolher ao namespace `minimalist` em `src/messages/en.json` e `src/messages/pt-BR.json`.
- [ ] 3.4 Integrar a configuração global de redução de movimento e verificar que Sobre/Experiência podem reutilizar o contrato sem duplicação.

## 4. Validar visual, acessibilidade e isolamento

- [ ] 4.1 Atualizar ou criar testes e snapshots para ordem dos cards, snap por linha, limites, expansão/recolhimento e estados ARIA.
- [ ] 4.2 Validar visualmente Minimalist em `1280×826` e viewport estreito, nos temas claro/escuro e locales `en`/`pt-BR`, incluindo o gradiente e ausência de scrollbar.
- [ ] 4.3 Testar teclado, roda/touch, foco no último card e redução de movimento, confirmando que a navegação global continua funcionando fora do viewport.
- [ ] 4.4 Executar a validação da rota Gamified e os checks `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, `npx pnpm build` e `git diff --check`.
