# Feature Specification: Migração do Portfolio para Monorepo (pnpm workspaces)

**Feature Branch**: `001-monorepo-migration`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "use o conteúdo de docs/prd.md como base para a spec da migração do portfolio para monorepo pnpm workspaces"

## Clarifications

### Session 2026-10-15

- Q: O critério de sucesso deveria apenas afirmar "os três sites atualizam automaticamente, sem intervenção manual" (sem prazo numérico), já que o tempo real depende do comportamento de fila da Vercel e não é algo que este projeto controla? → A: Sim — remover o número, manter só "atualiza automaticamente, sem intervenção manual".
- Q: Como verificar que "não há diferença perceptível" entre os layouts antes/depois da migração (SC-004)? → A: Checklist manual — navegar pelas rotas principais nos dois idiomas, comparar textos de interface e comportamento.
- Q: Quando um deploy falha, como o mantenedor deve ficar sabendo? → A: Confiar nas notificações nativas do provedor de deploy (e-mail/dashboard) — nenhum requisito de observabilidade adicional neste projeto.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicar um layout sem afetar os outros (Priority: P1)

Como mantenedor, quero publicar uma alteração em um único layout (`minimalist`, `gamified` ou `pro`) e ver apenas aquele projeto fazer um novo deploy, sem disparar rebuild dos outros dois.

**Why this priority**: É o motivador central da migração — hoje qualquer alteração em qualquer parte do app único dispara rebuild de tudo. Sem isso, a migração não entrega valor algum.

**Independent Test**: Alterar um arquivo que pertence só ao layout `gamified`, publicar, e confirmar que somente o projeto de deploy do `gamified` iniciou um novo build; `minimalist` e `pro` permanecem no deploy anterior.

**Acceptance Scenarios**:

1. **Given** os três projetos publicados e sincronizados, **When** uma alteração de código é feita apenas dentro da área do layout `minimalist`, **Then** somente o projeto `minimalist` inicia um novo deploy.
2. **Given** os três projetos publicados, **When** uma alteração é feita em um pacote compartilhado (contrato de dados ou pipeline do CMS), **Then** os três projetos iniciam um novo deploy, pois todos dependem do pacote alterado.

---

### User Story 2 - Atualizar conteúdo do CMS uma vez e refletir nos três sites (Priority: P1)

Como mantenedor, quero editar um arquivo de conteúdo no repositório de CMS e ver os três portfólios publicados (`minimalist`, `gamified`, `pro`) atualizarem seu conteúdo, sem precisar repetir a lógica de leitura do CMS em cada um.

**Why this priority**: Garante que a camada de dados do CMS seja escrita uma única vez (objetivo 2 do PRD) e que o conteúdo nunca diverja entre os três sites — essencial para a credibilidade do portfólio como fonte única de verdade.

**Independent Test**: Editar um campo de conteúdo (ex.: título de um projeto) no repositório de conteúdo, aguardar os três deploys automáticos, e verificar que o novo valor aparece de forma idêntica nos três sites publicados.

**Acceptance Scenarios**:

1. **Given** um arquivo de conteúdo alterado no repositório de CMS e publicado na branch observada, **When** a notificação de mudança chega, **Then** os três sites recebem a notificação e cada um dispara seu próprio novo deploy.
2. **Given** uma notificação de mudança com assinatura inválida ou vinda de uma branch diferente da observada, **When** ela chega a qualquer um dos três sites, **Then** nenhum deploy é disparado por aquele site.
3. **Given** o mesmo campo de conteúdo lido pelos três sites, **When** o conteúdo é renderizado, **Then** o valor e sua forma (tipo, textos derivados) são idênticos nos três, pois a leitura do CMS vem de uma implementação única compartilhada.

---

### User Story 3 - Visitante chega por uma URL antiga (Priority: P2)

Como visitante/recrutador que tem uma URL antiga salva (ex.: um link direto para `/portfolios/minimalist`), quero ser redirecionado automaticamente para o novo endereço equivalente, sem ver um erro ou página em branco.

**Why this priority**: Preserva o acesso de quem já compartilhou ou salvou links do portfólio antes da migração — importante para não perder visibilidade com recrutadores, mas não bloqueia a entrega do valor central (apps independentes), por isso fica em P2.

**Acceptance Scenarios**:

1. **Given** uma URL antiga do formato `/portfolios/minimalist/...`, **When** um visitante a acessa, **Then** é redirecionado permanentemente para o endereço equivalente no novo domínio dedicado ao `minimalist`, preservando o idioma selecionado.
2. **Given** uma URL antiga do formato `/portfolios/gamified/...`, **When** acessada, **Then** o redirecionamento equivalente ocorre para o domínio do `gamified`.
3. **Given** a URL antiga do hub (`/portfolios`), **When** acessada, **Then** o visitante é redirecionado para a página inicial do novo domínio raiz.

