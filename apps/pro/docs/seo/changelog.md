# Changelog de SEO — apps/pro

## 2026-11-15 (3) — Revisão página a página: Sobre, Projetos, Contato e projetos
- **Achados resolvidos:** `jsonld_missing` (Projetos, Contato), `heading_skip` H1→H3 (Projetos), `description_duplicate` (projetos), `title_length`/`description_length` (Sobre, Contato), e-mail com `mailto:` no JSON-LD.
- **Arquivos modificados:** `messages/{pt-BR,en}.json`, `src/app/[locale]/{about,contact,works,works/[slug]}/page.tsx`, `src/features/works/{project-list-card,cms-project-card,projects-section}.tsx`, `src/shared/utils/{build-section-metadata,build-page-metadata,structured-data}.ts`; novo `src/shared/utils/project-seo.ts`; `docs/seo/keywords.json`.
- **O que mudou e por quê:**
  - Meta `keywords` e listas de palavras-chave por página (`keywords.json`), lidas pela skill nas próximas auditorias.
  - JSON-LD: `Person` com `address` (de `location` do CMS) e e-mail puro; `CollectionPage` + `ItemList` em Projetos; `ContactPage` em Contato; `BreadcrumbList` nos projetos.
  - Cards de projeto aceitam `headingLevel`: H2 em `/works` (antes H3 direto sob o H1), H3 mantido em "Veja também".
  - Descriptions dos projetos = "{nome}: {excerpt}", pois o `excerpt` do CMS se repete entre site/blog.
- **Validação:** `typecheck` e `lint` passam; reauditoria contra o `next dev` (26 páginas, 0 Crítica, 0 Alta). **Build de produção não validado nesta rodada** (colide com o `next dev` aberto; rodar com o dev parado).
- **Pendências / ações humanas:** ver `audit.md` (redirect do `www`, `company` no CMS, Search Console, volume de busca).

## 2026-11-15 (2) — Palavras-chave, titles e descriptions ajustados
- **Achados resolvidos:** `title_length` (about/contact), `description_length` (contact).
- **Arquivos modificados:** `messages/{pt-BR,en}.json`, `src/app/[locale]/page.tsx`, `src/app/[locale]/about/page.tsx`, `src/shared/utils/build-page-metadata.ts`; novo `docs/seo/keywords.json`.
- **O que mudou:**
  - Titles internos passam a `{seção} — {name}, {role}` (nome e papel vêm do CMS); description da home = H1 + "Veja um pouco da minha trajetória, projetos e como entrar em contato comigo."; description de contato ampliada (>120).
  - Meta `keywords` na home (13 termos por idioma, lista em `keywords.json`).
- **Validação:** typecheck, lint e build ok; reauditoria local com `--keywords-file`: nenhum `title_length`/`description_length`.
- **Pendências:**
  - Palavra-chave principal "engenheiro de software" (pt) ainda não aparece no title, na description nem no H1 da home. O papel no CMS vai mudar para "Frontend Software Engineer": reauditar quando mudar e rever a principal (mantida por decisão do usuário).
  - Pesquisa de volume de busca não obtida: conferir Google Trends/Search Console.
  - Termos de serviço (criação de sites/sistemas) não aparecem no conteúdo visível.

## 2026-11-15 — Metadados completos, sitemap e JSON-LD
- **Achados resolvidos:** `title_missing`, `description_missing`, `canonical_missing`, `og_*_missing`, `twitter_card_missing`, `favicon_missing`, `not_in_sitemap`, `og_url_missing`, hreflang duplicado.
- **Arquivos modificados:** `messages/pt-BR.json`, `messages/en.json`, `src/i18n/routing.ts`, `src/app/sitemap.ts`, `src/app/[locale]/{layout,page}.tsx`, `src/app/[locale]/{about,works,contact}/page.tsx`, `src/app/[locale]/works/[slug]/page.tsx`.
- **Arquivos novos:** `src/shared/utils/{build-page-metadata,build-section-metadata,structured-data}.ts`, `src/shared/components/json-ld-script.tsx`.
- **O que mudou e por quê:**
  - Todas as páginas agora têm title, description, canonical, hreflang (+ `x-default`), Open Graph e Twitter, para snippets e previews de compartilhamento corretos.
  - `metadataBase`, ícones e robots ficam no layout raiz (antes só a home os tinha).
  - Sitemap passou de 2 para 26 URLs, com alternates por idioma.
  - `alternateLinks: false` evita hreflang duplicado entre o HTML e o cabeçalho `Link`.
  - JSON-LD em grafo (`WebSite`, `Person`, `ProfilePage`, `CreativeWork`) com `@id` estáveis.
- **Validação:** `typecheck`, `lint` e `build` do app `pro` passam (Node 24.19.0); reauditoria local: 0 Crítica, 0 Alta.
- **Pendências / ações humanas:** redirect do `www` (307 → 308) na Vercel; excerpts duplicados/longos no CMS; reauditar em produção após o deploy e reenviar o sitemap no Search Console.
