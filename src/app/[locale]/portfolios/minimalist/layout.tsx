import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { ACTIVE_SECTION_STORAGE_KEY, MINIMALIST_SECTION_IDS } from '@/features/minimalist/utils/preferences';

function MinimalistPreHydrationScript() {
  const sectionIds = MINIMALIST_SECTION_IDS.map((id) => `'${id}'`).join(',');
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  var stored = null;
  try {
    stored = window.sessionStorage.getItem('${ACTIVE_SECTION_STORAGE_KEY}');
  } catch (error) {}
  if (!stored) return;
  var sections = [${sectionIds}];
    var index = sections.indexOf(stored);
  if (index > 0) {
    var root = document.documentElement;
    root.classList.add('minimalist-pre-hydration');
    root.style.setProperty('--minimalist-active-section-offset', String(index * -25) + '%');
  }
})();
`,
      }}
    />
  );
}

type MinimalistLayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };

// `setRequestLocale` must run here too (not just in the page below it): this nested layout calls
// a next-intl translation function of its own, and without a locale already pinned, it falls back
// to reading `headers()` — a Dynamic API that silently opts the whole static route out of
// build-time prerendering (see portfolios/gamified/page.tsx for the full explanation).
export default async function MinimalistLayout({ children, params }: MinimalistLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'minimalist.layout' });
  return (
    <div className="minimalist-layout">
      <MinimalistPreHydrationScript />
      <a
        className="absolute top-[-100px] left-4 z-2 bg-minimalist-foreground px-3 py-2 text-minimalist-background focus:top-4"
        href="#main-content"
      >
        {t('skipToContent')}
      </a>
      {children}
    </div>
  );
}
