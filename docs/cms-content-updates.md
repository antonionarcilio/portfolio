# Como uma mudança no CMS chega ao ar

Os 3 apps (`minimalist`, `gamified`, `pro`) são **totalmente estáticos em produção**
(build-time puro, sem ISR) — o conteúdo é buscado uma única vez durante `next build`
de cada app, via o pacote compartilhado `packages/portfolio-cms-client`
(`fetch-cms-file.ts`), sem revalidação automática. Uma mudança em `content/**/*.md`
no repo `portfolio-cms` só aparece em cada site depois do próprio build+deploy
daquele site.

## O fluxo completo (3 webhooks → 3 Deploy Hooks)

Desde a migração para monorepo, **cada um dos 3 apps tem seu próprio webhook e seu
próprio Deploy Hook** — não existe mais um único `/api/revalidate` compartilhado.
Um push no `portfolio-cms` dispara os 3 em paralelo (em fila, por conta do limite
de builds simultâneos do plano Hobby da Vercel):

```
push no portfolio-cms (GitHub, qualquer branch)
  → GitHub dispara POST para os 3 webhooks configurados:
      {MINIMALIST_DOMAIN}/api/revalidate
      {GAMIFIED_DOMAIN}/api/revalidate
      {PRO_DOMAIN}/api/revalidate
    → cada rota valida sua própria assinatura HMAC (secret: CMS_GITHUB_WEBHOOK_SECRET
      daquele projeto na Vercel) via handleRevalidateWebhook (portfolio-cms-client/revalidate)
      → se payload.ref != refs/heads/{CMS_GITHUB_BRANCH daquele app}, ignora (sem rebuild)
      → se bate, dá POST no Deploy Hook daquele projeto (VERCEL_DEPLOY_HOOK_URL daquele app)
        → a Vercel inicia um build novo daquele app, que busca o CMS fresco
```

A implementação do HMAC/filtro de branch é **única** (`handleRevalidateWebhook` em
`packages/portfolio-cms-client/src/revalidate.ts`) — cada app só tem um wrapper de
~6 linhas em `src/app/api/revalidate/route.ts` passando sua própria config.

## Webhooks do GitHub

Configurados no repo `portfolio-cms` → **Settings → Webhooks** — **3 webhooks**,
um por app:

| App | Payload URL | Secret |
|---|---|---|
| `minimalist` | `https://minimalist.antoniomascarenhas.com.br/api/revalidate` | `CMS_GITHUB_WEBHOOK_SECRET` do projeto `minimalist` |
| `gamified` | `https://gamified.antoniomascarenhas.com.br/api/revalidate` | `CMS_GITHUB_WEBHOOK_SECRET` do projeto `gamified` |
| `pro` | `https://antoniomascarenhas.com.br/api/revalidate` | `CMS_GITHUB_WEBHOOK_SECRET` do projeto `pro` |

Todos com Content type **`application/json`** (obrigatório — ver "Content-Type"
abaixo) e evento `push`. Cada projeto na Vercel tem seu próprio secret — eles
**não precisam ser o mesmo valor** entre os 3 apps, mas cada webhook deve usar
exatamente o secret do projeto que ele aponta.

O GitHub não filtra webhooks por branch (o evento `push` cobre todas as
branches) — o filtro é feito em cada rota `/api/revalidate`, que só dispara o
Deploy Hook daquele app quando a branch do push é `CMS_GITHUB_BRANCH` (default
`master`) **daquele projeto**.

### Content-Type obrigatório

O webhook **deve** estar configurado com Content-Type `application/json`.
O GitHub envia o corpo raw como JSON, e a rota espera ler JSON direto
via `request.text()` + `JSON.parse()`.

Se o Content-Type estiver como `application/x-www-form-urlencoded` (valor
padrão na UI do GitHub ao criar um webhook), o GitHub envia o corpo como
`payload={"ref":...}` URL-encoded. A assinatura HMAC continua validando
(pois é calculada sobre o corpo cru), mas `JSON.parse('payload=...')`
lança `SyntaxError` → exceção não tratada → **HTTP 500**.

**Referência:** incidente de 04/ago/2026 — o commit `0a8ba27` adicionou
`JSON.parse()` ao fluxo; o webhook do repo `portfolio-cms` estava como
`form` desde sua criação. Redeliver de pushes passou a retornar 500 até
o content-type ser corrigido via `gh api`.

## Deploy Hooks da Vercel

Cada um dos 3 projetos (`minimalist`, `gamified`, `pro`) tem seu próprio Deploy Hook,
configurado em **Settings → Git → Deploy Hooks** daquele projeto. A URL gerada vai
na env var `VERCEL_DEPLOY_HOOK_URL` **daquele app** (`apps/<app>/.env` local e nas
env vars do projeto correspondente na Vercel — nunca commitada, ver
`apps/<app>/.env.sample` pro placeholder).

Essas URLs não têm autenticação própria — qualquer `POST` nelas dispara um build
daquele app. Por isso só a rota `/api/revalidate` daquele app (que já validou a
assinatura do GitHub antes) deve chamá-la; ela nunca deve ser exposta publicamente.

## Autenticação (HMAC-SHA256)

O GitHub assina cada payload com `X-Hub-Signature-256` — um
HMAC-SHA256 calculado sobre o **corpo cru** do request. A rota valida:

