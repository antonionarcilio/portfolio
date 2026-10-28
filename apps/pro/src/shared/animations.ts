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

/** Curva compartilhada pelos componentes de interface (acordeão, avatares); mesma do restante do projeto. */
const INTERFACE_EASING = SCRAMBLE_EASING;

/** Abertura/fechamento do painel do acordeão. */
export const ACCORDION_DURATION_SECONDS = 0.3;

export const ACCORDION_TRANSITION = { duration: ACCORDION_DURATION_SECONDS, ease: INTERFACE_EASING };

export const accordionPanelVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
};

/** A seta de `arrow-left` aponta para baixo (fechado) a -90° e para cima (aberto) a 90°. */
export const accordionArrowVariants = {
  collapsed: { rotate: -90 },
  expanded: { rotate: 90 },
};

/** Revelação da cor do avatar e do chip com o nome ao passar o mouse num grupo de time. */
export const AVATAR_REVEAL_DURATION_SECONDS = 0.35;

const AVATAR_REVEAL_TRANSITION = { duration: AVATAR_REVEAL_DURATION_SECONDS, ease: INTERFACE_EASING };

/** O chip nasce 4px abaixo da posição final e sobe ao aparecer. */
export const AVATAR_NAME_CHIP_OFFSET_PIXELS = 4;

/** O avatar com hover sobe 6px (o chip com o nome sobe junto). */
export const AVATAR_LIFT_PIXELS = 6;

export const avatarLiftVariants = {
  rest: { y: 0, transition: AVATAR_REVEAL_TRANSITION },
  hover: { y: -AVATAR_LIFT_PIXELS, transition: AVATAR_REVEAL_TRANSITION },
};

export const avatarSaturationVariants = {
  rest: { opacity: 1, transition: AVATAR_REVEAL_TRANSITION },
  hover: { opacity: 0, transition: AVATAR_REVEAL_TRANSITION },
};

export const avatarNameChipVariants = {
  rest: { opacity: 0, y: AVATAR_NAME_CHIP_OFFSET_PIXELS, transition: AVATAR_REVEAL_TRANSITION },
  hover: { opacity: 1, y: 0, transition: AVATAR_REVEAL_TRANSITION },
};

/** Troca de ilustração (ex.: formulário de contato vazio → preenchido → enviado): fade cruzado, um de cada vez. */
export const ILLUSTRATION_FADE_DURATION_SECONDS = 0.4;

export const ILLUSTRATION_FADE_TRANSITION = { duration: ILLUSTRATION_FADE_DURATION_SECONDS, ease: INTERFACE_EASING };

export const illustrationFadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
