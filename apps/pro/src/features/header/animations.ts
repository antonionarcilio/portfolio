import { SCRAMBLE_EASING } from '@/shared/animations';

/** Mesma curva do restante do projeto; o nome próprio evita ler "scramble" fora do contexto do efeito de idioma. */
const PROJECT_EASING = SCRAMBLE_EASING;

/** Duração-base das transições curtas da ilha (entrada dos itens da lista). */
export const ISLAND_SWAP_DURATION_SECONDS = 0.22;

/**
 * Container de botões da ilha (menu ⇄ abas de ferramentas): a largura se ajusta com uma mola
 * curta, no espírito do dynamic island do iPhone. `duration` aqui é a duração percebida da mola.
 */
export const ISLAND_BAR_SPRING = { type: 'spring', duration: 0.75, bounce: 0.14 } as const;

/** Fade dos botões que saem/entram no container durante a troca menu ⇄ ferramentas. */
export const ISLAND_BUTTONS_FADE_SECONDS = 0.25;

/** Fade do cartão com a lista, que só aparece depois que o container terminou de se ajustar. */
export const ISLAND_CARD_FADE_SECONDS = 0.4;

/**
 * Espera, em ms, até o container terminar de trocar os botões e ajustar a largura: fade de saída
 * do menu + mola. A mola assenta visualmente antes da `duration` nominal, então não há pausa notável.
 */
export const ISLAND_CARD_REVEAL_DELAY_MILLISECONDS = Math.round(
  (ISLAND_BUTTONS_FADE_SECONDS + ISLAND_BAR_SPRING.duration) * 1000,
);

/** Espera, em ms, para o cartão sumir antes de o container voltar a mostrar o menu. */
export const ISLAND_CARD_HIDE_DELAY_MILLISECONDS = Math.round(ISLAND_CARD_FADE_SECONDS * 1000);

export const islandButtonsVariants = {
  hidden: { opacity: 0, transition: { duration: ISLAND_BUTTONS_FADE_SECONDS, ease: PROJECT_EASING } },
  visible: { opacity: 1, transition: { duration: ISLAND_BUTTONS_FADE_SECONDS, ease: PROJECT_EASING } },
};

export const islandCardVariants = {
  hidden: { opacity: 0, transition: { duration: ISLAND_CARD_FADE_SECONDS, ease: PROJECT_EASING } },
  visible: { opacity: 1, transition: { duration: ISLAND_CARD_FADE_SECONDS, ease: PROJECT_EASING } },
};

/** Deslize da pílula branca que marca o item ativo do menu. */
export const islandPillTransition = { duration: 0.22, ease: PROJECT_EASING };

/** Intervalo entre a entrada de um item da lista e o seguinte. */
export const LIST_STAGGER_STEP_SECONDS = 0.06;

/** Espera antes do primeiro item, para a lista começar depois do painel/aba já visível. */
export const LIST_INITIAL_DELAY_SECONDS = 0.08;

export const LIST_ITEM_OFFSET_PIXELS = 8;

export const listItemVariants = {
  hidden: { opacity: 0, y: LIST_ITEM_OFFSET_PIXELS },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: ISLAND_SWAP_DURATION_SECONDS, ease: PROJECT_EASING, delay },
  }),
};

export function listStaggerDelay(index: number): number {
  return LIST_INITIAL_DELAY_SECONDS + index * LIST_STAGGER_STEP_SECONDS;
}
