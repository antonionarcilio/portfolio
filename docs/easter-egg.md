# Easter egg do skill map (confete → minigame)

Documenta um comportamento escondido no portfólio "gamified": clicar no ícone certo,
no lugar certo do skill map, dispara confete e abre um minigame. Não há
mudança de comportamento aqui — este arquivo só registra como o fluxo existente
funciona, para facilitar manutenção futura.

## Onde fica

Seção de habilidades ("habilidades"/skill map), componente
`src/features/gamified/components/skill-map.tsx`. O painel lateral tem 3 níveis:

| `panelLevel` | Nome | Conteúdo |
|---|---|---|
| `0` | Visão geral | Constelação de categorias, nada selecionado |
| `1` | Categoria focada | Descrição da categoria + chips de tecnologias |
| `2` (**"3ª etapa"**) | Tecnologia focada | Detalhe da tech + métricas, **é aqui que o easter egg vive** |

`panelLevel` é derivado em runtime: `tech ? 2 : focus !== null ? 1 : 0`.

## Condição do trigger

Dentro do painel de 3ª etapa, o ícone renderizado é o da **categoria** em foco
(`cat.iconUrl`, não o da tecnologia individual). O componente calcula:

```ts
const isEgg = cat.iconUrl.toLowerCase().includes('egg');
```

Se `isEgg` for verdadeiro, o `<SvgIcon>` recebe `className="lucide-egg"` e
`onClick={handleEggClick}` (`skill-map.tsx` por volta da linha 1038).

O `SvgIcon` (`src/shared/components/svg-icon.tsx`) tem um gancho genérico: se o
`<svg>` injetado tiver, na sua `class`, alguma substring `"egg"` **e** um
`onClick` tiver sido passado, ele promove o `<span>` wrapper para um elemento
interativo (`role="button"`, `tabindex="0"`, `aria-hidden="false"`,
`cursor-gamified-pointer`). Esse gancho não é exclusivo do skill map — qualquer
lugar que use `SvgIcon` pode ativar o mesmo comportamento passando um ícone
"egg" com `onClick`.

### Importante: não é aleatório em runtime

Qual categoria vira "a do ovo" **não é sorteada no client**. Depende do asset de
ícone configurado no CMS para aquele grupo de skill:

```ts
// src/shared/data/map-portfolio.ts
iconUrl: group.icon ? absoluteUrl(group.icon.url) : ''
```

Se o ícone SVG configurado no CMS para uma categoria for um Lucide "egg"
(ex.: nome de arquivo/URL contendo `egg`), o trigger ativa para aquela
categoria; caso contrário, nada acontece. Do ponto de vista do front, parece
arbitrário/opaco, mas é conteúdo determinístico do CMS — não há
`Math.random()` envolvido na escolha do ícone.

## Fluxo do clique (`handleEggClick`)

`src/features/gamified/components/skill-map.tsx`:

```ts
function handleEggClick() {
  wasReduceMotionOnRef.current = opts.reduceMotion;
  if (!opts.reduceMotion) toggle('reduceMotion');
  confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, scalar: 1.4 });
  setTimeout(() => setEggOpen(true), 600);
}
```

1. Guarda o estado atual de `reduceMotion` (contexto de a11y,
   `src/features/gamified/contexts/a11y-context.tsx`).
2. Se `reduceMotion` estava desligado, força-o a ligar. **Isso é um efeito
   colateral, não uma mudança de preferência de acessibilidade** — o objetivo
   é "congelar" a animação pesada da constelação em canvas enquanto o
   confete/minigame tocam. Vale considerar um mecanismo dedicado no futuro em
   vez de reaproveitar o toggle de a11y.
3. Dispara confete via [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)
   — única chamada dessa lib no projeto.
4. Após 600ms, abre o modal do minigame (`setEggOpen(true)`).

## Minigame

O modal usa `OverlayBase` (`src/shared/components/overlay-base.tsx`), um shell
genérico de modal via Floating UI (focus trap, backdrop, transição) — não é
específico do easter egg. Dentro dele é renderizado sempre `<SnakeGame />`
(`src/features/minigame/snake/`).

```tsx
<OverlayBase open={eggOpen} onClose={...} closeOnBackdropClick={false}>
  <SnakeGame locale={locale} onClose={...} />
</OverlayBase>
```

**Estado atual: fixo, não aleatório.** Não existe registry de minigames nem
`Math.random()` para escolher entre jogos diferentes — é sempre Snake. Não há
nenhum `TODO` no código sinalizando isso como pendência; a intenção de tornar a
escolha aleatória no futuro é conhecida apenas por comunicação direta com o
time, não por comentários no repositório. Se/quando isso for implementado,
este documento deve ser atualizado.

Ao fechar o modal (botão de fechar no `GameHud` ou dismiss do `OverlayBase`),
`reduceMotion` é restaurado ao valor anterior ao clique e `eggOpen` volta a
`false`.

## Fora do escopo deste fluxo

O modal de imagem de conquista (`src/features/gamified/components/
achievement-image-modal.tsx`) **não tem relação** com este easter egg. É usado
exclusivamente pela seção "Conquistas" (`achievements.tsx`) para exibir a
imagem de um badge em tamanho maior. Não há nenhuma referência cruzada entre
os dois — eles apenas foram adicionados em commits próximos no tempo.

## Arquivos envolvidos

| Arquivo | Papel |
|---|---|
| `src/shared/components/svg-icon.tsx` | Gancho genérico: `class` contendo `"egg"` + `onClick` ativa os atributos interativos. |
| `src/features/gamified/components/skill-map.tsx` | Dono do `panelLevel`, do cálculo `isEgg`, de `handleEggClick`, do estado `eggOpen` e da montagem de `OverlayBase`/`SnakeGame`. |
| `src/shared/components/overlay-base.tsx` | Shell de modal genérico (Floating UI), reaproveitado para o minigame. |
| `src/features/minigame/snake/` | Minigame Snake (único hoje) — componentes, hook de estado, engine, storage, i18n. |
| `src/shared/data/map-portfolio.ts` | Mapeia o ícone do grupo de skill vindo do CMS para `iconUrl` — origem real de "qual categoria é a do ovo". |
| `src/shared/types/portfolio.ts` | Tipos de `PortfolioData`, incl. `iconUrl` nas categorias de skill. |
| `src/features/gamified/styles.css` | Define `cursor-gamified-pointer`/`cursor-gamified-help` usados pelo affordance do ícone. |
