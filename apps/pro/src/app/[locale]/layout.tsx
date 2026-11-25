import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getNow, getTimeZone, setRequestLocale } from 'next-intl/server';
import { Calistoga, Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { env } from '@/env';
import { Footer } from '@/features/footer/footer';
import { BrandLogo } from '@/features/header/brand-logo';
import { BrandSeasonSync } from '@/features/header/brand-season-sync';
import { StickyHeader } from '@/features/header/sticky-header';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { A11Y_SCRIPT } from '@/shared/a11y/a11y-script';
import { ColorBlindFilterDefinition } from '@/shared/a11y/color-blind-filter-definition';
import { A11yProvider } from '@/shared/contexts/a11y-context';
import { ProjectTitlesProvider, type ProjectTitlesBySlug } from '@/shared/contexts/project-titles-context';
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

// Base absoluta de canonical/OG/hreflang de todas as páginas; ícones e robots valem para o site inteiro
// (antes só a home os declarava, e as demais páginas ficavam sem favicon).
export const metadata: Metadata = {
  metadataBase: new URL(env.MY_DOMAIN),
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
  robots: { index: true, follow: true },
};

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
  const [messages, now, timeZone, portfolio] = await Promise.all([
    getMessages({ locale }),
    getNow({ locale }),
    getTimeZone({ locale }),
    cmsClient.getPortfolio(locale),
  ]);
  // O header (client) mostra o nome do projeto aberto no menu mobile; getPortfolio é cacheado por locale.
  const projectTitlesBySlug: ProjectTitlesBySlug = Object.fromEntries(
    (portfolio?.projects ?? []).map((project) => [project.slug, project.projectName]),
  );

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
              <ColorBlindFilterDefinition />
              <div className="min-h-screen">
                <ProjectTitlesProvider titlesBySlug={projectTitlesBySlug}>
                  <div className="mx-auto w-auto max-w-page px-lg">
                    <StickyHeader brandLogo={<BrandLogo />} variant="island" />
                    {children}
                    <Footer />
                  </div>
                </ProjectTitlesProvider>
              </div>
            </A11yProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
