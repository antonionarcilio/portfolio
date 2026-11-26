import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { env } from '@/env';
import { ContactPageSection } from '@/features/contact/contact-page-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { JsonLdScript } from '@/shared/components/json-ld-script';
import { buildSectionMetadata } from '@/shared/utils/build-section-metadata';
import { buildContactPageNode, buildJsonLdGraph, buildPersonNode } from '@/shared/utils/structured-data';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildSectionMetadata(locale, 'contact');
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const tMetadata = await getTranslations({ locale, namespace: 'pro.metadata' });
  const { name, role, email, location, githubUrl, linkedinUrl } = data;
  const jsonLd = buildJsonLdGraph([
    buildContactPageNode(locale, tMetadata('contactTitle', { name, role })),
    buildPersonNode(locale, { name, role, email, location, profileUrls: [githubUrl, linkedinUrl] }),
  ]);

  return (
    <>
      <JsonLdScript document={jsonLd} />
      {/* `pb-md` (12px no design) até o footer: o chat ocupa a altura da tela (ver `contact-chat-height`). */}
      <main className="flex flex-col pb-md">
        <ContactPageSection linkedinUrl={linkedinUrl} githubUrl={githubUrl} turnstileSiteKey={env.TURNSTILE_SITE_KEY} />
      </main>
    </>
  );
}
