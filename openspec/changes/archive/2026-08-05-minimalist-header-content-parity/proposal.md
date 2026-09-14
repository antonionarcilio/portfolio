## Why

O header do portfólio minimalista (`/portfolios/minimalist`) ainda não é fiel ao protótipo Figma: o override de estilo aplicado dentro do header (`.minimalist-recruiter__header .minimalist-switch`) zera `border`/`padding` do componente base `switch-btn`, então os separadores visuais entre as opções de um mesmo switch (ex.: `PT | EN`, `LIGHT | DARK`) somem — e o divisor entre grupos de switches (locale/tema/modo) usa uma cor/variante não confirmada contra o componente real do Figma. O usuário reportou repetidamente ("ainda não está fiel") e forneceu os links exatos dos componentes Figma (`switch-btn` base, `i18n-switch`, `theme-switch`, `mode-switch`, `header` de composição) que precisam ser reconferidos um a um. Além disso, a área de conteúdo "Sobre" usa uma imagem estática local (`public/images/minimalist-profile.png`) em vez de vir do CMS, quebrando o requisito já existente de que a apresentação minimalista usa exclusivamente dados do pipeline CMS.

## What Changes

- Reconstruir o componente base `SwitchButton`/`minimalist-switch` a partir das variantes reais do Figma (node `2099-1997`), cobrindo estados `regular`/`hover`/`focus`/`current` e os dois divisores (interno entre opções do mesmo grupo; externo entre grupos) em light/dark.
- Reaplicar o componente base corrigido nos três switches do header: locale (`2126-2821`), tema (`2065-932`) e modo (`2065-736`), removendo o override que hoje zera a borda dentro de `.minimalist-recruiter__header`.
- Recompor o header (`2060-84`) com os três switches corrigidos, validando espaçamento, ordem e divisores contra o Figma.
- Validar o header via Playwright (screenshot/DOM) em light e dark, en e pt-BR, comparando com o protótipo.
- Adicionar um campo de imagem de perfil (avatar/portrait) ao pipeline CMS (`RootFields` → `mapPortfolioToData` → `PortfolioData`), seguindo o mesmo padrão BFS/mapper já usado pelo `gamified`, e consumir esse campo na página "Sobre" do minimalista no lugar do arquivo estático local.
- Adicionar `raw.githubusercontent.com` a `next.config.ts` (`images.remotePatterns`) para permitir carregar a imagem via `next/image`.
- Validar a área de conteúdo "Sobre" (`2131-2611`) via Playwright contra o protótipo, incluindo o estado sem imagem (campo ausente no CMS).

## Capabilities

### New Capabilities

- `minimalist-profile-avatar-cms`: resolução da imagem de perfil (avatar/portrait) minimalista a partir do repositório CMS, seguindo o pipeline BFS → `CmsGraph` → mapper → `PortfolioData` já usado pelas demais telas, com fallback quando o campo não existe no CMS.

### Modified Capabilities

<!-- minimalist-component-system e minimalist-cms-presentation ainda não existem em openspec/specs/ (propostas por
     minimalist-portfolio-components e minimalist-recruiter-screens, ainda não arquivadas). Como não há spec canônica
     para modificar, os deltas abaixo são registrados como ADDED Requirements sob os mesmos nomes de capability,
     refinando o que essas mudanças pendentes ainda não entregaram, em vez de criar uma quarta capability solta. -->
- `minimalist-component-system`: a "Figma component fidelity" do `switch-btn` e do `divider` (requisito já proposto, ainda não arquivado) ganha verificação concreta de geometria/estado contra os nós Figma citados (`2099-1997`, `2126-2821`, `2065-932`, `2065-736`, `2060-84`), incluindo os dois tipos de divisor (entre opções / entre grupos) hoje ausentes visualmente.
- `minimalist-cms-presentation`: "Real CMS portfolio data" (requisito já proposto, ainda não arquivado) passa a exigir explicitamente que a imagem de perfil também venha do CMS (hoje é um arquivo estático local), com estado de ausência tratado sem imagem quebrada.

## Impact

- `src/features/minimalist/components/minimalist-controls.tsx` (`SwitchButton`, `I18nToggle`, `ThemeToggle`, `Divider`)
- `src/features/minimalist/components/minimalist-recruiter.tsx` (header, `AboutPage`)
- `src/features/minimalist/variants.ts` (`switchButtonVariants`, `dividerVariants`)
- `src/features/minimalist/styles.css` (`.minimalist-switch`, `.minimalist-control-group`, `.minimalist-recruiter__header .minimalist-switch` override, `.minimalist-divider*`)
- `src/shared/data/map-portfolio.ts`, `src/shared/types/portfolio.ts` (novo campo de avatar)
- `next.config.ts` (`images.remotePatterns`)
- `public/images/minimalist-profile.png` (removido do fluxo de renderização; decisão de exclusão do arquivo fica para a task de limpeza)
- Sem mudança de schema de API pública; mudança é interna ao feature `minimalist` e ao pipeline CMS existente.
