import { A11yProvider } from '@/features/gamified/contexts/a11y-context';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Chakra_Petch, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

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

const chakraPetch = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-chakra-petch',
  display: 'swap',
});

type GamifiedLayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };

// `setRequestLocale` must run here too (not just in the page below it): this nested layout calls
// a next-intl translation function of its own, and without a locale already pinned, it falls back
// to reading `headers()` — a Dynamic API that silently opts the whole static route out of
// build-time prerendering (see portfolios/gamified/page.tsx for the full explanation).
export default async function GamifiedLayout({ children, params }: GamifiedLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'gamified.layout' });

  return (
    <div className={`${shareTechMono.variable} ${jetbrainsMono.variable} ${chakraPetch.variable}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:bg-cv-panel focus:text-cv-cyan focus:border focus:border-cv-cyan focus:px-4 focus:py-2 focus:font-cv-mono focus:text-[13px] focus:no-underline"
      >
        {t('skipToContent')}
      </a>
      <A11yProvider>{children}</A11yProvider>
      {/* Portal root for modals — inside the font-variable scope so CSS vars cascade */}
      <div id="gamified-portal-root" className="font-cv-mono" />
    </div>
  );
}
