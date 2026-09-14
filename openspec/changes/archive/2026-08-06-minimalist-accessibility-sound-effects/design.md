## Context

O painel existente em `src/features/minimalist/components/a11y-panel.tsx` mantém uma seleção circular e confirma mudanças de wheel por `consumeA11yWheel` em `src/features/minimalist/a11y.ts`. Os arquivos WAV são locais em `src/_assets/sounds`, não há dependência de áudio instalada e as preferências já são persistidas em `localStorage`. Ver `proposal.md` e as especificações desta mudança para a motivação e o contrato observável.

## Goals / Non-Goals

**Goals:**

- Centralizar catálogo, seleção e ciclo de vida dos efeitos em uma API pequena e reutilizável dentro de `src/features/minimalist/`.
- Integrar o primeiro consumidor ao evento de mudança confirmada do seletor — por wheel ou por teclado —, evitando sons para deslocamentos de wheel abaixo do limiar.
- Fazer a preferência de som participar do estado persistido do painel e funcionar nos idiomas `en` e `pt-BR`, como uma sexta opção da lista de acessibilidade, e não como um controle separado.
- Respeitar políticas do navegador tratando reprodução bloqueada como falha não fatal.

**Non-Goals:**

- Criar uma camada global de áudio compartilhada com o gamified.
- Implementar mixagem, volume configurável, efeitos simultâneos ou pré-carregamento de todos os arquivos.
- Adicionar áudio a interações que não sejam a navegação confirmada (wheel ou teclado) do painel nesta mudança.

## Decisions

