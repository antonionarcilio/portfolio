## Context

`minimalist-accessibility-sound-effects` já entregou o catálogo tipado (`sound-catalog.ts`), o controlador reutilizável (`useMinimalistSoundEffects`, uma instância `Audio` por chamada, `preload="none"`) e a preferência persistida `options.soundEffects` (gerenciada por `useMinimalistA11y()` em `a11y.ts`, hoje só lida em `recruiter.tsx`). O bloqueio de viewport mobile (`window.innerWidth <= 512`, espelhando `32rem`) hoje vive inline em `a11y-panel.tsx`. Os componentes alvo desta mudança — `MinimalistSwitchBtn` (`switch-btn.tsx`), `MinimalistA11yTrigger` (`a11y-trigger.tsx`), o botão de saída do painel (inline em `recruiter.tsx`), `MinimalistCard`'s controle de expansão (`card.tsx`) e `MinimalistAnchor` (`anchor.tsx`) — são todos reutilizados em múltiplos pontos da árvore e hoje não recebem `options`/`soundEffects` como prop.

O gamified já resolve um problema equivalente (uma preferência lida por muitos componentes distantes) com `A11yProvider`/`useA11y()` (`src/features/gamified/contexts/a11y-context.tsx`): um Context Provider próximo da raiz, um hook que lança se usado fora do provider.

## Goals / Non-Goals

**Goals:**

- Reaproveitar a API já validada (`sound-catalog.ts`, `useMinimalistSoundEffects`) sem alterá-la.
- Disponibilizar `soundEffects && !isMobileLocked` para componentes profundamente aninhados sem herdar a prop `options` inteira por várias camadas de componentes que não a usam para mais nada.
- Extrair a detecção de viewport mobile para um único hook compartilhado, eliminando a duplicação que surgiria ao repetir a lógica em cada novo consumidor.
- Manter cada ponto de integração com sua própria instância do controlador de áudio.
- Reaproveitar a proteção contra múltiplas confirmações de um único gesto contínuo já existente em `acquireNavigationLock`/`movePage`/`selectPage`, sem introduzir um cooldown novo para a mudança de seção.

**Non-Goals:**

- Criar uma nova opção de UI para os sons de interação — a mesma preferência `soundEffects` do painel de acessibilidade governa tudo.
- Introduzir um provedor de áudio global que compartilhe uma única instância `Audio` entre múltiplos cliques simultâneos.
- Migrar `options`/`useMinimalistA11y()` para dentro do novo contexto — ele continua sendo a fonte de verdade; o contexto apenas espelha o valor combinado (`soundEffects && !isMobileLocked`) para leitura.

## Decisions

