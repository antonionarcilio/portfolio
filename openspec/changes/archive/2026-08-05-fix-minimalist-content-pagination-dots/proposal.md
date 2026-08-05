## Why

O componente de paginação por dots exibido na área de conteúdo, no lado direito do layout Minimalist, não corresponde 1:1 aos componentes `step` e `pagination` definidos no Figma. Ele deve ser corrigido de forma independente da paginação/navegação localizada no footer, que está fora do escopo desta mudança.

## What Changes

- Auditar os nós Figma do componente `step` e da paginação de conteúdo e registrar suas medidas, espaçamentos, tipografia, cores e estados relevantes.
- Ajustar a renderização e os estilos da paginação lateral de dots para reproduzir a geometria e os estados regular, atual e interativo do Figma em light/dark.
- Preservar a seleção da etapa, a indicação semântica do item atual, teclado, foco, locale e responsividade sem alterar a navegação do footer.
- Validar a rota Minimalist com Playwright, usando screenshots e medições dos elementos afetados, e confirmar ausência de overflow e erros no console.
- Manter o layout Gamified e a paginação do footer inalterados.

## Capabilities

### New Capabilities

- `minimalist-content-pagination-dots`: comportamento e fidelidade visual da paginação de dots localizada na área de conteúdo do layout Minimalist.

### Modified Capabilities

- `minimalist-component-system`: atualizar o contrato visual e de interação dos componentes `step` e `pagination` quando usados na paginação lateral de conteúdo.

## Impact

- Afeta somente a feature `src/features/minimalist/`, principalmente o componente de navegação lateral, variantes e `styles.css`, além dos testes Playwright da rota Minimalist.
- Pode exigir ajustes nos seletores/atributos estáveis usados pela validação visual e acessível.
- Não altera CMS, APIs, mensagens fora do namespace Minimalist, a paginação do footer, a rota Gamified ou seus estilos.
- Referências de aceite: [componente step](https://www.figma.com/design/zzGQHeSIvf8Do9rPI2R8w8/Portfolio---Minimalist--Copy-?node-id=2101-1921&t=maxHQ4dvBcMek8Gu-4) e [paginação de conteúdo](https://www.figma.com/design/zzGQHeSIvf8Do9rPI2R8w8/Portfolio---Minimalist--Copy-?node-id=2101-1924&t=maxHQ4dvBcMek8Gu-4).

## Non-goals

- Corrigir, redesenhar ou alterar qualquer paginação localizada no footer.
- Alterar a ordem ou o conteúdo das páginas vindas do CMS.
- Modificar o layout Gamified, suas rotas, componentes ou estilos.
- Introduzir uma nova biblioteca de animação ou usar transições CSS em desacordo com `CLAUDE.md`.
