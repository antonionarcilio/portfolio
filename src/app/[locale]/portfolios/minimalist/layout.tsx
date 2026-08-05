import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

export default function MinimalistLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('minimalist.layout');
  return (
    <div className="minimalist-layout">
      <a className="minimalist-skip-link" href="#main-content">
        {t('skipToContent')}
      </a>
      {children}
    </div>
  );
}
