/** Duração total da decifragem de um texto ao trocar de idioma. */
export const SCRAMBLE_DURATION_SECONDS = 1;

/** Taxa de troca dos caracteres sorteados; abaixo de 60fps para o efeito ser legível, não um borrão. */
export const SCRAMBLE_FRAMES_PER_SECOND = 24;

/** Mesma curva do restante do projeto (ver skill `shared-animation-values`). */
export const SCRAMBLE_EASING = [0.2, 0.7, 0.2, 1] as const;

/**
 * Teto de espera pela chegada do novo idioma (o `router.push` busca a página no servidor).
 * Se o locale nunca mudar — rede caiu, navegação cancelada — a flag expira sozinha.
 */
export const LOCALE_SWITCH_TIMEOUT_MILLISECONDS = 5000;

/** Folga após o locale mudar, para todos os `ScrambleText` já terem lido a flag no layout effect. */
export const LOCALE_SWITCH_SETTLE_MILLISECONDS = 300;
