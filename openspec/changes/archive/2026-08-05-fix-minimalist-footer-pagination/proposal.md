## Why

O rodapé do layout Minimalist ainda trata a navegação como uma lista linear limitada: o item ativo não permanece centralizado e os limites desabilitam a continuidade esperada pelo design. Isso quebra a correspondência 1:1 com os nós de paginação e rodapé do Figma e torna o scroll wheel inconsistente entre as seções.

## What Changes

- Ajustar o gatilho de paginação e o rodapé para reproduzir geometria, espaçamento, tipografia, estados, cores e indicadores do Figma em light/dark.
- Transformar a navegação de seções em um carrossel/roda contínuo: scroll para cima/baixo e controles anterior/próximo percorrem as opções de forma circular.
- Manter a seção ativa visualmente e semanticamente centralizada no viewport; o item ativo do rodapé deve permanecer no centro do trilho de opções quando a lista for maior que a área visível.
- Preservar navegação por teclado, acessibilidade, localização `en`/`pt-BR` e isolamento completo do layout Gamified.
- Validar o comportamento e a fidelidade visual com Playwright em viewports representativos, incluindo scroll wheel, clique, teclado, temas e ausência de overflow horizontal.

## Capabilities

### New Capabilities

- `minimalist-footer-pagination`: comportamento contínuo e apresentação fiel do gatilho de paginação e do rodapé de navegação do layout Minimalist.

### Modified Capabilities

- `minimalist-recruiter-experience`: altera o contrato de navegação entre seções para suportar rolagem circular e manter a seção ativa centralizada.
- `minimalist-component-system`: altera os requisitos de fidelidade e estados dos componentes `pagination-btn`, `pagination`, `step` e `section-switch` usados no rodapé.

## Impact

- Afeta `src/features/minimalist/components/recruiter.tsx`, `src/features/minimalist/components/navigation.tsx`, `src/features/minimalist/components/controls.tsx`, `src/features/minimalist/styles.css` e mensagens Minimalist se novos rótulos forem necessários.
- Pode exigir ajustes em `src/features/minimalist/variants.ts` e testes/fixtures visuais ou E2E Playwright.
- Não altera APIs externas, CMS, conteúdo, rota Gamified ou seus estilos.
- Referências de aceite: [gatilho de paginação](https://www.figma.com/design/oaRNKV5sEnHE2gffqUbMJl/Portfolio---Minimalist?node-id=2138-3310&t=KnTlVnscoN89Vml1-4) e [rodapé](https://www.figma.com/design/oaRNKV5sEnHE2gffqUbMJl/Portfolio---Minimalist?node-id=2069-379&t=KnTlVnscoN89Vml1-4).

## Non-goals

- Reprojetar ou modificar o layout Gamified.
- Alterar o conteúdo vindo do CMS, a ordem editorial das seções ou a rota pública do portfólio.
- Adicionar uma nova dependência de animação; as animações existentes devem continuar usando Framer Motion.
