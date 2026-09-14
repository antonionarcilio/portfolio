## Context

Duas implementações de acessibilidade coexistem com o mesmo contrato implícito (`localStorage['a11y-opts']` + classes `a11y-*` no `<html>`): o Context `A11yProvider`/`useA11y` do gamified (`src/features/gamified/contexts/a11y-context.tsx`, 5 opções) e o hook `useMinimalistA11y` (`src/features/minimalist/a11y.ts`, 6 opções com `soundEffects`). Motivação em `proposal.md` — Why.

Fatos verificados no código atual:
- Todas as regras CSS de a11y (greyscale, cursor grande, highlight de links, zoom do upscale, reduce-motion de shimmer) vivem em `src/features/gamified/styles.css`, importado globalmente em `src/app/globals.css` — o CSS "vaza" para o minimalist (o highlight usa o ciano `#2bd6ff` do gamified na rota minimalist).
- A guarda de viewport `<= 399px` do upscale existe apenas no `A11yProvider` (`a11y-context.tsx:90-100`); o `useMinimalistA11y` não a tem — em 360px o upscale permanece ativo com `zoom: 1.2`.
- Ambos os lados já espelham `MotionGlobalConfig.skipAnimations` (`a11y-context.tsx:27-37,75` e `a11y.ts:74-87,105`), resultado não commitado do change `add-theme-circle-transition`.
- O `.a11y-zoom-wrapper` é um wrapper no layout raiz (`src/app/[locale]/layout.tsx:64`) envolvendo todas as rotas.
- O `soundEffects` hoje é a única opção sem classe; é lida por `useMinimalistSoundEffects` e pelo `MinimalistSoundPreferenceProvider` (contexto de leitura).
- O `MinimalistClient` futuro será o mesmo layout em modo cliente (toggle R/C em `src/features/minimalist/components/switches.tsx`), ou seja, um shell por vez.

## Goals / Non-Goals

**Goals:**

- Centralizar em `src/shared/a11y/store.ts` o contrato: chave de storage, opções, defaults, leitura/persistência com merge por chave, mapa de classes, guarda de upscale e sincronização de reduceMotion.
- Preservar as APIs públicas (`useA11y`, `useMinimalistA11y`, props de painel/trigger) para não tocar os consumidores existentes.
- Dar a cada layout a posse do CSS de apresentação dos efeitos específicos do tema, com o CSS genérico numa camada compartilhada.
- Corrigir a paridade da guarda de upscale e preparar o estado do Minimalist para a troca de modo R↔C.

**Non-Goals:**

- Não unificar num único provider no layout raiz (afetaria rotas de homepage/minigame sem consumidor).
- Não renomear `a11y-opts` nem alterar o formato de persistência de forma incompatível.
- Não mudar o catálogo/controlador de sons, tokens de tema ou o CSS visual do painel.

## Decisions

1. **Store compartilhado, estado React por consumidor.** `src/shared/a11y/store.ts` expõe helpers puros (leitura, merge, persistência, mapa de classes, guarda de viewport, sync de reduceMotion) e os hooks/contextos de cada feature mantêm seu próprio estado React alimentado por esses helpers. *Alternativa descartada:* um `A11yProvider` global no root layout — montaria em todas as rotas e obrigaria o modo de preparação R↔C a depender de layout, além de acoplar minigames/home.

2. **Merge por chave na persistência.** `readOptions`/`persistOptions` leem e gravam o objeto inteiro preservando chaves desconhecidas (spread do objeto lido), garantindo que o `soundEffects` do minimalist sobreviva a visitas ao gamified e vice-versa. *Alternativa descartada:* persistir apenas as chaves conhecidas de cada feature — apagaria preferências do outro layout.

