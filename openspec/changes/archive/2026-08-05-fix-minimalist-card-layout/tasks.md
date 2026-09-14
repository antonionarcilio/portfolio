## 1. Auditar contratos e preparar a composição

- [x] 1.1 Mapear a renderização atual de projetos em `src/features/minimalist/components/recruiter.tsx`, `card.tsx`, `styles.css` e `hooks/use-minimalist-snap-scroll.ts`, preservando alterações não relacionadas.
- [x] 1.2 Comparar os estados compacto, expandido e de lista com os nós Figma `2212:3607`, `2097:20992`, `2097:21133` e `2097:21131`, registrando dimensões e espaçamentos necessários para a implementação.
- [x] 1.3 Definir a marcação BEM do viewport, track, linha e gradiente dos cards sem introduzir seletores globais ou dependências novas.

## 2. Implementar navegação isolada dos cards

- [x] 2.1 Criar o modelo de posições/linhas navegáveis e atualizar suas medidas em mudanças de viewport, quantidade de colunas e expansão de card.
- [x] 2.2 Integrar snap por linha ao viewport de projetos, com avanço/retrocesso de uma unidade por gesto e permanência nos limites.
- [x] 2.3 Coordenar o consumo de wheel/touch/teclado para impedir que uma rolagem interna mude a seção global enquanto houver linha adjacente.
- [x] 2.4 Aplicar scrollbar visualmente oculta, snap CSS e gradiente de término sem bloquear foco, leitura ou controle do último card.

## 3. Implementar expansão FLIP reutilizável

- [x] 3.1 Extrair uma abstração FLIP em `src/features/minimalist/` com identidade estável, medição First/Last/Invert e execução Play via Framer Motion, usando o layout expandido do nó Figma `2130:3343` como referência visual.
- [x] 3.2 Conectar o card aos estados compacto/expandido, renderizar a descrição completa do projeto a partir de `desc` com `MarkdownText`, ocultar excerpt e âncora/status no footer, manter header/footer fixos, expandir o card sobreposto horizontal e verticalmente até os limites do viewport sem reflowar a lista, deixar apenas a área central do card ativo com scroll de até `420px`, manter o padding do card expandido oculto, corners e hint de navegação no estado retraído, ocultar o gradiente da lista e desativar seu scroll snap enquanto expandido, controlar o gradiente interno pelos limites reais do scroll, bloquear scroll global, dots e cliques do footer enquanto expandido, manter `aria-expanded` e foco, e retornar ao slot original ao retrair.
- [x] 3.3 Adicionar labels localizados de expandir/recolher ao namespace `minimalist` em `src/messages/en.json` e `src/messages/pt-BR.json`, sem hardcode no componente.
- [x] 3.4 Integrar a configuração global de redução de movimento e manter o contrato de expansão reutilizável por Sobre/Experiência sem duplicação.
