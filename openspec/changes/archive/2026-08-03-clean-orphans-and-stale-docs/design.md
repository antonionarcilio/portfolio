## Context

O relatório e a proposta apontam para uma limpeza transversal de dependências, exports, documentação e assets. O código atual é uma aplicação Next.js 15 com rotas em `src/app/[locale]/`, dados vindos de um CMS Markdown remoto e assets que podem ser referenciados por valor, não por import estático.

Arquivos diretamente envolvidos incluem `package.json`, `pnpm-lock.yaml`, `src/features/gamified/animations.ts`, `src/lib/github-cms/parse-wikilink.ts`, `src/features/gamified/components/skill-list.tsx`, `README.md`, `docs/accessibility.md` e os arquivos sob `public/portfolios/gamified/`.

## Goals / Non-Goals

**Goals:**

- Distinguir dependências e exports realmente mortos de APIs públicas, entrypoints do Next e consumo dinâmico.
- Atualizar a documentação para a estrutura e os contratos atuais.
- Produzir uma decisão auditável por asset, com evidência local e do CMS.
- Manter a mudança reversível e sem alteração funcional.

**Non-Goals:**

- Não modificar componentes, rotas, comportamento de acessibilidade ou o mapper do CMS além da remoção segura de símbolos sem uso.
- Não transformar o endpoint `cms-debug` em mecanismo permanente de inventário de assets.
- Não remover arquivos do CMS remoto.
- Não remover assets quando a referência estiver ausente apenas porque é dinâmica ou indireta.

## Decisions

### 1. Validar dependências em duas camadas

Para `playwright` e `dotenv`, pesquisar usos em `package.json`, lockfile, scripts, configurações, workflows e documentação. Só remover uma dependência quando não houver consumidor confirmado e quando a remoção não quebrar comandos documentados. Se houver uso operacional externo não representado no repositório, registrar a dependência como mantida e atualizar a justificativa.

Alternativa rejeitada: remover automaticamente todos os pacotes sem `import` em `src`, pois ferramentas de build e scripts podem ser consumidos fora do código-fonte.

### 2. Tratar exports como mortos somente sem contrato

Para `HOVER_SHIFT_X_VARIANT`, `parseWikiLinks` e `SkillList`, pesquisar consumidores no repositório inteiro, incluindo documentação, testes, configurações e barrels. Exports usados internamente permanecem exports ou podem virar declarações não exportadas apenas se isso não alterar uma API de módulo legítima. A remoção deve ser acompanhada por typecheck e lint.

Alternativa rejeitada: remover qualquer export com uma ocorrência, porque entrypoints do Next e tipos de extensão podem ser consumidos por convenção.

### 3. Reescrever a documentação a partir do código atual

O `README.md` será refeito usando as rotas reais em `src/app/`, scripts reais do `package.json`, `.nvmrc`, `.env.sample`, `CLAUDE.md` e o fluxo descrito em `docs/cms-content-updates.md`. `docs/accessibility.md` será corrigido contra `src/features/gamified/contexts/a11y-context.tsx`, `src/features/gamified/components/a11y-dropdown.tsx`, os shells compartilhados e `src/features/gamified/styles.css`.

Alternativa rejeitada: corrigir apenas caminhos e nomes pontuais, pois o README contém contratos inteiros de API e CMS que não existem mais.

### 4. Validar assets pelo grafo alcançável do CMS

Antes de classificar qualquer asset como órfão:

1. Enumerar todos os assets candidatos em `public/`.
2. Verificar referências locais literais em código, CSS, documentação e configuração.
3. Ler o conteúdo público de `antonionarcilio/portfolio-cms`, branch `master`, começando em `content/index.md`.
4. Reproduzir a regra de alcance do projeto: seguir somente wikilinks reconhecidos nos frontmatters alcançados, para cada locale relevante.
5. Procurar os caminhos, nomes de arquivo, URLs e campos de cover/icon/cursor no conjunto alcançado.
6. Classificar cada asset como `usado-localmente`, `usado-pelo-CMS`, `não-referenciado` ou `inconclusivo`, registrando o arquivo/campo que sustenta a decisão.

Somente a classe `não-referenciado`, com ausência de dependência operacional conhecida, poderá ser removida. A classe `inconclusivo` será mantida e documentada.

Alternativa rejeitada: usar apenas `rg` no checkout local, porque o mapper em `src/shared/data/map-portfolio.ts` aceita valores de cobertura vindos do CMS.

### 5. Verificação compatível com o ambiente

As verificações finais serão executadas em Node 24 conforme `.nvmrc`: `npx pnpm typecheck`, `npx pnpm lint`, `npx pnpm format:check` e `npx pnpm build`. Se o ambiente não fornecer Node 24, não se deve atribuir falhas internas do Next ao código; o resultado deve ser registrado como bloqueio ambiental e repetido em Node 24.

## Risks / Trade-offs

- [Referência dinâmica de asset não encontrada] → manter o asset como `inconclusivo` e registrar a evidência, sem remoção.
- [Playwright ou dotenv usados por automação externa] → revisar scripts/workflows e documentar a decisão antes de editar `package.json`.
- [Export aparentemente morto usado por importação de pacote] → pesquisar consumidores fora de `src` e preservar a exportação quando houver contrato.
- [README divergir novamente do código] → incluir rotas, scripts e variáveis diretamente conferidos nos arquivos de origem durante a implementação.
- [Node incompatível] → executar a validação final em Node 24 e separar falhas de ambiente de falhas do projeto.

## Migration Plan

1. Registrar a matriz de dependências, exports e assets antes das remoções.
2. Aplicar somente as remoções justificadas e atualizar lockfile quando necessário.
3. Atualizar README e documentação de acessibilidade.
4. Rodar typecheck, lint, format check e build em Node 24.
5. Se uma remoção causar regressão, restaurar somente o item correspondente e marcar a decisão como mantida na matriz; não reverter documentação ou decisões independentes.
