'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/features/minimalist/components/button';
import type { MinimalistAppearance, MinimalistButtonVariant } from '@/features/minimalist/types';

const APPEARANCES: MinimalistAppearance[] = ['light', 'dark'];
const VARIANTS: MinimalistButtonVariant[] = ['primary', 'secondary'];

export default function MinimalistButtonPreviewPage() {
  const t = useTranslations('minimalist.buttonPreview');
  const tRecruiter = useTranslations('minimalist.recruiter');
  const label = tRecruiter('expand');
  const variantLabel: Record<MinimalistButtonVariant, string> = {
    primary: t('variantPrimary'),
    secondary: t('variantSecondary'),
  };
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
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-4">
                <h3 className="font-bold">{variantLabel[variant]}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{t('stateEnabled')}</span>
                    <Button appearance={appearance} variant={variant} label={label} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{t('stateDisabled')}</span>
                    <Button appearance={appearance} variant={variant} label={label} disabled />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
