import { useTranslations } from 'next-intl';

import { ButtonUnderline } from '@/shared/components/button-underline';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

type ContactSectionProps = {
  linkedinUrl: string;
  githubUrl: string;
};

export function ContactSection({ linkedinUrl, githubUrl }: ContactSectionProps) {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex flex-col items-center gap-6 text-center" style={{ width: 986 }}>
      <div className="flex flex-col gap-4" style={{ maxWidth: 430 }}>
        <h2 className="text-display-md font-bold font-portfolio-title text-grey-700">{t('contactHeading')}</h2>
        <p className="text-md font-regular font-portfolio text-alpha-black-80">{t('contactBody')}</p>
      </div>
      <div className="flex items-center gap-6">
        <TriggerWithHelp label={t('contactCta')} iconSrc="/icons/lucide-arrow-up-right.svg" href="/contact" />
        <ButtonUnderline label={`${t('contactLinkedin')} ↗`} href={linkedinUrl} external />
        <ButtonUnderline label={`${t('contactGithub')} ↗`} href={githubUrl} external />
      </div>
    </section>
  );
}
