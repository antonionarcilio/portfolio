## Context

O `MinimalistRecruiter` (em `src/features/minimalist/components/recruiter.tsx`) controla a seção ativa via estado `activeIndex` (inicializado em 0), com 4 seções (about, projects, experience, education). O projeto já persiste preferências em `localStorage` via `readStoredPreference`/`writeStoredPreference` em `src/features/minimalist/utils/preferences.ts` (chaves `minimalist:appearance` e `minimalist:locale`), seguindo o padrão de estado iniciado com valor lido em `useLayoutEffect` (ver `use-minimalist-appearance.ts`). A seção ativa não tem rotas próprias — é puramente estado interno do componente. Para a seção ativa o escopo é **de sessão** (`sessionStorage`): sobrevive ao reload da aba, mas não persiste entre abas/sessões.

## Goals / Non-Goals

**Goals:**
- Restaurar a seção ativa já na primeira pintura após reload, sem flash da seção inicial nem animação de scroll no carregamento.
- Restringir a persistência apenas à seção ativa, com escopo de sessão (`sessionStorage`).

**Non-Goals:**
- Persistir estado transitório de UI: modal de bio (`isAboutExpanded`), cards expandidos (`expandedProjectIds`), experiência expandida (`isExperienceExpanded`), painel de acessibilidade (`a11yOpen`).
- Criar rotas/URLs por seção (hash ou query param) ou sincronizar com o histórico do navegador.
- Aplicar o comportamento a outros portfólios (gamified) ou minigames.
- Persistir a seção ativa entre abas/sessões (localStorage).

## Decisions

1. **Persistir índice vs identificador.** Persiste-se o identificador da seção (`'about' | 'projects' | 'experience' | 'education'`) em vez do índice numérico. O identificador é estável e legível; o fallback para a primeira seção acontece quando o identificador não corresponde a nenhuma seção conhecida. O índice é derivado na restauração. Alternativa considerada: armazenar o índice numérico — rejeitada por ser frágil a reordenação/remoção de seções e por não ser autodocumentado.

2. **Onde restaurar o estado.** Nova constante de chave (`minimalist:active-section`) em `src/features/minimalist/utils/preferences.ts`, mais `MINIMALIST_SECTION_IDS` (ids ordenados, base tanto para validação quanto para o script de pré-hidratação). A primeira pintura já exibe a seção armazenada através de três mecanismos coordenados:
   - **Pré-hidratação via CSS (inline script no `<head>`):** o layout do minimalista (`src/app/[locale]/portfolios/minimalist/layout.tsx`, Server Component) injeta um `<script>` inline que o React 19 sobe para o `<head>`. Ele roda de forma síncrona antes da pintura, lê o `sessionStorage` e, se houver uma seção válida com índice > 0, adiciona a classe `minimalist-pre-hydration` no `<html>` e define `--minimalist-active-section-offset`. A regra `.minimalist-pre-hydration .minimalist__content-track { transform: translateY(calc(var(--minimalist-active-section-offset) * -25%)); }` posiciona o track já na seção correta antes de qualquer JS de bundle carregar. O script é idempotente e coberto por `try/catch` (sessionStorage indisponível não quebra nada).
   - **Hidratação consistente com o frame pintado:** o cliente inicializa `activeIndex` com lazy `useState(() => initialActiveIndex(pages))`, então o primeiro render do cliente já hidrata no índice armazenado e o framer-motion aplica o mesmo `transform` inline (sem `initial`, o framer não anima no mount). Não há snap entre o estado pré-hidratação (CSS) e o pós-hidratação (inline) porque ambos são o mesmo deslocamento.
   - **Guarda contra hydration mismatch do conteúdo:** como o SSR sempre renderiza a seção 1, qualquer saída que deriva de `activeIndex` e difere entre SSR e primeiro render do cliente causaria erro de hidratação. Usa-se `displayIndex = hasMounted ? activeIndex : 0`: no primeiro render (hidratação) a saída é idêntica ao SSR (seções `aria-hidden`/`inert`, `currentStep` da paginação lateral, conteúdo e estado ativo do footer); um `useLayoutEffect` seta `hasMounted = true` antes da pintura, e o efeito de translate do footer re-roda (`hasMounted` nas deps) para centralizar a nova janela.
   - **`suppressHydrationWarning` no `<html>`:** a mutação pré-hidratação do `<html>` (classe + style) é intencional e o React 19 a reporta como *hydration mismatch* (não patcha atributos). O layout raiz (`src/app/[locale]/layout.tsx`) aplica `suppressHydrationWarning` no `<html>` — padrão consolidado (ex.: next-themes) — e um `useEffect` no recruiter remove a classe `minimalist-pre-hydration` após a hidratação (a variável CSS permanece, inofensiva).

   Alternativas consideradas e rejeitadas: (a) restaurar via `useLayoutEffect` com `activeIndex = 0` no primeiro render — rejeitada porque o navegador pinta o HTML do SSR antes do JS hidratar, então o usuário vê a seção 1 por um tempo antes do salto; (b) inicializador lazy **sem** a guarda `displayIndex` — rejeitada porque o footer/aria/paginação divergem do SSR e o React 19 lança *hydration mismatch*; (c) animar de 0 para a seção armazenada no mount — rejeitada por reintroduzir animação de scroll no load.

