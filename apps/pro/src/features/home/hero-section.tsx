import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Chip } from '@/shared/components/chip';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

export function HeroSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex items-center justify-between w-[986px]">
      {/* Left content */}
      <div className="flex flex-col gap-6 w-[450px]">
        <Chip label={t('heroChip')} iconSrc="/icons/solar-lightbulb-bolt.svg" iconAlt="" />
        <h1 className="text-display-lg font-bold font-portfolio-title text-grey-700">{t('heroHeading')}</h1>
        <p className="text-md font-regular font-portfolio text-alpha-black-80">{t('heroBody')}</p>
        <div className="flex items-center gap-3">
          <TriggerWithHelp label={t('heroCta')} iconSrc="/icons/lucide-arrow-up-right.svg" href="/contact" />
          <Image src="/icons/solar-tea-cup.svg" alt="" width={24} height={24} aria-hidden />
        </div>
      </div>

      {/* Right illustration */}
      <div className="w-[520px] h-[520px] shrink-0">
        <Image src="/illustrations/n123-idea.svg" alt="" width={520} height={520} aria-hidden priority />
      </div>
    </section>
  );
}
