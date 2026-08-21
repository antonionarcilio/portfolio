## Why

O portfólio Minimalist precisa de um componente de timeline reutilizável para futuras composições de experiências profissionais. O componente já foi definido no Figma, mas ainda não existe no código, o que impede sua adoção futura sem repetir a implementação visual.

## What Changes

- Adicionar a capacidade `minimalist-timeline` para renderizar uma timeline vertical de experiência.
- Criar os estados visuais ativo e inativo do ponto da timeline.
- Expor uma API tipada e pequena para os anos, estado dos pontos e aparência do tema Minimalist.
- Manter o componente isolado no feature Minimalist, sem integrá-lo às páginas ou ao CMS nesta mudança.
- Incluir uma página de desenvolvimento para validação visual nos dois modos de aparência.
- Reutilizar os tokens e convenções de estilo existentes, sem alterar o comportamento do Gamified.

## Non-goals

- Integrar a timeline à seção Experience ou a qualquer rota existente.
- Buscar dados no CMS, adicionar persistência ou criar comportamento interativo.
- Alterar o componente `Step` existente usado pela navegação/paginação.
- Implementar animações.

## Capabilities

### New Capabilities

- `minimalist-timeline`: componente visual reutilizável para representar uma experiência entre dois anos com pontos ativo/inativo e linha vertical.

### Modified Capabilities

- Nenhuma.

## Impact

- Código novo em `src/features/minimalist/components/` e estilos em `src/features/minimalist/styles.css`.
- Possível extensão de tipos e variantes compartilhados pelo feature Minimalist.
- Nenhuma nova dependência, alteração de API externa, mudança de CMS ou alteração de rota.
