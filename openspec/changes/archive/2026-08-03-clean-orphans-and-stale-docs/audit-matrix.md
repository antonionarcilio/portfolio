# Matriz de evidências

Data da verificação: 2026-08-03

## Dependências

| Item | Evidência | Decisão |
|---|---|---|
| `playwright` | Só aparece em `package.json`/`pnpm-lock.yaml`; não há script, workflow, configuração ou código do projeto que o consuma. A geração dinâmica de OG já foi removida pela mudança arquivada de SEO. | Remover |
| `dotenv` | Só aparece em `package.json`/`pnpm-lock.yaml`; o Next carrega `.env` nativamente e não há import, script ou configuração própria usando o pacote. | Remover |

## Exports

| Item | Evidência | Decisão |
|---|---|---|
| `HOVER_SHIFT_X_VARIANT` | Definido em `src/features/gamified/animations.ts`, sem consumidor no repositório. | Remover |
| `parseWikiLinks` | Exportado em `src/lib/github-cms/parse-wikilink.ts`, sem consumidor; o grafo usa apenas `parseWikiLink`. | Remover |
| `SkillList` | Definido em `src/features/gamified/components/skill-list.tsx`, sem consumidor; `SkillListItem` é usado pelo `skill-map.tsx`. | Remover |

## Assets

CMS consultado: `antonionarcilio/portfolio-cms`, branch `master`, commit `928952486bc41d3841f08f636f75c53eec8fdde4`.

O conteúdo de `content/` foi inspecionado como conjunto conservador, incluindo os nós alcançáveis a partir dos roots `content/index.md` e `content/index.en.md`. Os covers atuais usam URLs Cloudinary; não há referências aos caminhos locais abaixo.

| Grupo | Evidência local/CMS | Decisão |
|---|---|---|
| `public/antonio-pixel-art-250x250.jpeg` | O CMS possui um cover Cloudinary com basename semelhante, mas o mapper atual não expõe o campo `cover` para a UI; não há referência ao arquivo local. | Remover |
| `public/portfolios/gamified/achievements/*.png` | Nenhuma referência local ou CMS; os achievements atuais apontam para covers Cloudinary com nomes diferentes. | Remover |
| `public/portfolios/gamified/games-badges/*.png` | Nenhuma referência local ou CMS encontrada. | Remover |
| `public/portfolios/gamified/cursors/hand.svg` | Não aparece nas regras CSS; os demais cursores do grupo são referenciados por `src/features/gamified/styles.css`. | Remover |
| `public/portfolios/gamified/cursors/*.svg` restantes | Referenciados diretamente por `src/features/gamified/styles.css`. | Manter |
| `public/favicon.webp`, `public/og-image.webp` | Referenciados por metadata em `src/app/[locale]/`. | Manter |
