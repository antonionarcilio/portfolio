# Quickstart: Validação ponta a ponta da migração

Guia de validação executável — não é um guia de implementação (isso fica em `tasks.md`/fase de implementação). Pressupõe que as Waves 1-3 descritas em `/home/antonio/.claude/plans/me-diga-se-com-memoized-adleman.md` já foram executadas.

## Pré-requisitos

- Node.js v24.19.0 (`.nvmrc`), pnpm instalado (`pnpm@9.15.9`, ver `package.json`).
- Variáveis de ambiente de cada app configuradas (`.env` local por app): `MY_DOMAIN`, `CMS_GITHUB_OWNER`, `CMS_GITHUB_REPO`, `CMS_GITHUB_BRANCH`, `CMS_GITHUB_WEBHOOK_SECRET`, `VERCEL_DEPLOY_HOOK_URL`.

## 1. Instalar dependências do workspace

```bash
npx pnpm install
```

**Esperado**: um único `pnpm-lock.yaml` na raiz, sem erro de resolução de workspace; `packages/portfolio-content-model` e `packages/portfolio-cms-client` linkados nos 3 apps.

## 2. Validar os pacotes compartilhados (contratos)

```bash
npx pnpm --filter portfolio-content-model exec tsc --noEmit
npx pnpm --filter portfolio-cms-client exec tsc --noEmit
grep -r "@/env" packages/portfolio-cms-client/src   # deve retornar vazio
```

**Esperado**: zero erros de tipo; zero ocorrências de `@/env` no pacote de CMS (ver `contracts/portfolio-cms-client.md`).

## 3. Buildar os 3 apps isoladamente

```bash
npx pnpm --filter minimalist build
npx pnpm --filter gamified build
npx pnpm --filter pro build
```

**Esperado**: cada build conclui sem erro, sem precisar buildar os outros apps (US-16/US-22/US-27).

## 4. Rodar cada app em dev e navegar pelas rotas principais (SC-004 — checklist de paridade manual)

```bash
npx pnpm --filter minimalist dev     # http://localhost:3000
```
Navegar: `/pt-BR`, `/en`, `/pt-BR/labs/posts/flip`, `/pt-BR/dev/minimalist-button` (só em dev).

```bash
npx pnpm --filter gamified dev
```
Navegar: `/pt-BR`, `/en`, `/pt-BR/minigames/snake`.

```bash
npx pnpm --filter pro dev
```
Navegar: `/pt-BR`, `/en` — confirmar que `getPortfolio(locale)` renderiza nome/papel/links reais do CMS, com JSON-LD/OG presentes (ver código-fonte da página renderizada).

**Esperado**: conteúdo e comportamento idênticos ao estado pré-migração para `minimalist`/`gamified` (checklist manual, conforme clarificação de SC-004); `pro` renderiza dados reais do CMS.

## 5. Validar o fluxo de revalidação (US-14 / FR-006 / FR-007)

```bash
# Repetir para cada app, apontando para a porta/URL correspondente
curl -i -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/outra-branch"}'
# Esperado: 200 { "triggered": false } (branch não corresponde)

curl -i -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=assinatura-invalida" \
  -d '{"ref":"refs/heads/master"}'
# Esperado: 401
```

Ver `contracts/revalidate-webhook.md` para a tabela completa de respostas esperadas.

## 6. Validar os redirects 301 do app `pro` (US-29 / SC-003)

```bash
npx pnpm --filter pro build && npx pnpm --filter pro start   # http://localhost:3000
curl -I http://localhost:3000/portfolios
curl -I http://localhost:3000/pt-BR/portfolios/minimalist
curl -I http://localhost:3000/portfolios/gamified/alguma-rota
```

**Esperado**: `301` em todos os casos, `Location` apontando para o domínio/rota equivalente novo (ver tabela em `contracts/revalidate-webhook.md`).

## 7. Rodar os specs e2e do `minimalist`

```bash
npx pnpm --filter minimalist exec playwright test
```

**Esperado**: os 7 specs continuam passando após a migração (US-21).

## 8. Verificação final de limpeza (US-37 / SC-006 — só após Wave 3 + DOC completas)

```bash
grep -r "portfolioHub\|portfolio-hub-content\|@/shared\|@/features\|@/lib/github-cms" . \
  --include="*.ts" --include="*.tsx" -l 2>/dev/null | grep -v node_modules
```

**Esperado**: nenhuma ocorrência (o app único anterior foi completamente removido).
