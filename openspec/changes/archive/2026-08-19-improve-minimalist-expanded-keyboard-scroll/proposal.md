## Why

Quando Sobre, Projetos ou Experiência está expandido, as setas `ArrowUp` e `ArrowDown` só deslocam o conteúdo interno se o foco estiver exatamente na região rolável. Isso torna a navegação por teclado inconsistente: o usuário pode estar interagindo com o conteúdo expandido, mas precisa reposicionar o foco manualmente para obter a rolagem esperada.

## What Changes

- Capturar `ArrowUp` e `ArrowDown` enquanto uma área expandida de Sobre, Projetos ou Experiência estiver ativa e encaminhar a intenção de rolagem para o contêiner de conteúdo correspondente.
- Permitir que o conteúdo expandido avance ou recue mesmo quando o foco estiver em outro elemento interativo da expansão.
- Consumir o evento somente quando a área interna puder rolar na direção solicitada; preservar o comportamento de limite e a navegação global quando não houver mais conteúdo nessa direção.
- Manter controles de expansão/recolhimento, foco acessível, navegação circular de Experiência e bloqueios existentes da lista de Projetos.
- Adicionar cobertura E2E com foco fora da região rolável para Sobre, Projetos e Experiência, incluindo limites superior e inferior.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `minimalist-card-flip-expansion`: o conteúdo de um projeto expandido também deve responder às setas direcionais sem exigir foco direto no viewport interno.
- `minimalist-about-section`: o painel expandido da biografia deve responder às setas direcionais enquanto permanecer ativo, independentemente do foco estar no viewport de texto.
- `minimalist-recruiter-experience`: a descrição expandida da experiência deve responder às setas direcionais enquanto o painel estiver ativo, independentemente do foco estar no campo rolável.

## Impact

- Afeta a lógica de teclado e referências aos contêineres roláveis em `src/features/minimalist/`, incluindo os componentes/hooks das expansões de Sobre, Projetos e Experiência.
- Afeta os testes E2E em `e2e/` para validar interação real por teclado e não altera APIs externas, CMS, dados de portfólio ou o modo Gamified.
- Não introduz dependências novas; a implementação deve reutilizar o contrato de limites de rolagem já usado pelas áreas expandidas.

## Non-goals

- Não alterar a ordem das seções, a navegação global por wheel ou a navegação circular da lista de Experiência.
- Não transformar as setas em navegação global quando houver conteúdo interno disponível para rolagem.
- Não modificar a rolagem touch, a aparência dos gradientes, o layout FLIP ou o conteúdo fornecido pelo CMS.
