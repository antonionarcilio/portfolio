import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import ufoIcon from '@/_assets/icons/solar-ufo-3.svg';
import notFoundIllustration from '@/_assets/illustrations/not-found.svg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

export default async function NotFound() {
  const t = await getTranslations('pro.notFound');

  return (
    <main className="flex min-h-[calc(100svh-8rem)] items-center justify-center py-16">
      <div className="flex flex-col-reverse items-center gap-[22px] md:flex-row md:items-center md:justify-center md:gap-[22px]">
        {/* Content */}
        <div className="flex w-full max-w-[355px] flex-col gap-[22px] items-start">
          <div className="flex flex-col items-start gap-[14px]">
            <Chip label={t('chip')} iconLeading={ufoIcon} variant="outline-v1" size="lg" />
            <h1 className="text-display-md font-portfolio-title text-alpha-black-100">
              <ScrambleText>{t('heading')}</ScrambleText>
            </h1>
            <p className="text-md font-regular font-portfolio text-alpha-black-100 text-pretty">
              <ScrambleText>{t('body')}</ScrambleText>
            </p>
          </div>
          <ButtonUnderline label={t('cta')} href="/" className="uppercase" size="lg" />
        </div>

        {/* Illustration */}
        <div className="flex shrink-0 items-start justify-end overflow-hidden p-[10px]">
          <Image src={notFoundIllustration} alt={t('illustrationAlt')} width={370} height={370} priority />
        </div>
      </div>
    </main>
  );
}
