## Why

O portfolio minimalista já possui os componentes estruturais, mas a implementação ainda precisa ser tratada como um sistema visual fiel ao protótipo: tokens, tipografia, paleta, geometria e estados precisam estar centralizados e verificáveis antes da composição das telas do recrutador.

## What Changes

- Consolidar os componentes minimalistas existentes em uma feature isolada, sem dependência visual do `gamified`.
- Ajustar tokens de JetBrains Mono, tamanhos 12/14/16 px, cores claro/escuro, bordas, opacidades, espaçamentos e foco conforme a referência Figma capturada.
- Completar as variantes e estados de `switch-btn`, `i18n-toggle`, `on-off-toggle`, `pagination-btn`, `card`, `divider`, `navigation-hint`, `step`, `pagination`, `section-switch`, `a11y-trigger` e links/ações.
- Garantir que os componentes usem os assets locais existentes e mensagens localizadas próprias do namespace `minimalist`.
- Manter a rota temporária de showcase apenas como superfície de validação dos componentes; as telas do recrutador serão tratadas em `minimalist-recruiter-screens`.
- Registrar a referência Figma usada na implementação e evitar novas leituras MCP idênticas.

## Non-goals

- Não implementar as telas completas do modo recrutador.
- Não implementar o modo cliente.
- Não alterar o CMS, a rota gamificada ou os contextos compartilhados do gamified.
- Não fazer download ou substituir assets locais já existentes.
- Não chamar o Figma durante runtime.

## Capabilities

### New Capabilities

- `minimalist-component-system`: fornece os componentes, tokens visuais, variantes, estados e contratos de acessibilidade do layout minimalista.
- `minimalist-component-showcase`: disponibiliza uma rota temporária para revisar visualmente todas as famílias de componentes nos locales suportados.

### Modified Capabilities

- Nenhuma.

## Impact

- Código em `src/features/minimalist/` e na rota temporária `src/app/[locale]/portfolios/minimalist/`.
- Importação de stylesheet de feature em `src/app/globals.css`.
- Mensagens em `src/messages/en.json` e `src/messages/pt-BR.json` sob `minimalist`.
- Reuso de assets em `public` e `src/_assets`, sem alteração do pipeline CMS.
- Validação por format, lint, typecheck, build e inspeção visual contra a referência capturada.
