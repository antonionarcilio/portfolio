## Why

O projeto precisa validar a linguagem de efeitos sonoros em uma superfície pequena antes de expandi-la para todos os controles do layout Minimalist. O menu de acessibilidade é um bom experimento porque já possui uma seleção navegável por scroll e teclado, mas ainda não dispõe de uma forma centralizada de carregar, escolher, reproduzir e desativar sons.

## What Changes

- Criar um componente/controlador interno de efeitos sonoros para o Minimalist, baseado nos arquivos existentes em `src/_assets/sounds`.
- Expor catálogo de sons, seleção do som ativo e controles internos de `play`, `pause` e `stop`, sem depender de uma biblioteca externa.
- Integrar `plastic-bubble-click.wav` à navegação do seletor do menu de acessibilidade (scroll e teclado), reproduzindo o efeito quando cada mudança de item for efetivada.
- Adicionar "Efeitos sonoros" como uma nova opção navegável na lista existente do menu de acessibilidade, com título e descrição próprios, alternada pelos mesmos controles YES/NO e pelo mesmo scroll/teclado circular com limiar de pressão das demais opções, persistida junto às preferências do Minimalist e habilitada por padrão.
- Bloquear "Efeitos sonoros" em viewports com largura menor ou igual a `32rem`: a opção permanece visível na lista, mas fica desabilitada (sem permitir ativação/desativação) e nenhum áudio é reproduzido nesse viewport, independentemente do valor persistido.
- Manter a integração isolada de `src/features/minimalist/`, sem alterar o layout gamificado ou aplicar sons globalmente nesta etapa.

## Non-goals

- Adicionar sons a botões, toggles, dropdowns ou outros controles fora do menu de acessibilidade.
- Alterar a aparência, a ordem ou a interação visual das cinco opções de acessibilidade já existentes, além da inclusão da nova opção de efeitos sonoros na mesma lista circular.
- Adicionar dependências externas de áudio ou buscar arquivos sonoros remotamente.
- Definir a implementação final de áudio para todas as telas do portfólio.

## Capabilities

### New Capabilities

- `minimalist-sound-effects`: catálogo local e controlador reutilizável para selecionar e controlar efeitos sonoros do layout Minimalist.

### Modified Capabilities

- `minimalist-a11y-panel`: tocar o efeito sonoro configurado quando a seleção do item mudar por scroll ou por teclado, expor "Efeitos sonoros" como uma sexta opção navegável da lista, com o mesmo mecanismo circular de pressão e os mesmos controles YES/NO das demais opções, e bloquear essa opção em viewports mobile (≤ `32rem`).

## Impact

- Afetará os componentes, hooks, tipos e preferências em `src/features/minimalist/`, além dos textos correspondentes em `src/messages/en.json` e `src/messages/pt-BR.json`.
- Usará os arquivos WAV já presentes em `src/_assets/sounds`, com `plastic-bubble-click.wav` como som inicial do experimento.
- Não requer mudanças de API, CMS ou dependências de produção.
- A validação deverá cobrir comportamento com scroll/teclado, preferência persistida, bloqueio em viewport mobile, nomes acessíveis, ausência de alteração no gamified e checks de formato, tipos e lint.
