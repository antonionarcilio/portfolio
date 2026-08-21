## 1. Contrato e variantes

- [x] 1.1 Definir os tipos públicos da timeline (`startYear`, `endYear`, `activeStep` e `appearance`) em `src/features/minimalist/types.ts` e as variantes CVA de aparência/estado em `src/features/minimalist/variants.ts`.
- [x] 1.2 Revisar os nomes BEM e os estados contra `specs/minimalist-timeline/spec.md`, mantendo o `Step` de navegação inalterado.

## 2. Implementação visual

- [x] 2.1 Criar `src/features/minimalist/components/timeline.tsx` com `TimelineExperience` e o `TimelineStep` interno, renderizando os dois anos, os dois pontos e a linha sem CMS, i18n ou handlers.
- [x] 2.2 Adicionar a geometria do Figma como classes Tailwind no JSX/CVA: composição vertical centralizada, espaçamento de 16 px, item de 230 px, linha de 1 px e pontos de 14 px, usando tokens Minimalist para cores e tipografia.

## 3. Verificação

- [x] 3.1 Executar `npx pnpm format:check`, `npx pnpm typecheck` e `npx pnpm lint`, corrigindo apenas problemas introduzidos pela timeline.
- [x] 3.2 Executar `git diff --check` e revisar que não houve alterações em `src/app/[locale]/`, CMS, mensagens, Gamified ou no `Step` existente.
- [x] 3.3 Validar os estados ativo/inativo, os dois modos de appearance e a preservação dos anos por meio de revisão estrutural e, quando houver consumidor visual, teste real no navegador.

## 4. Página de demonstração

- [x] 4.1 Criar `src/app/[locale]/dev/minimalist-timeline/page.tsx` com base em `minimalist-button/page.tsx`, exibindo os dois appearances e alternando visualmente o ponto ativo.
- [x] 4.2 Adicionar as mensagens de preview em `src/messages/en.json` e `src/messages/pt-BR.json` e validar a página com as verificações do projeto.
