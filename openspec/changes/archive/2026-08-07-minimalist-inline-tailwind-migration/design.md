## Context

Conforme a proposta, o Minimalist concentra responsabilidades simples e complexas em `src/features/minimalist/styles.css`. O arquivo contém tokens, estados, responsividade e efeitos que devem permanecer, mas também contém muitos `display`, alinhamentos, gaps e espaçamentos locais que podem ser lidos diretamente na marcação. Os componentes e variantes vivem em `src/features/minimalist/components/` e `src/features/minimalist/variants.ts`; a rota consumidora está em `src/app/[locale]/portfolios/minimalist/`.

## Goals / Non-Goals

**Goals:**

- Tornar explícita e aplicável a fronteira entre JSX/Tailwind, CVA e CSS complexo.
- Migrar os estilos simples sem uma grande reescrita simultânea.
- Reduzir seletores CSS que só repetem utilities locais.
- Preservar tokens, geometria visual, responsividade, acessibilidade, Framer Motion e isolamento do Gamified.

**Non-Goals:**

- Reprojetar o Minimalist ou alterar sua aparência intencionalmente.
- Migrar breakpoints responsivos para JSX.
- Criar um sistema de layout compartilhado entre Minimalist e Gamified.
- Trocar animações CSS/da plataforma existentes por uma nova abordagem nesta mudança.

## Decisions

### 1. Migrar por famílias visuais e não por propriedade global

Cada lote tratará uma família coesa — primitives de controle, shell/header/footer, conteúdo recruiter, cards/projetos e painéis — para que o diff e a validação visual tenham uma causa clara. A alternativa de remover todas as declarações `display`/`gap` por busca global é rejeitada porque quebraria geometrias compostas e regras que dependem de estado ou breakpoint.

### 2. Classificar antes de mover

Antes de editar um componente, cada declaração será classificada como:

- utility local simples: mover para `className` com Tailwind;
- variante de design: manter como classe produzida por CVA;
- regra contextual/complexa: manter em `src/features/minimalist/styles.css`;
- regra responsiva: manter em media query da feature;
- token ou valor de referência: manter como custom property, usando-o nas regras apropriadas.

Classes BEM continuarão existindo quando carregarem comportamento visual semântico ou forem âncoras necessárias para media queries. A migração não renomeará classes apenas por estética.

### 3. Manter CVA co-localizado com a API do componente quando possível

Variantes específicas continuarão em `src/features/minimalist/variants.ts` ou no arquivo do componente, conforme o padrão já existente. Não será criado um mapa paralelo para substituir CVA. `clsx` continuará limitado à composição de classes runtime não representáveis como variante.

### 4. Usar validação por lote

Cada lote será formatado e verificado com `npx pnpm typecheck`, `npx pnpm lint` e `git diff --check`, além de testes Playwright/inspeção visual focados nos componentes afetados. A rota Minimalist será conferida nos estados light/dark, viewport estreito, foco de teclado, locale e ausência de overflow quando aplicável; a rota Gamified será usada como regressão quando houver impacto global.

### 5. Documentar a regra no contrato do repositório

`CLAUDE.md` receberá uma subseção próxima às regras de CSS/BEM explicando a divisão operacional. A documentação proibirá apenas a duplicação de utilities simples em CSS; não proibirá CSS necessário para media queries, tokens, pseudo-elementos, estados, temas e composições complexas.

## Risks / Trade-offs

- [Risco] Mover `gap`/alinhamento pode alterar a geometria por diferenças de precedência ou ordem das classes → [Mitigação] migrar uma família por vez, medir/inspecionar os estados afetados e remover CSS redundante somente após a validação.
- [Risco] Uma regra aparentemente simples pode ser necessária em um breakpoint ou estado → [Mitigação] classificar o seletor completo antes de mover e manter no CSS qualquer dependência contextual.
- [Risco] A redução do CSS pode levar à perda de âncoras BEM usadas por media queries → [Mitigação] preservar classes semânticas necessárias mesmo quando utilities sejam adicionadas ao elemento.
- [Risco] Mudanças em `globals.css`, documentação ou CSS importado podem afetar o Gamified → [Mitigação] limitar a implementação à feature e executar uma verificação de regressão da rota Gamified.
- [Trade-off] A migração ficará temporariamente híbrida → [Mitigação] registrar o lote atual em `tasks.md` e evitar novas regras duplicadas durante a transição.

## Migration Plan

1. Atualizar a convenção no `CLAUDE.md` e registrar a matriz de classificação no primeiro lote.
2. Migrar primitives e controles reutilizáveis, incluindo suas variantes CVA, removendo somente CSS redundante.
3. Migrar shell, header, footer e navegação, preservando media queries e geometria do viewport.
4. Migrar conteúdo recruiter, cards/projetos e estados de expansão sem tocar na lógica de interação.
5. Migrar painéis de acessibilidade e bio, preservando layering, scroll e gradientes.
6. Fazer uma auditoria final de `styles.css`, utilities no JSX, seletores `.flex` dependentes de CSS e regras duplicadas; executar a matriz completa de validação.

Rollback é por lote: reverter apenas o lote que falhar na validação, mantendo os lotes anteriores comprovadamente compatíveis. Nenhuma migração exige alteração de dados, dependências ou deploy especial.

## Open Questions

Nenhuma decisão necessária permanece aberta para iniciar a implementação.
