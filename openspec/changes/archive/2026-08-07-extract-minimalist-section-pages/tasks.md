## 1. Extração do módulo de seções

- [x] 1.1 Criar `src/features/minimalist/components/section.tsx` e mover `EmptyState`, `period`, `AboutPage`, `ExperiencePage`, `ProjectsPage` e `EducationPage`, preservando JSX, classes, atributos acessíveis e comportamento atual.
- [x] 1.2 Classificar no módulo as seções reutilizáveis (`AboutPage` e `ProjectsPage`) e as seções específicas da composição Recruiter (`ExperiencePage` e `EducationPage`), sem implementar Serviços ou Contato.
- [x] 1.3 Ajustar os imports e os tipos do novo módulo para que cada dependência das seções seja explícita e não dependa de estado ou valores implícitos do recruiter.

## 2. Simplificação do recruiter

- [x] 2.1 Remover de `src/features/minimalist/components/recruiter.tsx` as definições extraídas e importar os componentes de seção a partir de `section.tsx`.
- [x] 2.2 Confirmar que `MinimalistRecruiter` retém apenas shell, navegação, estado compartilhado, acessibilidade, aparência, locale e composição da sequência Recruiter.
- [x] 2.3 Confirmar que a fronteira de `section.tsx` permite ao futuro Client reutilizar Sobre e Projetos e trocar Experiência/Educação por Serviços/Contato, sem implementar esses componentes nesta change.

## 3. Verificação de equivalência

- [x] 3.1 Verificar o diff para garantir que não houve alteração intencional em mensagens, classes, ordem das seções, comportamento de scroll/FLIP, sons, foco, expansão ou isolamento do Gamified.
- [x] 3.2 Confirmar que o modo Cliente, Serviços e Contato não foram implementados ou introduzidos como placeholders nesta change.
- [x] 3.3 Executar `npx pnpm format:check`, `npx pnpm typecheck`, `npx pnpm lint` e `git diff --check`; executar testes focados da rota Minimalist quando disponíveis e registrar qualquer falha preexistente separadamente.
