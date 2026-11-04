import { useEffect, useState } from 'react';

import { MINIMALIST_A11Y_ACCORDION_MAX_WIDTH_PX, MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX } from '../a11y';

function useIsViewportAtMost(maxWidthPx: number): boolean {
  const [isWithinRange, setIsWithinRange] = useState(false);

  useEffect(() => {
    const update = () => setIsWithinRange(window.innerWidth <= maxWidthPx);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [maxWidthPx]);

  return isWithinRange;
}

// The Minimalist upscale lock is intentionally disabled together with the scale/font-size option.
// Keep the implementation commented for a future reactivation:
// export function useIsMinimalistUpscaleLocked(): boolean {
//   const [isLocked, setIsLocked] = useState(false);
//
//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(max-width: 399px)');
//     const update = () => setIsLocked(mediaQuery.matches);
//     update();
//     mediaQuery.addEventListener('change', update);
//     return () => mediaQuery.removeEventListener('change', update);
//   }, []);
//
//   return isLocked;
// }

export function useIsMinimalistSoundLocked(): boolean {
  return useIsViewportAtMost(MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX);
}

// Drives the mobile accordion presentation of the a11y panel; matches the project's shared
// mobile breakpoint (670px) rather than the narrower sound-lock threshold above.
export function useIsMinimalistA11yAccordionLayout(): boolean {
  return useIsViewportAtMost(MINIMALIST_A11Y_ACCORDION_MAX_WIDTH_PX);
}
