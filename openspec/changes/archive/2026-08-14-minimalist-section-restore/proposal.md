## Why

No portfólio minimalist, o recrutador navega por seções (about, projects, experience, education) via `activeIndex`. Ao recarregar a página, o usuário volta sempre para a primeira seção, perdendo o contexto de onde estava — uma frustração em sessões longas de navegação.

## What Changes

- Persistir a seção ativa do portfólio minimalist em `sessionStorage` e restaurá-la já na primeira pintura após o reload, sem flash da seção inicial nem animação de scroll no carregamento.
- Restaurar **somente** a seção ativa (índice/identificador da seção). Estado transitório de UI — modal de bio, expansão de cards de projetos, expansão da lista de experiência, painel de acessibilidade — **não** é persistido nem restaurado.
- Validar o valor lido do storage antes de aplicar (índice dentro dos limites, identificador conhecido), descartando valores inválidos com fallback para a primeira seção.
- Usar helpers de leitura/escrita de `sessionStorage` em `src/features/minimalist/utils/preferences.ts`, no mesmo padrão das preferências já existentes, porém com escopo de sessão (não persiste entre abas/sessões).

## Capabilities

### New Capabilities
- `minimalist-section-restore`: Persistência e restauração da seção ativa do portfólio minimalist no reload, restrita apenas à seção corrente.

### Modified Capabilities
<!-- Nenhum spec existente muda de requisito -->

## Impact

- `src/features/minimalist/components/recruiter.tsx` — estado `activeIndex` (lazy init a partir do storage + guarda `displayIndex` para hidratação + escrita em cada mudança de seção).
- `src/features/minimalist/utils/preferences.ts` — nova chave de storage, `MINIMALIST_SECTION_IDS` e helpers de leitura/escrita `sessionStorage` para a seção ativa.
- `src/app/[locale]/portfolios/minimalist/layout.tsx` — `<script>` inline de pré-hidratação (hoisted para `<head>` pelo React 19) que posiciona o track via CSS antes da primeira pintura.
- `src/features/minimalist/styles.css` — regra `.minimalist-pre-hydration .minimalist__content-track`.
- `src/app/[locale]/layout.tsx` — `suppressHydrationWarning` no `<html>` para cobrir a mutação intencional pré-hidratação.
- Sem novas dependências; usa `sessionStorage` (padrão `localStorage` já adotado para aparência e locale).