- **Contexto de leitura, não de estado:** `MinimalistSoundPreferenceContext` não gerencia estado próprio — `recruiter.tsx` continua chamando `useMinimalistA11y()` e passa `options.soundEffects` (combinado com o hook de viewport mobile) como o `value` do provider. Isso evita duas fontes de verdade para a mesma preferência; o contexto é só um cano para não precisar de prop-drilling em componentes reutilizados como `MinimalistAnchor`, que aparece em muitos pontos da árvore.
- **Hook de viewport mobile compartilhado:** extrair o `useState(false)` + `useEffect` com `resize` listener (hoje inline em `a11y-panel.tsx`) para `src/features/minimalist/hooks/use-minimalist-mobile-lock.ts`, exportando `useIsMinimalistSoundLocked()`. `a11y-panel.tsx` passa a consumir esse hook em vez de duplicar a lógica; os novos consumidores fazem o mesmo. Mantém o mesmo cuidado de SSR já corrigido na mudança anterior (inicializa em `false`, corrige em `useEffect`, nunca lê `window` durante o render).
- **Integração no componente compartilhado, não em cada consumidor:** `clear-mouse-clicks.wav` é disparado dentro do próprio `MinimalistSwitchBtn` (um único `onClick` wrapper), então `ThemeToggle`, `I18nToggle`, `ModeToggle` e os botões YES/NO herdam o som automaticamente, sem editar cada um. Um switch com `disabled` nunca dispara `onClick`, então nenhuma guarda extra é necessária.
- **Trigger e expansão compartilham um sentido de "abrir/fechar":** `MinimalistA11yTrigger`, o botão de saída do painel e o controle de expansão de `MinimalistCard` tocam o mesmo `mouse-click-close.wav` — são três componentes diferentes, então a integração é feita nos três `onClick`, mas com a mesma chamada de hook e o mesmo gate de contexto.
- **Âncora não aguarda o som:** `MinimalistAnchor` dispara `play()` e deixa a navegação do `<a>` prosseguir imediatamente — o efeito é best-effort, consistente com o non-goal de não atrasar navegação. Como cada `MinimalistAnchor` já cria sua própria instância `Audio` (`preload="none"`), não há custo de rede antes do clique.
- **Sem alterações no catálogo/controlador:** os três arquivos WAV pedidos já existem em `MINIMALIST_SOUND_CATALOG`; esta mudança só adiciona consumidores de `useMinimalistSoundEffects`, mantendo o padrão de uma instância por consumidor decidido na mudança anterior.
- **Mudança de seção tem som próprio, centralizado em `selectPage`/`movePage`:** os três caminhos de navegação de seção — pontos de paginação lateral, wheel e teclado (ArrowLeft/ArrowRight) — já convergem para `selectPage`/`movePage` em `recruiter.tsx`, ambos protegidos por `acquireNavigationLock` (1s). Tocar `plastic-bubble-click.wav` uma única vez, no ponto em que essas funções confirmam a mudança, cobre os três caminhos sem duplicar a lógica de disparo em cada handler de input.
- **Som de switch suprimido no clique do rodapé, para não duplicar:** como o switch de página do rodapé (`MinimalistSwitchBtn`) chama `selectPage` dentro do seu próprio `onClick`, um clique nele acionaria tanto o som de switch (`clear-mouse-clicks.wav`, da mudança anterior) quanto o novo som de seção. `MinimalistSwitchBtn` ganha um prop `playClickSound` (default `true`) para suprimir seu som padrão; as instâncias do switch de página do rodapé passam `playClickSound={false}` e dependem inteiramente do som de seção disparado por `selectPage`. Nenhuma outra instância de `MinimalistSwitchBtn` (tema, idioma, modo, YES/NO) é afetada.

## Risks / Trade-offs

- [Múltiplas instâncias `Audio` ociosas] → cada `MinimalistSwitchBtn`/`MinimalistAnchor` renderizado cria sua própria instância do controlador; com `preload="none"` isso não gera tráfego de rede antes do primeiro clique, mas múltiplas instâncias do mesmo efeito coexistem na página. Aceito como trade-off deliberado (ver Non-Goals) — revisitar com um provedor de áudio compartilhado se a contagem de instâncias se tornar um problema real.
- [Novo Context introduzido em uma feature que hoje só usa prop-drilling] → escopo do provider limitado à leitura de um único booleano combinado, valor já existe em `recruiter.tsx`; não deve virar um "grab-bag" de outras preferências.
- [Âncora navega antes do som tocar em navegações muito rápidas] → aceito (ver Non-Goals); o clique já dispara `play()` de forma síncrona antes do `href` ser seguido pelo navegador, então o efeito começa a tocar mesmo que a página mude em seguida.
- [Alteração acidental no gamified] → o novo contexto e hook vivem exclusivamente em `src/features/minimalist/`; validar a rota gamified após a implementação, como nas mudanças anteriores.
- [Som duplicado no clique do switch de página do rodapé] → suprimir o som padrão do switch (`playClickSound={false}`) especificamente nessas instâncias; o som de mudança de seção passa a ser a única reação sonora desse clique.

## Migration Plan

1. Extrair o hook de viewport mobile compartilhado e migrar `a11y-panel.tsx` para usá-lo (sem mudança de comportamento).
2. Introduzir o contexto de preferência de som, provido em `recruiter.tsx`.
3. Integrar o som de switches em `MinimalistSwitchBtn`.
4. Integrar o som de abrir/fechar/expandir em `MinimalistA11yTrigger`, no botão de saída do painel e no controle de expansão de `MinimalistCard`.
5. Integrar o som de clique em `MinimalistAnchor`.
6. Validar todas as superfícies em `en`/`pt-BR`, com efeitos ligados/desligados e em viewport mobile.
