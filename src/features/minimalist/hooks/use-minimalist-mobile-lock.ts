import { useEffect, useState } from 'react';

import { MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX } from '../a11y';

export function useIsMinimalistUpscaleLocked(): boolean {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 399px)');
    const update = () => setIsLocked(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isLocked;
}

export function useIsMinimalistSoundLocked(): boolean {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const update = () => setIsLocked(window.innerWidth <= MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isLocked;
}
