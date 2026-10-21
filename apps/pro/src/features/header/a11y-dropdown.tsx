'use client';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';

import highlightLinksIcon from '@/_assets/icons/lucide-highligh-links.svg';
import cursorIcon from '@/_assets/icons/solar-cursor.svg';
import meditationRoundIcon from '@/_assets/icons/solar-meditation-round.svg';
import magnifierZoomInIcon from '@/_assets/icons/solar-minimalistic-magnifer-zoom-in.svg';
import runningIcon from '@/_assets/icons/solar-running.svg';
import { ToggleSwitch } from '@/shared/components/toggle-switch';

export type A11yFeatures = {
  bigCursor: boolean;
  highlightLinks: boolean;
  biggerText: boolean;
  pauseAnimations: boolean;
};

type A11yDropdownProps = {
  features: A11yFeatures;
  /** Ver `I18nDropdown`: o painel sai junto com o header e volta com ele. */
  isHeaderHidden: boolean;
  onToggle: (key: keyof A11yFeatures) => void;
};

const FEATURE_LIST: { key: keyof A11yFeatures; icon: StaticImageData; iconChecked?: StaticImageData }[] = [
  { key: 'bigCursor', icon: cursorIcon },
  { key: 'highlightLinks', icon: highlightLinksIcon },
  { key: 'biggerText', icon: magnifierZoomInIcon },
  { key: 'pauseAnimations', icon: runningIcon, iconChecked: meditationRoundIcon },
];

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
        {FEATURE_LIST.map(({ key, icon, iconChecked }) => {
          const iconSrc = iconChecked && features[key] ? iconChecked : icon;
          return (
            <div key={key} className="flex h-6 items-center justify-between gap-3 px-3">
              <div className="flex items-center gap-2">
                <Image src={iconSrc} alt="" aria-hidden width={16} height={16} />
                <span className="whitespace-nowrap text-sm font-regular font-portfolio text-alpha-black-100">
                  {t(key)}
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
