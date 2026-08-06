import { useEffect, useState } from 'react';

import { MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX } from '../a11y';

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
