import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getNow, getTimeZone, setRequestLocale } from 'next-intl/server';
import { Inter, JetBrains_Mono, Poppins, Share_Tech_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { env } from '@/env';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';

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

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const portfolioData = await cmsClient.getPortfolio(routing.defaultLocale);
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
  const [messages, now, timeZone] = await Promise.all([
    getMessages({ locale }),
    getNow({ locale }),
    getTimeZone({ locale }),
  ]);

  return (
    <html
      lang={locale}
      className={`${shareTechMono.variable} ${jetbrainsMono.variable} ${poppins.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} now={now} timeZone={timeZone} formats={{}}>
          <div className="a11y-zoom-wrapper">{children}</div>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
