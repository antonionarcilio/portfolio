import 'server-only';

import { getTranslations } from 'next-intl/server';
import { DEFAULT_LOCALE } from 'portfolio-content-model';

import { CONTACT_OPTION_GROUPS } from '@/features/contact/contact-options';
import type { ContactRequest } from '@/features/contact/contact-request-schema';

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

async function buildSummary(request: ContactRequest, locale: ContactRequest['locale']): Promise<EmailSummaryLine[]> {
  const labels = await getTranslations({ locale, namespace: 'pro.contactEmail.labels' });
  const options = await getTranslations({ locale, namespace: 'pro.contactPage.options' });
  const optionLines = CONTACT_OPTION_GROUPS.filter((group) => request[group]).map((group) => ({
    label: labels(group),
    value: options(`${group}.${request[group]}`),
  }));

  return [
    { label: labels('name'), value: request.name },
    { label: labels('email'), value: request.email },
    ...optionLines,
    { label: labels('budget'), value: `R$ ${request.budgetMinimum} – R$ ${request.budgetMaximum}` },
    { label: labels('projectDescription'), value: request.projectDescription },
  ];
}

export type ProfileLinks = { linkedinUrl: string; githubUrl: string };

async function buildSignatureLinks(
  locale: ContactRequest['locale'],
  links: ProfileLinks,
): Promise<EmailSignatureLink[]> {
  const t = await getTranslations({ locale, namespace: 'pro.contactPage' });
  return [
    { label: t('linkedin'), url: links.linkedinUrl },
    { label: t('github'), url: links.githubUrl },
  ];
}

/** Aviso para quem atende — sempre no idioma padrão do site, independente do idioma do lead. */
export async function buildNotificationEmail(request: ContactRequest, to: string): Promise<EmailMessage> {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: 'pro.contactEmail.notification' });
  return {
    to,
    replyTo: request.email,
    subject: t('subject', { name: toSubjectSafeName(request.name) }),
    body: <NotificationEmail heading={t('heading')} summary={await buildSummary(request, DEFAULT_LOCALE)} />,
  };
}

/** Confirmação para o lead, no idioma em que ele preencheu o formulário. */
export async function buildAutoresponderEmail(
  request: ContactRequest,
  replyTo: string,
  profileLinks: ProfileLinks,
): Promise<EmailMessage> {
  const t = await getTranslations({ locale: request.locale, namespace: 'pro.contactEmail.autoresponder' });
  const props = {
    greeting: t('greeting', { name: request.name }),
    body: t('body'),
    closing: t('closing'),
    signature: t('signature'),
    links: await buildSignatureLinks(request.locale, profileLinks),
  };
  return { to: request.email, replyTo, subject: t('subject'), body: <AutoresponderEmail {...props} /> };
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
