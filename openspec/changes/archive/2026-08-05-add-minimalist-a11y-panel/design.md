## Context

O Minimalist já concentra a página em `src/features/minimalist/components/recruiter.tsx`, usa `MinimalistA11yTrigger` e `MinimalistSwitchBtn`, possui `circularIndex` e mantém seus tokens em `src/features/minimalist/styles.css`. O Figma fornece os frames `2138:3525` (composição), `2138:3750` (lista de 300 px e gradiente) e `2138:3757` (detalhe e YES/NO). A implementação deve seguir `CLAUDE.md`: i18n em ambos os arquivos de mensagens, CSS BEM por feature, CVA para variantes e Framer Motion para transições.

## Goals / Non-Goals

**Goals:**

- Encapsular a apresentação e o comportamento do painel em componentes/estado próprios da feature Minimalist.
- Reutilizar o botão de switch existente e o contrato de acessibilidade já disponível, mantendo foco, semântica e persistência coerentes.
- Implementar uma máquina de seleção circular com acumulador de wheel e limiar explícito, compartilhada pela interação wheel e teclado sem duplicar regras.
- Permitir validação determinística por seletores/atributos acessíveis e comparação visual nos breakpoints relevantes.

**Non-Goals:**

- Refatorar o `A11yProvider` do gamificado ou compartilhar estilos entre os dois layouts.
- Criar uma biblioteca genérica de carrossel ou alterar a navegação das páginas do recruiter.

## Decisions

1. **Estado local ao shell Minimalist, efeitos delegados ao contrato existente.** O recruiter controlará abertura, item selecionado e pressão acumulada; a aplicação/persistência das opções deverá chamar o contexto/serviço de acessibilidade que já possuir contrato compatível. Isso evita acoplar o Minimalist ao layout gamificado. Uma store nova seria evitada porque criaria duas fontes de verdade.

2. **Lista circular sem DOM infinito real.** Renderizar uma janela curta de itens repetidos e reposicionar índices com `circularIndex` entrega a percepção de scroll infinito sem crescimento de DOM. A alternativa de adicionar itens indefinidamente seria mais simples visualmente, mas produziria memória e foco inconsistentes após muitas interações.

3. **Pressão por acumulação de delta.** O wheel acumulará o deslocamento vertical por gesto, consumirá um item ao atingir o limiar e reiniciará o acumulador; o sentido oposto reinicia o acúmulo. Teclado avança diretamente um item, pois já representa uma intenção discreta. O valor do limiar será uma constante nomeada e testável, não um número espalhado em JSX.

4. **Toggle YES/NO como instâncias do switch existente.** `MinimalistSwitchBtn` continuará sendo a fonte de geometria, estados visuais e `aria-pressed`; o painel fornecerá labels traduzidos e estado atual. Um novo controle visual duplicaria o componente usado por tema, idioma e modo e aumentaria o risco de divergência do Figma.

5. **CSS BEM e gradientes na camada visual.** O gradiente ficará em pseudo-elementos ou elementos decorativos sem captura de ponteiro; a viewport da lista terá overflow controlado e os media queries ficarão em `src/features/minimalist/styles.css`. Animações de troca usarão `motion` e respeitarão o mecanismo global de redução de movimento.

6. **Mensagens por opção e por estado.** Os títulos, descrições, perguntas, labels acessíveis e anúncios de mudança serão adicionados simetricamente a `src/messages/pt-BR.json` e `src/messages/en.json`, sob o namespace `minimalist`, evitando fallback textual no componente.

7. **Validação pelo Playwright MCP.** Após a implementação, usar snapshots de acessibilidade para localizar controles, wheel/teclado para os contratos de interação, screenshots em viewport desktop e estreita para fidelidade, e checagem de console/overflow. A validação deve cobrir também a rota gamificada para confirmar isolamento.

## Risks / Trade-offs

- [Wheel varia por dispositivo e navegador] → acumular `deltaY`, normalizar apenas o sentido, limitar a uma transição por gesto e testar deltas pequenos, grandes e invertidos.
- [Reset visual da lista pode mover foco] → manter identidade estável por opção, sincronizar foco após a transição e garantir que itens clonados fora da seleção sejam `aria-hidden`/não focáveis.
- [Efeitos de acessibilidade existentes podem pertencer a outro layout] → mapear explicitamente cada opção ao contrato disponível antes de implementar e não importar o contexto gamificado no Minimalist.
- [Texto traduzido altera a largura do detalhe] → usar layout fluido, validar `en` e `pt-BR` em desktop/viewport estreita e não fixar largura além do limite demonstrado pelo Figma.

## Migration Plan

1. Implementar o painel e as mensagens somente na feature Minimalist.
2. Validar formatação, tipos, lint, build e cenários Playwright MCP.
3. Caso seja necessário rollback, remover a integração do painel do recruiter e os novos estilos/mensagens; não há migração de dados externa.
