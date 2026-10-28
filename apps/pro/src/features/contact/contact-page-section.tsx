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

  // A coluna 1 tem 36px de padding de cada lado (502 = 430 + 72), então o conteúdo visível começa 36px
  // para dentro dela e o formulário encosta na borda direita. O `pr-[36px]` devolve esse respiro à direita
  // para as margens visíveis ficarem simétricas. 502 + 520 + 36 + 36 (evenly) = 1094, mais que os 1034px
  // úteis do container: a seção estoura 30px para cada lado, mantendo-se centralizada.
  return (
    <section className="mx-[-30px] flex w-[calc(100%+60px)] max-w-[1094px] items-start justify-evenly pr-[36px] pt-[32px]">
      {/* A coluna já carrega 36px de padding vertical, então gruda em 0; o formulário rola solto. */}
      <StickyColumn topOffsetPixels={0}>
        <ContactIntroColumn illustrationState={illustrationState} linkedinUrl={linkedinUrl} githubUrl={githubUrl} />
      </StickyColumn>
      <ContactFormColumn form={form} />
    </section>
  );
}
