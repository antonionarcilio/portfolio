# Auditoria de SEO/meta — apps/pro

2026-11-15 · diagnóstico em produção (`https://antoniomascarenhas.com.br`) e reauditoria final contra o `next dev` local (`http://127.0.0.1:3003`) · script `audit_pages.py` da skill `amdev:seo-audit`, com `--keywords-file docs/seo/keywords.json`.

| | Antes (produção) | Depois (local) |
|---|---|---|
| Páginas rastreadas | 30 URLs | 26 |
| Crítica / Alta | 0 / 81 | 0 / 0 |
| Média / Baixa / Info | 134 / 220 / 22 | 69 / 40 / 27 |

O `audit-report.md` desta pasta é o relatório bruto da reauditoria final.

## Estado por página (depois)

| Página | Title | Description | H1 | Canonical/hreflang | OG/Twitter | JSON-LD | Meta keywords |
|---|---|---|---|---|---|---|---|
| Home (`/`, `/en`) | ✓ | ✓ (H1 + frase de trajetória) | ✓ | ✓ | ✓ | WebSite + Person | ✓ (13 termos) |
| Sobre | ✓ | ✓ | ✓ | ✓ | ✓ | ProfilePage + Person (e-mail sem `mailto:`, `address`) | ✓ (6 termos) |
| Projetos | ✓ | ✓ | ✓ | ✓ | ✓ | CollectionPage + ItemList | ✓ (lista da home) |
| Contato | ✓ | ✓ | ✓ | ✓ | ✓ | ContactPage + Person | ✓ (lista da home) |
| `works/[slug]` (9 × 2) | ✓ | ✓ ("{projeto}: {excerpt}") | ✓ | ✓ | ✓ (imagem padrão) | CreativeWork + BreadcrumbList | ✓ (nome, área, tecnologias) |

Faixas adotadas: title 30–65 e description 120–320 caracteres. Todas as páginas estão dentro delas.

## Decisões do usuário
- Textos aprovados: titles `{seção} — {name}, {role}` (nome e papel vêm do CMS), description da home = H1 + "Veja um pouco da minha trajetória, projetos e como entrar em contato comigo.", description de contato ampliada.
- Palavras-chave (em `keywords.json`): lista de 13 termos na home, herdada por Projetos e Contato; lista própria de 6 termos no Sobre (sem "formação"). Principal da home mantida como "engenheiro de software" (decisão do usuário, com o papel do CMS mudando para "Frontend Software Engineer").
- OG image dos projetos: manter a imagem padrão do site por enquanto.
- Pesquisa web: não retornou volume de busca; fica pendente o Google Trends/Search Console.

## Falsos positivos descartados
- `/pt-BR/*` responde 307 para `/*`: é o `localePrefix: 'as-needed'` do next-intl. Intencional.
- `hreflang_no_self` e `sitemap_noncanonical`: o script audita `127.0.0.1` enquanto o canonical aponta para o domínio de produção.
- `title_duplicate` e `h1_duplicate`: é o mesmo projeto em pt-BR e en, ligado por hreflang.
- `keywords_meta_present`: informativo; resultado da meta `keywords` aplicada a pedido (o Google ignora).
- `og_image_size_missing`: restou de um teste com capas do CMS, já revertido; reconfirmar na próxima auditoria.
- `keywords_not_in_head`: heurística sem relevância aqui.

## Pendentes
- **Palavra-chave principal fora de title/description/H1** ("engenheiro de software" em pt-BR; "software engineer" no en só na description/H1): decisão do usuário de manter; reauditar quando o papel mudar no CMS.
- **Termos de serviço** ("criação de sites", "sistemas personalizados") não aparecem no conteúdo visível; exigiria texto novo.
- **`thin_content` em Projetos** (134 palavras): normal para página de índice.
- **CMS:** `company` vale "Escallo" em todos os projetos (a página mostra "Cliente: Escallo", inclusive no da Futurotec); confirmar se é intencional.
- **Vercel (Domains):** `www.antoniomascarenhas.com.br` responde 307; ideal 308/301 para o apex.
- **Validação em produção:** rodar `build` com o `next dev` parado (o build colide com o `.next` do dev) e reauditar após o deploy; reenviar o sitemap no Search Console.
- H1 curto nos projetos ("BI", "Go") e H1 "Olá mundo." no Sobre: design/copy, não alterados.

## Não verificado
Search Console (cobertura, desempenho), Core Web Vitals, rich results, cache de preview do LinkedIn/WhatsApp, volume de busca dos termos.
