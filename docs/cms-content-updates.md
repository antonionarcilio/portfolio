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

## Webhook do GitHub

Configurado no repo `portfolio-cms` → **Settings → Webhooks**:

- Payload URL: `{MY_DOMAIN}/api/revalidate`
- Content type: **`application/json`** (obrigatório — ver "Content-Type" abaixo)
- Evento: `push`
- Secret: mesmo valor de `CMS_GITHUB_WEBHOOK_SECRET`

O GitHub não filtra webhooks por branch (o evento `push` cobre todas as
branches) — o filtro é feito na rota `/api/revalidate`, que só dispara o
Deploy Hook quando a branch do push é `CMS_GITHUB_BRANCH` (default
`master`).

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

## Deploy Hook da Vercel

Configurado no projeto do app → **Settings → Git → Deploy Hooks**. A URL
gerada vai na env var `VERCEL_DEPLOY_HOOK_URL` (no `.env` local e nas env
vars do projeto na Vercel — nunca commitada, ver `.env.sample` pro
placeholder).

Essa URL não tem autenticação própria — qualquer `POST` nela dispara um
build. Por isso só a rota `/api/revalidate` (que já validou a assinatura do
GitHub antes) deve chamá-la; ela nunca deve ser exposta publicamente.

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

Para testar um push em `master` sem depender de um push real, calcule
o HMAC manualmente e envie o request:

```bash
# Defina o secret (mesmo valor de CMS_GITHUB_WEBHOOK_SECRET no .env)
SECRET="$(grep -m1 CMS_GITHUB_WEBHOOK_SECRET .env | cut -d= -f2-)"

PAYLOAD='{"ref":"refs/heads/master"}'
SIG="sha256=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | awk '{print $2}')"

curl -X POST "https://antoniomascarenhas.com.br/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIG" \
  -d "$PAYLOAD"
```

**Atenção:** isso dispara o Deploy Hook real → um build novo na Vercel.

### Push real

A forma mais fiel: fazer um push em `master` no repo `portfolio-cms`
(merge de develop, por exemplo). É o fluxo que rodaria em produção.

## Diagnóstico e observabilidade

### 1. O request chegou na rota `/api/revalidate`?

**GitHub (fonte mais direta):**

`portfolio-cms` → Settings → Webhooks → hook ativo → **Recent Deliveries**.
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
secret expirou, etc.), dá pra forçar o rebuild sem depender de nenhuma
delas:

- Painel da Vercel → projeto → aba **Deployments** → **Redeploy** no último
  deployment, ou
- `curl -X POST $VERCEL_DEPLOY_HOOK_URL` direto no terminal.

Os dois disparam exatamente o mesmo build que o webhook dispararia.
