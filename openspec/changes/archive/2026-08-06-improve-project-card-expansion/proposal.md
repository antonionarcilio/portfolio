## Why

O efeito de retrair o card expandido é visivelmente diferente do de expandir (o card "pula" de posição e o conteúdo some por uma animação de altura própria), não há feedback de foco/hover na lista (nenhum card é destacado) e o scroll da lista continua funcionando por teclado/touch mesmo com um card expandido, quando deveria estar travado.

## What Changes

- Remover a animação de crescimento de altura (`scaleY`) da área de conteúdo expandido, deixando apenas um fade de `opacity`; o FLIP do card passa a ser a única animação de tamanho, tornando expandir e retrair espelhos exatos.
- Congelar o `scrollTop` da grid durante todo o colapso, sem disputa com o smooth-scroll, para o card não mudar de âncora enquanto encolhe.
- Adicionar destaque de foco/hover na lista de projetos: todos os cards, inicialmente a 100% de opacidade, ficam a 60% quando um outro card recebe hover/focus — apenas o card ativo permanece 100%, e cards fora do viewport visível da lista não são afetados.
- Adicionar fade-in/out suave nos corners do card ativo.
- Travar o scroll da lista (mouse, teclado e touch) enquanto houver um card expandido; a área de conteúdo expandido continua com scroll nativo.

## Capabilities

### New Capabilities

<!-- Nenhuma capability nova é introduzida nesta mudança. -->

### Modified Capabilities

- `minimalist-card-flip-expansion`: a continuidade FLIP passa a exigir simetria entre expandir e retrair (sem animação de altura própria no conteúdo e sem reposicionamento abrupto por scroll); a lista passa a travar scroll por mouse, teclado e touch enquanto um card está expandido; e a lista passa a exibir destaque de hover/focus com dim de 60% nos cards visíveis não ativos e fade suave nos corners.

## Impact

- `src/features/minimalist/components/card.tsx`: transição do conteúdo expandido (`scaleY` → `opacity`), congelamento do `scrollTop` no colapso, corners animados.
- `src/features/minimalist/components/recruiter.tsx`: estado de card ativo (hover/focus), guarda dos handlers de snap-scroll durante expansão.
- `src/features/minimalist/styles.css`: ajustes de transição dos corners e classes de dim.
- `src/features/minimalist/hooks/use-minimalist-flip.ts`: possivelmente centralizar a transição FLIP/fade.
- Sem mudanças de CMS, rotas, i18n ou dependências.

## Non-goals

- Não alterar o layout expandido (`max-height: 420px`, viewport `610px`, header/footer fixos).
- Não alterar a navegação global (sections, footer, paginação lateral).
- Não mexer no conteúdo/estrutura dos dados de projetos nem na feature `gamified`.
- Não trocar o mecanismo FLIP por outra técnica (ex.: resize animado por CSS).
