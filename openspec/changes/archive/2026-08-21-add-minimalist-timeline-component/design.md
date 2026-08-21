## Context

O feature Minimalist já possui tokens, variantes CVA e componentes de navegação em `src/features/minimalist/`. O Figma define `timeline/experience` como uma composição vertical estática com dois anos, uma linha de 1 px e dois pontos de 14 px, enquanto o `Step` existente em `src/features/minimalist/components/navigation.tsx` pertence à paginação e tem contrato diferente.

Arquivos previstos: `src/features/minimalist/components/timeline.tsx`, `src/features/minimalist/variants.ts`, `src/features/minimalist/types.ts`, `src/features/minimalist/styles.css`, `src/app/[locale]/dev/minimalist-timeline/page.tsx` e as mensagens dos dois locales.

## Goals / Non-Goals

**Goals:**

- Disponibilizar uma composição `TimelineExperience` com API tipada e dois estados de ponto.
- Manter o componente presentational, independente de CMS, i18n e navegação.
- Usar tokens Minimalist e classes BEM/CVA compatíveis com a arquitetura existente.
- Validar visualmente os estados e appearances por uma página de desenvolvimento baseada em `src/app/[locale]/dev/minimalist-button/page.tsx`.
- Preservar a distinção entre o step da timeline e o step de paginação.

**Non-Goals:**

- Generalizar a timeline para uma lista de quantidade arbitrária de eventos.
- Adicionar animações, interação, roteamento ou integração com Experience.
- Criar novos tokens globais ou alterar o tema Gamified.

## Decisions

### API mínima e explícita

`TimelineExperience` receberá `startYear`, `endYear`, `activeStep` e `appearance`. `activeStep` será uma união literal (`start` ou `end`), garantindo que exatamente um ponto seja ativo no contrato desta composição do Figma. Os anos aceitarão `string | number` para preservar formatos futuros sem conversão implícita.

Será criado um `TimelineStep` interno com estado `active | inactive`. O `Step` de navegação não será reutilizado porque possui tamanho, variantes e semântica de paginação próprios.

### Variantes no CVA e utilitários Tailwind no JSX

As variantes de aparência/estado serão declaradas em `src/features/minimalist/variants.ts`. Layout, espaçamento, dimensões, tipografia e cores simples serão expressos por classes Tailwind no JSX/CVA. `src/features/minimalist/styles.css` só receberá regras futuras se houver media query, seletor complexo, token ou geometria contextual que não possa ser representado localmente.

Alternativa rejeitada: criar seletores CSS para propriedades simples já cobertas por Tailwind. Isso duplicaria a responsabilidade entre JSX e stylesheet e contrariaria a regra do projeto.

### Tokens existentes

O componente usará aliases/tokens Minimalist já disponíveis para tipografia e foreground/linha. Não serão adicionados tokens roxos baseados na borda tracejada do component-set, pois essa borda é metadado de seleção do Figma e não parte da aparência renderizada do timeline.

### Componente sem montagem de produção

O componente não será montado em uma página de produção. A rota `src/app/[locale]/dev/minimalist-timeline/page.tsx` existirá apenas para inspeção visual local, com os dois appearances e os dois estados ativos.

## Risks / Trade-offs

- [Risco] A API de dois pontos pode não cobrir uma timeline futura com vários eventos → Mitigação: manter a implementação isolada e registrar a generalização como mudança separada quando houver requisito real.
- [Risco] O tema escuro pode exigir contraste diferente do snapshot Figma preto → Mitigação: resolver cores pelos tokens de appearance sem alterar dimensões ou estados visuais.
- [Risco] Ausência de rota torna a validação visual imediata limitada → Mitigação: manter critérios estruturais testáveis e validar no primeiro consumidor real.
