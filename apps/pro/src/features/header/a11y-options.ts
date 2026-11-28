import type { A11yFeatureKey } from '@/shared/a11y/store';
import type { AnimatedIconName } from '@/shared/components/animated-icon/animated-icon-registry';

/** Nomes de ícones animados do catálogo (`ANIMATED_ICONS`): animam no hover/foco da linha inteira. */
type A11yOption = { key: A11yFeatureKey; icon: AnimatedIconName; iconChecked?: AnimatedIconName };

/**
 * Itens do menu de acessibilidade, na ordem em que aparecem: o painel de ferramentas e o
 * dropdown do header clássico leem desta lista. O rótulo vem de `pro.a11y.<key>`.
 */
export const A11Y_OPTIONS: A11yOption[] = [
  { key: 'bigCursor', icon: 'cursor' },
  { key: 'highlightLinks', icon: 'highlight-links' },
  { key: 'biggerText', icon: 'magnifier-zoom-in' },
  { key: 'increasedLetterSpacing', icon: 'letter-spacing' },
  { key: 'monospaceFont', icon: 'type' },
  { key: 'increasedLineHeight', icon: 'line-height' },
  { key: 'highContrast', icon: 'contrast' },
  { key: 'colorBlindFilter', icon: 'eye-color-blind' },
  { key: 'pauseAnimations', icon: 'running', iconChecked: 'meditation-round' },
];
