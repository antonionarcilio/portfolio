## Why

O layout Minimalist concentra atualmente grande parte do alinhamento e da composição básica em `src/features/minimalist/styles.css`, apesar de o projeto já adotar Tailwind CSS para utilities locais, CVA para variantes e CSS de feature para regras complexas. Isso dificulta localizar a intenção de cada componente, aumenta a quantidade de seletores BEM para responsabilidades simples e faz com que a convenção definida no `CLAUDE.md` seja aplicada de forma inconsistente.

## What Changes

- Formalizar a regra de que utilities Tailwind simples e locais — como `flex`, `grid`, alinhamento, `gap`, espaçamento, posicionamento simples e dimensões utilitárias — devem ser compostas no JSX.
- Manter em `src/features/minimalist/styles.css` somente tokens, regras responsivas, pseudo-elementos, estados, temas, efeitos visuais e geometrias/composições que não sejam utilities locais simples.
- Migrar o Minimalist incrementalmente, por componente e por área visual, sem reescrever o layout inteiro em uma única etapa.
- Usar CVA para todas as variantes de componentes; usar `clsx` apenas para composição de estado runtime que não seja uma variante de design.
- Remover regras CSS que se tornarem redundantes após a migração, preservando os contratos visuais e acessíveis existentes.
- Atualizar o `CLAUDE.md` para tornar explícita essa divisão e evitar novas regressões arquiteturais.
- Validar cada lote com formatação, typecheck, lint, diff check e testes/checagens visuais focados no Minimalist e regressão do Gamified.

## Non-goals

- Não alterar o layout Gamified, seus componentes, rotas, mensagens ou estilos.
- Não substituir regras responsivas por variantes arbitrárias de breakpoint no JSX.
- Não remover tokens CSS, estados de foco/hover/disabled, temas, gradientes, pseudo-elementos, scroll ou geometria complexa apenas para reduzir o tamanho do `styles.css`.
- Não introduzir uma abstração genérica de layout ou uma biblioteca adicional.
- Não alterar comportamento funcional, conteúdo CMS, navegação, animações Framer Motion ou contratos de acessibilidade do Minimalist.

## Capabilities

### New Capabilities

- `minimalist-style-architecture`: Define a fronteira de responsabilidade entre utilities Tailwind inline, variantes CVA e CSS complexo da feature Minimalist, além do processo de migração incremental e seus critérios de preservação.

### Modified Capabilities

- Nenhuma. As capacidades existentes continuam com os mesmos requisitos de comportamento; esta mudança formaliza a arquitetura de implementação e sua manutenção.

## Impact

- `CLAUDE.md`, para documentar a regra de composição de estilos.
- `src/features/minimalist/components/**/*.tsx`, `variants.ts` e possivelmente componentes que precisem receber classes utilitárias locais.
- `src/features/minimalist/styles.css`, com remoção seletiva de regras simples e preservação de tokens, estados, responsividade e estilos complexos.
- Testes Playwright e verificações visuais focadas no Minimalist; nenhuma alteração esperada em APIs, dependências, CMS ou rotas.
