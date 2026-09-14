## 1. Persistência da seção ativa

- [x] 1.1 Adicionar em `src/features/minimalist/utils/preferences.ts` a constante `ACTIVE_SECTION_STORAGE_KEY = 'minimalist:active-section'`, junto das demais chaves existentes
- [x] 1.2 Adicionar helpers session-scoped `readStoredSessionPreference`/`writeStoredSessionPreference` (`sessionStorage`, com `try/catch` como as de `localStorage`) e o helper de leitura/validação tipado `readStoredSection(sections: string[]): string | null`, que usa o helper de sessão, valida contra as seções conhecidas e retorna `null` para valores ausentes/inválidos
- [x] 1.3 Restaurar `activeIndex` em `src/features/minimalist/components/recruiter.tsx` via inicializador lazy `useState(() => initialActiveIndex(pages))`, combinado com: (a) `<script>` inline de pré-hidratação no layout do minimalista que posiciona o track via CSS (`--minimalist-active-section-offset` + classe `minimalist-pre-hydration` no `<html>`); (b) guarda `displayIndex = hasMounted ? activeIndex : 0` para manter o primeiro render idêntico ao SSR (seções `aria-hidden`/`inert`, paginação lateral, footer); (c) `suppressHydrationWarning` no `<html>` do layout raiz; (d) `useEffect` que remove a classe pré-hidratação após o mount
- [x] 1.4 Gravar o identificador da seção no `sessionStorage` dentro de `selectPage`, no mesmo ponto onde `setActiveIndex` é chamado, usando `writeStoredSessionPreference(ACTIVE_SECTION_STORAGE_KEY, pages[nextIndex].id)`

## 2. Verificação

- [x] 2.1 Validar que reload mantém a seção ativa sem flash nem animação (navegar para experience, recarregar, confirmar que já abre em experience direto na primeira pintura)
- [x] 2.2 Validar que estado transitório não é restaurado: abrir modal de bio e expandir card de projeto, recarregar, confirmar que abrem fechados/recolhidos
- [x] 2.3 Validar fallback: apagar a chave no `sessionStorage` e recarregar, confirmar abertura na primeira seção
- [x] 2.4 Rodar `npx pnpm lint` e `npx pnpm typecheck` sem erros
