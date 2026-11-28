import { accessibilityIcon } from './accessibility-icon';
import { arrowUpRightIcon } from './arrow-up-right-icon';
import { closeCircleIcon } from './close-circle-icon';
import { contrastIcon } from './contrast-icon';
import { cursorIcon } from './cursor-icon';
import { eyeColorBlindIcon } from './eye-color-blind-icon';
import { globeIcon } from './globe-icon';
import { highlightLinksIcon } from './highlight-links-icon';
import { languagesIcon } from './languages-icon';
import { letterSpacingIcon } from './letter-spacing-icon';
import { lineHeightIcon } from './line-height-icon';
import { linkIcon } from './link-icon';
import { magnifierZoomInIcon } from './magnifier-zoom-in-icon';
import { meditationRoundIcon } from './meditation-round-icon';
import { menuDotsCircleIcon } from './menu-dots-circle-icon';
import { arrowLeftIcon, arrowUpWhiteIcon, chevronLeftIcon, chevronRightIcon } from './nudge-icons';
import { runningIcon } from './running-icon';
import { slashIcon } from './slash-icon';
import { sunFogIcon } from './sun-fog-icon';
import { sunIcon } from './sun-icon';
import { teaCupIcon } from './tea-cup-icon';
import { typeIcon } from './type-icon';
import type { AnimatedIconDefinition } from './types';
import { undoIcon } from './undo-icon';
import { userPenIcon } from './user-pen-icon';

/**
 * Catálogo dos ícones que têm animação própria. Para criar um novo: desenhe o SVG inline, marque as
 * partes móveis com `data-*`, escreva `playCycle` (ciclo que termina no repouso) ou `applyState` (pose ativa mantida)
 * e registre aqui.
 */
export const ANIMATED_ICONS = {
  accessibility: accessibilityIcon,
  contrast: contrastIcon,
  'eye-color-blind': eyeColorBlindIcon,
  languages: languagesIcon,
  'letter-spacing': letterSpacingIcon,
  'line-height': lineHeightIcon,
  'meditation-round': meditationRoundIcon,
  running: runningIcon,
  sun: sunIcon,
  'sun-fog': sunFogIcon,
  type: typeIcon,
  'arrow-left': arrowLeftIcon,
  'arrow-up-right': arrowUpRightIcon,
  'arrow-up-white': arrowUpWhiteIcon,
  'chevron-left': chevronLeftIcon,
  'chevron-right': chevronRightIcon,
  'close-circle': closeCircleIcon,
  cursor: cursorIcon,
  globe: globeIcon,
  'highlight-links': highlightLinksIcon,
  link: linkIcon,
  'magnifier-zoom-in': magnifierZoomInIcon,
  'menu-dots-circle': menuDotsCircleIcon,
  slash: slashIcon,
  'tea-cup': teaCupIcon,
  undo: undoIcon,
  'user-pen': userPenIcon,
} as const satisfies Record<string, AnimatedIconDefinition>;

export type AnimatedIconName = keyof typeof ANIMATED_ICONS;
