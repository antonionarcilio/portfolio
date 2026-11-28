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

/** Curva compartilhada pelos componentes de interface (acordeão, avatares, Anchor); mesma do `transition-interface`. */
export const INTERFACE_EASING = SCRAMBLE_EASING;

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

/**
 * Fade de 400ms (nasceu na troca de ilustração do formulário de contato antigo, removido no chat guiado;
 * hoje só o "Veja também" usa).
 */
export const ILLUSTRATION_FADE_DURATION_SECONDS = 0.4;

export const ILLUSTRATION_FADE_TRANSITION = { duration: ILLUSTRATION_FADE_DURATION_SECONDS, ease: INTERFACE_EASING };

/** "Veja também": a grade aparece em fade depois que o sorteio roda no cliente, sem mostrar a troca de cards. */
export const relatedProjectsFadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: ILLUSTRATION_FADE_TRANSITION },
};

/** Uma volta completa do indicador de carregamento (ex.: botão de envio do contato), em loop linear. */
export const SPINNER_ROTATION_DURATION_SECONDS = 0.8;

export const SPINNER_TRANSITION = {
  duration: SPINNER_ROTATION_DURATION_SECONDS,
  ease: 'linear',
  repeat: Infinity,
} as const;

/**
 * Modal centralizado (`ModalDialog`, desktop do `ConfirmDialog`): véu e painel aparecem juntos; o painel sobe
 * 8px. O bottom sheet do mobile usa a transição própria da vaul.
 */
export const DIALOG_FADE_DURATION_SECONDS = 0.2;

const DIALOG_PANEL_OFFSET_PIXELS = 8;

const DIALOG_TRANSITION = { duration: DIALOG_FADE_DURATION_SECONDS, ease: INTERFACE_EASING };

export const dialogOverlayVariants = {
  hidden: { opacity: 0, transition: DIALOG_TRANSITION },
  visible: { opacity: 1, transition: DIALOG_TRANSITION },
};

export const dialogPanelVariants = {
  hidden: { opacity: 0, y: DIALOG_PANEL_OFFSET_PIXELS, transition: DIALOG_TRANSITION },
  visible: { opacity: 1, y: 0, transition: DIALOG_TRANSITION },
};

/**
 * Ícones animados (`AnimatedIcon`): um ciclo de fumaça da xícara. Cada fio sobe, balança e volta ao
 * repouso, então o ciclo termina sempre na pose estática. Medidas em unidades do viewBox 24×24.
 */
export const ICON_STEAM_CYCLE_SECONDS = 2.2;

/** Curva ease-in-out dos ícones animados: arranca e assenta devagar, sem o "tranco" inicial da curva do projeto. */
export const ICON_SOFT_EASING = [0.45, 0, 0.2, 1] as const;

/** Atraso entre um fio de fumaça e o seguinte, para as 3 ondas não subirem juntas. */
export const ICON_STEAM_STAGGER_SECONDS = 0.25;

export const ICON_STEAM_RISE_UNITS = 1.4;

export const ICON_STEAM_SWAY_UNITS = 0.7;

export const ICON_STEAM_MINIMUM_OPACITY = 0.3;

/** Abaixo disso um ciclo "terminou" sem animar de fato (ex.: "pausar animações"): o loop para em vez de girar em vazio. */
export const ICON_CYCLE_MINIMUM_MILLISECONDS = 50;

/** Seta ↗ (`arrow-up-right`) dos botões e links: gira 45° (sentido horário, passa a apontar para baixo à direita) no hover/foco e volta ao sair. */
export const ICON_ARROW_ACTIVE_ROTATION_DEGREES = 45;

export const ICON_ARROW_ROTATION_SECONDS = 0.4;

/** Ícones que se "desenham" (reiniciar, globo, barra de atalhos): cada traço vai de 0 a 100% e fica completo. */
export const ICON_STROKE_DRAW_SECONDS = 0.8;

/** Atraso entre o início de um traço e o do seguinte, para o desenho acontecer em sequência. */
export const ICON_STROKE_STAGGER_SECONDS = 0.25;

/**
 * Ícones de voltar (seta e chevron ‹): empurram para a esquerda e voltam. Em unidades do viewBox 24×24:
 * 4,5 = 3px num ícone de 16px (5% literal seriam 0,8px, imperceptível).
 */
export const ICON_NUDGE_UNITS = 4.5;

export const ICON_NUDGE_SECONDS = 0.7;

/** Lápis do "Alterar meu nome": passeia por pontos aleatórios (até ±RANGE) e volta ao ponto de origem. */
export const ICON_PEN_SCRIBBLE_RANGE_UNITS = 2.2;

export const ICON_PEN_SCRIBBLE_POINTS = 5;

export const ICON_PEN_SCRIBBLE_SECONDS = 1;

/** Ícone de link (corrente): cada metade se afasta `PULL` na diagonal (em x e em y, unidades do viewBox 24×24) e volta. */
export const ICON_LINK_PULL_UNITS = 2.4;

