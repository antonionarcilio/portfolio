import { useTranslations } from 'next-intl';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import chatRoundLineIcon from '@/_assets/icons/solar-chat-round-line.svg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

type ContactSectionProps = {
  linkedinUrl: string;
  githubUrl: string;
};

export function ContactSection({ linkedinUrl, githubUrl }: ContactSectionProps) {
  const t = useTranslations('pro.home');

  return (
    <section className="flex items-center justify-center w-[986px]">
      <div className="flex flex-col gap-[22px] items-center w-[430px]">
        <div className="flex flex-col gap-3 text-center w-full">
          <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
            {t('contactHeading')}
          </h2>
          <p className="text-md font-regular font-portfolio text-alpha-black-100">{t('contactBody')}</p>
        </div>
        <div className="flex items-center gap-4">
          <TriggerWithHelp
            label={t('contactCta')}
            iconSrc={arrowUpRightIcon}
            helpIconSrc={chatRoundLineIcon}
            href="/contact"
          />
          <ButtonUnderline label={t('contactLinkedin')} href={linkedinUrl} external />
          <ButtonUnderline label={t('contactGithub')} href={githubUrl} external />
        </div>
      </div>
    </section>
  );
}
