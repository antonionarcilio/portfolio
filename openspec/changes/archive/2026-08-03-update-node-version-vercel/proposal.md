## Why

A Vercel recomenda hoje a versão mais recente do Node.js LTS (24.x) como padrão para builds e deploys. O projeto ainda referencia versões desatualizadas (v22.19.0 no `.nvmrc`, `>=20.16.0` no `engines`, e textos citando v20.16.0), o que gera inconsistência entre o ambiente local, o CI e o deploy.

## What Changes

- `.nvmrc`: atualiza de `v22.19.0` para a última versão estável do Node 24 (LTS recomendado pela Vercel).
- `package.json` (`engines.node`): passa a declarar `24.x`, o range recomendado pela Vercel, substituindo `>=20.16.0`.
- `README.md` e `CLAUDE.md`: corrigem as referências de versão do Node para 24.x.
- `openspec/config.yaml`: atualiza o contexto de Node 20.16 para Node 24.
- Verificação: build (`npx pnpm build`) e `typecheck` passam com Node 24.

## Capabilities

### New Capabilities

- `node-version`: o projeto declara e usa a versão do Node.js recomendada pela Vercel (24.x LTS) no ambiente local, no CI e nos deploys.

### Modified Capabilities

<!-- Nenhuma spec existente é alterada; a mudança é de ambiente/build, coberta pela nova capability acima. -->

## Non-goals

- Não atualizar o pnpm nem outras ferramentas do toolchain.
- Não alterar código de runtime, componentes, i18n ou comportamento do produto.
- Não mudar a versão selecionada no dashboard da Vercel (o `engines` de `package.json` já passa a ser a fonte de verdade para o deploy).
- Não lidar com mudanças de breaking changes de dependências que possam surgir do Node 24; se surgirem, serão tratadas em mudança separada.

## Impact

- Arquivos: `.nvmrc`, `package.json` (`engines.node`), `README.md`, `CLAUDE.md`, `openspec/config.yaml`.
- Dependências: nenhuma adição/remoção; apenas ajuste do range de versão do Node em `engines`.
- Deploy (Vercel): builds passam a rodar com Node 24.x de acordo com o `engines` de `package.json`.
- Ambiente local: desenvolvedores usando `nvm` passam a usar a versão 24.x conforme `.nvmrc`.