3. **`soundEffects` no mesmo padrão das demais.** Entra no conjunto de chaves do store com default `true` e classe `a11y-sound-effects` no `<html>` (sem efeito visual). O gate de reprodução continua em `MinimalistSoundPreferenceProvider` (`soundEffects && !isMobileLocked`), agora lendo do estado compartilhado. O dropdown do gamified não exibe a opção porque `ITEMS` é explícito (`a11y-dropdown.tsx:89-100`).

4. **Guarda de upscale no store, bloqueio no painel.** O efeito `matchMedia('(max-width: 399px)')` que força `upscale:false` passa a viver no store compartilhado (um hook usado por ambos). No painel minimalist, a opção "Enlarged Font" é **desabilitada** (não escondida) em `<= 399px`, pelo mesmo padrão do bloqueio de `soundEffects` (`a11y-panel.tsx:39,149-163`), evitando quebrar o índice circular. *Alternativa descartada:* esconder a opção (como o gamified) — mudaria a contagem de itens da lista circular.

5. **CSS: camada compartilhada + posse por layout.** Criar `src/shared/styles/a11y.css` com os efeitos genéricos (`a11y-greyscale`, `a11y-cursor-large`, `html.a11y-upscale .a11y-zoom-wrapper { zoom: 1.2 }`) e mover essas regras de `src/features/gamified/styles.css` para lá. Regras específicas de tema permanecem nos stylesheets de feature: highlight ciano no gamified; novo `html.a11y-highlight-links a` no minimalist usando `var(--minimalist-accent)` (token já existente em `minimalist/styles.css:43`); breakpoints `.cv-*` de upscale e `.cv-shimmer-*` de reduce-motion continuam no gamified.

6. **Estado do Minimalist sobe para o `page.tsx`.** O `useMinimalistA11y` passa a ser chamado em `src/app/[locale]/portfolios/minimalist/page.tsx` e `options`/`toggle` descem como props ao `MinimalistRecruiter` (que deixa de chamar o hook). Assim, trocar modo R↔C (futuro `MinimalistClient`) não remonta o estado a11y.

7. **APIs públicas preservadas.** `minimalist/a11y.ts` mantém e re-exporta `MINIMALIST_A11Y_OPTION_KEYS`, `consumeA11yWheel`, `nextCircularIndex` e `useMinimalistA11y` (agora sobre o store) — painel/trigger/recruiter não mudam de contrato. O `A11yProvider` do gamified continua expondo `useA11y`/`A11yKey` idênticos, apenas delegando ao store.

## Risks / Trade-offs

- [Regras CSS movidas de `gamified/styles.css` para o CSS compartilhado podem alterar ordem/especificidade em camadas `@layer base`] → mover com o mesmo seletor e ordem relativa; validar as duas rotas visualmente.
- [A classe `a11y-sound-effects` no `<html>` é nova e não tem efeito visual] → sem regra CSS associada; documentar no comment do `CLASS_MAP` que é estado para consumo JS e e2e.
- [Merge por chave pode manter lixo acumulado (ex.: `textLarge` órfão já presente)] → aceito: preservar é mais seguro que apagar; limpeza futura pode versionar a chave.
- [Bloqueio (em vez de ocultar) do upscale em <400px diverge do gamified que esconde] → intencional para não quebrar a lista circular; comportamento equivalente em UX (opção inoperante).
- [Subir o estado para o `page.tsx` muda onde o hook é chamado] → risco baixo; o `page.tsx` já é client-compatible e o shell recebe as mesmas props que já usava.

## Migration Plan

1. Implementar o store compartilhado e a guarda de upscale (comportamento neutro no gamified).
2. Refatorar `useMinimalistA11y` e `A11yProvider` sobre o store; verificar as duas rotas e os consumidores.
3. Mover o CSS genérico e adicionar o highlight do minimalist com `--minimalist-accent`.
4. Subir o estado do Minimalist para o `page.tsx`.
5. Rollback: reverter os commits do change (sem migração de dados externa; a chave `a11y-opts` permanece compatível).