- **Controlador local sem dependência externa:** criar um módulo/componente de áudio em `src/features/minimalist/` apoiado pela API nativa do navegador, porque o catálogo é pequeno, os arquivos já são locais e `play`/`pause`/`stop` são suficientes para o experimento. Howler ou outra biblioteca adicionaria peso e uma abstração que ainda não foi validada pelo produto.
- **Catálogo explícito e tipado:** registrar os oito arquivos atuais em uma definição estável, em vez de descobrir arquivos em runtime. O navegador não pode enumerar uma pasta pública de forma confiável e o catálogo explícito permite validar chaves e manter o padrão conhecido.
- **Reprodução no ponto de confirmação:** disparar o som junto da transição de índice em `a11y-panel.tsx`, após `consumeA11yWheel` devolver uma direção **ou** após uma seta de teclado (ArrowUp/ArrowDown) mover a seleção. Isso alinha um som a cada item realmente alterado, por wheel ou teclado, e evita ruído durante o acúmulo do wheel abaixo do limiar.
- **Efeitos sonoros como sexta opção da lista:** `soundEffects` passa a integrar o mesmo catálogo de chaves navegáveis (`MINIMALIST_A11Y_OPTION_KEYS`) usado pelas cinco opções existentes, em vez de um controle paralelo na área de conteúdo. Isso reaproveita o scroll/teclado circular com limiar de pressão e os botões YES/NO já existentes, sem duplicar UI ou lógica de alternância. O contador de opções ativas do gatilho (`activeCount`) passa a contar as seis opções da mesma forma, sem tratamento especial para o som.
- **Habilitado por padrão, por exceção:** ao contrário das cinco opções existentes (que iniciam desativadas), `soundEffects` inicia habilitado. É uma inconsistência deliberada: o objetivo desta mudança é validar a linguagem sonora já na primeira interação, sem exigir opt-in.
- **Sem reprodução automática na abertura:** o som só será solicitado por uma interação de mudança ou por um controle explícito de teste. Isso reduz risco de bloqueio de autoplay e evita surpresa para quem abre o painel.
- **Cooldown pós-confirmação no wheel, escopo exclusivo do wheel:** o acúmulo por `consumeA11yWheel` sozinho não impede múltiplas confirmações dentro de um único gesto físico contínuo — um flick de trackpad ou mesmo um único "notch" de mouse (tipicamente 100px no Chrome) já pode cruzar o limiar de 80px mais de uma vez antes que a pessoa perceba a primeira mudança. `a11y-panel.tsx` ignora deltas de wheel por `MINIMALIST_A11Y_WHEEL_COOLDOWN_MS` (250ms) após cada confirmação, usando `event.timeStamp` do próprio evento nativo. É uma heurística por tempo fixo, não detecção real de limite de gesto: um segundo flick deliberado dentro da janela também é descartado. **Este cooldown SHALL NOT se aplicar ao teclado:** cada ArrowUp/ArrowDown é uma ação discreta e deliberada, diferente do wheel, que gera dezenas de eventos para um único gesto físico — o problema que o cooldown resolve simplesmente não existe no teclado. Reaplicar o mesmo cooldown lá suprimiria repetições rápidas legítimas (segurar a seta pressionada, ou apertar várias vezes em sucessão). Cada seta confirmada solicita o som imediatamente, sem checar `lastConfirmedAt`; a instância única de áudio (já usada para evitar sobreposição — ver Risks) garante que disparos próximos apenas reiniciam o clipe em vez de empilhar reproduções.
- **Foco único no container da lista, nunca no item:** cada opção visível é remontada a cada mudança de seleção (a chave React do slot central inclui a chave da opção, que muda), então um `tabIndex={0}` no botão selecionado nunca sobrevive a uma navegação — o foco do DOM caía silenciosamente para `<body>` a cada wheel/seta. Os botões de opção agora são sempre `tabIndex={-1}` (permanecem clicáveis, mas nunca tabuláveis); o foco fica exclusivamente no container `role="listbox"` (já persistente entre renders) e `aria-activedescendant`, já presente, continua comunicando a opção ativa para tecnologias assistivas.
- **Bloqueado (não oculto) em viewport mobile:** em vez de remover "Efeitos sonoros" da lista de seis opções abaixo de `32rem` (mesmo breakpoint já usado em `src/features/minimalist/styles.css` para outras regras de viewport estreito), a opção permanece visível e navegável, mas o controle de alternância fica desabilitado e a reprodução real do efeito é sempre bloqueada nesse viewport, independentemente do valor persistido — reaproveitando o padrão `disabled` de `MinimalistSwitchBtn` já usado pelo modo "C" em `ModeToggle` (`switches.tsx`). Isso evita que a contagem de itens da lista (e, por consequência, o índice circular e o `aria-activedescendant`) dependa do viewport, o que exigiria recalcular seleção/wrap a cada redimensionamento. A detecção é por `window.innerWidth`, medida em JS — não apenas CSS —, porque a decisão afeta comportamento (bloqueio de estado), não só aparência, mesmo padrão já usado em `cv-header.tsx` para decisões dependentes de largura.
- **Mensagens localizadas:** adicionar os rótulos e descrições em `src/messages/en.json` e `src/messages/pt-BR.json`; nenhum texto de interface será criado dentro do componente.

## Risks / Trade-offs

- [Reprodução bloqueada por política do navegador] → capturar a rejeição de `play()` e manter o controlador silencioso e a interação funcional.
- [Corte ou sobreposição de cliques em scroll rápido] → usar uma única instância do efeito selecionado e reiniciar a reprodução somente por mudança confirmada; não criar uma instância por evento bruto.
- [Catálogo ficar desatualizado quando novos WAV forem adicionados] → manter o registro em um arquivo dedicado e incluir a lista atual nas tarefas/testes, deixando a expansão explícita.
- [Alteração acidental no gamified] → limitar imports, estado e estilos a `src/features/minimalist/` e validar a rota gamified após a implementação.
- [Redimensionar de desktop para mobile com a preferência já habilitada] → a reprodução deve ficar silenciosa imediatamente ao cruzar o breakpoint, sem apagar o valor persistido, para que o som volte a funcionar normalmente se o viewport voltar a alargar.

## Migration Plan

1. Implementar o controlador e a preferência atrás do escopo Minimalist.
2. Validar o painel em `en` e `pt-BR`, com som habilitado/desabilitado e navegação por wheel/teclado.
3. Se o experimento for rejeitado, remover a integração do painel e o estado de preferência; os arquivos de som locais permanecem disponíveis para uma decisão futura.
