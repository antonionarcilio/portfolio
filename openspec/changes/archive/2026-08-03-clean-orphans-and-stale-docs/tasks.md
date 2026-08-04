## 1. Preparar a auditoria e a matriz de evidências

- [x] 1.1 Confirmar o estado inicial do worktree e enumerar dependências, exports, rotas e assets candidatos sem alterar arquivos de aplicação.
- [x] 1.2 Criar uma matriz de decisão temporária contendo item, referências encontradas, decisão (`remover`, `manter` ou `inconclusivo`) e evidência; limitar cada análise a uma sessão de até 1 hora.

## 2. Validar e limpar dependências

- [x] 2.1 Pesquisar `playwright` e `dotenv` em `package.json`, `pnpm-lock.yaml`, scripts, configurações, workflows, documentação e automações locais.
- [x] 2.2 Confirmar que o build atual não depende de Playwright e que não existe consumidor operacional conhecido de `dotenv`; registrar a decisão de manter ou remover cada pacote.
- [x] 2.3 Se ambos forem comprovadamente órfãos, removê-los de `package.json` e atualizar `pnpm-lock.yaml` usando pnpm 9; caso contrário, manter o pacote e documentar o motivo.

## 3. Revisar exports mortos

- [x] 3.1 Pesquisar consumidores internos e externos ao diretório `src` para `HOVER_SHIFT_X_VARIANT`, `parseWikiLinks` e `SkillList`, incluindo documentação, barrels, testes e configurações.
- [x] 3.2 Remover somente os exports sem consumidor ou contrato legítimo, preservando funções usadas internamente e APIs de entrypoints do Next.
- [x] 3.3 Executar typecheck e lint após a limpeza dos exports e registrar qualquer símbolo mantido por compatibilidade.

## 4. Confirmar assets contra o CMS

- [x] 4.1 Enumerar os assets candidatos em `public/` e verificar referências literais em `src`, CSS, README, documentação, scripts e configuração.
- [x] 4.2 Baixar/ler o conteúdo público alcançável de `antonionarcilio/portfolio-cms` na branch `master`, iniciando em `content/index.md` e seguindo apenas wikilinks reconhecidos pelo grafo do projeto.
- [x] 4.3 Procurar no conjunto alcançado nomes, caminhos, URLs e campos `cover`, `icon` e cursor correspondentes a cada asset candidato; registrar o arquivo e campo da evidência.
- [x] 4.4 Classificar cada asset como usado localmente, usado pelo CMS, não referenciado ou inconclusivo; não remover assets inconclusivos.
- [x] 4.5 Remover somente assets classificados como não referenciados e confirmar que nenhum caminho restante aponta para eles.

## 5. Atualizar o README

- [x] 5.1 Reescrever a seção de visão geral e funcionalidades com base nas rotas e componentes atuais, removendo referências a `/api/portfolio`, DatoCMS e estruturas inexistentes.
- [x] 5.2 Documentar requisitos reais (`.nvmrc`, Node 24, pnpm 9), instalação via `npx pnpm`, variáveis de `.env.sample`, scripts disponíveis e fluxo CMS/GitHub/Vercel.
- [x] 5.3 Atualizar a árvore do projeto e a tabela de rotas para refletir `src/app/[locale]/`, `cms-debug`, `revalidate`, sitemap, robots e o redirecionamento de produção do minigame.
- [x] 5.4 Conferir todos os comandos, nomes de arquivos e URLs documentados contra `package.json`, `CLAUDE.md`, `next.config.ts` e `src/app/`.

## 6. Atualizar a documentação de acessibilidade

- [x] 6.1 Reconciliar `docs/accessibility.md` com `A11yKey`, `A11yProvider`, persistência, `upscale`, `reduceMotion` e as classes atuais em `src/features/gamified/contexts/a11y-context.tsx`.
- [x] 6.2 Corrigir caminhos, componentes, rotas e comportamento descritos usando `src/app/[locale]/portfolios/gamified/layout.tsx`, `a11y-dropdown.tsx`, shells compartilhados e `styles.css`.
- [x] 6.3 Revisar referências a linhas, nomes de props, defaults e lacunas para garantir que a documentação descreva o comportamento existente sem introduzir requisitos novos.

## 7. Verificação final

- [x] 7.1 Executar `npx pnpm typecheck`, `npx pnpm lint`, `npx pnpm format:check` e `npx pnpm build` em Node 24 conforme `.nvmrc`.
- [x] 7.2 Executar `git diff --check` e uma busca final por `/api/portfolio`, `DatoCMS`, `textLarge`, caminhos antigos e referências a assets removidos.
- [x] 7.3 Revisar o diff para confirmar que a mudança não alterou comportamento funcional, que o lockfile acompanha dependências removidas e que a matriz de evidências sustenta cada remoção.
