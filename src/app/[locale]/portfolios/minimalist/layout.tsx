import { useTranslations } from 'next-intl';
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

export default function MinimalistLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('minimalist.layout');
  return (
    <div className="minimalist-layout">
      <MinimalistPreHydrationScript />
      <a className="minimalist-skip-link" href="#main-content">
        {t('skipToContent')}
      </a>
      {children}
    </div>
  );
}
