import 'server-only';

import { getTranslations } from 'next-intl/server';
import { DEFAULT_LOCALE, type SupportedLocale } from 'portfolio-content-model';

import { groupSummarySteps, summaryGroupLines } from '@/features/contact/engine/build-summary';
import { resolvePath } from '@/features/contact/engine/conversation-path';
import { FLOW_MESSAGES_NAMESPACE } from '@/features/contact/engine/flow-message-keys';
import { createFlowTexts } from '@/features/contact/engine/flow-texts';
import type { ValidatedContact } from '@/features/contact/engine/validate-contact-submission';

import {
  AutoresponderEmail,
  DeliveryAlertEmail,
  NotificationEmail,
  type EmailSignatureLink,
  type EmailSummaryLine,
} from './contact-email-templates';
import type { EmailMessage } from './email-sender';

const MAX_SUBJECT_NAME_LENGTH = 80;

/** Remove quebras de linha do nome antes de ir para o assunto — evita header injection. */
function toSubjectSafeName(name: string): string {
  return name.replace(/[\r\n]+/g, ' ').slice(0, MAX_SUBJECT_NAME_LENGTH);
}

/**
 * O mesmo resumo da revisão do chat (blocos, rótulos e linhas), no idioma de quem atende. Etapa pulada aparece
 * como "Não informado", igual à tela.
 */
async function buildSummary(contact: ValidatedContact, locale: SupportedLocale): Promise<EmailSummaryLine[]> {
  const texts = createFlowTexts(
    await getTranslations({ locale, namespace: FLOW_MESSAGES_NAMESPACE }),
    contact.visitorName,
    contact.answers,
  );
  const labels = await getTranslations({ locale, namespace: 'pro.contactEmail.labels' });
  const review = await getTranslations({ locale, namespace: 'pro.contactChat.review' });
  const groupLines = groupSummarySteps(resolvePath(contact.answers)).flatMap((group) => {
    const firstStep = group.steps[0];
    if (!firstStep) return [];
    const value = summaryGroupLines(group, contact.answers, texts).join('\n') || review('notInformed');
    return [{ label: texts.summaryLabel(firstStep), value }];
  });
  return [{ label: labels('name'), value: contact.visitorName }, ...groupLines];
}

export type ProfileLinks = { linkedinUrl: string; githubUrl: string };

async function buildSignatureLinks(locale: SupportedLocale, links: ProfileLinks): Promise<EmailSignatureLink[]> {
  const t = await getTranslations({ locale, namespace: 'pro.contactPage' });
  return [
    { label: t('linkedin'), url: links.linkedinUrl },
    { label: t('github'), url: links.githubUrl },
  ];
}

/** Aviso para quem atende — sempre no idioma padrão do site, independente do idioma do lead. */
export async function buildNotificationEmail(contact: ValidatedContact, to: string): Promise<EmailMessage> {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: 'pro.contactEmail.notification' });
  return {
    to,
    replyTo: contact.email,
    subject: t('subject', { name: toSubjectSafeName(contact.visitorName) }),
    body: <NotificationEmail heading={t('heading')} summary={await buildSummary(contact, DEFAULT_LOCALE)} />,
  };
}

/** Confirmação para o lead, no idioma em que ele conversou. */
export async function buildAutoresponderEmail(
  contact: ValidatedContact,
  replyTo: string,
  profileLinks: ProfileLinks,
): Promise<EmailMessage> {
  const t = await getTranslations({ locale: contact.locale, namespace: 'pro.contactEmail.autoresponder' });
  const props = {
    greeting: t('greeting', { name: contact.visitorName }),
    body: t('body'),
    closing: t('closing'),
    signature: t('signature'),
    links: await buildSignatureLinks(contact.locale, profileLinks),
  };
  return { to: contact.email, replyTo, subject: t('subject'), body: <AutoresponderEmail {...props} /> };
}

/** Aviso de que o autoresponder não saiu para o lead (melhor esforço). */
export async function buildDeliveryAlertEmail(leadEmail: string, to: string): Promise<EmailMessage> {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: 'pro.contactEmail.deliveryAlert' });
  return {
    to,
    subject: t('subject'),
    body: <DeliveryAlertEmail heading={t('heading')} body={t('body', { email: leadEmail })} />,
  };
}
