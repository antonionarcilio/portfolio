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
  clearMouseClicks: '/sounds/clear-mouse-clicks.wav',
  clickError: '/sounds/click-error.wav',
  fastDoubleClickOnMouse: '/sounds/fast-double-click-on-mouse.wav',
  modernTechnologySelect: '/sounds/modern-technology-select.wav',
  mouseClickClose: '/sounds/mouse-click-close.wav',
  onOrOffLightSwitchTap: '/sounds/on-or-off-light-switch-tap.wav',
  plasticBubbleClick: '/sounds/plastic-bubble-click.wav',
  typewriterSoftClick: '/sounds/typewriter-soft-click.wav',
};

export function resolveMinimalistSoundSrc(key: MinimalistSoundKey): string {
  return MINIMALIST_SOUND_CATALOG[key] ?? MINIMALIST_SOUND_CATALOG[MINIMALIST_DEFAULT_SOUND_KEY];
}
