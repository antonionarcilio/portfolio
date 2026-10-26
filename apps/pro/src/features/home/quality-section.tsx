import { useTranslations } from 'next-intl';
import Image from 'next/image';

import verifiedCheckIcon from '@/_assets/icons/solar-verified-check.svg';
import workingIllustration from '@/_assets/illustrations/n133-working.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';
import { StatItem } from '@/shared/components/stat-item';

// Numeric targets are design constants — locale only controls the suffix text
const STATS = [
  { count: 5, suffixKey: 'qualityStat1Suffix', labelKey: 'qualityStat1Label' },
  { count: 13, suffixKey: 'qualityStat2Suffix', labelKey: 'qualityStat2Label' },
  { count: 53, suffixKey: 'qualityStat3Suffix', labelKey: 'qualityStat3Label' },
] as const;

export function QualitySection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex h-[505px] w-[986px] items-center justify-center gap-[22px] rounded-[32px]">
      {/* Left illustration */}
      <div className="shrink-0 size-[390px]">
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
      <div className="flex w-[430px] shrink-0 flex-col gap-[22px]">
        <div className="flex flex-col items-start gap-3">
          <Chip label={t('qualityChip')} iconLeading={verifiedCheckIcon} size="md" />
          <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
            <ScrambleText>{t('qualityHeading')}</ScrambleText>
          </h2>
          <p className="text-md font-regular font-portfolio text-alpha-black-100">
            <ScrambleText>{t('qualityBody')}</ScrambleText>
          </p>
        </div>
        <div className="flex w-full items-center justify-center gap-[48px] pt-[22px]">
          {STATS.map(({ count, suffixKey, labelKey }) => (
            <StatItem key={labelKey} count={count} suffix={t(suffixKey)} label={t(labelKey)} />
          ))}
        </div>
      </div>
    </section>
  );
}
