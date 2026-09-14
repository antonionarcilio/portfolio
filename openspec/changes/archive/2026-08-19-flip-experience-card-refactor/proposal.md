## Why

A seção Experiências ainda expande seu painel de detalhe com `AnimatePresence` trocando duas subárvores de DOM completamente distintas (`key="collapsed"` / `key="expanded"`) e com o FLIP feito via `layout`/`layoutId` do Framer Motion (`use-minimalist-flip.ts`). Essa é a abordagem antiga, já abandonada em Projetos: `card.tsx` foi reformulado para manter todo o conteúdo (colapsado e expandido) presente na árvore DOM o tempo todo, ocultando/exibindo via classe/CSS e animando geometria real capturada (`captureExpansionGeometry`/overlay), o que produz uma revelação mais harmônica e evita o salto de layout do `layout` transform-based descrito nos comentários de `card.tsx`. A "Reusable FLIP contract" já prevista em `minimalist-card-flip-expansion` promete essa reutilização para Experiência, mas hoje não é cumprida.

## What Changes

- Reformular o JSX de `ExperiencePage` (`section.tsx`) para manter cabeçalho, resumo colapsado e campos expandidos sempre montados no DOM, alternando visibilidade por estado/CSS — no mesmo espírito do header (`meta`/`metaExpanded`) e do split `content`/`expandedContent` de `MinimalistCard` — em vez do swap via `AnimatePresence` com duas árvores de conteúdo distintas.
- Substituir o FLIP baseado em `layout`/`layoutId` (`useMinimalistFlipLayout`) pela técnica de captura de geometria real e overlay (rect colapsado → rect expandido, quadro de seed, teardown por timeout) já usada em `card.tsx`, extraindo essa lógica para um ponto compartilhado consumido por `MinimalistCard` e `ExperiencePage` — cumprindo a "Reusable FLIP contract" sem duplicar a máquina de estados de overlay.
- Remover `use-minimalist-flip.ts` (única consumidora era `ExperiencePage`) e qualquer código morto decorrente da migração.
- Preservar o comportamento e conteúdo hoje documentados em `minimalist-recruiter-experience` (kicker/período colapsados, campos expandidos, aliases, `employment_type`, gradiente de rolagem, foco, `Escape`) — é uma mudança de técnica de animação/estrutura, não de comportamento visível.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `minimalist-recruiter-experience`: o requirement "Experience detail expansion" descreve hoje a técnica como `layout`/`layoutId`; passa a descrever a técnica de captura de geometria/overlay com conteúdo sempre presente no DOM, alternado por estado.

## Impact

- `src/features/minimalist/components/section.tsx` — `ExperiencePage` (estrutura JSX e estado de expansão).
- `src/features/minimalist/components/card.tsx` — extração da lógica de overlay/geometria hoje local ao componente.
- `src/features/minimalist/hooks/use-minimalist-flip.ts` — removido.
- Novo módulo compartilhado para a lógica de overlay/geometria FLIP (local exato definido em design.md).
- Nenhuma mudança de i18n, CMS ou API; nenhuma mudança de comportamento visível para o usuário final.
