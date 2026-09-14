## Why

O portfólio Minimalist já possui o acionador de acessibilidade, mas ainda não oferece o menu visual proposto no Figma nem uma forma consistente de percorrer suas opções. A nova área deve tornar as preferências de acessibilidade descobríveis, navegáveis e operáveis por mouse, wheel e teclado, preservando a identidade visual do Minimalist.

## What Changes

- Adicionar o painel de acessibilidade do Minimalist conforme os frames Figma `2138:3525`, `2138:3750` e `2138:3757`.
- Exibir uma lista lateral de opções com rolagem circular/infinita, gradientes de suavização no topo e na base e limiar de movimento ("pressão") para confirmar a troca de item.
- Exibir no conteúdo o nome da opção selecionada, sua descrição e a pergunta de ativação com controle YES/NO baseado no componente de toggle já usado por tema, localização e modo.
- Integrar o painel ao `MinimalistA11yTrigger`, com estado visual de abertura, seleção, foco e opção ativa.
- Persistir/aplicar as preferências de acessibilidade através do contrato existente quando disponível, sem alterar o portfólio gamificado.
- Cobrir comportamento, acessibilidade e fidelidade visual com testes Playwright via MCP, incluindo wheel abaixo/acima do limiar, navegação circular, teclado, toggle e breakpoints relevantes.

## Non-goals

- Alterar o layout, componentes ou contexto de acessibilidade do portfólio gamificado.
- Criar novas opções de acessibilidade além das previstas no layout e dos contratos já existentes.
- Substituir o CMS, alterar a rota pública do Minimalist ou introduzir um sistema paralelo de internacionalização.

## Capabilities

### New Capabilities

- `minimalist-a11y-panel`: painel de acessibilidade do Minimalist com lista circular, seleção por pressão, detalhe da opção e ativação YES/NO.

### Modified Capabilities

- Nenhuma.

## Impact

- Afeta `src/features/minimalist/`, especialmente o acionador, controles, tipos, estado do recruiter e stylesheet.
- Adiciona mensagens equivalentes em `src/messages/pt-BR.json` e `src/messages/en.json`.
- Pode reutilizar `MinimalistSwitchBtn`, `circularIndex` e o contrato de estado persistente de acessibilidade, sem nova dependência de runtime.
- A validação deverá usar Node 24 e Playwright MCP, além de lint, typecheck, format check e build proporcionais à implementação.
