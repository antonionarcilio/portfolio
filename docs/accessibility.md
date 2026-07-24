# Acessibilidade no portfólio "gamified"

Documenta as funcionalidades de acessibilidade existentes hoje no portfólio "gamified"
(`src/app/portfolios/gamified/`): o contexto que guarda as preferências, o painel que as
controla, como cada preferência afeta a página, e os padrões de foco/teclado/ARIA
usados pelos componentes compartilhados. Não há mudança de comportamento aqui — este
arquivo só registra como o que já existe funciona, mais uma seção final com lacunas
observadas, para facilitar decisões de manutenção futura.

## Onde fica

O `A11yProvider` é montado em `src/app/portfolios/gamified/layout.tsx:29`, envolvendo
todas as rotas do portfólio gamified:

```tsx
<A11yProvider>{children}</A11yProvider>
<div id="gamified-portal-root" className="font-cv-mono" />
```

O sistema é **exclusivo do portfólio gamified** — não existe em `src/app/(homepage)` nem
em `src/app/not-found.tsx`.

## Contexto `A11yProvider` / `useA11y()`

`src/features/gamified/contexts/a11y-context.tsx`.

Cinco opções (`A11yKey`), todas booleanas, todas `false` por padrão:

```ts
export type A11yKey = 'textLarge' | 'cursorLarge' | 'greyscale' | 'highlightLinks' | 'reduceMotion';
```

| `A11yKey` | Classe aplicada em `<html>` |
|---|---|
| `textLarge` | `a11y-text-large` |
| `cursorLarge` | `a11y-cursor-large` |
| `greyscale` | `a11y-greyscale` |
| `highlightLinks` | `a11y-highlight-links` |
| `reduceMotion` | `a11y-reduce-motion` |

Persistência em `localStorage` sob a chave `a11y-opts`.

**Hidratação síncrona no module-load** (linhas 24-31) — roda antes de qualquer
componente renderizar, especificamente para `reduceMotion`:

```ts
if (typeof window !== 'undefined') {
  try {
    const _stored = localStorage.getItem(STORAGE_KEY);
    if (_stored && JSON.parse(_stored)?.reduceMotion) {
      MotionGlobalConfig.skipAnimations = true;
    }
  } catch {}
}
```

O comentário no código explica o motivo: evitar o flash de `opacity: 0` do primeiro
frame de componentes Framer Motion com `initial` definido, que apareceria se
`skipAnimations` só fosse setado depois do primeiro render.

Dentro do `A11yProvider`, o estado começa em `DEFAULT_OPTS` (tudo `false`) e é
**rehidratado num `useEffect`** — de propósito: o primeiro render do client sempre
bate com o output do server (evita mismatch de hidratação), e só depois disso os
valores salvos entram.

**Guarda de viewport estreito**: um listener de `matchMedia('(max-width: 399px)')`
força `textLarge` para `false` sempre que a tela estiver/ficar abaixo de 400px —
porque o zoom de 1.2× quebra o layout nessa largura.

**Efeito de sincronização com o DOM** — roda a cada mudança de `opts`, não só na
carga inicial: aplica/remove as classes do `CLASS_MAP` em `document.documentElement`
e atualiza `MotionGlobalConfig.skipAnimations = opts.reduceMotion`.

`toggle(key)` inverte uma opção; `reset()` volta tudo para `DEFAULT_OPTS`.
`useA11y()` lança erro se usado fora de `<A11yProvider>`.

## UI: `A11yDropdown`

`src/features/gamified/components/a11y-dropdown.tsx`, renderizado em
`src/features/gamified/components/cv-header.tsx:305`:

```tsx
<A11yDropdown floatingTopOverride={condensed ? '80px' : undefined} />
```