---

### User Story 4 - Visitante acessa cada portfólio pelo domínio próprio (Priority: P2)

Como visitante, quero acessar cada portfólio pelo seu domínio dedicado e ver exatamente o mesmo conteúdo e comportamento de antes da migração — nenhuma mudança visual ou funcional perceptível.

**Why this priority**: É a garantia de paridade total exigida pelo PRD para `minimalist` e `gamified`; sem isso a migração arquitetural quebraria a experiência já validada do produto.

**Acceptance Scenarios**:

1. **Given** o layout `minimalist` publicado em seu domínio dedicado, **When** comparado ao comportamento anterior à migração, **Then** conteúdo, textos de interface e interações são indistinguíveis do estado anterior.
2. **Given** o layout `gamified` publicado em seu domínio dedicado, incluindo o minigame, **When** comparado ao estado anterior, **Then** o comportamento é idêntico.
3. **Given** o domínio raiz após a migração, **When** acessado, **Then** o visitante vê o novo layout `pro`, não mais o hub de seleção de portfólios (removido).

---

### User Story 5 - Agente de IA implementa uma fatia isolada (Priority: P3)

Como agente de IA encarregado de uma parte da migração ou de uma manutenção futura, quero ter contexto suficiente dentro de um único projeto (app ou pacote) para implementar e validar meu trabalho sem precisar entender o reposítório inteiro.

**Why this priority**: Acelera manutenção futura e reduz erros de agentes atuando sem contexto completo, mas é uma melhoria de processo — não bloqueia a entrega aos usuários finais, por isso fica em P3.

**Acceptance Scenarios**:

1. **Given** um agente que vai alterar apenas o app `gamified`, **When** ele lê a documentação própria daquele app, **Then** encontra todos os comandos, estrutura e regras necessários, sem precisar ler a documentação dos outros dois apps.
2. **Given** uma implementação concluída em um app, **When** o agente roda a validação de tipos e o build daquele app isoladamente, **Then** consegue confirmar que seu trabalho está correto sem precisar buildar o repositório inteiro.

---

### Edge Cases

- O que acontece quando a notificação de mudança de conteúdo chega para um site cujo gatilho de deploy não está configurado? → o site deve reportar essa condição de forma distinta de "rejeitado por assinatura inválida" ou "branch errada", para diferenciar erro de configuração de tentativa de acesso inválida.
- O que acontece se dois dos três sites estiverem com deploys em andamento quando uma nova notificação de conteúdo chega? → cada site deve enfileirar/disparar seu próprio novo deploy de forma independente, sem que o estado de um bloqueie o outro.
- O que acontece com uma URL antiga que não corresponde a nenhum padrão de redirecionamento conhecido? → deve cair num tratamento de "não encontrado" do domínio raiz, não gerar erro de servidor.
- O que acontece se o repositório de conteúdo (CMS) ficar temporariamente indisponível durante um deploy? → o deploy daquele site deve falhar sem publicar conteúdo parcial/corrompido, preservando a última versão publicada com sucesso; a visibilidade dessa falha para o mantenedor é feita pelas notificações nativas do provedor de deploy (e-mail/dashboard), sem necessidade de um canal de alerta próprio.
- O que acontece com uma rota que hoje existe apenas em um layout (ex.: minigame) quando o visitante tenta acessá-la pelo domínio de outro layout? → deve resultar em "não encontrado" nesse domínio, pois a rota só existe no app dono dela.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que cada layout (`minimalist`, `gamified`, `pro`) seja publicado e atualizado de forma independente, sem exigir rebuild dos outros layouts quando só o código daquele layout muda.
- **FR-002**: O sistema DEVE disparar rebuild dos três layouts quando uma alteração ocorre em código compartilhado entre eles (contrato de dados ou pipeline de leitura do CMS).
- **FR-003**: O sistema DEVE expor uma única implementação do contrato de dados do portfólio (forma, validação) consumida pelos três layouts, eliminando qualquer duplicação dessa lógica.
- **FR-004**: O sistema DEVE expor uma única implementação do pipeline de leitura de conteúdo do CMS (busca, resolução de referências internas, montagem do grafo de conteúdo, mapeamento para o contrato de dados), consumida pelos três layouts.
- **FR-005**: O sistema DEVE validar a forma dos dados do portfólio antes de considerá-los utilizáveis, reportando com clareza qual campo e qual forma eram esperados quando a validação falha.
- **FR-006**: O sistema DEVE notificar os três layouts publicados quando o conteúdo do CMS muda, permitindo que cada um dispare seu próprio processo de atualização.
- **FR-007**: O sistema DEVE recusar notificações de mudança de conteúdo cuja origem não possa ser verificada como autêntica (assinatura inválida) ou que não correspondam à fonte de conteúdo observada (branch incorreta).
- **FR-008**: O sistema DEVE preservar o comportamento e o conteúdo exatamente como estavam antes da migração para os layouts `minimalist` e `gamified` — nenhuma mudança perceptível para o visitante.
- **FR-009**: O sistema DEVE apresentar um novo layout (`pro`) no domínio raiz, substituindo a página de seleção de portfólios (hub) que existia antes da migração.
- **FR-010**: O sistema DEVE redirecionar permanentemente cada URL antiga conhecida (rotas do hub e dos layouts dentro do app único anterior) para o endereço equivalente no novo domínio dedicado correspondente, preservando o idioma selecionado pelo visitante quando aplicável.
- **FR-011**: O sistema DEVE permitir que um colaborador (humano ou agente de IA) encontre, dentro da documentação de um único app ou pacote, todos os comandos e regras necessários para trabalhar nele, sem depender de contexto de outros apps.
- **FR-012**: O sistema DEVE permitir validar (tipos e build) cada app de forma isolada, sem precisar compilar os demais apps do repositório.
- **FR-013**: O sistema NÃO DEVE manter nenhuma implementação remanescente do app único anterior (código morto) após a conclusão da migração — toda a funcionalidade equivalente deve existir exclusivamente dentro dos três apps novos e dos pacotes compartilhados.
- **FR-014**: O sistema DEVE manter uma única fonte de dependências e suas versões para o repositório inteiro, evitando divergência de versão de bibliotecas entre os apps.

