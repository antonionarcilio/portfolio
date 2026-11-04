import { useTranslations } from 'next-intl';
import Image from 'next/image';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import lightbulbBoltIcon from '@/_assets/icons/solar-lightbulb-bolt.svg';
import teaCupIcon from '@/_assets/icons/solar-tea-cup.svg';
import ideaIllustration from '@/_assets/illustrations/n123-idea.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

export function HeroSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="flex w-full flex-col items-center justify-center gap-[32px] pt-[16px] min-[1020px]:min-h-[calc(100vh-(var(--header-height)+130px))] min-[1020px]:flex-row min-[1020px]:gap-[16px] min-[1020px]:pt-0">
      {/* Left content */}
      <div className="flex w-full min-w-0 flex-col min-[1020px]:flex-[1_0_0] items-start gap-[22px]">
        {/* Chip + heading + body */}
        <div className="flex flex-col items-start gap-[14px] shrink-0">
          <Chip label={t('heroChip')} iconLeading={lightbulbBoltIcon} variant="outline-v1" size="lg" />
          <h1 className="w-full max-w-[450px] text-display-lg font-regular font-portfolio-title leading-[55px] max-[479px]:text-display-md max-[479px]:leading-[44px] text-alpha-black-100">
            <ScrambleText>{t('heroHeading')}</ScrambleText>
          </h1>
          <p className="w-full max-w-[450px] text-md font-regular font-portfolio text-alpha-black-80">
            <ScrambleText>{t('heroBody')}</ScrambleText>
          </p>
        </div>

        <TriggerWithHelp
          label={t('heroCta')}
          iconSrc={arrowUpRightIcon}
          helpIconSrc={teaCupIcon}
          href="/contact"
          size="lg"
        />
      </div>

      {/* Right illustration */}
      <div className="aspect-square w-full max-w-[520px] shrink-0">
        <Image
          src={ideaIllustration}
          alt=""
          aria-hidden
          width={520}
          height={520}
          draggable={false}
          className="size-full object-contain pointer-events-none select-none"
        />
      </div>
    </section>
  );
}
