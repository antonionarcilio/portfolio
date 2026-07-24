## Package manager

Node is managed via **nvm** and is not available globally in agent shells. `nvm use` cannot be run by agents. **Always invoke pnpm through `npx`** — never call `pnpm` directly, as it will not be found.

- Node version: **v20.16.0** (see `.nvmrc`).

## Commands

### Build
- `npx pnpm build` — Builds the app for production.
- `npx pnpm start` — Starts the already built app in a production environment.

### Development

- `npx pnpm dev` — Runs the project in development mode with hot-reload (Next.js + Turbopack).
- `npx pnpm lint` — Runs ESLint on the entire codebase for code quality.
- `npx pnpm format` — Formats all code using Prettier.
- `npx pnpm format:check` — Checks if all code is formatted.
- `npx pnpm typecheck` — Checks all project TypeScript types.
- `npx pnpm prepare` — Initializes Husky git hooks (run locally after installing dependencies).

## Code style

- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any`, no `Dict`, no untyped functions.
- Use Zod for validation.
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.
- Do not use abbreviations in variable names, keys, function names, or file names.

## Git Workflow

- Git operations are managed by the user through custom automation.
- Never execute Git write operations unless the user explicitly instructs you to do so.
- Never generate or suggest commit messages unless explicitly requested.
- Never stage files (`git add`) unless explicitly requested.
- Never create, delete, or switch branches unless explicitly requested.
- Never rewrite Git history without explicit approval.
- Always preserve uncommitted changes.

## Comments

- Keep your own comments. Don't strip them on refactor — they carry intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings (jsdoc) on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because of a specific bug or upstream constraint.

## Dependencies

- Inject dependencies through constructor/parameter, not global/import.
- Wrap third-party libs behind a thin interface owned by this project.

## Animations

- **All animations must be implemented exclusively via [Framer Motion](https://www.framer.com/motion/).**
- Do **not** use CSS `@keyframes`, Tailwind `animate-*`, `transition-*`, `duration-*`, `ease-*`, or inline `style={{ animation/transition }}`.
- Use `motion.*` elements, `whileHover`, `whileTap`, `whileFocus`, `AnimatePresence`, and the `animate` + `transition` props.
- Looping / ambient animations (e.g. LED pulse, radar beam) must use `animate` with `repeat: Infinity` on a `motion.*` component.
- Enter/exit transitions for conditionally-rendered elements must use `<AnimatePresence>`.
- Keep easing consistent with the project's existing curve: `[0.2, 0.7, 0.2, 1]` (cubic-bezier), expressed as `ease: [0.2, 0.7, 0.2, 1]` in Framer Motion's `transition` object.
- After migration, remove all orphaned `@keyframes` from `globals.css` and all Tailwind animation/transition variables from the `@theme` block.

### Shared animation values

Animation variants, timing constants, and easing curves used in **two or more components** must be extracted to a central file — never duplicated.

- Per-feature shared animations go in `src/features/<feature>/animations.ts`.
- Shared animations used across features go in `src/shared/animations.ts`.
- Each exported value should have a clear, specific name (e.g. `listItemVariants`, `listStaggerDelay`, `LIST_STAGGER_STEP`).
- Components import from that file instead of defining local copies.

```ts
// src/features/gamer/animations.ts
export const LIST_STAGGER_STEP = 0.07;
export const LIST_MAX_STAGGER_INDEX = 5;

export const listItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  }),
};

