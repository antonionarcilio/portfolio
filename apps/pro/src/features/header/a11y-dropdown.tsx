'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import type { A11yFeatures } from '@/shared/a11y/store';
import { ScrambleText } from '@/shared/components/scramble-text';
import { ToggleSwitch } from '@/shared/components/toggle-switch';
import { A11Y_OPTIONS } from './a11y-options';

export type { A11yFeatures } from '@/shared/a11y/store';

type A11yDropdownProps = {
  features: A11yFeatures;
  /** Ver `I18nDropdown`: o painel sai junto com o header e volta com ele. */
  isHeaderHidden: boolean;
  onToggle: (key: keyof A11yFeatures) => void;
};

export function A11yDropdown({ features, isHeaderHidden, onToggle }: A11yDropdownProps) {
  const t = useTranslations('pro.a11y');

  return (
    <div
      // Ver `I18nDropdown`: fade no lugar do deslize — o painel permanece parado e só
      // perde opacidade enquanto o header sai.
      className={`absolute right-0 top-full z-50 mt-2 w-max transition-[opacity,visibility] duration-300 ease-out ${
        isHeaderHidden ? 'invisible opacity-0' : 'opacity-100'
      }`}
    >
      <div className="header-surface flex flex-col gap-1 overflow-hidden rounded-[6px] py-3 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]">
        {A11Y_OPTIONS.map(({ key, icon, iconChecked }) => {
          const iconSrc = iconChecked && features[key] ? iconChecked : icon;
          return (
            <div key={key} className="flex h-6 items-center justify-between gap-3 px-3">
              <div className="flex items-center gap-2">
                <Image src={iconSrc} alt="" aria-hidden width={16} height={16} />
                <span className="whitespace-nowrap text-sm font-regular font-portfolio text-alpha-black-100">
                  <ScrambleText>{t(key)}</ScrambleText>
                </span>
              </div>
              <ToggleSwitch checked={features[key]} onChange={() => onToggle(key)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
