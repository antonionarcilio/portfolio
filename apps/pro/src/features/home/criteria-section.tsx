import { useTranslations } from 'next-intl';
import Image from 'next/image';

import filterIcon from '@/_assets/icons/solar-filter.svg';
import virtualAssistanceIllustration from '@/_assets/illustrations/634-virtual-assistance.svg';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

export function CriteriaSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex w-full max-w-content flex-col items-center justify-center gap-2xl max-tablet:gap-0 rounded-4xl desktop:flex-row">
      <div className="aspect-square w-full max-w-illustration shrink-0 max-tablet:-mb-[40px]">
        <Image src={virtualAssistanceIllustration} alt="" width={390} height={390} aria-hidden className="size-full" />
      </div>

      <div className="flex flex-col gap-lg items-start w-full max-w-text">
        <Chip label={t('criteriaChip')} iconLeading={filterIcon} variant="outline-v1" size="lg" />
        <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
          <ScrambleText>{t('criteriaHeading')}</ScrambleText>
        </h2>
        <p className="text-md font-regular font-portfolio text-alpha-black-100">
          <ScrambleText>{t('criteriaBody')}</ScrambleText>
        </p>
      </div>
    </section>
  );
}