1. Lê o corpo como texto cru (`request.text()`) antes de qualquer parse.
2. Calcula o HMAC com o secret (`CMS_GITHUB_WEBHOOK_SECRET`).
3. Compara em **tempo constante** (`timingSafeEqual`) para evitar
   timing attacks.
4. Retorna 401 se não bater.

O secret é compartilhado entre o GitHub (repo → Webhooks → Secret) e
a env var `CMS_GITHUB_WEBHOOK_SECRET` no projeto da Vercel.

## Respostas da rota

| Status | Significado | Quando |
|--------|-------------|--------|
| `200` | `{"triggered": true}` | Push em `CMS_GITHUB_BRANCH` → Deploy Hook acionado |
| `200` | `{"triggered": false, "reason": "Branch ignorada..."}` | Push em outra branch → sem rebuild |
| `401` | `{"error": "Não autorizado."}` | Assinatura HMAC inválida ou ausente |
| `502` | `{"error": "Falha ao disparar o Deploy Hook da Vercel."}` | Deploy Hook retornou erro (URL expirada/inválida) |
| `503` | `{"error": "Webhook não configurado."}` | `CMS_GITHUB_WEBHOOK_SECRET` ou `VERCEL_DEPLOY_HOOK_URL` ausentes |
| `500` | Exceção não tratada | Body não é JSON válido, ou `fetch` lançou erro de rede |

## Como testar e simular

### Limitação do Redeliver

O botão **Redeliver** no GitHub reproduz o request **idêntico** ao original:
mesmo payload, mesmo `ref`, mesmos headers. Não dá pra escolher branch.
Se a entrega original foi de um push em `develop`, redeliver sempre envia
`refs/heads/develop` → sempre "Branch ignorada".

### Simulação com curl + openssl

Para testar um push em `master` sem depender de um push real, calcule o HMAC
manualmente e envie o request **para o app que você quer testar** (repita para
cada um, trocando o domínio e o `.env` de origem do secret):

```bash
# Exemplo para o app minimalist — repita trocando o domínio/path do .env para gamified/pro
SECRET="$(grep -m1 CMS_GITHUB_WEBHOOK_SECRET apps/minimalist/.env | cut -d= -f2-)"

PAYLOAD='{"ref":"refs/heads/master"}'
SIG="sha256=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | awk '{print $2}')"

curl -X POST "https://minimalist.antoniomascarenhas.com.br/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIG" \
  -d "$PAYLOAD"
```

**Atenção:** isso dispara o Deploy Hook real daquele app → um build novo na Vercel.

### Push real

A forma mais fiel: fazer um push em `master` no repo `portfolio-cms`
(merge de develop, por exemplo). É o fluxo que rodaria em produção.

## Diagnóstico e observabilidade

### 1. O request chegou na rota `/api/revalidate`?

**GitHub (fonte mais direta):**

`portfolio-cms` → Settings → Webhooks → hook ativo **do app em questão** → **Recent Deliveries**.
Cada entrega mostra:
- Aba *Request*: headers (`X-GitHub-Event`, `Content-Type`), payload bruto.
- Aba *Response*: status HTTP e corpo da resposta da rota.

**Vercel Functions:**

Dashboard do projeto → **Deployments** → deployment de produção → aba
**Functions** → `api/revalidate` → invocações e logs por chamada. Ou o
painel **Logs** (Runtime Logs), filtrando pela função.

### 2. A rota acionou o Deploy Hook da Vercel?

O Deploy Hook não tem painel de logs próprio, mas cada POST bem-sucedido
nele cria um deployment novo. Verifique na aba **Deployments** do painel
da Vercel se aparece um deployment novo logo após o push.

Como a rota só chama o hook após validar assinatura **e** branch, um
deployment novo também prova que ambos estavam corretos.

### 3. Tabela de diagnóstico

| Sinal | Significado |
|-------|-------------|
| GitHub mostra status HTTP da rota (200/401/500) | Request chegou na rota |
| GitHub mostra "Invalid HTTP Response: 404" | Nem chegou — domínio/rota inexistente |
| Deployment novo após o push | Hook foi acionado com sucesso |
| Rota 502 e sem deployment novo | Hook não foi acionado (URL expirada/inválida) |
| Rota 401 | Assinatura inválida — verifique o secret no GitHub e na env var |
| Rota 503 | Env vars `CMS_GITHUB_WEBHOOK_SECRET` ou `VERCEL_DEPLOY_HOOK_URL` ausentes |
| Rota 500 | Body não é JSON (verifique Content-Type) ou erro de rede no fetch |

## Fallback manual

Se qualquer peça dessa cadeia falhar silenciosamente (webhook não disparou,
secret expirou, etc.) **para um app específico**, dá pra forçar o rebuild
daquele app sem depender de nenhuma delas:

- Painel da Vercel → projeto daquele app → aba **Deployments** → **Redeploy**
  no último deployment, ou
- `curl -X POST $VERCEL_DEPLOY_HOOK_URL` (daquele app) direto no terminal.

Os dois disparam exatamente o mesmo build que o webhook daquele app dispararia.
Como os 3 apps são independentes, um problema de webhook em um deles não afeta
os outros dois.
