import { INTERFACE_EASING } from '@/shared/animations';

/**
 * Valores de movimento do chat de contato. Ficam na feature (regra local → global do DESIGN.md): só sobem
 * para `shared/animations.ts` quando outra feature reutilizar.
 */

/** Entrada de cada peça da conversa (balão, resumo, compositor): sobe 8px e aparece. */
export const CHAT_ENTER_DURATION_SECONDS = 0.3;

const CHAT_ENTER_OFFSET_PIXELS = 8;

export const chatEnterVariants = {
  hidden: { opacity: 0, y: CHAT_ENTER_OFFSET_PIXELS },
  visible: { opacity: 1, y: 0, transition: { duration: CHAT_ENTER_DURATION_SECONDS, ease: INTERFACE_EASING } },
};

/** Pontos do "digitando…": cada um pulsa em sequência, 0,15s depois do anterior. */
export const TYPING_DOT_STAGGER_SECONDS = 0.15;

export const TYPING_DOT_TRANSITION = { duration: 0.9, ease: 'easeInOut', repeat: Infinity } as const;

export const TYPING_DOT_ANIMATE = { opacity: [0.3, 1, 0.3], y: [0, -2, 0] };

/**
 * Atraso simulado antes de cada fala do bot (o "agente" pensando): cresce com o tamanho do texto e fica
 * entre 400ms e 900ms. Com animações pausadas (a11y ou `prefers-reduced-motion`) a fala aparece na hora.
 */
export const BOT_TYPING_MINIMUM_MILLISECONDS = 400;
export const BOT_TYPING_MAXIMUM_MILLISECONDS = 900;
export const BOT_TYPING_MILLISECONDS_PER_CHARACTER = 6;

/** Quanto a opção escolhida fica marcada antes de a conversa seguir (estado "selecionado" do design). */
export const OPTION_CONFIRM_MILLISECONDS = 250;

/**
 * Ao recarregar com uma conversa salva, o loading centralizado fica este tempo antes de o chat aparecer —
 * simula o "carregamento" do histórico em vez de trocar de tela num piscar.
 */
export const RESTORE_LOADING_MILLISECONDS = 900;

/**
 * Menu de atalhos (G06): surge e some subindo 4px, mais rápido que as falas — é um controle, não uma peça da
 * conversa. Com animações pausadas, abre e fecha sem transição.
 */
const SHORTCUTS_MENU_OFFSET_PIXELS = 4;

export const SHORTCUTS_MENU_DURATION_SECONDS = 0.2;

const SHORTCUTS_MENU_TRANSITION = { duration: SHORTCUTS_MENU_DURATION_SECONDS, ease: INTERFACE_EASING };

export const shortcutsMenuVariants = {
  hidden: { opacity: 0, y: SHORTCUTS_MENU_OFFSET_PIXELS, transition: SHORTCUTS_MENU_TRANSITION },
  visible: { opacity: 1, y: 0, transition: SHORTCUTS_MENU_TRANSITION },
};
