import { Analytics } from '@vercel/analytics/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getNow, getTimeZone, setRequestLocale } from 'next-intl/server';
import { Calistoga, Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { Footer } from '@/features/footer/footer';
import { StickyHeader } from '@/features/header/sticky-header';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/shared/contexts/theme-context';

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
      <body className="font-portfolio">
        <NextIntlClientProvider locale={locale} messages={messages} now={now} timeZone={timeZone} formats={{}}>
          <ThemeProvider>
            <div className="min-h-screen">
              <div className="mx-auto w-auto max-w-[calc(1050px+1rem)] px-4">
                <StickyHeader />
                {children}
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
