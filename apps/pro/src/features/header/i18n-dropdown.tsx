'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { usePathname, useRouter } from '@/i18n/navigation';
import { ToggleSwitch } from '@/shared/components/toggle-switch';

const LOCALES = [
  { code: 'pt-BR', flag: '/icons/flag-br.svg', labelKey: 'portuguese' },
  { code: 'en', flag: '/icons/flag-us.svg', labelKey: 'english' },
] as const;

export function I18nDropdown({ onClose }: { onClose: () => void }) {
  const t = useTranslations('pro.i18n');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (locale: string) => {
    router.push(pathname, { locale });
    onClose();
  };

  return (
    <div className="absolute right-0 top-full z-50 mt-2">
      <div className="flex flex-col gap-1 overflow-hidden rounded-[6px] bg-alpha-white-100 py-3 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]">
        {LOCALES.map(({ code, flag, labelKey }) => (
          <div key={code} className="flex h-6 items-center justify-between gap-4 px-3">
            <div className="flex items-center gap-2">
              <Image src={flag} alt="" aria-hidden width={14} height={14} />
              <span className="whitespace-nowrap text-sm font-regular font-portfolio text-alpha-black-100">
                {t(labelKey)}
              </span>
            </div>
            <ToggleSwitch checked={currentLocale === code} onChange={() => switchLocale(code)} />
          </div>
        ))}
      </div>
    </div>
  );
}
