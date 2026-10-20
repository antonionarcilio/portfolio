'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { ToggleSwitch } from '@/shared/components/toggle-switch';

export type A11yFeatures = {
  bigCursor: boolean;
  highlightLinks: boolean;
  biggerText: boolean;
  pauseAnimations: boolean;
};

type A11yDropdownProps = {
  features: A11yFeatures;
  onToggle: (key: keyof A11yFeatures) => void;
};

const FEATURE_LIST: { key: keyof A11yFeatures; icon: string; iconChecked?: string }[] = [
  { key: 'bigCursor', icon: '/icons/solar-cursor.svg' },
  { key: 'highlightLinks', icon: '/icons/lucide-highligh-links.svg' },
  { key: 'biggerText', icon: '/icons/solar-minimalistic-magnifer-zoom-in.svg' },
  {
    key: 'pauseAnimations',
    icon: '/icons/solar-running.svg',
    iconChecked: '/icons/solar-meditation-round.svg',
  },
];

export function A11yDropdown({ features, onToggle }: A11yDropdownProps) {
  const t = useTranslations('pro.a11y');

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-max">
      <div className="flex flex-col gap-1 overflow-hidden rounded-[6px] bg-alpha-white-100 py-3 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]">
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
