import { useTranslations } from 'next-intl';
import Image from 'next/image';

import filterIcon from '@/_assets/icons/solar-filter.svg';
import virtualAssistanceIllustration from '@/_assets/illustrations/634-virtual-assistance.svg';
import { Chip } from '@/shared/components/chip';

export function CriteriaSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="flex items-center justify-center gap-[22px] rounded-[32px] w-[986px]">
      <div className="size-[390px] shrink-0">
        <Image src={virtualAssistanceIllustration} alt="" width={390} height={390} aria-hidden />
      </div>

      <div className="flex flex-col gap-3 items-start w-[430px]">
        <Chip label={t('criteriaChip')} iconLeading={filterIcon} variant="outline-v1" size="md" />
        <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
          {t('criteriaHeading')}
        </h2>
        <p className="text-md font-regular font-portfolio text-alpha-black-100">{t('criteriaBody')}</p>
      </div>
    </section>
  );
}
