# Contract: Webhook `/api/revalidate` (por app)

Endpoint HTTP exposto por cada um dos 3 apps (`apps/<app>/src/app/api/revalidate/route.ts`), consumido pelo webhook configurado no repositório `antonionarcilio/portfolio-cms`. A implementação real vive no pacote (`handleRevalidateWebhook`, ver `portfolio-cms-client.md`); este contrato documenta a superfície HTTP exposta a um sistema externo (GitHub).

## Request

- **Método**: `POST`
- **Header obrigatório**: `X-Hub-Signature-256: sha256=<hmac>` — HMAC-SHA256 do corpo bruto da requisição, usando o segredo configurado (`CMS_GITHUB_WEBHOOK_SECRET` daquele app).
- **Body** (JSON, payload padrão de webhook de push do GitHub): deve conter `ref` no formato `refs/heads/<branch>`.

## Response

| Cenário | Status | Body |
|---|---|---|
| Assinatura ausente/inválida | `401` | — |
| `ref` não corresponde à branch observada (`CMS_GITHUB_BRANCH` daquele app) | `200` | `{ "triggered": false }` |
| Segredo ou URL de deploy hook não configurados naquele app | `503` | — |
| Assinatura válida + branch correta + configuração completa | `200` | `{ "triggered": true }` — e um `POST` é disparado para o Deploy Hook daquele app |

## Redirecionamento de URLs antigas (app `pro`, `next.config.ts` → `redirects()`)

| Origem | Destino | Tipo |
|---|---|---|
| `/portfolios/minimalist/:path*` | `https://minimalist.antoniomascarenhas.com.br/:path*` | 301 |
| `/:locale/portfolios/minimalist/:path*` | `https://minimalist.antoniomascarenhas.com.br/:locale/:path*` | 301 |
| `/portfolios/gamified/:path*` | `https://gamified.antoniomascarenhas.com.br/:path*` | 301 |
| `/:locale/portfolios/gamified/:path*` | `https://gamified.antoniomascarenhas.com.br/:locale/:path*` | 301 |
| `/portfolios` | `/` | 301 |
| `/:locale/portfolios` | `/:locale` | 301 |

## Verificação do contrato

```bash
# Simular webhook localmente (exemplo, ajustar secret/branch do app em teste)
curl -i -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=<hmac-calculado>" \
  -d '{"ref":"refs/heads/master"}'

# Verificar redirects do app pro (produção)
curl -I https://antoniomascarenhas.com.br/portfolios/minimalist/alguma-rota
curl -I https://antoniomascarenhas.com.br/pt-BR/portfolios/minimalist
curl -I https://antoniomascarenhas.com.br/portfolios
```
