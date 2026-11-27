/**
 * Ajustes locais sobre o snapshot da lista pública (`disposable-email-domains.json`). Ficam em código, e não no
 * snapshot, para sobreviver a qualquer atualização pelo script e para o projeto não depender de a lista
 * pública aceitar uma correção. Domínios em minúsculas, sem "@".
 */

/** Bloqueados mesmo que não estejam (ou deixem de estar) na lista pública — ex.: vistos em spam real aqui. */
export const EXTRA_BLOCKED_EMAIL_DOMAINS: readonly string[] = [];

/** Liberados mesmo que a lista pública os marque — falsos positivos reportados por leads reais. Vence o bloqueio. */
export const ALLOWED_EMAIL_DOMAINS: readonly string[] = [];
