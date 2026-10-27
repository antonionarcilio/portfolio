import { useTranslations } from 'next-intl';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import chatRoundLineIcon from '@/_assets/icons/solar-chat-round-line.svg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { ScrambleText } from '@/shared/components/scramble-text';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

type ContactSectionProps = {
  heading: string;
  body: string;
  linkedinUrl: string;
  githubUrl: string;
};

export function ContactSection({ heading, body, linkedinUrl, githubUrl }: ContactSectionProps) {
  const t = useTranslations('pro.contact');

  return (
    <section className="flex items-center justify-center w-[986px]">
      <div className="flex flex-col gap-[22px] items-center w-[430px]">
        <div className="flex flex-col gap-[14px] text-center w-full">
          <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
            <ScrambleText>{heading}</ScrambleText>
          </h2>
          <p className="text-md font-regular font-portfolio text-alpha-black-100">
            <ScrambleText>{body}</ScrambleText>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TriggerWithHelp
            label={t('cta')}
            iconSrc={arrowUpRightIcon}
            helpIconSrc={chatRoundLineIcon}
            href="/contact"
            size="lg"
          />
          <ButtonUnderline label={t('linkedin')} href={linkedinUrl} external size="lg" />
          <ButtonUnderline label={t('github')} href={githubUrl} external size="lg" />
        </div>
      </div>
    </section>
  );
}
