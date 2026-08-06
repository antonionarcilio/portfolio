## Why

A lista de cards da página Minimalist não reproduz o layout aprovado no Figma: o espaço de cards ainda permite uma rolagem interna que compete com a navegação entre seções, apresenta scrollbar visível e termina com um corte seco. A interação também precisa tratar os cards como uma sequência linear com snap e preservar a técnica FLIP para que a expansão futura das áreas Sobre e Experiência tenha uma base reutilizável.

## What Changes

- Reestruturar a área de cards para seguir o layout de referência e sua composição de uso nos nós Figma fornecidos.
- Remover a scrollbar visível da área de cards e aplicar um gradiente de término que suavize visualmente o final da lista.
- Isolar o gesto de navegação dos cards da navegação vertical/circular entre seções, evitando que uma rolagem interna altere a seção ativa.
- Implementar navegação linear com scroll snap por card, fazendo cada gesto avançar ou retroceder uma linha de cards.
- Expandir o conteúdo do card com uma transição FLIP (First, Last, Invert, Play), mantendo a técnica em uma abstração reutilizável para Sobre e Experiência.
- Preservar a separação total entre Minimalist e Gamified; a referência ao comportamento Gamified serve apenas como contrato de interação.

## Non-goals

- Alterar o layout, componentes, estilos ou comportamento da experiência Gamified.
- Inventar conteúdo de projetos ou substituir os dados reais fornecidos pelo CMS.
- Implementar ainda a expansão FLIP de Sobre ou Experiência; este change deve deixar a infraestrutura preparada para essas áreas.
- Alterar a ordem global das seções, o shell persistente, os controles de tema/idioma ou o contrato de CMS.

## Capabilities

### New Capabilities

- `minimalist-card-navigation`: navegação linear dos cards com snap por linha, tratamento de rolagem e acabamento visual sem scrollbar exposta.
- `minimalist-card-flip-expansion`: expansão e recolhimento de cards usando FLIP, com uma API reutilizável por outras seções Minimalist.

### Modified Capabilities

- `minimalist-recruiter-experience`: a área de projetos passa a ter um viewport de cards independente da navegação entre seções, sem alterar o contrato da navegação global.
- `minimalist-component-system`: o componente `card` passa a suportar estados de expansão e transição FLIP sem perder semântica, acessibilidade e fidelidade visual.

## Impact

- Afeta `src/features/minimalist/components/card.tsx`, `recruiter.tsx`, `styles.css` e `hooks/use-minimalist-snap-scroll.ts`, além de novos utilitários/hooks de navegação e FLIP.
- Pode exigir mensagens localizadas para os estados de expandir/recolher e atualização de testes/snapshots visuais.
- Usa Framer Motion conforme o contrato do projeto; não introduz dependências externas nem modifica APIs do CMS.
- A validação deve cobrir os nós Figma `2212:3607`, `2097:20992`, `2097:21133` e `2097:21131`, além das rotas Minimalist e Gamified em viewport desktop e estreito.
