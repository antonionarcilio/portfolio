## Context

O shell atual em `src/features/minimalist/components/recruiter.tsx` mantém um trilho vertical de seções e usa índices limitados de `0` ao último item. O rodapé renderiza todas as opções em `src/features/minimalist/components/navigation.tsx`/`controls.tsx`, mas não desloca o item ativo para o centro. O CSS de `src/features/minimalist/styles.css` já separa header, viewport central e footer, e as animações devem permanecer em Framer Motion conforme `CLAUDE.md`.

## Goals / Non-Goals

**Goals:**

- Fazer a seleção de seção circular, com uma única mudança por gesto de wheel e wrap nos dois endpoints.
- Preservar o trilho de conteúdo centralizado e criar um trilho de opções do rodapé que acompanha/centraliza o item ativo.
- Reproduzir os dois nós Figma fornecidos nos estados light/dark e nos estados interativos relevantes.
- Cobrir mouse, teclado, acessibilidade, locale, tema e responsividade com Playwright.

**Non-Goals:**

- Alterar a estrutura de dados do CMS ou a ordem das páginas.
- Compartilhar código/estilos com Gamified ou modificar sua rota.
- Introduzir CSS keyframes, transições CSS ou outra biblioteca de animação.

## Decisions

### 1. Normalizar o índice em uma função circular

Extrair uma função pequena que converte qualquer índice para `[0, pageCount)`, e fazer wheel, botões e opções do footer passarem pelo mesmo caminho de seleção. Isso evita que cada entrada tenha regras diferentes e remove `disabled` de previous/next por endpoint. A alternativa rejeitada é duplicar as quatro regras de wrap em handlers separados, que tende a divergir entre mouse e teclado.

### 2. Separar seleção lógica de posição visual

Manter `activeIndex` como estado lógico e calcular a posição visual do trilho de conteúdo/rodapé a partir dele. Para o footer, renderizar opções suficientes para permitir vizinhança contínua (por exemplo, cópias modulo do conjunto) ou usar um deslocamento normalizado; a implementação deve escolher a opção que preserva DOM acessível único para o item ativo. A alternativa rejeitada é usar apenas `overflow-x: auto` e depender do scroll nativo, pois isso não garante centralização após wheel ou ativação por teclado.

### 3. Transição visual com Framer Motion

Animar o deslocamento do trilho central e do trilho do footer com `motion` e a curva existente `[0.2, 0.7, 0.2, 1]`. A mudança circular pode saltar silenciosamente a posição clonada durante o wrap ou usar uma sequência equivalente, desde que não exponha um flash de endpoint ao usuário. A alternativa rejeitada é `scroll-behavior`/`transition` CSS, incompatível com as regras de animação do projeto.

### 4. Contrato semântico único

Cada opção visível deverá continuar sendo um controle localizável com label ativa e estado `aria-current`/`aria-pressed` apropriado ao componente. Cópias visuais, se necessárias para o efeito circular, não poderão criar destinos duplicados no tab order nem múltiplos itens anunciados como ativos. A página inativa continuará protegida por `aria-hidden` e `inert`.

### 5. Validação visual e comportamental com Playwright

Adicionar ou estender a configuração/testes Playwright existentes para iniciar a rota Minimalist com dados reais do projeto e validar screenshots dos nós afetados em viewport desktop e estreito, nos dois temas e locales. Os testes também devem medir o centro do item ativo, verificar wrap por wheel/clique/teclado, `scrollWidth === clientWidth` no shell e ausência de erros no console. A alternativa rejeitada é validar apenas com snapshots estáticos, pois o defeito principal é temporal e depende de interação.

## Risks / Trade-offs

- [Risco] A quantidade real de páginas pode mudar com o CMS → [Mitigação] calcular posições e cópias a partir do array em runtime, sem hardcode de quatro páginas.
- [Risco] Cópias visuais podem prejudicar acessibilidade → [Mitigação] manter apenas o conjunto lógico no tab order e testar contagem/estado dos controles com Playwright.
- [Risco] O footer pode ficar apertado em telas estreitas → [Mitigação] usar trilho com clipping controlado, centralização do item ativo e media queries nos estilos da feature; testar pelo menos 1280x826 e 900x800, além de um viewport estreito.
- [Risco] Alterações de geometria podem atingir o showcase de componentes → [Mitigação] verificar a rota de showcase e os componentes isolados após a alteração, preservando os tokens existentes.

## Migration Plan

1. Implementar o novo estado/posicionamento apenas em `src/features/minimalist/` e adicionar os testes Playwright correspondentes.
2. Executar formatação, typecheck, lint, build e validação visual/interativa.
3. Em caso de regressão, reverter os arquivos da feature e os testes da mudança; não há migração de dados nem rollback de API.

## Open Questions

Nenhuma: o comportamento circular, a centralização, as referências Figma, o uso de Playwright e o isolamento do Gamified estão definidos pelo pedido e pelos contratos acima.