3. **Quando persistir.** Escrever no `sessionStorage` dentro de `selectPage`, onde `setActiveIndex` já é chamado — ponto único de navegação de seção. Isso garante que toda mudança legítima de seção (pagination lateral, footer, seta/wheel) persista, e que bloqueios existentes (conteúdo expandido) não gerem gravações.

4. **Escopo de sessão.** A leitura/escrita usa `readStoredSessionPreference`/`writeStoredSessionPreference` (`sessionStorage`), não `localStorage`. A seção ativa é um estado de navegação da aba corrente; persistir entre abas/sessões não é desejado. O padrão `localStorage` segue sendo usado apenas para preferências (aparência, locale).

5. **Validação do valor lido.** Função auxiliar tipada que valida o identificador contra as seções conhecidas e retorna `null` se inválido; o fallback é a primeira seção. Reaproveita-se o `try/catch` já embutido em `readStoredSessionPreference`.

## Risks / Trade-offs

- **Flash da seção incorreta em SSR/hidratação** → O `<script>` inline no `<head>` (pré-hidratação) posiciona o track via CSS antes da primeira pintura; o cliente hidrata no mesmo índice via lazy init, e o framer aplica o mesmo transform inline. Não há janela em que a seção 1 fique visível. O `suppressHydrationWarning` no `<html>` cobre a mutação intencional do script.
- **Hydration mismatch do conteúdo (footer, aria, paginação)** → Guarda `displayIndex = hasMounted ? activeIndex : 0` mantém o primeiro render idêntico ao SSR; o flip para `hasMounted` acontece em `useLayoutEffect`, antes da pintura, sem estado intermediário visível.
- **Animação de scroll no load** → Sem `initial`, o framer-motion não anima no mount: aplica o `transform` do índice restaurado instantaneamente. Navegações subsequentes mantêm a transição normal (0.55s).
- **`sessionStorage` indisponível (privacidade/limites)** → `readStoredSessionPreference`/`writeStoredSessionPreference` tratam exceções e retornam `null`, resultando no fallback padrão (primeira seção); o script inline também está em `try/catch`.
- **Valor desatualizado após mudança no número/ordem de seções** → Validação por identificador conhecido descarta valores obsoletos com fallback para a primeira seção.
- **Usuários que esperam reset sempre para a primeira seção** → Comportamento é o desejado pelo requisito; sem impacto em acessibilidade, pois a seção ativa já recebe `aria-current` e a persistência apenas o reproduz.
