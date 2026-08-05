'use client';

import { useTranslations } from 'next-intl';

import type { MinimalistAppearance, MinimalistStepState } from '../types';
import { navigationHintVariants, sectionSwitchVariants, stepVariants } from '../variants';

type NavigationHintProps = { appearance: MinimalistAppearance; state?: 'regular' | 'hover' };

export function NavigationHint({ appearance, state = 'regular' }: NavigationHintProps) {
  const t = useTranslations('minimalist.navigation');
  return (
    <div className={navigationHintVariants({ appearance, state })}>
      <span>{t('navigation')}</span>
      <span aria-hidden="true">↓</span>
      <span aria-hidden="true">↑</span>
    </div>
  );
}

type StepProps = { appearance: MinimalistAppearance; state?: MinimalistStepState; label: string };

export function Step({ appearance, state = 'regular', label }: StepProps) {
  return <span className={stepVariants({ appearance, state })} aria-label={label} aria-hidden="true" />;
}

type PaginationProps = {
  appearance: MinimalistAppearance;
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
};

export function StepPagination({ appearance, currentStep, totalSteps, onStepChange }: PaginationProps) {
  const t = useTranslations('minimalist.navigation');
  return (
    <div
      className="minimalist-content-pagination"
      data-content-pagination="true"
      role="group"
      aria-label={t('stepPagination', { current: currentStep, total: totalSteps })}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const label = t('step', { number: index + 1 });
        const active = index + 1 === currentStep;
        if (!onStepChange) {
          return <Step key={index} appearance={appearance} state={active ? 'current' : 'regular'} label={label} />;
        }
        return (
          <button
            key={index}
            type="button"
            className="minimalist-content-pagination__button"
            data-content-step={index + 1}
            aria-label={label}
            aria-current={active ? 'step' : undefined}
            onClick={() => onStepChange(index)}
          >
            <Step appearance={appearance} state={active ? 'current' : 'regular'} label={label} />
          </button>
        );
      })}
    </div>
  );
}

type SectionSwitchProps = {
  appearance: MinimalistAppearance;
  active: boolean;
  label: string;
  onClick: () => void;
  showMarker?: boolean;
  tabIndex?: number;
};

export function SectionSwitch({ appearance, active, label, onClick, showMarker = true, tabIndex }: SectionSwitchProps) {
  return (
    <button
      type="button"
      className={sectionSwitchVariants({ appearance, active })}
      aria-pressed={active}
      aria-label={label}
      tabIndex={tabIndex}
      onClick={onClick}
    >
      {showMarker && active && <span aria-hidden="true">➤</span>}
      {label}
    </button>
  );
}