export const ICON_LINK_PULL_SECONDS = 0.9;

/** Ícone de fechar (círculo com X): as duas linhas do X se desenham de cima para baixo, a segunda 100ms depois. */
export const ICON_CLOSE_DRAW_SECONDS = 0.5;

export const ICON_CLOSE_SECOND_LINE_DELAY_SECONDS = 0.1;

/** Ícone de pontos (menu de ferramentas): cada ponto entra em fade-in e desliza de cima para baixo, um após o outro. */
export const ICON_DOTS_FADE_SECONDS = 0.3;

export const ICON_DOTS_STAGGER_SECONDS = 0.15;

/** De onde cada ponto parte, acima da posição final (unidades do viewBox 24×24; o anel tem raio 10). */
export const ICON_DOTS_SLIDE_UNITS = 5;

/**
 * Ícone de acessibilidade (boneco): o corpo (com os braços) entra em fade-in e os braços acenam; a cabeça
 * entra depois, em fade-in mais longo e com atraso. Ângulos em graus, positivos = braço sobe.
 */
export const ICON_PERSON_BODY_FADE_SECONDS = 0.2;

export const ICON_PERSON_HEAD_FADE_SECONDS = 0.4;

export const ICON_PERSON_HEAD_DELAY_SECONDS = 0.1;

export const ICON_PERSON_WAVE_SECONDS = 1.2;

/** Posições do aceno, do repouso e de volta: sobe, desce um pouco abaixo do repouso, sobe de novo e assenta. */
export const ICON_PERSON_WAVE_DEGREES = [0, 21, -9, 21, 0] as const;

/** Cursor (acessibilidade): passeia por pontos aleatórios em x e y e volta ao lugar. */
export const ICON_CURSOR_SCRIBBLE_RANGE_UNITS = 3;

export const ICON_CURSOR_SCRIBBLE_POINTS = 5;

export const ICON_CURSOR_SCRIBBLE_SECONDS = 1;

/**
 * Marca-texto (destacar links): entra na diagonal, vindo de cima e da direita (ângulo medido a partir do eixo
 * horizontal; 75° = quase vertical) até a posição final, e então vai e volta na horizontal, como quem rabisca.
 */
export const ICON_MARKER_ENTRY_ANGLE_DEGREES = 75;

export const ICON_MARKER_ENTRY_DISTANCE_UNITS = 7;

export const ICON_MARKER_ENTRY_SECONDS = 0.45;

export const ICON_MARKER_SCRIBBLE_UNITS = 2.2;

export const ICON_MARKER_SCRIBBLE_SECONDS = 0.8;

/** Lupa com "+" (aumentar escala): só o sinal de mais cresce e volta, no centro da lupa. */
export const ICON_ZOOM_PLUS_SCALE = 1.7;

export const ICON_ZOOM_PLUS_SECONDS = 0.7;

/** Espaçamento de letras: as duas barras se afastam em sentidos opostos (esquerda ← →  direita) e voltam. */
export const ICON_SPREAD_UNITS = 2;

export const ICON_SPREAD_SECONDS = 0.7;

/** Fonte monoespaçada (`T`): a barra de cima se estica na horizontal e volta. */
export const ICON_TYPE_TOP_SCALE = 1.2;

export const ICON_TYPE_SECONDS = 0.7;

/** Espaçamento de linha: as setas se afastam para cima e para baixo e a haste se alonga junto. */
export const ICON_LINE_HEIGHT_ARROW_UNITS = 2;

export const ICON_LINE_HEIGHT_STEM_SCALE = 1.25;

export const ICON_LINE_HEIGHT_SECONDS = 0.7;

/** Filtro para daltonismo (olho): a bola do olho pisca (achata na vertical e volta). */
export const ICON_EYE_BLINK_SCALE = 0.12;

export const ICON_EYE_BLINK_SECONDS = 0.5;

/**
 * "Pausar animações" desligado (corredor): braço de trás -15°, braço da frente +15°, cabeça 5% do ícone na
 * horizontal (24 × 0,05 = 1,2 unidade) e as pernas balançam em sentidos opostos.
 */
export const ICON_RUNNER_ARM_DEGREES = 15;

export const ICON_RUNNER_LEG_DEGREES = 8;

export const ICON_RUNNER_HEAD_SHIFT_UNITS = 1.2;

export const ICON_RUNNER_SECONDS = 0.9;

/** "Pausar animações" ligado (meditação): tremor curto, de quem se segura para não se mexer. */
export const ICON_BUZZ_UNITS = 0.45;

export const ICON_BUZZ_STEPS = 12;

export const ICON_BUZZ_SECONDS = 0.7;

/** Ícones de tema: cada traço apaga e acende (fade-out → fade-in), um após o outro, em ordem aleatória. */
export const ICON_FLICKER_SECONDS = 0.8;

/** Sol e entardecer: atraso entre um traço (raio ou listra do reflexo) e o seguinte, na ordem sorteada. */
export const ICON_RAYS_STAGGER_SECONDS = 0.1;
