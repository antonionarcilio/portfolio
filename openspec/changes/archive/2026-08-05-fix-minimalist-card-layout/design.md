## Context

O recruiter Minimalist já possui shell persistente, um track central de seções e um hook de snap global. A composição de projetos em `src/features/minimalist/components/recruiter.tsx` ainda usa uma lista/grid de cards com expansão condicional, enquanto `src/features/minimalist/styles.css` controla a geometria dos cards e do track. A motivação e os limites de produto estão em `proposal.md`; os contratos observáveis estão nos specs deste change.

## Goals / Non-Goals

**Goals:**

- Separar explicitamente o viewport de cards do viewport de seções.
- Derivar o snap de uma linha/card real, incluindo limites, resize e quantidade responsiva de colunas.
- Criar uma infraestrutura FLIP reutilizável, integrada ao padrão de animação Framer Motion do projeto.
- Reproduzir a composição dos nós Figma `2212:3607`, `2097:20992`, `2097:21133` e `2097:21131` por validação visual local.

**Non-Goals:**

- Alterar `src/features/gamified/` ou qualquer rota gamificada.
- Mudar a navegação circular global, o CMS, a ordem das seções ou o shell persistente.
- Criar uma segunda fonte de dados ou persistir estado de expansão entre sessões.

## Decisions

### 1. Viewport interno com consumo de gesto delimitado

O bloco de projetos terá um viewport próprio e uma camada de conteúdo que conhece suas linhas navegáveis. O listener do gesto deverá identificar se existe uma linha anterior/próxima; só nesse caso consome o evento. No limite, o evento permanece disponível para a navegação global, evitando aprisionar o usuário no fim da lista.

Alternativas consideradas: deixar o navegador decidir entre dois scroll containers (causa competição entre seção e cards) ou desabilitar toda rolagem global dentro de projetos (impede sair da seção naturalmente).

### 2. Snap lógico por linha, não por altura arbitrária

As posições de snap serão calculadas a partir dos elementos de linha/card renderizados e atualizadas quando o layout responsivo mudar. A navegação usa uma única posição adjacente por gesto, com `scrollIntoView`/posição equivalente e snap CSS como garantia de repouso.

Alternativas consideradas: snap por viewport inteiro (não representa cards), ou snap por índice fixo em pixels (quebra em narrow viewport e quando o card expande).

### 3. Gradiente como camada visual não-interativa

O gradiente final será um pseudo-elemento/classe BEM no viewport, com `pointer-events: none`, e será dimensionado para não cobrir o controle do último card. A scrollbar será ocultada apenas visualmente; foco, teclado, touch e rolagem programática continuam disponíveis.

Alternativa considerada: truncar a lista com máscara que bloqueia conteúdo e foco (não atende acessibilidade).

### 4. FLIP reutilizável e estado local

O card manterá uma identidade estável e o estado de expansão continuará local ao recruiter. Uma abstração FLIP receberá o elemento/medidas antes e depois da mudança e executará a interpolação por Framer Motion, preservando a curva `[0.2, 0.7, 0.2, 1]` e a configuração global de redução de movimento.

Alternativas consideradas: depender apenas de `height: auto` (não garante continuidade espacial) ou criar animações específicas em cada seção (duplica lógica e impede o uso futuro em Sobre/Experiência).

### 5. Conteúdo e semântica

O conteúdo expandido continua vindo dos dados de projeto existentes, usando `desc` como fonte da descrição completa e `MarkdownText` como renderer. O layout expandido seguirá o nó Figma `2130:3343`. O toggle será um controle semântico com estado ARIA, foco visível e mensagens localizadas em `src/messages/en.json` e `src/messages/pt-BR.json`; nenhum texto editorial será introduzido.

### 6. Persistência durante a navegação global

O estado expandido será mantido no nível de `MinimalistRecruiter`, indexado pela identidade estável do projeto, e não dentro do viewport temporário da seção. A coordenação de scroll distinguirá a área interna do conteúdo expandido da área externa: somente a primeira consome o gesto para scroll interno; gestos fora dela seguem para a navegação global, sem limpar o estado expandido.

Quando houver um projeto expandido, essa regra é substituída por um modo modal da seção: o scroll global é bloqueado, os dots laterais ficam ocultos/inativos e o footer global rejeita interação. O usuário deve recolher o card para retomar a navegação entre seções.

## Risks / Trade-offs

- [Risco] Um card expandido altera as posições das linhas e pode invalidar o índice atual. → Recalcular âncoras após a medição e manter a identidade do card para reposicionar a linha ativa.
- [Risco] `wheel` pode ser entregue ao listener global e ao viewport interno no mesmo gesto. → Usar um único coordenador de gesto, marcar o evento somente quando uma transição interna foi executada e testar limites.
- [Risco] Gradiente pode reduzir contraste ou encobrir o último CTA. → Validar contraste e foco nos dois temas, reduzir a altura do gradiente conforme a geometria e testar teclado no último card.
- [Risco] CSS de scrollbar varia entre navegadores. → Cobrir scrollbar padrão e WebKit sem depender da ocultação para a funcionalidade.
- [Risco] A alteração pode afetar involuntariamente Gamified por estilos globais. → Manter classes e imports dentro de `src/features/minimalist/` e executar validação da rota gamificada.

## Migration Plan

1. Implementar o viewport/snap e a abstração FLIP atrás dos componentes Minimalist existentes.
2. Atualizar mensagens, testes e snapshots; revisar somente diffs visuais intencionais.
3. Validar em viewport `1280×826` e estreito, nos dois locales e temas, com teclado, roda/touch e redução de movimento.
4. Se houver regressão, reverter apenas os arquivos do feature Minimalist; não há migração de dados nem alteração de API externa.

## Open Questions

Nenhuma decisão de produto permanece aberta para iniciar a implementação; a distância exata do gradiente e a duração da animação devem ser calibradas contra os nós Figma durante a validação visual, sem alterar os contratos dos specs.
