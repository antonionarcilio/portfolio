export const MINIMALIST_SOUND_KEYS = [
  'clearMouseClicks',
  'clickError',
  'fastDoubleClickOnMouse',
  'modernTechnologySelect',
  'mouseClickClose',
  'onOrOffLightSwitchTap',
  'plasticBubbleClick',
  'typewriterSoftClick',
] as const;

export type MinimalistSoundKey = (typeof MINIMALIST_SOUND_KEYS)[number];

export const MINIMALIST_DEFAULT_SOUND_KEY: MinimalistSoundKey = 'plasticBubbleClick';

export const MINIMALIST_SOUND_CATALOG: Record<MinimalistSoundKey, string> = {
  clearMouseClicks: '/portfolios/minimalist/sounds/clear-mouse-clicks.wav',
  clickError: '/portfolios/minimalist/sounds/click-error.wav',
  fastDoubleClickOnMouse: '/portfolios/minimalist/sounds/fast-double-click-on-mouse.wav',
  modernTechnologySelect: '/portfolios/minimalist/sounds/modern-technology-select.wav',
  mouseClickClose: '/portfolios/minimalist/sounds/mouse-click-close.wav',
  onOrOffLightSwitchTap: '/portfolios/minimalist/sounds/on-or-off-light-switch-tap.wav',
  plasticBubbleClick: '/portfolios/minimalist/sounds/plastic-bubble-click.wav',
  typewriterSoftClick: '/portfolios/minimalist/sounds/typewriter-soft-click.wav',
};

export function resolveMinimalistSoundSrc(key: MinimalistSoundKey): string {
  return MINIMALIST_SOUND_CATALOG[key] ?? MINIMALIST_SOUND_CATALOG[MINIMALIST_DEFAULT_SOUND_KEY];
}
