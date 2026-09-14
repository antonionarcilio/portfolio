## Context

O painel está implementado em `src/features/minimalist/components/a11y-panel.tsx`, com regras visuais em `src/features/minimalist/styles.css` e cobertura de interação em `e2e/minimalist-a11y-panel.spec.ts`. A proposta modifica somente a composição mobile; a lista circular, as preferências, a internacionalização e o contrato de foco/fechamento existentes devem continuar compartilhados quando aplicável.

## Goals / Non-Goals

**Goals:**

- Reaproveitar a fonte atual de opções e estados, apresentando-a como seções expansíveis em mobile.
- Usar elementos semânticos de disclosure, com relação explícita entre cabeçalho e conteúdo e estado exposto para tecnologias assistivas.
- Manter o plus visualmente à esquerda, o nome à direita e a rotação de 45 graus no estado expandido.
- Condicionar o conteúdo do detalhe ao layout mobile, removendo somente o header `//...` e mantendo descrição, pergunta e controles.
- Isolar as regras responsivas em `src/features/minimalist/styles.css` e manter a interação testável por teclado e clique.

**Non-Goals:**

- Reestruturar a persistência ou a navegação circular das opções.
- Alterar a composição desktop ou criar um novo componente de acessibilidade para o Gamified.

## Decisions

1. **Acordeão controlado pelo estado atual da opção.**
   - A seção aberta será derivada do estado de seleção/expansão já mantido pelo painel, evitando uma segunda fonte de verdade para a funcionalidade ativa.
   - O cabeçalho será um controle semântico de disclosure e indicará `aria-expanded`/`aria-controls`; o conteúdo receberá um identificador estável.
   - Alternativa rejeitada: usar apenas `div` com listeners, pois perderia semântica nativa e exigiria reimplementar teclado e foco.

2. **CSS responsivo sobre a mesma árvore de conteúdo.**
   - O componente conservará a estrutura funcional existente e aplicará a variação mobile por classes BEM e media query em `src/features/minimalist/styles.css`.
   - O header `//...` será ocultado ou não renderizado apenas no contexto mobile, sem remover os dados usados pelo layout desktop.
   - Alternativa rejeitada: duplicar todo o painel em duas árvores independentes, pois aumentaria risco de divergência de labels, estado e acessibilidade.

3. **Indicador plus como estado visual do disclosure.**
   - O mesmo ícone será transformado visualmente com uma rotação de 45 graus quando expandido, mantendo nome acessível que comunique a ação/estado.
   - A transformação deverá respeitar a política de animações do projeto e a preferência de redução de movimento já existente.
   - Alternativa rejeitada: trocar o ícone por outro elemento, pois perderia continuidade visual entre fechado e aberto.

4. **Validação por comportamento observável.**
   - Os testes mobile verificarão ordem visual/semântica do summary, expansão, rotação observável, conteúdo permitido, teclado, foco e ausência de overflow.
   - Os testes desktop e de isolamento do Gamified permanecerão como regressão.

## Risks / Trade-offs

- [Risk] A lista circular existente pode conflitar com a interação de expansão em mobile → limitar a expansão ao cabeçalho da seção e preservar o mecanismo de seleção somente onde ele continuar necessário.
- [Risk] Ocultar o header `//...` apenas por CSS pode deixá-lo exposto a leitores de tela → garantir que o conteúdo removido do mobile não permaneça no fluxo acessível, usando renderização condicional ou atributos semânticos adequados.
- [Risk] A rotação do plus pode ser confundida com animação não suportada → usar a implementação de motion já adotada pelo projeto e validar o estado final também com redução de movimento.
- [Risk] Conteúdo longo pode gerar overflow horizontal em telas estreitas → definir limites e quebra no bloco mobile e validar em viewports estreitas com Playwright.
