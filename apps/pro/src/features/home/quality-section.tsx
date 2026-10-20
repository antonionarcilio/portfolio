import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Chip } from '@/shared/components/chip';

export function QualitySection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex items-center gap-16 rounded-3xl bg-brand-50 p-9 w-[986px]">
      {/* Left illustration */}
      <div className="w-[390px] h-[390px] shrink-0">
        <Image src="/illustrations/n133-working.svg" alt="" width={390} height={390} aria-hidden />
      </div>

      {/* Right content */}
      <div className="flex flex-col gap-6">
        <Chip label={t('qualityChip')} iconSrc="/icons/solar-verified-check.svg" iconAlt="" />
        <h2 className="text-display-md font-bold font-portfolio-title text-grey-700">{t('qualityHeading')}</h2>
        <p className="text-md font-regular font-portfolio text-alpha-black-80">{t('qualityBody')}</p>
        <div className="flex items-center gap-8 pt-2">
          {(
            [
              [t('qualityStat1Value'), t('qualityStat1Label')],
              [t('qualityStat2Value'), t('qualityStat2Label')],
              [t('qualityStat3Value'), t('qualityStat3Label')],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-display-sm font-bold font-portfolio-title text-grey-700">{value}</span>
              <span className="text-sm font-regular font-portfolio text-alpha-black-60">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
