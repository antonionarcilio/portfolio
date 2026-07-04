# Sub-projeto (A): Correções rápidas de acessibilidade — Gamer

## Contexto

`docs/accessibility.md` documenta o sistema de acessibilidade do portfólio "gamer" e
lista 8 lacunas observadas. O usuário pediu para corrigi-las. Dado que as 8 lacunas
cobrem subsistemas independentes (semântica de cliques, i18n de `lang`/`aria-label`,
navegação por teclado do canvas de skills), o trabalho foi dividido em 3
sub-projetos:

- **(A) Correções rápidas** — este documento. Cobre as lacunas #1, #5, #6, #7, #8.
- **(B) Infraestrutura de i18n** — `<html lang>` dinâmico + `aria-label`s traduzidos
  (lacunas #3, #4). Ainda não desenhado.
- **(C) Acessibilidade do canvas do skill-map** — navegação por teclado na
  constelação (lacuna #2). Ainda não desenhado.

Este spec cobre exclusivamente o sub-projeto (A).

## Escopo

Numeração das lacunas conforme a seção "Lacunas / inconsistências observadas" de
`docs/accessibility.md`:

1. Cards clicáveis sem semântica de botão/suporte a teclado.
5. Ausência de skip-to-content link.
6. Ausência de landmark `<nav>`/`role="navigation"`.
7. `reduceMotion` 100% manual, sem leitura de `prefers-reduced-motion`.
8. `aria-describedby={undefined}` — placeholder sem efeito.

Fora de escopo (sub-projetos B e C, a desenhar depois): lacunas #2, #3, #4.

## Seção 1 — Cards clicáveis (lacuna #1)

**Arquivos:** `src/features/gamer/components/animated-card.tsx`,
`src/features/gamer/components/achievements.tsx` (`FlipBadge`).

Hoje `AnimatedCard` aceita `onClick`, `role` e `tabIndex` como props passadas
manualmente por cada chamador — `experience-section.tsx:46-49` e
`projects-section.tsx` passam `onClick` + `tabIndex={0}` mas nunca `role` nem
`onKeyDown`, então o card não responde a Enter/Space via teclado e não é anunciado
como botão por leitores de tela. `achievements.tsx`'s `FlipBadge` (linha 57-60) tem
um `<div onClick={...}>` sem nenhum atributo de acessibilidade.

**Decisão:** extrair um hook compartilhado
`src/features/gamer/hooks/use-activation-props.ts`:

```ts
export function useActivationProps(onClick?: () => void) {
  if (!onClick) return {};
  return {
    role: 'button' as const,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  };
}
```

- `AnimatedCard` passa a chamar `useActivationProps(onClick)` internamente e faz
  merge desses valores com os `role`/`tabIndex`/`onKeyDown` explícitos já recebidos
  via props (explícito vence, para não quebrar usos que já passam algo customizado).
  Isso torna `experience-section.tsx` e `projects-section.tsx` acessíveis por
  teclado sem editar esses arquivos — o `tabIndex={0}` que eles já passam
  manualmente continua funcionando (é redundante com o hook, mas inofensivo).
- `FlipBadge`, em `achievements.tsx`, aplica `useActivationProps(canPopup ? onOpen :
  undefined)` no `<div>` da linha 57, espalhando o resultado nas props do elemento.
  Quando `canPopup` é `false` (mobile ≤520px), o hook retorna `{}` e o comportamento
  atual (sem interação de clique, só tooltip) é preservado.
- Remover o `tabIndex={0}` da linha 89 de `achievements.tsx` (o `AnimatedCard` que
  envolve `FlipBadge`), já que esse `AnimatedCard` não recebe `onClick` — o
  `tabIndex` ali hoje coloca um elemento não-interativo na ordem de tabulação sem
  necessidade.

## Seção 2 — Skip link (lacuna #5)

**Arquivos:** `src/app/portfolios/gamer/layout.tsx`,
`src/features/gamer/components/portfolio-client.tsx`.

**Decisão:** adicionar um link "Pular para o conteúdo" como primeiro filho de
`GamerLayout`, antes do `<A11yProvider>`, usando a classe utilitária `sr-only` já
usada no projeto (`focus:not-sr-only` ou padrão equivalente do Tailwind) para
ficar visualmente oculto exceto quando focado via teclado:

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only ...">
  Pular para o conteúdo
</a>
```

O alvo `#main-content` precisa existir de fato: em `portfolio-client.tsx`, o `<div
className="cv-page-content">` (linha 58) é dividido em duas partes —
`<CvHeader>` fica fora de um novo `<main id="main-content">`, que passa a envolver
de `<Stats>` até o fechamento do `<div className="sm-layout">`; `<CvFooter>`
permanece fora do `<main>`. Nenhuma classe CSS muda, só a estrutura de tags (troca
de `<div>` por `<main>` na posição correspondente + o novo `id`).

## Seção 3 — Landmark de navegação (lacuna #6)

**Arquivo:** `src/features/gamer/components/cv-header.tsx` (`HeaderTriggers`,
linhas 275-308).

**Decisão:** o seletor de idioma (`<div role="group" aria-label="Language">`,
linhas 280-284) é o único candidato real a landmark de navegação — ele lista links
que trocam de rota (`/portfolios/gamer/pt-BR`, `/portfolios/gamer/en`). Trocar essa
`div` por `<nav aria-label="Idioma">`, mantendo os `<Link aria-current>` internos
como estão.

`RankSwiper` (linhas 109-272, botões "anterior"/"próximo" em torno de um carrossel
de labels decorativo) **não** é tratado como navegação — não navega entre páginas
nem seções, só cicla um valor de exibição — e fica fora do escopo desta correção.

## Seção 4 — `prefers-reduced-motion` (lacuna #7)

**Arquivo:** `src/features/gamer/contexts/a11y-context.tsx`.

Hoje o toggle `reduceMotion` é 100% manual: o valor inicial é sempre `false`
(`DEFAULT_OPTS`, linha 18) a menos que já exista algo salvo em `localStorage`. Não
há leitura de `window.matchMedia('(prefers-reduced-motion: reduce)')` em nenhum
ponto.

**Decisão:** usar a preferência do SO apenas como *default* na ausência de um valor
salvo — uma vez que o usuário alterna manualmente o toggle (e isso é persistido em
`localStorage`), a escolha manual sempre prevalece. Dois pontos precisam do mesmo
fallback:

1. **Guarda de module-load** (linhas 25-32) — hoje só seta
   `MotionGlobalConfig.skipAnimations = true` se algo estiver salvo com
   `reduceMotion: true`. Passa a também setar `true` quando nada está salvo *e*
   `matchMedia('(prefers-reduced-motion: reduce)').matches` for `true`.
2. **`useState<A11yOpts>(DEFAULT_OPTS)`** em `A11yProvider` (linha 60) — o valor
   inicial de `reduceMotion` passa a vir de uma função que checa `matchMedia` como
   fallback quando não há nada salvo (mesma lógica do item 1, mas para o estado
   React). O efeito de hidratação (linhas 63-70) continua re-lendo
   `localStorage` depois do mount e sobrescrevendo se houver um valor salvo
   explícito — sem mudanças nele.

Não é necessário adicionar CSS `@media (prefers-reduced-motion: reduce)`: o
mecanismo central do projeto já é o `MotionGlobalConfig.skipAnimations` do Framer
Motion (documentado em `AGENTS.md:87-98`), então alimentar esse mesmo mecanismo com
a preferência do SO é suficiente e evita duplicar a lógica em dois sistemas
paralelos.

## Seção 5 — `aria-describedby={undefined}` (lacuna #8)

**Arquivos:** `src/shared/components/dropdown-base.tsx:176`,
`src/shared/components/modal-base.tsx:117`.

Ambos os arquivos passam `aria-describedby={undefined}` para `Drawer.Content` (vaul)
— um placeholder que nunca teve um ID real associado e não tem nenhum efeito
(React omite o atributo quando o valor é `undefined`).

**Decisão:** remover a prop `aria-describedby={undefined}` das duas linhas. Nenhum
outro comportamento muda — `Drawer.Title` (com `sr-only`) continua fornecendo o
nome acessível do drawer nos dois arquivos.

## Fora de escopo (confirmado)

- Lacuna #2 (canvas do skill-map mouse-only) — sub-projeto (C), a desenhar depois.
  Nota de contexto já levantada: `skill-list.tsx` já renderiza uma UI paralela
  100% baseada em `<motion.button>` (`SkillListItem`) que espelha as mesmas ações
  do canvas e já é navegável por teclado — isso deve reduzir bastante o escopo do
  desenho futuro de (C).
- Lacunas #3 e #4 (`lang` dinâmico, `aria-label`s traduzidos) — sub-projeto (B), a
  desenhar depois.

## Verificação

- `npx pnpm typecheck` — garante que o hook `useActivationProps` e os novos tipos
  de props batem em todos os call-sites.
- `npx pnpm lint` — convenções de nomes/imports.
- Teste manual (dev server): tab pelos cards de experiência/projetos/conquistas e
  confirmar que Enter/Space disparam a mesma ação do clique; tab até o topo da
  página `/portfolios/gamer/pt-BR` e confirmar que o skip link aparece no primeiro
  Tab e pula para o conteúdo principal; inspecionar `document.activeElement` /
  árvore de acessibilidade do DevTools para o seletor de idioma (`<nav>`) e para os
  dois drawers (sem `aria-describedby` residual).
- Testar `prefers-reduced-motion` via DevTools (emular a media query) em uma aba
  sem `localStorage` prévio e confirmar que animações não tocam; confirmar que
  ligar/desligar o toggle manual do dropdown de acessibilidade ainda funciona
  normalmente e persiste.
