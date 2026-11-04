## Monorepo

Este repositório é um monorepo **pnpm workspaces** com 3 apps Next.js independentes (`apps/minimalist`, `apps/gamified`, `apps/pro`) e 2 pacotes compartilhados (`packages/portfolio-content-model`, `packages/portfolio-cms-client`). Cada app tem deploy próprio na Vercel. Convenções específicas de cada app/pacote vivem no `AGENTS.md` **daquele** diretório — leia o deste arquivo junto com o do diretório em que você está trabalhando, nunca só este.

- `apps/minimalist/AGENTS.md`
- `apps/gamified/AGENTS.md`
- `apps/pro/AGENTS.md`
- `packages/portfolio-content-model/AGENTS.md`
- `packages/portfolio-cms-client/AGENTS.md`

## Package manager

Node é gerenciado via **nvm** e não está disponível globalmente em shells de agente. `nvm use` não pode ser executado por agentes. **Sempre invoque pnpm via `npx`** — nunca chame `pnpm` diretamente.

- Node version: **v24.x** (ver `.nvmrc`).

## Comandos (raiz do workspace)

- `npx pnpm install` — instala dependências de todo o workspace.
- `npx pnpm build` — builda todos os apps (`pnpm --filter './apps/*' build`).
- `npx pnpm --filter <app> dev` / `build` / `start` / `lint` / `typecheck` — comando isolado de um app/pacote específico (`minimalist`, `gamified`, `pro`, `portfolio-content-model`, `portfolio-cms-client`).
- `npx pnpm lint` / `typecheck` — roda em todos os pacotes/apps (`pnpm -r`).
- `npx pnpm format` / `format:check` — Prettier em todo o repo.
- `npx pnpm prepare` — inicializa hooks do Husky.

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
- Dentro de `packages/*`, isso é mandatório: nenhum pacote lê `process.env` para configuração própria (owner/repo/branch de CMS, segredos) — tudo é injetado por parâmetro pelo app consumidor. Ver `packages/portfolio-cms-client/AGENTS.md`.

## Variants

Use [`class-variance-authority`](https://cva.style) (CVA) for all components
that accept a `variant` prop.

- Import: `import { cva, type VariantProps } from 'class-variance-authority'`
- Define the `cva()` call at file top, below type imports.
- Export `type Props = VariantProps<typeof myVariant>` for type inference.
- Shared variant definitions (used em ≥2 componentes do mesmo app) ficam em `src/shared/variants/` daquele app — não existe mais um `src/shared` compartilhado entre apps.

**Anti-patterns:** `[...].join(' ')`, inline JSX ternaries in `className`,
parallel `Record<string, string>` tables for the same key set.

## Estrutura do workspace

```
pnpm-workspace.yaml
tsconfig.base.json          — compilerOptions compartilhado; cada app/pacote estende
eslint.config.mjs           — ignores compartilhados na raiz; cada app tem seu próprio
                               eslint.config.mjs completo (next/core-web-vitals/typescript)

apps/
  minimalist/                — ver apps/minimalist/AGENTS.md
  gamified/                  — ver apps/gamified/AGENTS.md
  pro/                       — ver apps/pro/AGENTS.md

packages/
  portfolio-content-model/   — contrato de dados + locales (ver AGENTS.md do pacote)
  portfolio-cms-client/      — pipeline de CMS (ver AGENTS.md do pacote)
```

Dentro de cada app, a estrutura segue o App Router do Next.js (`src/app/[locale]/...`), com `src/features/<nome>/` para lógica de UI e `src/shared/` para cópias locais de utilitários compartilhados entre apps (ver a seção "Dependencies" acima — não existe mais um `src/shared` único no nível do repositório).

- **Todos os arquivos devem usar kebab-case** (ex.: `component-name.tsx`, `hook-name.tsx`).
- Exceções clássicas como `index.js`/`ts` são permitidas, assim como arquivos de terceiros/templates.
- **camelCase**, PascalCase e snake_case em nomes de arquivo **não são permitidos**.

## CSS

- `globals.css` de cada app deve conter **só** `@import 'tailwindcss'`, o import de `shared/styles/a11y.css` (quando aplicável) e os imports de CSS específico das features daquele app. Nenhum estilo de feature deve viver em `globals.css`.
- Estilos específicos de feature (`@theme`, `@utility`, `@layer`, media queries) vão em `src/features/<feature>/styles.css` daquele app e são importados via `@import`.

## Formatting

- `prettier-plugin-organize-imports` is active — imports are auto-sorted on format; do not manually reorder them.
- Husky + lint-staged run `lint` and `format` automatically on `git commit`. Do not skip hooks with `--no-verify` unless explicitly required.

## Logging

- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.

## CMS markdown (GitHub)

O pipeline de leitura do conteúdo (BFS a partir de `content/index.md`, resolução de wikilinks, mapeamento para `PortfolioData`) vive **uma única vez** no pacote `packages/portfolio-cms-client` — ver `packages/portfolio-cms-client/AGENTS.md` para como funciona e como adicionar um campo novo do CMS. Nenhum app deve reimplementar ou duplicar essa lógica; todos consomem via `cmsClient.getPortfolio(locale)` (instanciado em `src/lib/cms-client.ts` de cada app).

## UI localization (i18n)

Toda string de interface (botões, labels, tooltips, `aria-label`, `title`, `alt`, mensagens de status) **deve** vir de `messages/pt-BR.json`/`messages/en.json` **do app** via `next-intl` — nunca hardcoded no componente. Isso é independente da localização de **conteúdo** do CMS: `cmsClient.getPortfolio(locale)` traduz o *dado* (nome, papel, descrições), `next-intl` traduz a *interface* ao redor.

- `src/i18n/routing.ts` de cada app — locales suportados e `localePrefix`, derivados de `SUPPORTED_LOCALES`/`DEFAULT_LOCALE` do pacote `portfolio-content-model`.
- `src/i18n/navigation.ts` — `Link`/`useRouter`/`usePathname`/`getPathname` com consciência de locale. Use em vez de `next/link`/`next/navigation` sempre que um link precisar respeitar o locale atual.
- `src/middleware.ts` de cada app — detecção de locale e rewrite/redirect via `createMiddleware(routing)`.
- Toda rota renderizável (páginas, layouts) vive dentro de `src/app/[locale]/...` daquele app — exceto route handlers em `src/app/api/*`, que não renderizam HTML e ficam fora de `[locale]`.
- Cada app tem seu(s) próprio(s) root key(s) em `messages/*.json` — ver o `AGENTS.md` do app para quais.

## Adicionando variáveis de ambiente

1. Adicionar a variável ao `.env` **do app** (e ao `.env.sample` daquele app).
2. Registrar em `src/env.ts` **do app** — vars server-only em `server`, vars client-acessíveis (prefixo `NEXT_PUBLIC_`) em `client`. Adicionar a entrada correspondente em `runtimeEnv`.
3. Consumir via `import { env } from '@/env'` — nunca ler `process.env` diretamente fora de `env.ts`.
4. Se precisar em um Client Component, passar como prop a partir do Server Component mais próximo, em vez de adicionar prefixo `NEXT_PUBLIC_` a menos que a exposição pública seja intencional.

Não existe mais um `env.ts`/`.env` compartilhado na raiz — cada app é autônomo.

---
