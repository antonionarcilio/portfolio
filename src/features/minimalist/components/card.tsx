import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

import type { MinimalistCardProps } from '../types';
import { cardVariants } from '../variants';

type CardComponentProps = MinimalistCardProps & {
  appearance: 'light' | 'dark';
  collapsed?: boolean;
  onToggle?: () => void;
  state?: 'regular' | 'hover' | 'focus';
};

export function MinimalistCard({
  appearance,
  title,
  eyebrow,
  children,
  footer,
  href,
  linkLabel,
  collapseLabel,
  collapsed = false,
  onToggle,
  state = 'regular',
}: CardComponentProps) {
  const t = useTranslations('minimalist.card');
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  return (
    <article className={clsx(cardVariants({ appearance, state }), collapsed && 'minimalist-card--collapsed')}>
      <header className="minimalist-card__header">
        <div>
          <p className="minimalist-card__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {onToggle && (
          <button
            type="button"
            className="minimalist-card__collapse"
            aria-expanded={!collapsed}
            aria-label={collapseLabel ?? t('collapse')}
            onClick={onToggle}
          >
            {collapsed ? '+' : '−'}
          </button>
        )}
      </header>
      {!collapsed && (
        <>
          <div className="minimalist-card__content">{children}</div>
          <footer className="minimalist-card__footer">
            {href && (
              <a href={href} onClick={handleAnchorClick}>
                {linkLabel ?? t('open')}
              </a>
            )}
            {footer}
          </footer>
        </>
      )}
    </article>
  );
}
