## 1. Catálogo e controlador de áudio

- [x] 1.1 Criar o catálogo tipado dos oito arquivos WAV em `src/features/minimalist/`, incluindo `plastic-bubble-click.wav` como seleção padrão e caminhos locais válidos.
- [x] 1.2 Implementar o controlador reutilizável de áudio com seleção, `play`, `pause` e `stop`, uma única instância nativa de reprodução e tratamento de falhas de autoplay/carregamento.
- [x] 1.3 Cobrir com testes unitários o catálogo, a seleção padrão, os controles de ciclo de vida e o bloqueio de reprodução quando os efeitos estiverem desabilitados.

## 2. Preferência do menu de acessibilidade

- [x] 2.1 Reestruturar `src/features/minimalist/a11y.ts` para que `soundEffects` integre `MINIMALIST_A11Y_OPTION_KEYS`/`MinimalistA11yKey` como sexta opção navegável (habilitada por padrão), removendo o campo paralelo (`soundEffects` fora do union) e o tipo `MinimalistA11yPreferenceKey` que deixam de ser necessários.
- [x] 2.2 Remover de `src/features/minimalist/components/a11y-panel.tsx` o grupo de controle dedicado de som na área de conteúdo, garantindo que "Efeitos sonoros" seja exibida e alternada pelos mesmos controles de lista e YES/NO usados pelas demais opções, sem reprodução automática na abertura.
- [x] 2.3 Substituir as chaves dedicadas de som (`soundGroup`, `soundOn`, `soundOff`, `soundOnAria`, `soundOffAria`) por `options.soundEffects.title`, `.description` e `.question` em `src/messages/en.json` e `src/messages/pt-BR.json`, no mesmo formato das demais opções, usando a cópia fornecida em pt-BR e sua tradução em en.
- [x] 2.4 Bloquear a opção "Efeitos sonoros" em viewports com largura ≤ `32rem` (mesmo breakpoint usado em `src/features/minimalist/styles.css`): desabilitar o controle de alternância em `a11y-panel.tsx` e impedir a reprodução real do efeito nesse viewport, independentemente do valor persistido, usando detecção de largura em JS equivalente à já usada em decisões de comportamento (ex.: `cv-header.tsx`).

## 3. Integração do experimento de scroll

- [x] 3.1 Conectar a reprodução de `plastic-bubble-click.wav` a toda mudança de item confirmada — por `consumeA11yWheel` (wheel) ou por seta de teclado (ArrowUp/ArrowDown) —, incluindo os limites circulares e evitando reprodução abaixo do limiar no wheel.
- [x] 3.2 Remover a restrição que mantinha o som exclusivo ao wheel: a navegação por teclado passa a solicitar a reprodução do efeito a cada seta confirmada, **sem** aplicar o cooldown de `MINIMALIST_A11Y_WHEEL_COOLDOWN_MS` usado pelo wheel — cada seta é uma ação discreta, diferente do wheel, que precisa do cooldown para não tratar um único gesto físico contínuo como várias confirmações.
- [x] 3.3 Reescrever os testes de interação para cobrir reprodução via wheel **e** via teclado (setas, incluindo repetição rápida sem supressão pelo cooldown do wheel), navegando até a opção "Efeitos sonoros"/"Sound effects" pela lista e alternando via os controles genéricos YES/NO compartilhados com as demais opções — cobrindo wheel abaixo/acima do limiar, mudança circular, estado desligado, restauração persistida e ausência de reprodução na abertura.
- [x] 3.4 Adicionar testes de interação cobrindo o bloqueio em viewport mobile (opção visível e desabilitada, sem áudio) e a transição desktop→mobile com a preferência já habilitada, garantindo que fique silenciosa sem perder o valor persistido.

## 4. Validação visual e de regressão

- [x] 4.1 Verificar o painel em `en` e `pt-BR`, com efeitos ligados e desligados, nos viewports suportados, incluindo foco, nomes acessíveis e ausência de overflow horizontal.
- [x] 4.2 Confirmar que a rota gamified não carrega estado, estilos, mensagens ou comportamento de áudio do Minimalist.
- [x] 4.3 Executar `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint`, a validação OpenSpec estrita e `git diff --check`, corrigindo qualquer falha introduzida pela mudança.
- [x] 4.4 Revalidar visualmente o estado bloqueado da opção "Efeitos sonoros" no mobile, em `en` e `pt-BR`, incluindo foco e nome acessível do controle desabilitado.