export function listStaggerDelay(index: number): number {
  return Math.min(index, LIST_MAX_STAGGER_INDEX) * LIST_STAGGER_STEP;
}
```

**Rule:** if you find yourself writing the same `variants` object or timing constant in a second component, stop and extract first.

### Disable / pause animations (reduceMotion)

The gamer feature has a global accessibility toggle that pauses **all** Framer Motion animations at once. No per-component code is needed.

- **Context:** `src/features/gamer/contexts/a11y-context.tsx` — `A11yProvider` + `useA11y()` hook.
- **Key:** `reduceMotion` (type `A11yKey`). Toggle via `useA11y().toggle('reduceMotion')`.
- **Mechanism:** sets `MotionGlobalConfig.skipAnimations = true` (Framer Motion global flag) — all `motion.*` components skip their animations instantly.
- **CSS class:** `a11y-reduce-motion` is added to `<html>` when active (use it only for non-Framer-Motion effects; standard animations are already covered by `skipAnimations`).
- **Persistence:** stored in `localStorage` under the key `a11y-opts`; rehydrated synchronously at module load to avoid a first-render flash.

**Rule for new animations:** use `motion.*` + Framer Motion props only — they are automatically paused when `reduceMotion` is on. Never add a separate "if reduceMotion" branch; the global flag handles it.

## Variants

Use [`class-variance-authority`](https://cva.style) (CVA) for all components
that accept a `variant` prop.

- Import: `import { cva, type VariantProps } from 'class-variance-authority'`
- Define the `cva()` call at file top, below type imports.
- Export `type Props = VariantProps<typeof myVariant>` for type inference.
- Merge with `clsx` only for runtime-state classes not expressible as CVA variants.
- Shared variant definitions (used in ≥2 files) go in `src/shared/variants/`.

**Anti-patterns:** `[...].join(' ')`, inline JSX ternaries in `className`,
parallel `Record<string, string>` tables for the same key set.

## Structure

- Follows the Next.js 14+ App Router architecture — all files and components reside in `src/app/` and subdirectories.
- Use named subfolders to group routes, components, and features.
- **All files must strictly use kebab-case naming** (e.g.: `componente-name.tsx, hook-name.tsx`).
- Classic exceptions like `index.js`/`ts` are allowed, as well as third-party or template files.
- **camelCase**, PascalCase, and snake_case filenames are **not allowed**.


Typical structure:

```
src/
    app/                   — Next.Js Router files, global styles.
      feature-name/
        layout.tsx
        page.tsx
      global.styles.css
      ...
    features/              — Feature-based modules. Business logic lives here.
      feature-name/
        components/
        hooks/
        utils/
        services/
        types/
        styles.css
        ...
      ...
    shared/                — Reusable UI, hooks, utilities, types
      components/
      hooks/
      utils/
      services/
      types/
    api/                   — Api clients, axios instance, endpoints
    store/                 — Global state configuration
    lib/                   — Third-party libary configuration
    routes/                — Route definitions and guards
...
```

## CSS

- `src/app/globals.css` must contain **only** `@import 'tailwindcss'` and imports of feature-specific CSS files. No feature styles here.
- Feature-specific styles (`@theme`, `@utility`, `@layer`, media queries) go in `src/features/<feature>/styles.css` and are imported from `globals.css` via `@import`.
- This keeps Tailwind's PostCSS pipeline intact for `@utility` and `@layer` directives in feature files.

### Responsividade — sem variantes arbitrárias de breakpoint no JSX

- **Nunca** use variantes Tailwind arbitrárias de breakpoint diretamente no `className` de um componente: `max-[Npx]:`, `min-[Npx]:`, `max-cv:`, `min-cv:` (ou qualquer outro breakpoint customizado definido em `--breakpoint-*`). Isso vale mesmo para uma única classe isolada.
- Toda regra de layout responsivo vive em `@media` dentro de `src/features/<feature>/styles.css`, dentro da layer `cv-overrides` (ou da layer relevante da feature), amarrada a uma classe BEM estável do elemento — nunca a um seletor utilitário do Tailwind.
- Se o elemento ainda não tem uma classe BEM, adicione uma antes de escrever a media query (ver convenção BEM abaixo). Não crie a regra CSS a partir de um seletor de atributo/posição.
- Para o breakpoint customizado `--breakpoint-cv` (definido em `@theme`, `styles.css:22`), use a sintaxe Tailwind v4 `theme()` em vez de repetir o valor em px/rem: `@media (width <= theme(--breakpoint-cv))` / `@media (width >= theme(--breakpoint-cv))`. Nunca escreva `880px` ou `55rem` fora do `@theme`.
- Quando o estilo depende de um estado de acessibilidade já refletido como classe em `<html>` (ex.: `html.a11y-upscale` para o zoom de 1.2×), **não** replique essa condição com um ternário em JS dentro do `className` (`opts.upscale ? 'a' : 'b'`). Em vez disso, use uma única classe estática no JSX e resolva a diferença em CSS com `html.a11y-upscale .minha-classe { … }` / `html:not(.a11y-upscale) .minha-classe { … }` — ver o padrão de "dois thresholds" já usado em `styles.css:192-330`.
- Exceção: lógica que decide *comportamento* de runtime (ex.: medir `window.innerWidth` para disparar um `setState` que altera o fluxo do componente, como o scroll-threshold de `cv-header.tsx`) continua em JavaScript — a regra acima cobre apenas estilo.

### CSS class naming — BEM

All custom CSS classes follow **BEM** (Block\_\_Element--Modifier).

```
block               — independent component:      .sc-metric
block__element      — child tied to the block:    .sc-metric__value
block--modifier     — variant of the block:       .sc-metric--compact
block__element--modifier — variant of the child: .sc-metric__label--muted
```

#### Rules

- **Block** names use a feature prefix when the component lives in shared CSS (`sc-` for skill-constellation, `cv-` for curriculum, etc.).
- **Element** names describe the role of the child, not its tag or visual appearance. Use `.sc-metric__value`, never `.sc-metric__span` or `.sc-metric__big`.
- **Modifier** names describe the state or variant. Use `.sc-chip--selected`, never `.sc-chip-s` or `.sc-chip2`.
- **Never nest BEM blocks** inside each other in the CSS — each block is self-contained. Use a new block name for nested components.
- **Single-letter, two-letter, and abbreviated class names are banned** — a reader must not have to guess what `.fl`, `.v`, or `.ci-g` mean.
- Utility classes from Tailwind (`flex`, `gap-4`, …) are exempt from BEM — apply them directly in JSX alongside BEM class names.

#### Example

```css
/* Block */
.sc-metric { … }

