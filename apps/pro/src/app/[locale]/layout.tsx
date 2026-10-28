import { Analytics } from '@vercel/analytics/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getNow, getTimeZone, setRequestLocale } from 'next-intl/server';
import { Calistoga, Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { Footer } from '@/features/footer/footer';
import { BrandLogo } from '@/features/header/brand-logo';
import { BrandSeasonSync } from '@/features/header/brand-season-sync';
import { StickyHeader } from '@/features/header/sticky-header';
import { routing } from '@/i18n/routing';
import { A11Y_SCRIPT } from '@/shared/a11y/a11y-script';
import { A11yProvider } from '@/shared/contexts/a11y-context';
import { ThemeProvider } from '@/shared/contexts/theme-context';
import { BRAND_SEASON_SCRIPT } from '@/shared/utils/brand-season-script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-portfolio',
  display: 'swap',
});

const calistoga = Calistoga({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-portfolio-title',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

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
    <html lang={locale} suppressHydrationWarning className={`${poppins.variable} ${calistoga.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BRAND_SEASON_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: A11Y_SCRIPT }} />
      </head>
      <body className="font-portfolio">
        <NextIntlClientProvider locale={locale} messages={messages} now={now} timeZone={timeZone} formats={{}}>
          <ThemeProvider>
            <A11yProvider>
              <BrandSeasonSync />
              <div className="min-h-screen">
                <div className="mx-auto w-auto max-w-[calc(1050px+1rem)] px-4">
                  <StickyHeader brandLogo={<BrandLogo />} variant="island" />
                  {children}
                  <Footer />
                </div>
              </div>
            </A11yProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
