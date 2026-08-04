## Why

O relatório de auditoria encontrou dependências sem uso confirmado, exports possivelmente mortos, documentação incompatível com a estrutura atual e assets estáticos que não podem ser classificados sem consultar o CMS. A limpeza agora reduz manutenção e evita remover arquivos ainda consumidos dinamicamente.

## What Changes

- Validar `playwright` e `dotenv` contra scripts, configurações e histórico operacional; remover somente dependências sem consumidor confirmado.
- Revisar os exports mortos identificados (`HOVER_SHIFT_X_VARIANT`, `parseWikiLinks` e `SkillList`) e remover apenas símbolos sem contrato externo ou uso legítimo.
- Reescrever o `README.md` para refletir Next.js 15, App Router com `[locale]`, CMS via GitHub, rotas reais, `.env.sample`, Node 24 e pnpm 9.
- Atualizar `docs/accessibility.md` para refletir `upscale`, caminhos atuais, componentes e comportamento implementados.
- Consultar o conteúdo alcançável do repositório `portfolio-cms` para verificar referências aos assets em `public/`; registrar a decisão por asset e remover somente os comprovadamente órfãos.
- Executar as verificações disponíveis e registrar limitações ambientais, especialmente quando Node 24 for necessário.

## Non-goals

- Não alterar comportamento funcional, layout, contratos de CMS, rotas públicas ou preferências de acessibilidade.
- Não remover assets com referência possível no CMS sem evidência conclusiva.
- Não corrigir novos problemas de acessibilidade, SEO ou arquitetura descobertos incidentalmente; eles devem virar mudanças separadas.
- Não alterar arquivos históricos em `openspec/changes/archive/`.

## Capabilities

### New Capabilities

Nenhuma. Esta é uma limpeza de tooling, código não utilizado e documentação, sem mudança de comportamento especificável.

### Modified Capabilities

Nenhuma.

## Impact

- Código: `src/features/gamified/animations.ts`, `src/lib/github-cms/parse-wikilink.ts`, `src/features/gamified/components/skill-list.tsx` e eventuais consumidores descobertos na validação.
- Documentação: `README.md` e `docs/accessibility.md`.
- Dependências: `package.json` e `pnpm-lock.yaml`, somente se a validação confirmar remoção.
- Assets: arquivos sob `public/portfolios/gamified/` e `public/antonio-pixel-art-250x250.jpeg`, somente após confronto com o CMS e referências locais.
- Verificação externa: repositório público `antonionarcilio/portfolio-cms`, branch `master`, especialmente o grafo iniciado em `content/index.md`.
