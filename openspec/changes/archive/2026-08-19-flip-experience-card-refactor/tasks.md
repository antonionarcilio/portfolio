## 1. Extrair o hook de overlay/geometria de `card.tsx`

- [x] 1.1 Criar `src/features/minimalist/hooks/use-minimalist-card-flip.ts` movendo a lógica de `cardSlotRef`/`captureExpansionGeometry`/`overlayGeometry`/`overlayTarget`/`isOverlay`/`isCollapsing`/`overlayCycle`/quadro de seed/teardown por timeout de `card.tsx` para o hook, parametrizado por uma ref de container (em vez do `closest('.minimalist__project-grid')` fixo) e por callbacks opcionais de salvar/restaurar deslocamento de rolagem do container.
- [x] 1.2 Atualizar `MinimalistCard` (`card.tsx`) para consumir o novo hook, fornecendo o grid como container e os callbacks de scroll-lock hoje embutidos (`grid.scrollTop`), mantendo as mesmas classes, data-attributes e comportamento de foco/gradiente já existentes.
- [x] 1.3 Rodar `npx pnpm dev` e verificar manualmente `ProjectsPage`: expandir/recolher em diferentes células do grid (canto, borda, centro), com o grid rolado, com `reduceMotion` ativo e desativo — confirmar que o comportamento é idêntico ao anterior à extração.
- [x] 1.4 Rodar `npx pnpm lint` e `npx pnpm typecheck`.

## 2. Remover o FLIP baseado em `layout`/`layoutId`

- [x] 2.1 Remover `src/features/minimalist/hooks/use-minimalist-flip.ts`.

## 3. Reformular `ExperiencePage` para conteúdo persistente + overlay compartilhado

- [x] 3.1 Reescrever a estrutura de cabeçalho de `ExperiencePage` (`section.tsx`) para manter as variantes colapsada (`// role` + período) e expandida (aliases unidos por " | " + modalidade) sempre montadas, com a visibilidade alternada por estado/CSS, no mesmo padrão de `meta`/`metaExpanded` de `card.tsx`.
- [x] 3.2 Substituir o `AnimatePresence` com `key="collapsed"`/`key="expanded"` por uma condição simples de conteúdo (equivalente a `showExpandedLayout`), preservando os campos "Cargo", "Experiência" e "Um pouco sobre" no bloco expandido e o resumo truncado (`excerpt`, `line-clamp`) no bloco colapsado.
- [x] 3.3 Conectar `ExperiencePage` ao hook criado em 1.1, fornecendo `viewportRef` como container (sem callbacks de scroll-lock, já que o viewport não rola) e o slot do painel de detalhe como elemento medido.
- [x] 3.4 Preservar o comportamento já especificado: foco movido ao painel expandido, `Escape` recolhe, foco restaurado ao botão "Expandir" após recolher, gradiente de rolagem em "Um pouco sobre", `layoutDependency`-equivalente para não animar ao trocar apenas a empresa selecionada.
- [x] 3.5 Ajustar `src/features/minimalist/styles.css` (ou arquivo de estilos equivalente da feature) se novas classes de alternância de header/conteúdo forem necessárias, seguindo BEM e o boundary CSS/Tailwind já definido em CLAUDE.md.

## 4. Verificação final

- [x] 4.1 Rodar `npx pnpm dev` e verificar manualmente `ExperiencePage`: expandir/recolher por mouse e teclado, trocar de empresa selecionada sem disparar animação de expansão, `Escape` durante expansão, foco após recolher, gradiente do campo "Um pouco sobre", `reduceMotion` ativo e desativo.
- [x] 4.2 Confirmar que nenhum import de `use-minimalist-flip.ts` restou no projeto.
- [x] 4.3 Rodar `npx pnpm lint`, `npx pnpm typecheck` e `npx pnpm format:check`.
- [x] 4.4 Rodar `openspec validate --change flip-experience-card-refactor --strict` e corrigir eventuais divergências entre a implementação e o delta spec.
