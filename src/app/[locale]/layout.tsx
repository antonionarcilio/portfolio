import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { env } from '@/env';
import { routing } from '@/i18n/routing';
import { getPortfolio } from '@/shared/data/get-portfolio';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const portfolioData = await getPortfolio();
  const years = portfolioData?.careerYears ?? 0;

  return {
    metadataBase: new URL(env.MY_DOMAIN),
    title: 'Antônio Mascarenhas — Frontend Developer',
    description: `Portfolio de Antônio Mascarenhas, Frontend Developer com ${years}+ anos de experiência em React, Next.js e TypeScript. São Luís, MA — Brasil.`,
    icons: {
      icon: '/favicon-dark.svg',
      shortcut: '/favicon-dark.svg',
      apple: '/favicon-dark.svg',
    },
  };
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${shareTechMono.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <div className="a11y-zoom-wrapper">{children}</div>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
