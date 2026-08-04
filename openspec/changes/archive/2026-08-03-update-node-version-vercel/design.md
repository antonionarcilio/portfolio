## Context

O projeto é Next.js 15 (App Router + Turbopack), React 19, TypeScript strict, gerenciado com pnpm 9. Hoje as referências de versão do Node estão espalhadas e inconsistentes: `.nvmrc` aponta para `v22.19.0`, `package.json` declara `engines.node: >=20.16.0`, e `README.md`, `CLAUDE.md` e `openspec/config.yaml` citam v20.16.0. A Vercel recomenda e usa por padrão a última LTS do Node.js (24.x) para builds e deploys (ver proposal.md - Why).

## Goals / Non-Goals

**Goals:**
- Unificar a versão do Node em `24.x` em todos os pontos de referência do repositório.
- Garantir que o deploy na Vercel resolva automaticamente a última release 24.x via `engines.node`.
- Manter o fluxo local via `nvm` consistente com o ambiente de build.

**Non-Goals:**
- Não mudar o dashboard da Vercel (o `engines.node` de `package.json` passa a ser a fonte de verdade).
- Não atualizar pnpm nem dependências; não mexer em código de runtime.

## Decisions

- **`.nvmrc` → `v24.19.0`**: fixa a release 24.x mais recente publicada (2026-08-03) para desenvolvedores que usam `nvm`. Alternativa considerada: deixar `24` solto; descartada porque `nvm` resolve melhor com uma versão exata pinada.
- **`engines.node` → `24.x`**: formato recomendado pela Vercel para mapear para a última 24.x no deploy (a Vercel suporta `24.x`, `^24.0.0`, `>=20.0.0`). Alternativa considerada: `>=20.16.0` (atual); descartada pois não reflete o alvo recomendado e poderia liberar major muito antiga.
- **Docs (`README.md`, `CLAUDE.md`, `openspec/config.yaml`)**: atualizar a versão citada para `24.x` para refletir o estado real. Nenhum outro lugar referencia versão de Node (CI não usa `setup-node`).

## Risks / Trade-offs

- [Dependências de runtime podem não suportar Node 24] → Mitigação: rodar `npx pnpm install` + `npx pnpm build` + `npx pnpm typecheck` com Node 24 como verificação desta mudança; em caso de incompatibilidade, tratar em mudança separada.
- [Rollback de versão no `.nvmrc` diverge do `engines`] → Mitigação: a verificação (build/typecheck) com Node 24 valida o par `.nvmrc` + `engines` juntos antes do merge.
