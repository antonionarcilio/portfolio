import { useTranslations } from 'next-intl';

import chatRoundLineIcon from '@/_assets/icons/solar-chat-round-line.svg';
import { Anchor } from '@/shared/components/anchor';
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
    <section className="mx-auto flex w-full max-w-content items-center justify-center">
      <div className="flex flex-col gap-2xl items-center w-full max-w-text">
        <div className="flex flex-col gap-lg text-center w-full">
          <h2 className="text-display-md font-regular font-portfolio-title text-alpha-black-100">
            <ScrambleText>{heading}</ScrambleText>
          </h2>
          <p className="text-md font-regular font-portfolio text-alpha-black-100">
            <ScrambleText>{body}</ScrambleText>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center max-small:flex-col gap-lg">
          <TriggerWithHelp
            label={t('cta')}
            animatedIcon="arrow-up-right"
            helpIconSrc={chatRoundLineIcon}
            href="/contact"
            size="lg"
          />
          {/* Agrupados para ir juntos à segunda linha quando o container vira coluna (≤480px). */}
          <div className="flex items-center gap-lg">
            <Anchor label={t('linkedin')} href={linkedinUrl} external size="lg" />
            <Anchor label={t('github')} href={githubUrl} external size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
