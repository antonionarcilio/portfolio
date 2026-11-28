# Checklist de varredura (modo Existente)

Objetivo: extrair **valores literais com origem** (`arquivo:linha`) e **padrões de uso real**. Use `grep`,
`rg` ou `find`. Não carregue node_modules, `.next` nem `dist`.

## 1. Fontes de tokens (leia por inteiro, são a verdade)

| Stack | Onde olhar |
|---|---|
| Tailwind v4 | `@theme { ... }` em qualquer `.css` (`rg -l '@theme'`). Namespaces: `--color-*`, `--font-*`, `--text-*` (+ `--text-*--line-height`), `--font-weight-*`, `--radius-*`, `--shadow-*`, `--spacing-*`, `--breakpoint-*`, `--ease-*`, `--animate-*` |
| Tailwind v3 | `tailwind.config.{js,ts,cjs,mjs}` → `theme` e `theme.extend` |
| CSS vars | `:root {`, `[data-theme=`, `.dark {` (`rg -n '^\s*--[a-z]'`) |
| Sass/Less | `_variables.scss`, `$color-`, `@use 'tokens'` |
| CSS-in-JS | `theme.ts`, `createTheme(` (MUI), `extendTheme(` (Chakra), `ThemeProvider`, `stitches.config`, `vanilla-extract` `createTheme` |
| Token pipelines | `tokens.json`, `*.tokens.json` (DTCG), Style Dictionary `config.json`, Tokens Studio |
| UI kits | shadcn `components.json` + CSS vars em `globals.css`; Radix Colors; DaisyUI `themes` |
| Fontes | `next/font` (`layout.tsx`), `@font-face`, `<link fonts.googleapis>` → família real e pesos carregados |

Registre também: tokens com **light/dark**, aliases semânticos (`--color-primary: var(--blue-600)`) e
comentários explicando intenção (eles viram prosa).

## 2. Uso real (o que os tokens não contam)

Conte ocorrências nas pastas de UI (`src/features`, `src/components`, `app/`):

```bash
rg -o --no-filename '\b(gap|space-[xy]|p[xytblr]?|m[xytblr]?)-[0-9.]+\b' src | sort | uniq -c | sort -rn | head -30
rg -o --no-filename '\bmax-w-[a-z0-9\[\]]+' src | sort | uniq -c | sort -rn | head
rg -o --no-filename '\b(rounded|shadow)(-[a-z0-9]+)?\b' src | sort | uniq -c | sort -rn | head
rg -o --no-filename '\b(sm|md|lg|xl|2xl):' src | sort | uniq -c | sort -rn
rg -n '\[[0-9.]+(px|rem)\]' src | head   # valores arbitrários = escala não tokenizada
rg -n '#[0-9a-fA-F]{3,8}\b' src --glob '!*.svg' | head   # hex fora dos tokens
```

Daqui saem: o ritmo vertical entre seções, o padding do container, o max-width, a escala de gap dominante, os
breakpoints realmente usados e as violações (hex cru, valores arbitrários). As violações vão para o plano e
para Known Gaps, não para o YAML.

Em CSS puro ou CSS Modules, faça o equivalente com `rg -o 'gap:\s*[^;]+'`, `padding`, `border-radius`,
`box-shadow` e `@media`.

## 3. Componentes

- Diretórios: `components/ui`, `shared/components`, `src/components`, `packages/ui`.
- Variantes: `cva(`, `variants: {`, `variant=`, `size=`, `tv(` (tailwind-variants), `styled(...)` com props.
- Estados: `hover:`, `focus-visible:`, `active:`, `disabled:`, `aria-[...]`, `data-[state=...]`.
- Docs existentes: Storybook (`*.stories.*`), páginas `/dev` e `/playground`, `README` de componentes.
- Para cada componente-chave, anote o papel, as variantes, os estados, os tokens usados e o arquivo. Priorize
  os primitivos (Button, Link, Input, Card, Chip/Tag, Nav/Header, Dialog/Drawer) e os componentes de assinatura
  do produto.

## 4. Movimento

`framer-motion`/`motion` (`variants`, `transition`), arquivos `animations.ts`, `@keyframes`, `transition-*`,
`prefers-reduced-motion`. Registre durações, easings e onde a redução de movimento é respeitada.

## 5. Voz e conteúdo

Arquivos de i18n (`messages/*.json`, `locales/`), labels de botões e estados vazios/erro. Só documente se
houver padrão claro (capitalização, tom, termos).

## 6. Figma (se o MCP estiver conectado e o usuário fornecer o arquivo)

Puxe variables, styles e components e compare com o código. Divergência = item do plano. O código vence no
modo Existente.

## 7. Regras já escritas

`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `docs/`, lint rules customizadas (ESLint/Stylelint que proíbem
hex, etc.). Viram Do's and Don'ts e alimentam a Fase 7 (mover regras descritivas).
