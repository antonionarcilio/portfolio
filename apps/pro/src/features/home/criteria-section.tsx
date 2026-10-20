import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Chip } from '@/shared/components/chip';

export function CriteriaSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex items-center gap-16 rounded-3xl bg-grey-100 p-9 w-[986px]">
      {/* Left illustration */}
      <div className="w-[390px] h-[390px] shrink-0">
        <Image src="/illustrations/634-virtual-assistance.svg" alt="" width={390} height={390} aria-hidden />
      </div>

      {/* Right content */}
      <div className="flex flex-col gap-6">
        <Chip label={t('criteriaChip')} iconLeading="/icons/solar-filter.svg" />
        <h2 className="text-display-md font-bold font-portfolio-title text-grey-700">{t('criteriaHeading')}</h2>
        <p className="text-md font-regular font-portfolio text-alpha-black-80">{t('criteriaBody')}</p>
      </div>
    </section>
  );
}
