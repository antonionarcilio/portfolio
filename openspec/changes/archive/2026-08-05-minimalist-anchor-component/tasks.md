## 1. Componente Anchor

- [x] 1.1 Criar `src/features/minimalist/components/minimalist-anchor.tsx` com `anchorVariants` (cva) no topo e o componente `MinimalistAnchor` abaixo, cobrindo `appearance`, `variant` (`primary`/`secondary`/`tertiary`), `uppercase` (default `true`), `trailingIcon` (default `true`) e `disabled`
- [x] 1.2 Implementar `disabled` com `aria-disabled="true"`, `tabIndex={-1}` e sem `href` (âncora sem `href` não navega nem recebe Enter/click; mais simples que bloquear `onClick`, sem atributo HTML `disabled`, inválido em `<a>`)
- [x] 1.3 Remover `linkVariants`/`LinkVariantProps` de `src/features/minimalist/variants.ts`
- [x] 1.4 Remover `src/features/minimalist/components/minimalist-links.tsx`

## 2. CSS do componente (BEM)

- [x] 2.1 Renomear bloco `.minimalist-link` → `.minimalist-anchor` em `src/features/minimalist/styles.css`, com modificadores `--primary`/`--secondary`/`--tertiary` aplicando `font-weight: var(--minimalist-weight-regular|bold|medium)` respectivamente, e `--uppercase`
- [x] 2.2 Aplicar cor base: `var(--minimalist-foreground)` para `--primary`/`--secondary`, `var(--minimalist-muted)` para `--tertiary` (ambos já existentes, resolvidos por appearance — não criar tokens novos)
- [x] 2.3 Aplicar cor de `:hover`/`:focus-visible`, escopada por appearance: `.minimalist-theme--light .minimalist-anchor` usa `var(--minimalist-alpha-black-70)` (`--primary`/`--secondary`) ou `var(--minimalist-alpha-black-50)` (`--tertiary`); `.minimalist-theme--dark .minimalist-anchor` usa os equivalentes `--minimalist-alpha-white-70`/`-50`
- [x] 2.4 Aplicar cor de `[aria-disabled="true"]` — `var(--minimalist-alpha-black-30)` em light, `var(--minimalist-alpha-white-30)` em dark, todos os variants — e `pointer-events: none`
- [x] 2.5 Adicionar sublinhado em `:hover`/`:focus-visible` restrito a `.minimalist-theme--dark .minimalist-anchor--primary`/`.minimalist-anchor--secondary`
- [x] 2.6 Remover `.minimalist-link` do seletor múltiplo compartilhado com `.minimalist-a11y-trigger` (linha ~204). A parte de "mover o `:focus-visible` outline" não se aplicava: `.minimalist-anchor` é um `<a>` real, já coberto pela regra genérica `.minimalist-theme a:focus-visible` (styles.css:46-48) — diferente de `.minimalist-section-switch`/`.minimalist-a11y-trigger`/`.minimalist-card__collapse`, que são `<button>` e por isso precisam da regra dedicada. Descoberto durante a implementação: `.minimalist-card__footer a` (removido) também forçava cor/sublinhado incondicionais com especificidade maior que `.minimalist-anchor--*`, quebrando a fidelidade no único call site dentro de um card footer (`item.companyUrl`)

## 3. Call sites

- [x] 3.1 Atualizar `src/features/minimalist/components/minimalist-showcase.tsx` para `MinimalistAnchor`
- [x] 3.2 Atualizar `src/features/minimalist/components/minimalist-recruiter.tsx` (5 usos) para `MinimalistAnchor`. Nenhum call site pedia `emphasis="bold"` no código antigo, e o Figma não diferencia GitHub/LinkedIn/E-Mail/contatos/companyUrl por variant — todos ficam no default `variant="primary"` (não é uma decisão de design nova, apenas preserva o peso "regular" já usado); os `uppercase` explícitos (agora redundantes com o novo default `true`) foram removidos dos 4 call sites que os tinham
- [x] 3.3 Verificar visualmente nos dois locales e appearances os dois call sites que ficam maiúsculos pelo novo default: `item.companyUrl` (recruiter) e o link `navigation.link` em `minimalist-showcase.tsx` — este segundo não estava listado no proposal original, encontrado durante a implementação (também não passava `uppercase` explícito)

## 4. Verificação

- [x] 4.1 `npx pnpm typecheck`
- [x] 4.2 `npx pnpm lint`
- [x] 4.3 `npx pnpm format:check`
- [x] 4.4 Conferir visualmente contra o node Figma (`node-id=2101-1277`) em `npx pnpm dev`. Verificado via browser na rota real (`/en/portfolios/minimalist`, único consumidor ao vivo): light (foreground preto, uppercase, sem sublinhado) e dark (foreground branco, sublinhado condicional aparece só no hover/focus em dark) em `about` (GitHub/LinkedIn/E-Mail) e `projects` (Visit Company dentro de um card footer — confirma que a remoção de `.minimalist-card__footer a` não regrediu nada). `MinimalistShowcase` não está roteado em nenhuma página (0 usos fora do próprio arquivo), então o link `navigation.link` não pôde ser verificado visualmente ao vivo — typecheck/lint/format cobrem sua correção estática