### Key Entities

- **Dado do portfólio (contrato de conteúdo)**: representa a informação exibida em qualquer um dos três layouts — identidade, papel, projetos, experiências, educação, links — com uma forma validável e compartilhada entre todos os consumidores.
- **Grafo de conteúdo do CMS**: a estrutura de nós de conteúdo alcançáveis a partir do nó raiz do repositório de conteúdo, usada para montar o dado do portfólio.
- **Layout publicável**: cada uma das três unidades de publicação independente (`minimalist`, `gamified`, `pro`), com seu próprio domínio, ciclo de deploy e documentação.
- **Notificação de mudança de conteúdo**: evento recebido por cada layout publicável quando o repositório de conteúdo muda, contendo informação suficiente para verificar sua autenticidade e origem antes de disparar um novo deploy.
- **Redirecionamento de URL antiga**: mapeamento entre um endereço usado antes da migração e seu equivalente após a migração, preservando o idioma quando aplicável.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma alteração restrita ao código de um único layout resulta em novo deploy apenas daquele layout em 100% dos casos observados; os outros dois layouts permanecem na versão anterior.
- **SC-002**: Uma alteração de conteúdo no repositório do CMS reflete nos três layouts publicados automaticamente, sem nenhuma intervenção manual adicional (o tempo exato depende do comportamento de enfileiramento da infraestrutura de deploy e está fora do controle deste sistema).
- **SC-003**: 100% das URLs antigas conhecidas (rotas do hub e dos dois layouts dentro do app único anterior) resultam em um redirecionamento permanente válido para o endereço equivalente novo, sem erro ou página em branco.
- **SC-004**: Uma verificação manual por checklist — navegando pelas rotas principais de `minimalist` e `gamified` nos dois idiomas suportados e comparando textos de interface e comportamento contra o estado anterior à migração — não encontra nenhuma diferença perceptível ao visitante.
- **SC-005**: Um colaborador consegue implementar e validar uma alteração restrita a um único app usando apenas a documentação daquele app, sem precisar ler a documentação dos demais apps ou do repositório inteiro.
- **SC-006**: Após a conclusão da migração, uma busca por qualquer referência ao app único anterior (estrutura de pastas ou nomes de rota do hub) no repositório não encontra nenhuma ocorrência remanescente.

## Assumptions

- O repositório de conteúdo do CMS (público, somente leitura via HTTP) continua sendo a única fonte de conteúdo; nenhuma mudança é feita nesse repositório ou em seu formato como parte desta migração.
- Os três layouts continuam suportando os dois mesmos idiomas já existentes (português do Brasil e inglês); a migração não adiciona nem remove idiomas.
- "Paridade total" (User Story 4 / SC-004) refere-se a conteúdo, comportamento e textos de interface — não exige que a URL de cada rota interna permaneça byte-a-byte idêntica à estrutura de pastas anterior, desde que o visitante final não perceba diferença de experiência.
- A infraestrutura de hospedagem (provedor de deploy, domínios, webhooks do repositório de conteúdo) é configurada manualmente por um operador humano fora do escopo desta spec; esta spec cobre o comportamento funcional resultante, não os passos de configuração em painéis de terceiros.
- Um "deploy" de cada layout publicável é sempre um rebuild completo daquele layout (o conteúdo é estático, obtido em tempo de build) — não há atualização parcial/incremental de conteúdo em produção entre deploys.
