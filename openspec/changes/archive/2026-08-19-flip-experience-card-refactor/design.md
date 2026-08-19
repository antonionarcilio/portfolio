## Context

`src/features/minimalist/components/card.tsx` (`MinimalistCard`, usado por `ProjectsPage`) e `src/features/minimalist/components/section.tsx` (`ExperiencePage`) resolvem a mesma transição — colapsado ⇄ expandido, com continuidade espacial — de duas formas diferentes hoje:

- **`card.tsx`**: mantém um único `motion.article` persistente por card. O bloco de conteúdo troca por uma condição simples (`{!showExpandedLayout && …}` / `{showExpandedLayout && …}`) sem `AnimatePresence`, e o cabeçalho (`meta`/`metaExpanded`) fica sempre montado, com a visibilidade de cada variante resolvida em CSS pelo estado (`data-expanded`/classe). A geometria é capturada do DOM real (`captureExpansionGeometry`) e animada como overlay absoluto (`top/left/width/height`) até a área do grid, com um quadro de seed de uma animação e teardown por `setTimeout` amarrado à duração compartilhada.
- **`section.tsx`** (`ExperiencePage`): usa `layout`/`layoutId` do Framer Motion (via `useMinimalistFlipLayout`) no `motion.div` do painel, e troca o conteúdo com `AnimatePresence` entre dois `motion.div` com `key="collapsed"`/`key="expanded"` — cada um monta sua própria subárvore (campos diferentes, textos diferentes) com fade de entrada/saída próprio.

Ver proposal.md para a motivação. `openspec/specs/minimalist-card-flip-expansion/spec.md` já formaliza a "Reusable FLIP contract": a lógica de medição/interpolação deve ser reutilizável por Sobre e Experiência sem duplicação — hoje isso não é cumprido, pois a lógica de overlay vive inteiramente dentro de `card.tsx`.

## Goals / Non-Goals

**Goals:**
- `ExperiencePage` passa a resolver a transição com a mesma estratégia de `card.tsx`: conteúdo persistente + condição de renderização simples, geometria real capturada e animada como overlay.
- A lógica de captura/overlay/seed/teardown deixa de existir apenas dentro de `card.tsx` e passa a ser consumida por ambos os componentes a partir de um único lugar, cumprindo a "Reusable FLIP contract" já especificada.
- `use-minimalist-flip.ts` (layoutId-based) é removido; nenhum consumidor resta.

**Non-Goals:**
- Nenhuma mudança de conteúdo, copy, campos exibidos, i18n ou comportamento observável já coberto por `minimalist-recruiter-experience` além da técnica de transição (ver delta spec).
- Não estende a técnica para a seção Sobre (`AboutPage`) — fora do escopo desta mudança, mesmo que a extração facilite isso no futuro.
- Não introduz nenhuma dependência nova; usa apenas Framer Motion e React já presentes.

## Decisions

### 1. Trocar `AnimatePresence` com duas subárvores por uma condição simples de conteúdo persistente

Em vez de `AnimatePresence` alternando `key="collapsed"`/`key="expanded"` (cada um com seu próprio `initial`/`exit` de opacidade e sua própria árvore de campos), `ExperiencePage` passa a manter um único container de conteúdo cujo bloco interno alterna por uma condição booleana equivalente ao `showExpandedLayout` de `card.tsx` (`expanded || isCollapsing`), assim como o header (kicker/período colapsados vs. aliases/modalidade expandidos) segue o padrão `meta`/`metaExpanded` de `card.tsx`: ambos os textos do header ficam disponíveis e a visibilidade é resolvida por CSS a partir do estado, não por mount/unmount.

