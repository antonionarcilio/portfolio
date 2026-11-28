import { useTranslations } from 'next-intl';
import Image from 'next/image';

import verifiedCheckIcon from '@/_assets/icons/solar-verified-check.svg';
import workingIllustration from '@/_assets/illustrations/n133-working.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';
import { StatItem } from '@/shared/components/stat-item';

type QualitySectionProps = {
  careerYears: number;
  projectsCount: number;
  skillsCount: number;
};

export function QualitySection({ careerYears, projectsCount, skillsCount }: QualitySectionProps) {
  const t = useTranslations('pro.home');
  // Numeric targets come from the CMS — locale only controls the suffix text
  const stats = [
    { count: careerYears, suffixKey: 'qualityStat1Suffix', labelKey: 'qualityStat1Label' },
    { count: projectsCount, suffixKey: 'qualityStat2Suffix', labelKey: 'qualityStat2Label' },
    { count: skillsCount, suffixKey: 'qualityStat3Suffix', labelKey: 'qualityStat3Label' },
  ] as const;

  return (
    <section className="mx-auto flex w-full max-w-content flex-col items-center justify-center gap-2xl max-tablet:gap-3xl rounded-4xl desktop:min-h-[505px] desktop:flex-row">
      {/* Left illustration — no mobile (<640px) fica 20px menor que o tamanho que teria
          (largura disponível ou o teto de 390px) e alinhada à esquerda */}
      <div className="aspect-square w-full max-w-illustration shrink-0 max-tablet:w-[calc(100%-20px)] max-tablet:max-w-[370px] max-tablet:self-start">
        <Image
          src={workingIllustration}
          alt=""
          aria-hidden
          width={390}
          height={390}
          draggable={false}
          className="size-full object-contain pointer-events-none select-none"
        />
      </div>

      {/* Right content */}
      <div className="flex w-full max-w-text max-tablet:max-w-none shrink-0 flex-col gap-2xl">
        <div className="flex flex-col items-start gap-lg">
          <Chip label={t('qualityChip')} iconLeading={verifiedCheckIcon} size="lg" />
          <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
            <ScrambleText>{t('qualityHeading')}</ScrambleText>
          </h2>
          <p className="text-md font-regular font-portfolio text-alpha-black-100">
            <ScrambleText>{t('qualityBody')}</ScrambleText>
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center max-tablet:justify-start gap-x-2xl gap-y-lg small:gap-x-4xl">
          {stats.map(({ count, suffixKey, labelKey }) => (
            <StatItem key={labelKey} count={count} suffix={t(suffixKey)} label={t(labelKey)} />
          ))}
        </div>
      </div>
    </section>
  );
}
