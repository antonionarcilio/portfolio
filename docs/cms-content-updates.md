# Como uma mudança no CMS chega ao ar

O site é **totalmente estático em produção** (build-time puro, sem ISR) — o
conteúdo é buscado uma única vez durante `next build`
(`src/lib/github-cms/fetch-cms-file.ts`), sem revalidação automática. Uma
mudança em `content/**/*.md` no repo `portfolio-cms` só aparece no site
depois de um novo build+deploy.

## O fluxo completo

```
push no portfolio-cms (GitHub, qualquer branch)
  → webhook do GitHub dispara POST pra {MY_DOMAIN}/api/revalidate
    → a rota valida a assinatura HMAC (secret: CMS_GITHUB_WEBHOOK_SECRET)
      → se payload.ref != refs/heads/{CMS_GITHUB_BRANCH}, ignora (sem rebuild)
      → se bate, dá POST no Deploy Hook da Vercel (VERCEL_DEPLOY_HOOK_URL)
        → a Vercel inicia um build novo, que busca o CMS fresco
```

### Webhook do GitHub

Configurado no repo `portfolio-cms` → **Settings → Webhooks**:
- Payload URL: `{MY_DOMAIN}/api/revalidate`
- Evento: `push`
- Secret: mesmo valor de `CMS_GITHUB_WEBHOOK_SECRET`

O GitHub não filtra webhooks por branch (o evento `push` cobre todas as
branches) — o filtro é feito na rota `/api/revalidate`, que só dispara o
Deploy Hook quando a branch do push é `CMS_GITHUB_BRANCH` (default
`master`).

### Deploy Hook da Vercel

Configurado no projeto do app → **Settings → Git → Deploy Hooks**. A URL
gerada vai na env var `VERCEL_DEPLOY_HOOK_URL` (no `.env` local e nas env
vars do projeto na Vercel — nunca commitada, ver `.env.sample` pro
placeholder).

Essa URL não tem autenticação própria — qualquer `POST` nela dispara um
build. Por isso só a rota `/api/revalidate` (que já validou a assinatura do
GitHub antes) deve chamá-la; ela nunca deve ser exposta publicamente.

## Fallback manual

Se qualquer peça dessa cadeia falhar silenciosamente (webhook não disparou,
secret expirou, etc.), dá pra forçar o rebuild sem depender de nenhuma
delas:

- Painel da Vercel → projeto → aba **Deployments** → **Redeploy** no último
  deployment, ou
- `curl -X POST $VERCEL_DEPLOY_HOOK_URL` direto no terminal.

Os dois disparam exatamente o mesmo build que o webhook dispararia.
