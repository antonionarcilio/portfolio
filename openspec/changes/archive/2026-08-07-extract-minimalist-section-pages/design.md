## Context

Conforme `proposal.md`, `src/features/minimalist/components/recruiter.tsx` reúne o shell do modo recruiter e quatro implementações de seção. O futuro modo cliente deverá compartilhar o shell, mas usar outra composição: Sobre e Projetos permanecem, Experiência é substituída por Serviços e Educação/Formação é substituída por Contato. A refatoração deve preparar essa separação sem implementar o modo cliente e deve manter o contrato atual de `MinimalistRecruiter`, os dados `PortfolioData`, as traduções, os hooks Minimalist e as classes existentes.

## Goals / Non-Goals

**Goals:**

- Criar `src/features/minimalist/components/section.tsx` como módulo de apresentação das seções compartilháveis do modo recruiter.
- Mover para esse módulo `AboutPage`, `ExperiencePage`, `ProjectsPage`, `EducationPage`, `EmptyState`, `period` e os tipos diretamente necessários, distinguindo conceitualmente seções reutilizáveis e específicas do Recruiter.
- Deixar `src/features/minimalist/components/recruiter.tsx` responsável pela composição do shell, navegação, estado compartilhado e renderização de `MinimalistRecruiter`.
- Manter as seções reutilizáveis separadas da composição atual, de forma que a futura composição Client possa importar Sobre e Projetos e trocar Experiência por Serviços e Educação/Formação por Contato. A generalização completa do shell será decidida na change do modo Client.
- Tornar explícitas via props as dependências que cada seção recebe, evitando estado global ou acoplamento ao componente recruiter.
- Preservar nomes de classes, atributos acessíveis, efeitos sonoros, animações FLIP, rolagem, expansão e contratos de tradução.

**Non-Goals:**

- Não criar uma abstração genérica de página para além das quatro seções atuais.
- Não implementar o modo Cliente, seus dados, mensagens ou as seções Serviços e Contato.
- Não mover estilos para outro arquivo nem renomear classes CSS.
- Não alterar o conteúdo do CMS, mensagens, rotas ou o layout Gamified.

## Decisions

1. **Usar `section.tsx` como módulo de seções.**
   O arquivo é específico da feature e representa melhor a responsabilidade extraída do que um módulo utilitário genérico. `sections.tsx` seria uma alternativa válida, mas o nome singular alinha o módulo ao conceito de composição de uma seção e mantém o escopo claro.

2. **Manter as seções como componentes nomeados e preservar seus contratos.**
   `AboutPage`, `ExperiencePage`, `ProjectsPage` e `EducationPage` continuam componentes internos ao módulo, recebendo dados, aparência, traduções e callbacks por props. As seções que não dependem da identidade do Recruiter devem permanecer reutilizáveis; Experiência e Educação/Formação ficam identificadas como slots específicos que o futuro Client poderá substituir. Isso reduz o risco de regressão e evita transformar a refatoração em uma mudança de API pública.

3. **Separar as implementações de seção da composição Recruiter.**
   A seleção da seção, o footer, o wheel global, o painel de acessibilidade, a troca de locale/tema e os estados que coordenam o shell permanecem em `recruiter.tsx` nesta change. As páginas recebem apenas os valores e callbacks necessários para renderizar seu estado atual, enquanto `section.tsx` se torna o ponto de reuso de Sobre e Projetos para o futuro Client. A eventual extração de um shell genérico será avaliada separadamente.

4. **Mover dependências junto com a implementação que as usa.**
   Imports de `ExperienceEntry`, hooks de card/FLIP/som e componentes de conteúdo permanecem em `section.tsx` quando usados pelas páginas extraídas. Imports exclusivos do shell permanecem em `recruiter.tsx`; imports compartilhados serão ajustados pelo formatter/linter.

5. **Preparar reuso de seções sem antecipar o modo cliente.**
   A extração deve remover o acoplamento desnecessário entre as implementações reutilizáveis e o Recruiter, mas não deve introduzir componentes vazios, mensagens provisórias ou contratos de dados para Serviços/Contato. A futura inclusão do Client, incluindo eventual shell genérico, será uma change própria.

6. **Validar equivalência estrutural e estática.**
   A implementação deve confirmar que `recruiter.tsx` não contém mais as definições das páginas e que o novo módulo compila. A validação inclui `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint` e `git diff --check`, sem exigir alteração de testes funcionais.

## Risks / Trade-offs

- **[Risco]** Uma dependência de hook/ref pode ser esquecida durante a extração e causar erro de compilação ou mudança de foco/scroll. → **Mitigação:** manter os contratos de props atuais, revisar todos os imports e executar typecheck/lint antes de concluir.
- **[Risco]** Uma mudança acidental no JSX pode alterar aria/inert, classes ou comportamento de expansão. → **Mitigação:** mover os blocos sem reescrever sua estrutura e comparar o diff, além de executar `git diff --check` e testes focados disponíveis.
- **[Trade-off]** `section.tsx` continuará contendo mais de uma seção porque o objetivo é separar páginas do shell, não criar muitos arquivos pequenos. → **Mitigação:** manter funções curtas e extrair novos módulos somente quando surgir uma responsabilidade independente real.
- **[Risco]** A preparação para múltiplos modos pode virar uma abstração prematura e dificultar o Recruiter atual. → **Mitigação:** introduzir somente o módulo de seções reutilizáveis; a modelagem completa dos modos e a eventual generalização do shell ficam para a change do Client.

## Migration Plan

1. Criar o módulo `section.tsx` e mover as definições das páginas, tipos e helpers necessários, separando seções reutilizáveis das específicas do Recruiter.
2. Ajustar `recruiter.tsx` para importar o módulo e conservar somente shell, estado compartilhado, navegação e composição da sequência Recruiter.
3. Confirmar que a fronteira do módulo permite ao futuro Client reutilizar Sobre e Projetos e trocar Experiência/Educação por Serviços/Contato, sem implementar esses componentes ou generalizar o shell nesta change.
4. Rodar format, typecheck, lint e verificação de diff; corrigir apenas problemas introduzidos pela refatoração.

Rollback: reverter os dois arquivos de código da extração; não há migração de dados, dependência externa ou alteração de contrato de runtime.
