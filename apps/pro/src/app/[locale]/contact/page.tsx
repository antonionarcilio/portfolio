import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { ContactPageSection } from '@/features/contact/contact-page-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  return (
    // `pb` de 64px separa a seção do footer (menor que o `--home-section-gap` das demais páginas).
    <main className="flex flex-col pb-[64px]">
      <ContactPageSection linkedinUrl={data.linkedinUrl} githubUrl={data.githubUrl} />
    </main>
  );
}
