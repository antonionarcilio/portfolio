## Why

O layout minimalista já possui uma base de componentes, mas ainda não apresenta as telas completas do modo recrutador. Este change transforma a base visual em uma experiência navegável por seções de tela cheia, usando o conteúdo real já publicado no CMS e preservando o portfólio gamificado.

## What Changes

- Criar as telas do modo recrutador dentro da rota localizada do portfólio minimalista.
- Compor as seções de apresentação, perfil, experiência, projetos, competências, formação e contato com dados reais de `getPortfolio(locale)`.
- Implementar navegação por scroll entre seções, com cada seção ocupando a viewport e com controles de passo/seleção acessíveis.
- Manter o modo cliente fora deste change, para ser planejado separadamente.
- Integrar a linguagem visual dos componentes estilizados no change `minimalist-portfolio-components` sem compartilhar estilos ou mensagens com `gamified`.
- Validar as telas em `pt-BR` e `en`, em light/dark e em viewport estreito usando Chrome DevTools MCP.

## Non-goals

- Não implementar o modo cliente.
- Não alterar o schema, o pipeline de busca ou o conteúdo do CMS.
- Não substituir ou remover a rota gamificada.
- Não fazer chamadas ao Figma em runtime nem repetir a consulta MCP já capturada para a mesma referência visual.

## Capabilities

### New Capabilities

- `minimalist-recruiter-experience`: define as telas, seções full-screen, navegação e acessibilidade do modo recrutador.
- `minimalist-cms-presentation`: define como os dados reais do portfólio são projetados nas seções minimalistas sem dados fictícios.

### Modified Capabilities

- Nenhuma.

## Impact

- Novos componentes de composição em `src/features/minimalist/`.
- Alterações na rota `src/app/[locale]/portfolios/minimalist/` para substituir o showcase temporário pela experiência do recrutador.
- Novas mensagens em `src/messages/en.json` e `src/messages/pt-BR.json` sob o namespace `minimalist`.
- Reuso de `src/shared/data/get-portfolio.ts` e dos tipos existentes de `PortfolioData`.
- Validação visual e comportamental via Chrome DevTools MCP, sem dependência externa adicional.
