## Context

`src/features/minimalist/components/navigation.tsx` já possui `Step` e `StepPagination`, enquanto `src/features/minimalist/components/recruiter.tsx` monta a paginação lateral em `.minimalist__side-pagination`. O mesmo conjunto de variantes e estilos também convive com controles de paginação do footer em `src/features/minimalist/components/controls.tsx` e `src/features/minimalist/styles.css`; a implementação precisa separar explicitamente esses dois usos.

As referências de aceite são os nós Figma `2101-1921` (`step`) e `2101-1924` (paginação). A referência capturada em `src/features/minimalist/reference.ts` deve ser reutilizada quando já contiver os dados necessários, evitando leituras repetidas durante a implementação.

## Goals / Non-Goals

**Goals:**

- Fazer a paginação lateral de dots reproduzir a geometria e os estados dos nós Figma nas aparências light e dark.
- Preservar uma única fonte de verdade para página ativa, estado ARIA, foco e seleção por mouse/teclado.
- Diferenciar os seletores/estilos do uso lateral dos estilos e comportamento da paginação do footer.
- Usar Playwright para validar screenshots, bounding boxes, estados, interação, locale, tema, viewport estreito e ausência de overflow/erros.

**Non-Goals:**

- Reestruturar a navegação de seções ou transformar a paginação do footer em carrossel.
- Alterar a origem CMS, a ordem das páginas ou o contrato de outras famílias Minimalist.
- Modificar arquivos de `src/features/gamified/` ou a rota `src/app/[locale]/portfolios/gamified/`.

## Decisions

### 1. Manter `Step` como átomo visual e especializar o agrupamento lateral

O `Step` continuará responsável por um dot e seus estados visuais via CVA. `StepPagination` receberá apenas os ajustes necessários para identificar o contexto de conteúdo e o agrupamento lateral terá um bloco BEM próprio, aplicado em `src/features/minimalist/components/navigation.tsx` e `src/features/minimalist/styles.css`. Isso evita que uma correção de dimensões do dot altere controles do footer por seletores descendentes genéricos.

Alternativa rejeitada: duplicar o componente inteiro para a lateral, pois criaria divergência entre estados, ARIA e tokens.

### 2. Preservar a seleção existente e tornar o estado observável

O índice ativo continuará sendo fornecido pelo recruiter; cada dot interativo seguirá selecionando seu índice e expondo `aria-current="step"` somente no item ativo. Serão adicionados atributos estáveis de teste no contêiner lateral e nos dots, sem duplicar controles no tab order.

Alternativa rejeitada: controlar uma segunda seleção local dentro da paginação, pois isso permitiria que o indicador visual divergisse do conteúdo ativo.

### 3. Reproduzir medidas do Figma com tokens e CSS da feature

Durante a implementação, registrar as medidas verificadas dos nós Figma e traduzi-las nos tokens/variantes Minimalist existentes, mantendo a fonte JetBrains Mono, as roles de aparência e as regras responsivas em `src/features/minimalist/styles.css`. Qualquer ajuste de breakpoint ficará em media query da feature, conforme `CLAUDE.md`.

Alternativa rejeitada: estilos inline ou breakpoints arbitrários no JSX, pois dificultam a manutenção e violam as convenções do projeto.

### 4. Validar primeiro por geometria e depois por interação

O teste Playwright em `e2e/` deverá localizar exclusivamente o contêiner da paginação de conteúdo, medir `getBoundingClientRect()` do grupo e dos dots, comparar dimensões/gaps/posição com os valores registrados do Figma dentro de uma tolerância explícita e capturar screenshots. Em seguida, validará click, Enter/Space, foco, `aria-current`, light/dark, `en`/`pt-BR`, pelo menos 1280x826, 900x800 e viewport estreito, além de `scrollWidth === clientWidth` e ausência de erros no console.

Alternativa rejeitada: confiar apenas em screenshot manual ou snapshot sem interação, pois não comprova seleção, foco, semântica nem isolamento do footer.

### 5. Verificar isolamento como parte do aceite

O teste deverá confirmar que o footer mantém seus seletores, quantidade de controles e comportamento antes/depois da interação lateral, e que a rota Gamified continua carregando sem erros. A implementação ficará restrita a `src/features/minimalist/`, `e2e/` e aos artefatos desta mudança.

### 6. Criar os testes e2e seguindo as convenções do projeto

O teste e2e desta mudança será criado em `e2e/minimalist-content-pagination.spec.ts`, dentro do `testDir` já configurado em `playwright.config.ts` (`baseURL` padrão `http://127.0.0.1:3000`, `webServer` iniciando `npx pnpm dev` e reutilizando servidor ativo, `trace: 'retain-on-failure'`). Executar com `npx playwright test e2e/minimalist-content-pagination.spec.ts`, no padrão do script `test:e2e:minimalist`. Instruções para criar o teste:

1. Importar `{ expect, test, type Page }` de `@playwright/test` e reaproveitar os padrões do spec existente `e2e/minimalist-footer-pagination.spec.ts`: coleta de erros de console com `page.on('console')`, `setViewportSize` fixando cada viewport, `page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' })`, espera das transições e screenshots via `testInfo.outputPath()` com `animations: 'disabled'`.
2. Localizar exclusivamente o contêiner lateral e os dots pelos atributos estáveis definidos na tarefa 1.3, nunca por seletores que possam casar com os controles do footer.
3. Aguardar o carregamento das fontes, medir com `getBoundingClientRect()`/`boundingBox()` e comparar dimensões, gaps e posição aos valores auditados do Figma dentro da tolerância documentada.
4. Validar click, Enter, Space, foco visível, `aria-current`, light/dark, `en`/`pt-BR` e viewports 1280x826, 900x800 e estreito; confirmar `scrollWidth === clientWidth` no shell e ausência de erros de console.
5. Confirmar no mesmo fluxo que a paginação do footer permanece inalterada e a rota Gamified segue funcional.

Alternativa rejeitada: criar o spec fora de `e2e/` ou duplicar helpers entre arquivos, pois a configuração e as convenções já estão centralizadas em `playwright.config.ts` e no spec do footer.

## Risks / Trade-offs

- [Risco] O CMS pode alterar a quantidade de páginas → [Mitigação] derivar a quantidade e os estados do array de páginas em runtime e validar com mais de um total quando possível.
- [Risco] Um seletor compartilhado pode alterar o footer incidentalmente → [Mitigação] usar o bloco lateral dedicado, revisar o diff de `styles.css` e cobrir o footer no Playwright.
- [Risco] Diferenças de fonte/viewport podem gerar pequenas variações de pixel → [Mitigação] aguardar fontes no teste, fixar viewports e usar tolerância documentada apenas para arredondamento do browser.
- [Risco] A referência Figma pode conter estados que não estão capturados localmente → [Mitigação] auditar os dois nós indicados antes de codificar e atualizar somente a referência Minimalist necessária.

## Migration Plan

1. Auditar e registrar as medidas/estados dos dois nós Figma e o contrato atual da paginação lateral.
2. Implementar a separação visual/semântica lateral, mantendo o footer intacto.
3. Adicionar/ajustar os testes Playwright e confirmar as evidências em todos os contextos definidos.
4. Executar format, typecheck, lint, build, validação OpenSpec e `git diff --check`.

Como não há migração de dados ou API, o rollback consiste em reverter os arquivos da feature e os testes desta mudança caso a validação revele regressão.
