'use client';

import { useTranslations } from 'next-intl';

import { TimelineExperience } from '@/features/minimalist/components/timeline';
import type { MinimalistAppearance } from '@/features/minimalist/types';

const APPEARANCES: MinimalistAppearance[] = ['light', 'dark'];

export default function MinimalistTimelinePreviewPage() {
  const t = useTranslations('minimalist.timelinePreview');
  const appearanceLabel: Record<MinimalistAppearance, string> = {
    light: t('appearanceLight'),
    dark: t('appearanceDark'),
  };

  return (
    <div>
      <div className="p-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      {APPEARANCES.map((appearance) => (
        <section
          key={appearance}
          className={`minimalist-theme minimalist-theme--${appearance} flex flex-col gap-8 p-8`}
        >
          <h2 className="text-xl font-bold">{appearanceLabel[appearance]}</h2>
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col items-center gap-4">
              <h3 className="font-bold">{t('activeStart')}</h3>
              <TimelineExperience appearance={appearance} activeStep="start" startYear="2026" endYear="2022" />
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="font-bold">{t('activeEnd')}</h3>
              <TimelineExperience appearance={appearance} activeStep="end" startYear="2026" endYear="2022" />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
