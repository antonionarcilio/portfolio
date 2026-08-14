## Requirements

- Requirements do change: `requirements.md` com o estágio a executar.
- Requirements de qualidade global para todos os estágios:
  - TypeScript: `npx pnpm typecheck` sem erros.
  - ESLint: `npx pnpm lint` sem erros.
  - Requisitos das specs (delta `shared-a11y-contract`, `minimalist-a11y-panel`, `minimalist-sound-effects`) cobertos por code.

## Tasks

### Stage 1: Guarda de upscale <400px

#### Task 1.1: Guarda de upscale no hook minimalist

**Description:** Replicar a guarda de viewport do `A11yProvider` (`a11y-context.tsx:90-100`) no `useMinimalistA11y`: ao montar, e em mudanças de viewport, forçar `upscale:false` quando `matchMedia('(max-width: 399px)')` é atendido; a opção volta a poder ser ativada quando a viewport ultrapassa o limite.

**Acceptance Criteria:**
- [x] Em viewport `<= 399px`, `options.upscale` é forçado a `false` mesmo com preferência persistida ativa.
- [x] A classe `a11y-upscale` não é aplicada nesse estado e a persistência reflete a desativação.
- [x] Em viewport `> 399px`, a opção volta a poder ser ativada.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

### Stage 2: Contrato compartilhado + split de CSS

#### Task 2.1: Criar o store compartilhado

**Description:** Criar `src/shared/a11y/store.ts` com: chave `a11y-opts`; conjunto de opções e defaults (`upscale:false`, `greyscale:false`, `cursorLarge:false`, `highlightLinks:false`, `reduceMotion` via sistema, `soundEffects:true`); `readOptions`/`persistOptions` com merge por chave preservando chaves desconhecidas; `CLASS_MAP` com a classe de cada opção (incluindo `soundEffects: 'a11y-sound-effects'`); helper `getUpscaleGuard()` (matchMedia `<= 399px`); e sync de `MotionGlobalConfig.skipAnimations` síncrono no load e no render.

**Acceptance Criteria:**
- [x] `src/shared/a11y/store.ts` criado com os helpers descritos, sem efeitos colaterais de DOM no módulo.
- [x] Merge preserva chaves desconhecidas (ex.: `textLarge`) ao ler e persistir.
- [x] `MotionGlobalConfig.skipAnimations` é sincronizado com `reduceMotion` no load (sem flash) e ao trocar a opção.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

#### Task 2.2: Refatorar o hook minimalist sobre o store

**Description:** Fazer `useMinimalistA11y` (`src/features/minimalist/a11y.ts`) delegar ao store compartilhado, mantendo a API pública existente (`MINIMALIST_A11Y_OPTION_KEYS`, `consumeA11yWheel`, `nextCircularIndex`, retorno `options`/`toggle`) e a persistência em `a11y-opts`. Remover a guarda de upscale adicionada na Task 1.1 (agora no store). `useMinimalistSoundEffects`/`MinimalistSoundPreferenceProvider` passam a ler `soundEffects` do estado compartilhado.

**Acceptance Criteria:**
- [x] `useA11y`-equivalente do minimalist lê/escreve via store; classes `a11y-*` continuam aplicadas no `<html>`.
- [x] `soundEffects` começa `true` e é refletido como classe `a11y-sound-effects` no `<html>`.
- [x] A guarda de upscale segue válida após a remoção da implementação da Task 1.1.
- [x] Consumidores (painel, trigger, recruiter) não mudam de assinatura.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

#### Task 2.3: Refatorar o provider do gamified sobre o store

**Description:** Fazer `A11yProvider`/`useA11y` (`src/features/gamified/contexts/a11y-context.tsx`) delegar ao store compartilhado, preservando a API pública (`A11yKey`, `useA11y`). Remover a guarda de viewport e o sync de `MotionGlobalConfig` duplicados; manter o `ITEMS` explícito (sem `soundEffects`) no dropdown. A troca de `soundEffects` pelo painel do minimalist passa a valer no gamified apenas como estado compartilhado (sem item visual).

