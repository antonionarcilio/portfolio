import { useCallback, useEffect, useRef } from 'react';

import { resolveMinimalistSoundSrc, type MinimalistSoundKey } from './sound-catalog';

export type MinimalistSoundController = {
  play: () => void;
  pause: () => void;
  stop: () => void;
};

export function useMinimalistSoundEffects(key: MinimalistSoundKey, enabled: boolean): MinimalistSoundController {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'none';
    audio.src = resolveMinimalistSoundSrc(key);
    audioRef.current = audio;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [key]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!enabled || !audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Autoplay/loading failures stay silent; the interaction remains usable.
    });
  }, [enabled]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  return { play, pause, stop };
}
