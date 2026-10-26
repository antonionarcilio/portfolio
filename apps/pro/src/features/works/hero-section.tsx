import { useTranslations } from 'next-intl';
import Image from 'next/image';

import codeIcon from '@/_assets/icons/solar-code.svg';
import buildingIllustration from '@/_assets/illustrations/n121-building.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

export function WorksHeroSection() {
  const t = useTranslations('pro.works');

  return (
    // Altura vem do conteúdo (390 da ilustração + 2×36 de padding = 462, como no Figma), sem min-h de viewport.
    <section className="flex w-full items-center justify-center gap-[22px] rounded-[32px] p-[36px]">
      {/* Left — illustration */}
      <div className="flex w-[390px] shrink-0 items-start justify-end overflow-hidden p-[10px]">
        <div className="relative aspect-square min-w-px flex-[1_0_0] overflow-hidden">
          <Image src={buildingIllustration} alt="" aria-hidden fill draggable={false} />
        </div>
      </div>

      {/* Right — text content */}
      <div className="flex w-[430px] shrink-0 flex-col items-start gap-[12px]">
        <Chip label={t('heroChip')} iconLeading={codeIcon} size="md" />
        <h1 className="font-portfolio-title font-regular text-display-md text-alpha-black-100">
          <ScrambleText>{t('heroHeading')}</ScrambleText>
        </h1>
        <p className="font-portfolio font-regular text-md text-alpha-black-100 text-pretty">
          <ScrambleText>{t('heroBody')}</ScrambleText>
        </p>
      </div>
    </section>
  );
}
