'use client';

import { useLocale } from 'next-intl';
import type { SupportedLocale } from 'portfolio-content-model';

import { StickyColumn } from '@/shared/components/sticky-column';

import { ContactFormColumn } from './contact-form-column';
import { resolveContactIllustrationState } from './contact-illustration-state';
import { ContactIntroColumn } from './contact-intro-column';
import { sendContactMessage } from './send-contact-message';
import { useContactForm } from './use-contact-form';

type ContactPageSectionProps = {
  linkedinUrl: string;
  githubUrl: string;
  /** `null` quando o Turnstile não está configurado: o formulário não consegue enviar. */
  turnstileSiteKey: string | null;
};

/**
 * Única seção da página de contato: coluna de apresentação sticky à esquerda e o formulário à
 * direita. O estado do formulário vive aqui porque a ilustração, o título e o botão da coluna 1
 * reagem a ele.
 */
export function ContactPageSection({ linkedinUrl, githubUrl, turnstileSiteKey }: ContactPageSectionProps) {
  const locale = useLocale() as SupportedLocale;
  const form = useContactForm(sendContactMessage, locale);
  const illustrationState = resolveContactIllustrationState(form.values, form.status === 'success');

  // Entre 1020px e 1120px o container é menor que as duas colunas somadas: as colunas encolhem (shrink) e a
  // seção não ganha o transbordo de 30px, que só cabe quando há margem de viewport (≥1120px).
  // Abaixo de 1020px as colunas empilham (apresentação, depois formulário) e a coluna 1 deixa de ser sticky.
  // A coluna 1 tem 36px de padding de cada lado (502 = 430 + 72), então o conteúdo visível começa 36px
  // para dentro dela e o formulário encosta na borda direita. O `pr-[36px]` devolve esse respiro à direita
  // para as margens visíveis ficarem simétricas. 502 + 520 + 36 + 36 (evenly) = 1094, mais que os 1034px
  // úteis do container: a seção estoura 30px para cada lado, mantendo-se centralizada.
  return (
    <section className="flex w-full flex-col items-center gap-[24px] pt-[16px] min-[1020px]:flex-row min-[1120px]:mx-[-30px] min-[1120px]:w-[calc(100%+60px)] min-[1120px]:max-w-[1094px] min-[1020px]:items-start min-[1020px]:justify-evenly min-[1020px]:pr-[36px] min-[1020px]:pt-[32px]">
      {/* A coluna já carrega 36px de padding vertical, então gruda em 0; o formulário rola solto. */}
      <StickyColumn
        topOffsetPixels={0}
        className="max-[1019px]:static max-[1019px]:w-full min-[1020px]:w-[502px] min-[1020px]:shrink"
      >
        <ContactIntroColumn illustrationState={illustrationState} linkedinUrl={linkedinUrl} githubUrl={githubUrl} />
      </StickyColumn>
      <ContactFormColumn form={form} turnstileSiteKey={turnstileSiteKey} />
    </section>
  );
}
