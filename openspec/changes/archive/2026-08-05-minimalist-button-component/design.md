## Context

O Figma MCP confirmou que `2099:1949` é o component set `button/collapse`, composto por oito variantes: `state=default|hover|focus|disable` em `appearance=light|dark`. O conteúdo é `VER MAIS`, com JetBrains Mono, 14 px, uppercase; os colchetes ficam visíveis em hover/focus. As variantes individuais não registram borda/radius próprios; o outline roxo `#8A38F5`, 1 px tracejado, radius 5 px e padding de 20 px pertencem ao frame do `COMPONENT_SET` usado para inspeção. As cores das variantes são preto/branco em 100%, 70% e 30% conforme estado.

O código atual contém botões nativos espalhados em `src/features/minimalist/components/`, incluindo controles “VER MAIS” em `minimalist-recruiter.tsx`. O objetivo desta mudança é extrair apenas esse contrato para `button.tsx`.

## Goals / Non-Goals

**Goals:**

- Criar o módulo `src/features/minimalist/components/button.tsx` com export nomeado `Button`.
- Representar apenas as oito variantes confirmadas do `button/collapse`.
- Aplicar semântica nativa de botão, foco acessível e disabled sem criar eixos visuais não presentes no Figma.
- Migrar apenas os controles “VER MAIS” equivalentes.

**Non-Goals:**

- Alterar Anchor, Divider, Toggle, Pagination, Card, Navigation ou A11y Trigger.
- Criar suporte visual para ícones, loading, pressed ou múltiplos tamanhos.
- Alterar qualquer código da superfície Gamified.

## Decisions

### Nome e módulo

O componente será exportado como `Button` a partir de `src/features/minimalist/components/button.tsx`. O nome do arquivo segue a convenção kebab-case, enquanto o nome público solicitado permanece exatamente `Button`.

Alternativa considerada: `MinimalistButton` ou `minimalist-button.tsx`. Rejeitada porque o contrato solicitado define o nome do componente como apenas `Button`.

### Estado visual versus estado nativo

Os estados de produção serão derivados de interação nativa (`:hover`, `:focus-visible` e `:disabled`). A matriz de oito variantes poderá ser exibida no showcase/test fixture, mas a API de produção não deve exigir que consumidores falsifiquem `hover` ou `focus`.

### Conteúdo e tradução

O componente receberá o label localizado pelo consumidor e manterá o contrato “VER MAIS”; não terá slots de ícone ou conteúdo arbitrário. Os colchetes serão controlados pelo estilo do estado para reproduzir o Figma, mantendo o nome acessível sem duplicar texto para leitores de tela.

### Migração limitada

Somente os controles “VER MAIS” que correspondem ao `button/collapse` serão migrados. PaginationButton, toggles, anchors, dividers e demais botões continuam com seus próprios contratos até mudanças futuras.

### Validação visual

Usar Playwright para verificar as oito combinações, computed styles, bounding boxes, screenshots, foco por teclado, ativação por Enter/Space e disabled. Validar Minimalist em `en`/`pt-BR`, light/dark, e confirmar isolamento da rota Gamified.

## Risks / Trade-offs

- [Colchetes podem ser anunciados duas vezes por leitores de tela] → manter os colchetes decorativos com `aria-hidden` e usar um nome acessível único.
- [CSS legado pode sobrescrever o Button] → localizar regras agregadas antes da migração e remover somente duplicações do “VER MAIS”.
- [Consumidores podem esperar conteúdo genérico] → manter a API deliberadamente restrita ao contrato `button/collapse` confirmado no Figma.
