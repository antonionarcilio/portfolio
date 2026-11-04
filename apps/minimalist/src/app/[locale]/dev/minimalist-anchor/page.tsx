'use client';

import { useTranslations } from 'next-intl';

import { MinimalistAnchor } from '@/features/minimalist/components/anchor';
import { MinimalistSoundPreferenceProvider } from '@/features/minimalist/contexts/sound-preference-context';
import type { MinimalistAppearance } from '@/features/minimalist/types';

const APPEARANCES: MinimalistAppearance[] = ['light', 'dark'];
const VARIANTS = ['primary', 'secondary', 'tertiary'] as const;

const PREVIEW_HREF = 'https://example.com';

export default function MinimalistAnchorPreviewPage() {
  const t = useTranslations('minimalist.anchorPreview');
  const label = t('linkLabel');
  const variantLabel: Record<(typeof VARIANTS)[number], string> = {
    primary: t('variantPrimary'),
    secondary: t('variantSecondary'),
    tertiary: t('variantTertiary'),
  };
  const appearanceLabel: Record<MinimalistAppearance, string> = {
    light: t('appearanceLight'),
    dark: t('appearanceDark'),
  };

  return (
    <MinimalistSoundPreferenceProvider enabled={false}>
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
                <div className="flex flex-wrap items-start gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{t('stateEnabled')}</span>
                    <MinimalistAnchor appearance={appearance} variant={variant} href={PREVIEW_HREF}>
                      {label}
                    </MinimalistAnchor>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{t('stateDisabled')}</span>
                    <MinimalistAnchor appearance={appearance} variant={variant} href={PREVIEW_HREF} disabled>
                      {label}
                    </MinimalistAnchor>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{t('stateNoIcon')}</span>
                    <MinimalistAnchor
                      appearance={appearance}
                      variant={variant}
                      href={PREVIEW_HREF}
                      trailingIcon={false}
                    >
                      {label}
                    </MinimalistAnchor>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">{t('stateLowercase')}</span>
                    <MinimalistAnchor appearance={appearance} variant={variant} href={PREVIEW_HREF} uppercase={false}>
                      {label}
                    </MinimalistAnchor>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </MinimalistSoundPreferenceProvider>
  );
}
