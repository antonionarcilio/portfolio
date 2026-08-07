## Why

`src/features/minimalist/components/recruiter.tsx` atualmente contém tanto a composição e o estado exclusivos de `MinimalistRecruiter` quanto a implementação das páginas individuais do conteúdo. Essa mistura dificulta localizar responsabilidades e também torna mais custosa a futura inclusão do modo cliente, que compartilhará o shell Minimalist, mas substituirá as seções de Experiência e Educação/Formação por Serviços e Contato.

## What Changes

- Extrair `AboutPage`, `ExperiencePage`, `ProjectsPage`, `EducationPage` e os tipos/utilitários necessários para um módulo de seções, preferencialmente `src/features/minimalist/components/section.tsx`.
- Separar no novo módulo as seções reutilizáveis das seções específicas do Recruiter, mantendo Experiência como conteúdo exclusivo do modo Recruiter.
- Estruturar o módulo de seções para que futuros modos possam reutilizar Sobre e Projetos; na futura composição do modo Cliente, Experiência poderá ser substituída por Serviços e Educação/Formação por Contato.
- Manter em `recruiter.tsx` somente o shell e a lógica de composição/navegação do modo Recruiter: estado compartilhado, controles persistentes, aparência, locale, acessibilidade e montagem das seções do Recruiter.
- Atualizar os imports e contratos entre o recruiter e o novo módulo sem alterar o comportamento visual, interativo, acessível ou localizado.
- Preservar o isolamento do Minimalist em relação ao Gamified.

## Non-goals

- Não implementar o modo Cliente, nem as seções Serviços ou Contato.
- Não alterar a ordem, o conteúdo ou a navegação atuais do modo Recruiter.
- Não modificar contratos do CMS, mensagens, estilos ou componentes visuais sem necessidade da extração.
- Não alterar a lógica de acessibilidade, sons, FLIP, scroll, tema, locale ou expansão; apenas reposicioná-la quando pertencer à página extraída.
- Não criar uma nova API pública de modos nem generalizar todo o shell nesta change; a preparação deve limitar-se à separação estrutural das seções.
- Não criar uma nova capability nem mudar requisitos funcionais observáveis nesta change.

## Capabilities

### New Capabilities

Nenhuma. Esta é uma refatoração estrutural sem mudança de comportamento.

### Modified Capabilities

Nenhuma. As capabilities existentes permanecem com os mesmos requisitos.

## Impact

- Código afetado: `src/features/minimalist/components/recruiter.tsx` e o novo módulo em `src/features/minimalist/components/`.
- Possíveis atualizações de imports e tipos locais; nenhuma API externa ou dependência nova.
- Verificação proporcional com formatação, typecheck, lint e `git diff --check`, além de testes focados se disponíveis para a rota Minimalist.
