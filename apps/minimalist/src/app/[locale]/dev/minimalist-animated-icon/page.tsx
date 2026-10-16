'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  ANIMATED_ICON_NAMES,
  AnimatedIcon,
  type AnimatedIconName,
} from '@/features/minimalist/components/animated-icon';
import {
  IconInteractionProvider,
  useIconInteractionHandlers,
} from '@/features/minimalist/contexts/icon-interaction-context';
import { MinimalistReducedMotionProvider } from '@/features/minimalist/contexts/reduced-motion-context';
import type { MinimalistAppearance } from '@/features/minimalist/types';

const APPEARANCES: MinimalistAppearance[] = ['light', 'dark'];

// Enlarged so the sub-pixel path/scale motion is analysable during design; production usage is ~14–16px.
const PREVIEW_ICON_SIZE = 96;

function AnimatedIconTrigger({ icon, label }: { icon: AnimatedIconName; label: string }) {
  const { state, handlers } = useIconInteractionHandlers({ disabled: false });
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded p-4"
      aria-label={`${label}: ${icon}`}
      {...handlers}
    >
      <IconInteractionProvider value={state}>
        <AnimatedIcon icon={icon} size={PREVIEW_ICON_SIZE} />
      </IconInteractionProvider>
    </button>
  );
}

export default function MinimalistAnimatedIconPreviewPage() {
  const t = useTranslations('minimalist.animatedIconPreview');
  const [reduceMotion, setReduceMotion] = useState(false);
  const appearanceLabel: Record<MinimalistAppearance, string> = {
    light: t('appearanceLight'),
    dark: t('appearanceDark'),
  };

  return (
    <MinimalistReducedMotionProvider enabled={reduceMotion}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p>{t('description')}</p>
        <label className="mt-4 flex w-fit items-center gap-2 text-sm">
          <input type="checkbox" checked={reduceMotion} onChange={(event) => setReduceMotion(event.target.checked)} />
          {t('reduceMotionLabel')}
        </label>
      </div>
      {APPEARANCES.map((appearance) => (
        <section
          key={appearance}
          className={`minimalist-theme minimalist-theme--${appearance} flex flex-col gap-8 p-8`}
        >
          <h2 className="text-xl font-bold">{appearanceLabel[appearance]}</h2>
          <div className="flex flex-wrap gap-12">
            {ANIMATED_ICON_NAMES.map((icon) => (
              <div key={icon} className="flex flex-col items-center gap-4">
                <h3 className="font-bold">{icon}</h3>
                <AnimatedIconTrigger icon={icon} label={t('triggerLabel')} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </MinimalistReducedMotionProvider>
  );
}
