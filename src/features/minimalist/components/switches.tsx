'use client';

import { useTranslations } from 'next-intl';

import type { MinimalistAppearance } from '../types';
import { Divider } from './divider';
import { MinimalistSwitchBtn } from './switch-btn';

type I18nToggleProps = {
  appearance: MinimalistAppearance;
  locale: 'en' | 'pt-BR';
  onChange: (locale: 'en' | 'pt-BR') => void;
};

export function I18nToggle({ appearance, locale, onChange }: I18nToggleProps) {
  const t = useTranslations('minimalist.controls');
  return (
    <div className="minimalist-control-group" role="group" aria-label={t('languageGroup')}>
      <span className="minimalist-control-group__label">{t('language')}</span>
      <div className="minimalist-control-group__options">
        <MinimalistSwitchBtn
          appearance={appearance}
          current={locale === 'pt-BR'}
          label="PT"
          onClick={() => onChange('pt-BR')}
        />
        <Divider appearance={appearance} variant="v1" orientation="vertical" />
        <MinimalistSwitchBtn
          appearance={appearance}
          current={locale === 'en'}
          label="EN"
          onClick={() => onChange('en')}
        />
      </div>
    </div>
  );
}

type ThemeToggleProps = { appearance: MinimalistAppearance; onChange: (appearance: MinimalistAppearance) => void };

export function ThemeToggle({ appearance, onChange }: ThemeToggleProps) {
  const t = useTranslations('minimalist.controls');
  return (
    <div className="minimalist-control-group" role="group" aria-label={t('themeGroup')}>
      <span className="minimalist-control-group__label">{t('theme')}</span>
      <div className="minimalist-control-group__options">
        <MinimalistSwitchBtn
          appearance={appearance}
          current={appearance === 'light'}
          label={t('light')}
          onClick={() => onChange('light')}
        />
        <Divider appearance={appearance} variant="v1" orientation="vertical" />
        <MinimalistSwitchBtn
          appearance={appearance}
          current={appearance === 'dark'}
          label={t('dark')}
          onClick={() => onChange('dark')}
        />
      </div>
    </div>
  );
}

type ModeToggleProps = { appearance: MinimalistAppearance; current: 'R' | 'C' };

export function ModeToggle({ appearance, current }: ModeToggleProps) {
  const t = useTranslations('minimalist.recruiter');
  return (
    <div className="minimalist-control-group" role="group" aria-label={t('mode')}>
      <span className="minimalist-control-group__label">{t('mode')}</span>
      <div className="minimalist-control-group__options">
        <MinimalistSwitchBtn appearance={appearance} current={current === 'R'} label="R" />
        <Divider appearance={appearance} variant="v1" orientation="vertical" />
        <MinimalistSwitchBtn appearance={appearance} current={current === 'C'} label="C" disabled />
      </div>
    </div>
  );
}
