'use client';

import { StickyColumn } from '@/shared/components/sticky-column';

import { ContactFormColumn } from './contact-form-column';
import { resolveContactIllustrationState } from './contact-illustration-state';
import { ContactIntroColumn } from './contact-intro-column';
import { sendContactMessage } from './send-contact-message';
import { useContactForm } from './use-contact-form';

type ContactPageSectionProps = {
  linkedinUrl: string;
  githubUrl: string;
};

/**
 * Única seção da página de contato: coluna de apresentação sticky à esquerda e o formulário à
 * direita. O estado do formulário vive aqui porque a ilustração, o título e o botão da coluna 1
 * reagem a ele.
 */
export function ContactPageSection({ linkedinUrl, githubUrl }: ContactPageSectionProps) {
  const form = useContactForm(sendContactMessage);
  const illustrationState = resolveContactIllustrationState(form.values, form.status === 'success');

  return (
    <section className="mx-auto flex w-full max-w-[986px] items-start justify-between pt-[32px]">
      {/* A coluna já carrega 36px de padding vertical, então gruda em 0; o formulário rola solto. */}
      <StickyColumn topOffsetPixels={0}>
        <ContactIntroColumn illustrationState={illustrationState} linkedinUrl={linkedinUrl} githubUrl={githubUrl} />
      </StickyColumn>
      <ContactFormColumn form={form} />
    </section>
  );
}