**Alternativas consideradas:**
- Manter `AnimatePresence` e só trocar o FLIP por geometria real — rejeitada: mantém duas árvores de conteúdo com fades de entrada/saída independentes competindo visualmente com o fade único do overlay, que é exatamente o efeito "não harmônico" reportado.
- Montar sempre as duas variantes (colapsada e expandida) simultaneamente, ocultas por CSS puro (`display:none`) sem nunca desmontar — rejeitada: `card.tsx` já não faz isso para o bloco de conteúdo (só o header é assim); manter os dois blocos de conteúdo sempre montados duplicaria markup pesado (Markdown renderizado) sem necessidade, e divergiria do próprio componente usado como base.

### 2. Extrair a máquina de overlay/geometria de `card.tsx` para um hook compartilhado

A lógica de `cardSlotRef`, `captureExpansionGeometry`, `overlayGeometry`/`overlayTarget`, o quadro de seed (`useLayoutEffect` com `requestAnimationFrame` duplo) e o teardown por `setTimeout` amarrado a `MINIMALIST_EXPANSION_DURATION_MS` sai de `card.tsx` para um hook em `src/features/minimalist/hooks/`, parametrizado por uma ref de container (em vez do `closest('.minimalist__project-grid')` fixo) e por callbacks opcionais de salvar/restaurar deslocamento de rolagem do container — necessário para o grid de Projetos (`grid.scrollTop`), mas não para o viewport de Experiência, que não rola. `MinimalistCard` e `ExperiencePage` passam a consumir o mesmo hook, cada um fornecendo sua própria ref de container e seu próprio `motion.*` de overlay.

**Alternativas consideradas:**
- Deixar a lógica duplicada dentro de `section.tsx`, só copiando o padrão de `card.tsx` sem extrair — rejeitada: viola a regra de "No code duplication" do projeto e a própria "Reusable FLIP contract" já especificada, que exige reuso sem duplicar a lógica de medição/interpolação.
- Generalizar via `layout`/`layoutId` do Framer Motion em vez de geometria capturada manualmente — rejeitada: é exatamente a técnica que está sendo abandonada, pelo motivo já documentado nos comentários de `card.tsx` (`layout` é transform-based e produz o salto de tamanho no primeiro frame).

## Risks / Trade-offs

- [Extrair o hook pode introduzir uma regressão sutil na animação de Projetos, já validada em produção] → Extrair primeiro, sem tocar em `section.tsx`, e confirmar visualmente (`npx pnpm dev`, expandir/recolher cards em diferentes células e com o grid rolado) que `ProjectsPage` continua idêntico antes de tocar em `ExperiencePage`.
- [O viewport de Experiência (`viewportRef`) não é rolável como o grid de Projetos; um hook mal generalizado poderia reintroduzir lógica de scroll desnecessária] → Os callbacks de scroll-lock ficam opcionais (no-op por padrão) no hook, e só `ProjectsPage` os fornece.
- [Header sempre montado (kicker/período colapsados + aliases/modalidade expandidos) aumenta levemente o HTML sempre presente] → Aceitável: mesmo padrão já em produção no header de `card.tsx`, custo desprezível.

## Migration Plan

1. Extrair o hook de overlay/geometria a partir da lógica hoje em `card.tsx`, mantendo `MinimalistCard` funcionalmente idêntico (mesmos data-attributes, mesmas classes, mesmo comportamento de scroll-lock do grid). Verificar Projetos manualmente antes de prosseguir.
2. Remover `src/features/minimalist/hooks/use-minimalist-flip.ts`.
3. Reescrever `ExperiencePage` em `section.tsx` para consumir o hook extraído e a estrutura de conteúdo persistente (header sempre montado + condição simples para o bloco de conteúdo), preservando os campos e comportamento descritos no delta de `minimalist-recruiter-experience`.
4. Rodar `npx pnpm lint`, `npx pnpm typecheck`, e verificar manualmente no navegador: expandir/recolher com teclado e mouse, `Escape`, foco após recolher, gradiente de rolagem do campo "Um pouco sobre", e `reduceMotion` ativo.
5. Rollback: reverter o commit da mudança — não há dado persistido nem migração de schema envolvida.