/* Elements */
.sc-metric__value { font-size: 20px; color: var(--cyan); }
.sc-metric__value small { … }
.sc-metric__label { font-size: 9px; text-transform: uppercase; }

/* Modifier on block */
.sc-metric--compact { padding: 4px 8px; }
```

```tsx
<div className="sc-metric sc-metric--compact">
  <div className="sc-metric__value">{count}<small>/{total}</small></div>
  <div className="sc-metric__label">Núcleos</div>
</div>
```

#### Migration note

Existing classes that predate this rule (e.g. `.sc-metric .value`, `.sc-cat-item .name`) are tolerated until the component is touched for another reason — **do not** refactor naming alone in a dedicated PR unless it is the primary task.

## Formatting

- `prettier-plugin-organize-imports` is active — imports are auto-sorted on format; do not manually reorder them.
- Husky + lint-staged run `lint` and `format` automatically on `git commit`. Do not skip hooks with `--no-verify` unless explicitly required.

## Logging

- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.

## CMS markdown (GitHub)

O conteúdo do portfólio vive em markdown num repo GitHub **público**
(`antonionarcilio/portfolio-cms`, branch `master`, pasta `content/`), buscado
em runtime via `raw.githubusercontent.com` — sem token, sem Tree API. A pipeline
é: BFS a partir de `content/index.md` → grafo em memória (`CmsGraph`) → mapper
puro → `PortfolioData` → Server Component.


### Como funciona

1. `src/lib/github-cms/fetch-cms-file.ts` busca um arquivo cru por path. Em
   dev usa `cache: 'no-store'`; em produção usa fetch tags + `revalidate`
   (`CMS_REVALIDATE_SECONDS`, default 1h).
2. `src/lib/github-cms/parse-wikilink.ts` parseia `"[[path|label]]"`.
3. `src/shared/data/get-cms-graph.ts` (`getCmsGraph`, cacheado por locale) faz
   a travessia BFS a partir do root, seguindo os wikilinks presentes no
   frontmatter — só o que é alcançável a partir de `content/index.md` entra
   no grafo. Expõe `resolveWikiLinks(graph, campo)` para resolver um campo
   (`string | string[]`) em nós do grafo, na ordem de origem.
4. `src/shared/data/map-portfolio.ts` (`mapPortfolioToData`) é o
   anti-corruption layer: converte o nó raiz + grafo em `PortfolioData`.
5. `src/shared/data/get-portfolio.ts` (`getPortfolio(locale)`) orquestra os
   dois passos acima — é o único ponto de entrada consumido pelas páginas.

### Adicionando um campo novo

1. Adicione o campo no arquivo `.md` correspondente no repo `portfolio-cms`
   (fora deste repo — editado via Obsidian).
2. Se o campo for um wikilink (ou lista de wikilinks), resolva com
   `resolveWikiLinks(graph, node.frontmatter.campo)` dentro do mapper
   correspondente em `map-portfolio.ts`.
3. Tipe o formato esperado do frontmatter localmente em `map-portfolio.ts`
   (`RootFields`, `ProjectFields`, etc.) — não existe import cross-repo dos
   tipos gerados no CMS (`content-types.d.ts`), copie os campos usados.
4. Ordem de exibição de listas = ordem literal do array YAML — nunca
   ordenar/reordenar em código.

### Regras

- **Nunca editar `src/shared/data/get-cms-graph.ts` pra buscar fora do que é
  alcançável a partir do root** — arquivo não linkado em `content/index.md`
  não deve gerar chamada de rede (é a regra "root é única fonte de verdade").
- **Sem resolver de link curto por basename** — todo wikilink usa caminho
  completo (`content/<collection>/<slug>/index`).
- `PortfolioData` nunca deve importar tipos do grafo (`CmsNode`/`CmsGraph`) —
  o mapper é a fronteira.

## Adding environment variables

1. Add the variable to `.env` (and `.env.example` if one exists).
2. Register it in `src/env.ts` — server-only vars go in `server`, client-accessible vars (must be prefixed `NEXT_PUBLIC_`) go in `client`. Add the matching `process.env.VAR_NAME` entry to `runtimeEnv`.
3. Consume via `import { env } from '@/env'` — never read `process.env` directly.
4. If needed in a client component, pass it down as a prop from the nearest server component (page/layout) rather than adding a `NEXT_PUBLIC_` prefix unless public exposure is intentional.

---
