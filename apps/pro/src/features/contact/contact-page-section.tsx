'use client';

import { useLocale } from 'next-intl';
import type { SupportedLocale } from 'portfolio-content-model';

import { ContactHero } from './components/contact-hero';
import { ConversationLoading } from './components/conversation-loading';
import { ConversationView } from './components/conversation-view';
import type { ProfileLinks } from './components/social-links';
import type { SendContactSubmission } from './engine/contact-submission';
import { requestEmailCheck, type VerifyEmailAddress } from './engine/request-email-check';
import { sendContactSubmission } from './engine/send-contact-submission';
import { useConversation } from './engine/use-conversation';

type ContactPageSectionProps = ProfileLinks & {
  /** Chave pública do Turnstile (env do servidor, repassada pela página); sem ela, o desafio não aparece. */
  turnstileSiteKey: string | undefined;
  /** Envio injetado; o padrão é o POST em `/api/contact` (Resend). */
  sendSubmission?: SendContactSubmission;
  /** Checagem de e-mail injetada; o padrão é o BFF `/api/contact/email-check`. */
  verifyEmail?: VerifyEmailAddress;
};

/**
 * Página de contato como conversa guiada: Hero de entrada e, depois de "Iniciar conversa", o chat. O Hero já
 * está visível no HTML (`<h1>` e texto para buscadores, leitores sem JS e LCP). Para uma conversa restaurada não
 * piscar o Hero, `SavedConversationFlagScript` marca o `<html>` antes do paint e o CSS o esconde até a
 * hidratação. Com conversa salva, mostra o loading centralizado antes de devolver o chat.
 * @example <ContactPageSection linkedinUrl={linkedinUrl} githubUrl={githubUrl} turnstileSiteKey={env.TURNSTILE_SITE_KEY} />
 */
export function ContactPageSection({
  linkedinUrl,
  githubUrl,
  turnstileSiteKey,
  sendSubmission = sendContactSubmission,
  verifyEmail = requestEmailCheck,
}: ContactPageSectionProps) {
  const locale = useLocale() as SupportedLocale;
  const conversation = useConversation(sendSubmission, locale);
  const links = { linkedinUrl, githubUrl };

  if (conversation.hydration === 'restoring') return <ConversationLoading />;
  const isPending = conversation.hydration === 'pending';
  if (isPending || conversation.state.stage === 'hero') {
    return <ContactHero links={links} onStart={conversation.start} isHydrationPending={isPending} />;
  }
  return (
    <ConversationView
      conversation={conversation}
      links={links}
      verifyEmail={verifyEmail}
      turnstileSiteKey={turnstileSiteKey}
    />
  );
}
