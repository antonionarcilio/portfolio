import type { StaticImageData } from 'next/image';

import codeIcon from '@/_assets/icons/lucide-code.svg';
import contrastIcon from '@/_assets/icons/lucide-contrast.svg';
import eyeIcon from '@/_assets/icons/lucide-eye-color-blind.svg';
import highlightLinksIcon from '@/_assets/icons/lucide-highligh-links.svg';
import letterSpacingIcon from '@/_assets/icons/lucide-letter-spacing.svg';
import lineHeightIcon from '@/_assets/icons/lucide-line-height.svg';
import cursorIcon from '@/_assets/icons/solar-cursor.svg';
import meditationRoundIcon from '@/_assets/icons/solar-meditation-round.svg';
import magnifierZoomInIcon from '@/_assets/icons/solar-minimalistic-magnifer-zoom-in.svg';
import runningIcon from '@/_assets/icons/solar-running.svg';
import type { A11yFeatureKey } from '@/shared/a11y/store';

type A11yOption = { key: A11yFeatureKey; icon: StaticImageData; iconChecked?: StaticImageData };

/**
 * Itens do menu de acessibilidade, na ordem em que aparecem: o painel de ferramentas e o
 * dropdown do header clássico leem desta lista. O rótulo vem de `pro.a11y.<key>`.
 */
export const A11Y_OPTIONS: A11yOption[] = [
  { key: 'bigCursor', icon: cursorIcon },
  { key: 'highlightLinks', icon: highlightLinksIcon },
  { key: 'biggerText', icon: magnifierZoomInIcon },
  { key: 'increasedLetterSpacing', icon: letterSpacingIcon },
  { key: 'monospaceFont', icon: codeIcon },
  { key: 'increasedLineHeight', icon: lineHeightIcon },
  { key: 'highContrast', icon: contrastIcon },
  { key: 'colorBlindFilter', icon: eyeIcon },
  { key: 'pauseAnimations', icon: runningIcon, iconChecked: meditationRoundIcon },
];