**Acceptance Criteria:**
- [x] Comportamento das 5 opções do gamified inalterado; classes aplicadas via `CLASS_MAP` do store.
- [x] Guarda de upscale e sync de `MotionGlobalConfig` continuam funcionando via store (remoção das duplicatas).
- [x] Preferências trocadas entre as rotas persistem nos dois sentidos.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

#### Task 2.4: Mover o CSS genérico para camada compartilhada

**Description:** Criar `src/shared/styles/a11y.css` e mover de `src/features/gamified/styles.css` as regras genéricas: `html.a11y-greyscale`, cursor grande (`a11y-cursor-large`), e `html.a11y-upscale .a11y-zoom-wrapper { zoom: 1.2 }`. Importar `a11y.css` em `src/app/globals.css`. Manter no gamified os breakpoints `.cv-*` de upscale e `.cv-shimmer-*` de reduce-motion, e o highlight ciano `html.a11y-highlight-links` (`gamified/styles.css:188-197`).

**Acceptance Criteria:**
- [x] `src/shared/styles/a11y.css` criado e importado em `globals.css`.
- [x] Efeitos genéricos funcionam igualmente nas rotas gamified e minimalist.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

#### Task 2.5: Highlight de links no minimalist com o token do tema

**Description:** Adicionar em `src/features/minimalist/styles.css` a regra `html.a11y-highlight-links a` (ou seletor equivalente do tema) usando `var(--minimalist-accent)` em vez do ciano herdado do gamified.

**Acceptance Criteria:**
- [x] Links realçados no minimalist usam o pink-500 (`--minimalist-accent`, `minimalist/styles.css:43`).
- [x] O highlight do gamified continua ciano `#2bd6ff`.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

#### Task 2.6: Bloquear a opção "Enlarged Font" em viewport estreito

**Description:** No painel minimalist (`src/features/minimalist/components/a11y-panel.tsx`), desabilitar (não esconder) a opção "Enlarged Font" quando a viewport é `<= 399px`, seguindo o padrão do bloqueio de `soundEffects` (alternância inerte com `disabled`). A opção permanece na lista circular.

**Acceptance Criteria:**
- [x] Em `<= 399px`, a opção "Enlarged Font" aparece desabilitada e o toggle é inerte (não ativa/desativa).
- [x] Em `> 399px`, a opção funciona normalmente.
- [x] O `consumed: true` (item clicado) é compatível com o estado bloqueado, sem quebrar o índice circular.
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

### Stage 3: Subir o estado do Minimalist para o `page.tsx`

#### Task 3.1: Mover `useMinimalistA11y` para o `page.tsx` e passar props

**Description:** Em `src/app/[locale]/portfolios/minimalist/page.tsx`, chamar `useMinimalistA11y` e passar `options`/`toggle` como props a `MinimalistRecruiter`; remover a chamada do hook de `src/features/minimalist/components/recruiter.tsx:404` e repassar as props ao `MinimalistA11yPanel`/trigger. Sem criar o `MinimalistClient`.

**Acceptance Criteria:**
- [x] `page.tsx` é o único dono do estado a11y do Minimalist; shell recebe `options`/`toggle` via props.
- [x] Painel e trigger continuam funcionais (wheel, índice circular, persistência).
- [x] Nenhum outro consumidor quebra (typecheck + lint + verificação visual das duas rotas).
- [x] `npx pnpm typecheck` e `npx pnpm lint` passam.

### Stage 4: Verificação

#### Task 4.1: Verificação manual das duas rotas e do guard

**Description:** Com o dev server local, verificar nas rotas `/[locale]/portfolios/minimalist` e `/[locale]/portfolios/gamified`: persistência cruzada de preferências, guarda de upscale em `<= 399px` (desabilitado/bloqueado no minimalist, forçado off no gamified), sync de `reduceMotion` sem flash, e highlight de links com o token correto em cada tema.

**Acceptance Criteria:**
- [ ] Preferências persistem entre as rotas (todos os 6 campos, inclusive `soundEffects`).
- [ ] Em viewport `<= 399px` o zoom nunca aplica `1.2`; em `> 399px` funciona.
- [ ] `reduceMotion` ativo pula animações framer desde o load; toggle reflete imediatamente.
- [ ] Highlight do minimalist é pink; do gamified é ciano.
