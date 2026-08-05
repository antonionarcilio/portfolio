## Why

A seção “Sobre” atualmente não reproduz com fidelidade o artboard `2097:20729` do protótipo Minimalist e mistura header, conteúdo e footer dentro do fluxo de cada tela. Este change estabelece a primeira seção como uma página visualmente fiel ao Figma, com navegação persistente e o conteúdo central como única área deslizável.

## What Changes

- Reconstruir a seção “Sobre” do modo recrutador a partir do artboard `2097:20729`.
- Tornar header/navbar e footer persistentes durante a navegação; somente a área central de conteúdo deverá deslizar.
- Reproduzir a composição, espaçamentos, tipografia, cores, controles, paginação lateral e links do protótipo.
- Usar os dados reais já fornecidos pelo CMS para nome, cargo, biografia, localização e contatos.
- Manter o botão `VER MAIS` visível, porém desabilitado enquanto a animação flip/expansão não for implementada.
- Corrigir os componentes existentes de header, footer, controles e conteúdo sem alterar o layout gamificado.
- Validar a seção em viewport equivalente ao artboard e em desktop responsivo usando o Chrome MCP.

## Non-goals

- Implementar a animação flip ou a expansão da biografia.
- Implementar o modo cliente.
- Reconstruir as seções Experiências, Projetos ou Formação neste change.
- Alterar a origem dos dados do CMS ou criar conteúdo editorial hardcoded.
- Alterar qualquer tela ou componente exclusivo do portfólio gamificado.

## Capabilities

### New Capabilities

- `minimalist-about-section`: seção “Sobre” do modo recrutador com shell persistente, conteúdo central fiel ao Figma, dados CMS e navegação visual entre seções.

### Modified Capabilities

- Nenhuma.

## Impact

- Componentes e estilos em `src/features/minimalist/`.
- Mensagens localizadas em `src/messages/en.json` e `src/messages/pt-BR.json`.
- Rota `src/app/[locale]/portfolios/minimalist/` apenas no modo recrutador.
- Possível uso do asset de perfil já disponível em `public/images/`.
- Nenhuma API, contrato do CMS ou dependência externa nova.
