## Context

As três expansões já mantêm um viewport interno com `overflow-y: auto` e referências DOM próprias: `src/features/minimalist/components/about-bio-panel.tsx`, `src/features/minimalist/components/card.tsx` e `src/features/minimalist/components/section.tsx`. Hoje o teclado é tratado localmente apenas em alguns contêineres, e a rolagem nativa depende do foco chegar ao elemento rolável. A motivação e o contrato de comportamento estão em `proposal.md` e nos deltas de `specs/`.

## Goals / Non-Goals

**Goals:**

- Fazer `ArrowUp`/`ArrowDown` alcançar o viewport expandido a partir de qualquer foco dentro da expansão.
- Reutilizar a mesma regra de direção, limites e consumo de evento nas três áreas.
- Preservar Escape, controles de expansão/recolhimento, seleção circular de Experiência e bloqueios de scroll já existentes.
- Validar o comportamento com interação real de teclado em `e2e/`.

**Non-Goals:**

- Alterar a arquitetura FLIP, o layout, os gradientes ou o comportamento de wheel/touch.
- Criar uma navegação global alternativa para as setas.
- Alterar `src/app/[locale]/` ou o modo Gamified.

## Decisions

### Usar um utilitário compartilhado para a intenção de rolagem

Adicionar em `src/features/minimalist/` um utilitário pequeno que receba um `HTMLElement` e a direção derivada da tecla. Ele verifica `scrollTop`, `clientHeight` e `scrollHeight`, chama `scrollBy({ top, behavior: 'auto' })` somente quando existe espaço naquela direção e informa se o evento deve ser consumido. Isso mantém a semântica de limite idêntica para Sobre, Projetos e Experiência.

Alternativa considerada: duplicar cálculos em cada componente. Foi rejeitada porque diferenças pequenas entre os painéis fariam regressões de borda e tornariam a correção futura mais difícil.

### Tratar setas no contêiner raiz de cada expansão

`AboutBioPanel` tratará o evento no `aside` expandido; `ExperiencePage` continuará tratando o evento no viewport da experiência; `ProjectsPage` tratará o evento no grid. Como o evento de teclado borbulha, o foco pode permanecer no botão de recolhimento ou em outro controle sem exigir `focus()` artificial no conteúdo.

Alternativa considerada: mover o foco automaticamente para cada viewport após toda seta. Foi rejeitada porque altera a posição de foco do usuário e pode prejudicar a operação dos controles e leitores de tela.

### Consumir somente quando houver rolagem interna

Quando o utilitário confirma movimento possível, o handler chama `preventDefault()` e evita que a seta produza uma rolagem concorrente. No topo/fim, não chama `preventDefault()`, mantendo o contrato de limite e permitindo que o comportamento superior existente decida o que fazer. Escape continuará sendo processado antes da lógica direcional.

### Cobertura E2E baseada em `scrollTop`

Adicionar cenários aos testes Minimalist existentes em `e2e/minimalist-experience-section.spec.ts` e arquivos correspondentes de Sobre/Projetos (ou criar um arquivo focado se a organização atual exigir). Cada cenário deve expandir o conteúdo real, focalizar um controle fora do viewport rolável, pressionar a seta e observar `scrollTop`; também deve verificar que o limite não ultrapassa a faixa válida.

## Risks / Trade-offs

- [Risco] Uma seta em um controle interativo poderia ser interpretada simultaneamente pelo navegador e pelo viewport interno. → O handler só usa `preventDefault()` quando há espaço de rolagem e o utilitário é aplicado no ancestral da expansão.
- [Risco] Conteúdo CMS curto não oferece espaço para validar movimento. → Os testes devem pular de forma explícita quando o fixture/ conteúdo publicado não tiver overflow, sem fabricar dados em produção.
- [Risco] O handler de Projetos pode conflitar com o bloqueio de scroll da lista expandida. → A lógica deve manter o `scrollTop` da grade congelado e rolar apenas o elemento marcado como conteúdo expandido.
- [Risco] A rolagem programática pode não refletir imediatamente em todos os navegadores durante uma animação FLIP. → Validar após o estado expandido estar estabilizado e manter `behavior: 'auto'`, alinhado ao contrato atual de scroll.

## Migration Plan

1. Implementar o utilitário e conectar os três handlers.
2. Executar os testes E2E focados, `npx pnpm typecheck`, `npx pnpm lint`, `npx pnpm format:check` e `git diff --check`.
3. Se necessário reverter, remover as chamadas dos handlers e o utilitário; não há migração de dados, dependência ou alteração de API externa.