Cinco itens, um por `A11yKey`, cada um com ícone [lucide-react](https://lucide.dev/)
e label em PT-BR:

| `key` | Ícone | Label |
|---|---|---|
| `textLarge` | `ALargeSmall` | "Aumentar escala" |
| `cursorLarge` | `MousePointer2` | "Aumentar cursor" |
| `greyscale` | `Contrast` | "Tons de cinza" |
| `highlightLinks` | `Link` | "Destacar links" |
| `reduceMotion` | `Pause` | "Desabilitar animações" |

O item `textLarge` some do painel abaixo de 400px de viewport (`hideBelow400: true`),
espelhando a guarda do contexto.

- Botão de disparo: `aria-label="Acessibilidade"`, `aria-haspopup="menu"`,
  `aria-expanded={open}`, ícone `Accessibility` (lucide), texto "A11Y" e um badge
  `[N]` com `aria-label="{N} opções ativas"` mostrando quantas opções estão ligadas.
- Cada linha do painel é um `<button role="menuitemcheckbox" aria-checked={active}>`
  real — clicar ou usar `ArrowLeft`/`ArrowRight` alterna a opção. O estado visual é
  mostrado por um `CvSwitch` em modo `asDisplay` (não-interativo, já que o `<button>`
  pai carrega a semântica).
- Rodapé com dica "NAVEGAÇÃO ↑↓" e botão "Resetar" (chama `reset()`).
- Em telas estreitas, o painel vira uma gaveta (`vaul` `Drawer`) em vez de um menu
  flutuante — ver `DropdownBase` abaixo.
- `noMotion={opts.reduceMotion}` é passado para o `DropdownBase`, zerando a duração
  da própria transição de abrir/fechar do menu.

## Foco e navegação por teclado

Três "shells" genéricos, todos sobre [Floating UI](https://floating-ui.com/), cobrem
todo o foco-trap/dismiss/role do app:

| Shell | Arquivo | Uso |
|---|---|---|
| `OverlayBase` | `src/shared/components/overlay-base.tsx` | Modal genérico (usado pelo minigame do easter egg, ver `docs/easter-egg.md`) |
| `ModalBase` | `src/shared/components/modal-base.tsx` | Modais de conteúdo (projeto, experiência, imagem de conquista) |
| `DropdownBase` | `src/shared/components/dropdown-base.tsx` | Menu do `A11yDropdown` |

- `OverlayBase` usa `useDismiss(context, { outsidePressEvent: 'mousedown' })` e
  `<FloatingFocusManager context={context} modal>` — foco preso dentro do modal
  (Tab cicla só nos elementos internos), `lockScroll` no `FloatingOverlay`.
- `ModalBase` adiciona `useRole(context, { role: 'dialog' })` e também usa
  `FloatingFocusManager ... modal`. No mobile, troca para uma gaveta `vaul`
  (`<Drawer.Title className="sr-only">{drawerTitle}</Drawer.Title>`, título padrão
  `'Detalhes'`) em vez do modal com foco preso.
- `DropdownBase` usa `useRole(context, { role })` (padrão `'menu'`) e
  `useListNavigation` (navegação por setas, `loop`, foco no primeiro item ao abrir).
  Também tem uma versão mobile em gaveta com
  `<Drawer.Title className="sr-only">{drawerLabel ?? 'Menu'}</Drawer.Title>`
  (`drawerLabel="Acessibilidade"` quando é o `A11yDropdown`).
- Ambos `DropdownBase` e `ModalBase` passam `aria-describedby={undefined}` para o
  Floating UI — ver seção de lacunas.

**Anel de foco global**, aplicado a todo elemento focável dentro do portfólio gamified:

```css
/* src/features/gamified/styles.css:126-129 */
html.cv-gamified-root *:focus-visible {
  outline: 2px solid var(--color-cv-orange);
  outline-offset: -2px;
}
```

**Padrões de `tabIndex`/clique em componentes específicos:**

- `AnimatedCard` (`src/features/gamified/components/animated-card.tsx`) é um wrapper
  reutilizável em `motion.div` que aceita `tabIndex`, `onKeyDown`, `role`, `onClick`
  como props — ou seja, o componente **suporta** cards ativáveis por teclado.
- Em `experience-section.tsx:48-49` e `projects-section.tsx:52-53`, porém, o uso é
  `<AnimatedCard onClick={...} tabIndex={0}>` sem `role="button"` e sem `onKeyDown`
  (ver lacunas).
- `achievements.tsx:89` — o `AnimatedCard` da linha da conquista tem `tabIndex={0}`
  mas não é clicável; quem é clicável é o `FlipBadge` interno
  (`achievements.tsx:59`, `onClick={canPopup ? onOpen : undefined}`), que não tem
  nenhum `tabIndex`/`role`/handler de teclado.
- `education-section.tsx` usa `tabIndex={0}` sem `onClick` — puramente focável/lido,
  não interativo.
- `stats.tsx` usa `tabIndex={0}` no card, mas a ação real fica num `CvButton`
  aninhado (um `<button>` de verdade).
- `cv-header.tsx` — o "mini nome" (breadcrumb no header condensado) é um `<button>`
  real com `aria-hidden={!condensed}` e `tabIndex={condensed ? 0 : -1}`: só é
  alcançável por Tab quando está visível.
- `skill-map.tsx` — o mapa de habilidades é um `<canvas aria-label="Mapa de
  Habilidades">` com handlers só de mouse (`onMouseMove`/`onMouseLeave`/`onClick`);
  não há equivalente por teclado para selecionar nós da constelação.
- Não há nenhum uso de `autoFocus` no projeto.

## Redução de movimento

Mecanismo central: `MotionGlobalConfig.skipAnimations` (Framer Motion), sincronizado
a partir de `opts.reduceMotion` — setado de forma síncrona no module-load e depois
reativamente a cada mudança (ver seção do contexto acima). A convenção do projeto
está documentada em `AGENTS.md`:

> use `motion.*` + Framer Motion props only... Never add a separate "if reduceMotion"
> branch; the global flag handles it.

Na prática, vários componentes **também** fazem um branch manual adicional para
efeitos que não passam pelo Framer Motion:

| Arquivo | O que é pausado |
|---|---|
| `src/features/gamified/hooks/use-snap-scroll.ts` | Scroll com snap customizado (`disabled = opts.reduceMotion \|\| isMobile`) |
| `src/features/gamified/components/achievements.tsx` | Flip 3D (`rotateY`) do `FlipBadge` no hover |
| `src/features/gamified/components/animated-card.tsx` | Troca `initial`/`animate`/`transition` do Framer Motion por valores estáticos |
| `src/features/gamified/components/scroll-list.tsx` | Troca a seta animada "role para ver mais" por um `▼` estático |
| `src/features/gamified/components/skill-map.tsx` | Congela a animação em canvas da constelação |
| `cv-header.tsx`, `project-modal.tsx`, `experience-modal.tsx`, `section-heading.tsx`, `skill-list.tsx`, `stats.tsx` | Cada um ajusta seus próprios `initial`/`animate`/`transition` locais |

O easter egg do skill map (ver `docs/easter-egg.md`) **reaproveita** o toggle de
`reduceMotion` como efeito colateral para congelar a constelação enquanto o confete e
o minigame tocam — não é uma mudança de preferência de acessibilidade do usuário. O
próprio `docs/easter-egg.md` já sinaliza isso como algo a reconsiderar no futuro.

No CSS, uma única regra reage a `reduceMotion` fora do Framer Motion:

```css
/* src/features/gamified/styles.css:543-545 */
html.a11y-reduce-motion .cv-shimmer-btn:hover .cv-shimmer-text,
html.a11y-reduce-motion .cv-shimmer-btn:focus-visible .cv-shimmer-text,
html.a11y-reduce-motion .cv-shimmer-status {
  /* remove o sweep de gradiente animado, mantém cor plana */
}
```

## Contraste e aparência visual

| Opção | Efeito |
|---|---|
| `greyscale` | `html.a11y-greyscale { filter: grayscale(1); }` |
| `highlightLinks` | Contorno/sublinhado cyan em todo `<a>` (`!important`) |
| `cursorLarge` | Cursor SVG customizado 40×40px (seta cyan); variante branco/preto quando `greyscale` também está ativo, para manter contraste |

Não há `@media (prefers-contrast)` nem modo de "alto contraste" além do filtro de
greyscale acima; não há paletas específicas para daltonismo.

`alt=` em imagens: só 3 ocorrências no projeto, todas `next/image`, todas na feature
de conquistas (`achievement-image-modal.tsx`, `achievements.tsx` ×2). Não há outro
uso de `<img>`/`next/image` no app — ícones passam por `SvgIcon` (SVG inline).

## Texto para leitor de tela

Dois usos de `sr-only` (utilitário do Tailwind) no projeto inteiro, ambos alimentando
o título acessível exigido pelo `vaul` `Drawer`:

- `src/shared/components/dropdown-base.tsx:180` — título da gaveta mobile do
  `A11yDropdown`.
- `src/shared/components/modal-base.tsx:121` — título da gaveta mobile dos modais de
  conteúdo.

## `SvgIcon` — gancho genérico "egg"

`src/shared/components/svg-icon.tsx:127-137`. Comportamento geral (não específico de
nenhum ícone em particular):

```tsx
// Generic easter-egg hook: any caller can make an icon act as a hidden
// trigger by passing `onClick` alongside an SVG whose class carries "egg"
// (e.g. `className="lucide-egg"`, or a Lucide icon literally named egg).
if (svgClass.includes('egg') && onClick) {
  container.setAttribute('role', 'button');
  container.removeAttribute('cursor');
  container.classList.add('cursor-gamified-pointer');
  container.setAttribute('tabindex', '0');
  container.setAttribute('aria-hidden', 'false');
}
```

Qualquer `<SvgIcon>` no app que (a) receba um `onClick` **e** (b) cujo `<svg>`
injetado tenha, na `class`, uma substring `"egg"`, tem seu `<span>` wrapper promovido
de decorativo para interativo. Por padrão, sem esse gancho, todo `SvgIcon` é
`aria-hidden="true"` (linha 146) — ou seja, ícones são decorativos/ocultos de
tecnologia assistiva a menos que esse gatilho dispare. O único caso concreto hoje é
o do skill map, documentado em `docs/easter-egg.md`.

## Idioma/locale

```tsx
// src/app/layout.tsx:42
<html lang="pt-BR" ...>
```

O atributo `lang` é fixo em `"pt-BR"` no layout raiz — ver lacunas abaixo.

## CSS dedicado (`src/features/gamified/styles.css`)

| Seletor | O que faz |
|---|---|
| `html.a11y-text-large .a11y-zoom-wrapper` | `zoom: 1.2` no wrapper de página inteira (`<div className="a11y-zoom-wrapper">`, definido em `src/app/layout.tsx:44`) |
| `html.a11y-text-large .a11y-dropdown-inner` | Mesmo zoom 1.2× aplicado ao painel do `A11yDropdown`, já que o `FloatingPortal` o renderiza fora do `.a11y-zoom-wrapper`; largura fixa de 260px para evitar loop de crescimento (zoom sobre zoom) |
| `html.a11y-text-large .a11y-drawer-inner` | Mesma compensação de zoom para a variante mobile (gaveta) do painel |
| `html.a11y-text-large .a11y-dropdown-outer` | `min-width` ajustado para casar com o inner já ampliado (260 × 1.2) |
| `html.a11y-text-large .cv-name-divider`, `.cv-header-*`, `.cv-rank-label` (várias regras) | Overrides de padding/grid/font-size do header, específicos para o layout não quebrar quando o zoom expande o conteúdo sem mudar a largura do viewport |
| `html.a11y-greyscale` | `filter: grayscale(1)` |
| `html.a11y-highlight-links a` | Outline/underline/background cyan em links |
| `html.a11y-cursor-large`, `html.a11y-cursor-large *` | Cursor SVG customizado 40×40 (data-URI inline) |
| `html.a11y-cursor-large.a11y-greyscale ...` | Variante branco/preto do cursor quando greyscale também está ativo |
| `html.a11y-reduce-motion .cv-shimmer-btn:hover ...` | Remove o sweep animado do texto shimmer |
| `html.cv-gamified-root *:focus-visible` | Anel de foco global (não tem prefixo `a11y-`, mas faz parte da superfície de acessibilidade) |

`src/app/globals.css` não tem nenhuma regra `.a11y-*` própria (só 3 `@import`), e
`src/features/minigame/snake/styles.css` também não tem nenhuma.

## Lacunas / inconsistências observadas

Registro factual do estado atual — sem propor correção, só para deixar visível na
hora de decidir prioridades futuras:

- **Cards clicáveis sem semântica de botão nem teclado.** `experience-section.tsx`
  (linhas 48-49) e `projects-section.tsx` (linhas 52-53) usam
  `<AnimatedCard onClick={...} tabIndex={0}>` sem `role="button"` e sem `onKeyDown`
  — o card é focável e clicável com mouse, mas Enter/Espaço não ativam. O
  `FlipBadge` de `achievements.tsx` (linha 59) é ainda mais mouse-only: não tem
  `tabIndex`, `role` nem handler de teclado algum.
- **Mapa de habilidades é mouse-only.** O `<canvas>` de `skill-map.tsx` só reage a
  eventos de mouse; não existe forma de navegar/selecionar nós da constelação via
  teclado.
- **`lang="pt-BR"` fixo.** O app tem rotas em inglês (`/portfolios/gamified/en`, via
  `SUPPORTED_LOCALES` em `src/shared/i18n/locales.ts`), mas o atributo `lang` do
  `<html>` raiz nunca muda — fica sempre `pt-BR`, mesmo nessas rotas.
- **`aria-label`s hardcoded em PT-BR.** Todo `aria-label` encontrado no projeto
  (`"Fechar"`, `"Acessibilidade"`, `"anterior"`/`"próximo"`, `"Mapa de
  Habilidades"`, etc.) é uma string literal em português — não passa pelo sistema
  de i18n, nem mesmo na rota `/en`. O único lugar com um objeto de mensagens
  traduzido é o `Messages` do minigame Snake, e mesmo lá o botão de fechar usa
  `aria-label="Fechar"` fixo em vez de puxar de `messages`.
- **Sem skip link.** Não existe nenhum mecanismo de "pular para o conteúdo" em
  nenhuma página do app.
- **Sem `<nav>`/`role="navigation"`.** O switcher de idioma e os controles de
  próximo/anterior rank em `cv-header.tsx` são `<div>`s com `<button>`/`<Link>`
  dentro, não estão dentro de nenhuma landmark de navegação. Landmarks encontradas
  no app inteiro: dois `<main>` (fora do portfólio gamified, em `(homepage)/page.tsx`
  e `not-found.tsx`) e um `<footer>` (`cv-footer.tsx`).
- **`reduceMotion` é 100% manual.** Não há `@media (prefers-reduced-motion)` em
  nenhum arquivo CSS do projeto — a preferência do sistema operacional não é lida;
  o usuário precisa ligar o toggle manualmente todas as vezes (persistido só em
  `localStorage`, por navegador/dispositivo).
- **`aria-describedby={undefined}`** em `dropdown-base.tsx:176` e
  `modal-base.tsx:117` — presente na chamada do Floating UI mas sempre `undefined`
  na prática, um placeholder sem efeito hoje.

## Arquivos envolvidos

| Arquivo | Papel |
|---|---|
| `src/features/gamified/contexts/a11y-context.tsx` | `A11yProvider`/`useA11y()`: estado das 5 opções, persistência, sincronização com `<html>` e Framer Motion. |
| `src/features/gamified/components/a11y-dropdown.tsx` | Painel de controle das opções (menu flutuante desktop / gaveta mobile). |
| `src/shared/components/overlay-base.tsx` | Shell de modal genérico (Floating UI) — foco preso, usado pelo minigame do easter egg. |
| `src/shared/components/modal-base.tsx` | Shell de modal de conteúdo (Floating UI + `role="dialog"` + gaveta mobile). |
| `src/shared/components/dropdown-base.tsx` | Shell de menu (Floating UI + navegação por lista + gaveta mobile) — base do `A11yDropdown`. |
| `src/shared/components/svg-icon.tsx` | Injeta SVG inline; gancho genérico que promove ícones "egg" com `onClick` a elementos interativos. |
| `src/features/gamified/components/cv-switch.tsx` | Switch reutilizável (`role="switch"`), usado tanto como controle real quanto como indicador visual (`asDisplay`) dentro do `A11yDropdown`. |
| `src/features/gamified/styles.css` | Todas as regras `.a11y-*` (zoom, greyscale, highlight-links, cursor grande, shimmer) e o anel de foco global. |
| `src/app/layout.tsx` | `<html lang="pt-BR">` e o `.a11y-zoom-wrapper` que envolve toda a página. |
| `src/app/portfolios/gamified/layout.tsx` | Ponto de montagem do `A11yProvider`. |
