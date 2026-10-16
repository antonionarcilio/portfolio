import { Analytics } from '@vercel/analytics/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getNow, getTimeZone, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';

import { routing } from '@/i18n/routing';

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
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} now={now} timeZone={timeZone} formats={{}}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
