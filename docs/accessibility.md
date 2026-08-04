# Acessibilidade do portfólio gamified

Este documento descreve o comportamento implementado atualmente no portfólio gamified. O escopo começa em `src/app/[locale]/portfolios/gamified/layout.tsx`; a homepage, o `not-found` e as rotas de API não montam o provedor de acessibilidade.

## Contexto e persistência

`src/features/gamified/contexts/a11y-context.tsx` exporta `A11yProvider` e `useA11y()`. O estado é persistido em `localStorage` na chave `a11y-opts`.

As cinco opções atuais são:

| Chave | Classe em `<html>` | Efeito |
|---|---|---|
| `upscale` | `a11y-upscale` | Aplica zoom de 1.2× ao wrapper e possui ajustes responsivos para o header e os painéis. |
| `cursorLarge` | `a11y-cursor-large` | Usa os cursores SVG maiores definidos em `src/features/gamified/styles.css`. |
| `greyscale` | `a11y-greyscale` | Aplica `grayscale(1)` ao documento. |
| `highlightLinks` | `a11y-highlight-links` | Destaca links com contorno, fundo, sombra e sublinhado. |
| `reduceMotion` | `a11y-reduce-motion` | Desativa o shimmer CSS e sincroniza `MotionGlobalConfig.skipAnimations`. |

Todas começam desativadas, exceto `reduceMotion`, que considera `prefers-reduced-motion` no primeiro estado do cliente. O valor salvo é reidratado após a montagem para preservar a saída do servidor e evitar mismatch de hidratação. A leitura síncrona no carregamento do módulo evita o primeiro frame invisível de componentes Framer Motion.

`upscale` é forçado para `false` abaixo de 400px porque o zoom quebra o layout estreito. `toggle()` alterna uma opção e `reset()` retorna ao estado padrão. `useA11y()` lança erro quando usado fora do provider.

## Painel de controles

`src/features/gamified/components/a11y-dropdown.tsx` é renderizado pelo `CvHeader`. Os labels, títulos, dicas e atributos acessíveis vêm de `src/messages/en.json` e `src/messages/pt-BR.json`, no namespace `gamified.a11y`.

O painel contém os controles `upscale`, `cursorLarge`, `greyscale`, `highlightLinks` e `reduceMotion`. `upscale` fica oculto abaixo de 400px. Cada item é um `button` com `role="menuitemcheckbox"`, `aria-checked`, foco controlado e suporte a `ArrowLeft`/`ArrowRight`. O botão de reset usa o estado atual do provider.

`DropdownBase` escolhe entre painel flutuante no desktop e gaveta mobile via `vaul`. O label da gaveta é fornecido pelo `A11yDropdown`; o componente compartilhado não contém texto localizado próprio. Quando `reduceMotion` está ativo, a transição do dropdown também recebe duração zero.

## Componentes compartilhados de foco

Os shells em `src/shared/components/` concentram o comportamento de foco e dismiss:

| Componente | Uso |
|---|---|
| `OverlayBase` | Overlay genérico usado pelo modal do Snake no easter egg. |
| `ModalBase` | Modais de projeto, experiência e imagem de achievement; usa dialog e gaveta mobile. |
| `DropdownBase` | Menu de acessibilidade; usa navegação por lista e gaveta mobile. |
| `TooltipBase` | Base dos tooltips do tema gamified. |

`ModalBase` usa `role="dialog"`, `aria-modal`, `aria-label` e `FloatingFocusManager`. `drawerTitle` é obrigatório para que a variante mobile tenha um título acessível. `DropdownBase` exige `drawerLabel` pelo mesmo motivo.

O anel de foco global do tema está em `src/features/gamified/styles.css` e reage a `:focus-visible` dentro de `html.cv-gamified-root`.

## Ativação por teclado

`src/features/gamified/hooks/use-activation-props.ts` fornece `Enter` e `Space` para superfícies que funcionam como ações. `AnimatedCard` usa esse helper quando recebe `onClick`, além de aceitar `role`, `aria-label` e `tabIndex`.

O skill map expõe controles localizados para expandir/recolher o painel, breadcrumbs e o canvas. A constelação continua sendo uma visualização canvas cuja interação principal é pointer-based; o componente fornece o label acessível do canvas, mas não transforma cada nó visual em um controle DOM independente.

## Redução de movimento

Framer Motion é a fonte principal das animações e recebe o estado global por `MotionGlobalConfig.skipAnimations`. O código também desativa efeitos que não são controlados por Framer Motion:

- scroll snap customizado em `use-snap-scroll.ts`;
- flip 3D de achievements;
- animação de canvas do skill map;
- seta de indicação do `ScrollList`;
- shimmer CSS em `styles.css`.

O easter egg do skill map temporariamente ativa `reduceMotion` para congelar a constelação durante confete e Snake, restaurando o valor anterior ao fechar. Esse comportamento é específico do easter egg, não uma segunda preferência persistente.

## Estilos e cursores

As regras de acessibilidade ficam em `src/features/gamified/styles.css`, não em `src/app/globals.css`. O wrapper `.a11y-zoom-wrapper` é criado pelo layout locale-aware em `src/app/[locale]/layout.tsx`; o layout gamified monta o provider e o portal de modais.

Os cursores usados pelo CSS são `default-alt.svg`, `pointer.svg`, `text.svg`, `move.svg`, `grab.svg`, `grabbing.svg`, `not-allowed.svg`, `wait.svg` e `help.svg`, todos em `public/portfolios/gamified/cursors/`. Covers de mídia do portfólio vêm do CMS como URLs externas.

## Limitações conhecidas

- Não existe um modo de alto contraste separado de `greyscale` e `highlightLinks`.
- O canvas do skill map não oferece seleção de cada nó por teclado equivalente ao pointer.
- O easter egg reutiliza temporariamente `reduceMotion`, uma decisão de implementação que pode ser substituída por um mecanismo dedicado em mudança futura.
