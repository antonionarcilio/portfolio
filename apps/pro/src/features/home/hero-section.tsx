import { useTranslations } from 'next-intl';

import { Chip } from '@/shared/components/chip';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

export function HeroSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="flex w-full items-center justify-center gap-[16px] py-12">
      {/* Left content */}
      <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[22px]">
        {/* Chip + heading + body */}
        <div className="flex flex-col items-start gap-3 shrink-0">
          <Chip label={t('heroChip')} iconLeading="/icons/solar-lightbulb-bolt.svg" variant="outline-v1" size="md" />
          <h1 className="w-[450px] text-display-lg font-regular font-portfolio-title leading-[55px] text-alpha-black-100">
            {t('heroHeading')}
          </h1>
          <p className="w-[450px] text-md font-regular font-portfolio text-alpha-black-80">{t('heroBody')}</p>
        </div>

        <TriggerWithHelp
          label={t('heroCta')}
          iconSrc="/icons/lucide-arrow-up-right.svg"
          helpIconSrc="/icons/solar-tea-cup.svg"
          href="/contact"
        />
      </div>

      {/* Right illustration — SVG rendered as img to preserve natural aspect ratio */}
      <div className="shrink-0 size-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/n123-idea.svg"
          alt=""
          aria-hidden
          draggable={false}
          className="size-full object-contain pointer-events-none select-none"
        />
      </div>
    </section>
  );
}
