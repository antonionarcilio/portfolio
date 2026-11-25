import { useTranslations } from 'next-intl';

import plainIcon from '@/_assets/icons/solar-plain.svg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { Chip } from '@/shared/components/chip';
import { ScrambleText } from '@/shared/components/scramble-text';

import { ContactIllustration } from './contact-illustration';
import type { ContactIllustrationState } from './contact-illustration-state';

type ContactIntroColumnProps = {
  illustrationState: ContactIllustrationState;
  linkedinUrl: string;
  githubUrl: string;
};

/**
 * Coluna 1 (sticky): chip, título, descrição, ilustração e links de redes. No estado `submitted`
 * o título e a descrição viram a confirmação do envio; a região `aria-live` a anuncia.
 */
export function ContactIntroColumn({ illustrationState, linkedinUrl, githubUrl }: ContactIntroColumnProps) {
  const t = useTranslations('pro.contactPage');
  const messageKey = illustrationState === 'submitted' ? 'success' : 'intro';

  return (
    <div className="flex w-full max-w-[502px] shrink-0 flex-col items-center gap-2xl rounded-4xl px-0 py-lg mx-auto contact-intro-padded:px-lg desktop:p-panel">
      <div className="flex w-full max-w-text flex-col items-start gap-lg">
        <Chip label={t(`${messageKey}.chip`)} iconLeading={plainIcon} size="lg" />
        <div aria-live="polite" className="flex w-full flex-col gap-lg">
          <h1 className="font-portfolio-title text-display-md font-regular text-alpha-black-100">
            <ScrambleText>{t(`${messageKey}.heading`)}</ScrambleText>
          </h1>
          <p className="font-portfolio text-md font-regular text-alpha-black-100 text-pretty">
            <ScrambleText>{t(`${messageKey}.body`)}</ScrambleText>
          </p>
        </div>
      </div>
      <ContactIllustration state={illustrationState} />
      <div className="flex flex-col items-center gap-xs">
        <p className="font-portfolio text-md font-semibold text-alpha-black-100">
          <ScrambleText>{t('elsewhere')}</ScrambleText>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-lg">
          <ButtonUnderline label={t('linkedin')} href={linkedinUrl} external size="lg" />
          <ButtonUnderline label={t('github')} href={githubUrl} external size="lg" />
        </div>
      </div>
    </div>
  );
}
