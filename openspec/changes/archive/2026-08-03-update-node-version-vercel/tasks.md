## 1. Atualizar arquivos de configuração

- [x] 1.1 Atualizar `.nvmrc` de `v22.19.0` para `v24.19.0`
- [x] 1.2 Atualizar `engines.node` em `package.json` de `>=20.16.0` para `24.x`

## 2. Atualizar referências em documentação

- [x] 2.1 Atualizar `README.md` (pré-requisitos) de v20.16.0 para Node.js 24.x
- [x] 2.2 Atualizar `CLAUDE.md` (seção Node version) de v20.16.0 para Node.js 24.x
- [x] 2.3 Atualizar `openspec/config.yaml` (contexto) de Node 20.16 para Node 24

## 3. Verificação

- [x] 3.1 Rodar `npx pnpm typecheck` e confirmar que passa com a nova configuração
- [x] 3.2 Rodar `npx pnpm build` e confirmar que o build completa sem erros
- [x] 3.3 Confirmar que `.nvmrc` e `engines.node` estão consistentes entre si (24.x)
