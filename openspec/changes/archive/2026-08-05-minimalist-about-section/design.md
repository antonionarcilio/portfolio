## Context

O change substitui a composição atual da seção recrutador por uma implementação guiada pelo artboard Figma `2097:20729`. A rota já recebe `PortfolioData` do CMS e os componentes Minimalist existentes podem ser reaproveitados, mas o shell atual repete header/footer por página e os estilos não preservam a geometria do protótipo.

## Goals / Non-Goals

**Goals:**

- Separar o shell persistente da área central navegável.
- Reusar os controles e componentes Minimalist existentes, corrigindo sua apresentação visual e estados.
- Usar o asset de perfil disponível e os campos de `PortfolioData` sem conteúdo editorial fixo.
- Manter a implementação localizada em `src/features/minimalist/` e as mensagens em `src/messages/`.
- Deixar o botão `VER MAIS` presente, sem ação, até existir uma especificação própria para a animação flip.

**Non-Goals:**

- Não introduzir nova dependência.
- Não alterar o contrato de carregamento do CMS.
- Não compartilhar estilos ou estado com `src/features/gamified/`.
- Não implementar as demais seções nem o modo cliente.

## Decisions

### Shell único com viewport de conteúdo

O componente da rota deverá renderizar um único shell Minimalist com header e footer fora do viewport de conteúdo. A navegação usará uma área central com páginas/estados de seção, mantendo a altura de referência do artboard e permitindo o slide apenas nesse elemento.

Alternativa considerada: manter um header/footer dentro de cada seção e usar scroll-snap na página inteira. Foi descartada porque duplica o shell, faz os controles se moverem e é a causa direta da divergência percebida no protótipo.

### Componentes existentes como primitives visuais

`MinimalistCard`, `MinimalistLink`, `I18nToggle`, `ThemeToggle`, `A11yTrigger`, `StepPagination` e `PaginationButton` serão ajustados/reutilizados como primitives do shell. A geometria será definida em `src/features/minimalist/styles.css` com classes BEM, preservando a isolação da feature.

Alternativa considerada: criar uma segunda família de componentes somente para a seção Sobre. Foi descartada para evitar duplicação e manter os componentes compartilháveis entre as telas Minimalist futuras.

### Conteúdo CMS e estado de expansão

O conteúdo da seção será projetado a partir de `PortfolioData`, incluindo filtragem de contatos opcionais. O botão `VER MAIS` terá estado disabled e callback inerte; o estado de expansão não será implementado nesta etapa.

Alternativa considerada: colocar a cópia observada do Figma diretamente na tela para obter pixel matching. Foi descartada porque violaria a exigência de dados reais e criaria divergência com o CMS.

### Validação visual por viewport de referência

Após a implementação, a rota será validada no Chrome MCP em 1280×826 e em uma largura desktop menor. Serão verificadas geometria do shell, ausência de overflow, visibilidade do conteúdo, estados de tema/locale, navegação por seção e ausência de erros no console.

## Risks / Trade-offs

- [Risco] O conteúdo CMS pode ser maior que a área central do artboard → [Mitigação] limitar a composição visual ao conteúdo real, permitir overflow vertical interno somente na área central e validar com dados atuais de en e pt-BR.
- [Risco] Fixar o shell pode reduzir a área útil em telas menores → [Mitigação] incluir regras responsivas específicas da feature e preservar foco/rolagem acessível.
- [Risco] O botão desabilitado diverge temporariamente da aparência de interação completa → [Mitigação] manter a aparência do protótipo e comunicar o estado via `disabled`, deixando a animação para um change posterior.
- [Risco] Alterações em CSS Minimalist afetarem componentes já usados em outra tela Minimalist → [Mitigação] escopar regras ao shell da rota e validar a rota gamified separadamente.

## Migration Plan

1. Ajustar o shell e a seção Sobre na rota Minimalist.
2. Executar lint, typecheck, format check e build com Node 24.
3. Validar visualmente no Chrome MCP e corrigir divergências de geometria.
4. Em caso de regressão, reverter somente as mudanças em `src/features/minimalist/`, mensagens e asset referenciado; nenhum dado do CMS ou contrato de API será migrado.
