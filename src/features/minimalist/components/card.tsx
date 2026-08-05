import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

import type { MinimalistCardProps } from '../types';
import { cardVariants } from '../variants';

type CardComponentProps = MinimalistCardProps & {
  appearance: 'light' | 'dark';
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
  'data-project-card': dataProjectCard,
  state = 'regular',
}: CardComponentProps) {
  const t = useTranslations('minimalist.card');
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  return (
    <article data-project-card={dataProjectCard} className={clsx(cardVariants({ appearance, state }))}>
      <span className="minimalist-card__corner minimalist-card__corner--top-left" aria-hidden="true" />
      <span className="minimalist-card__corner minimalist-card__corner--top-right" aria-hidden="true" />
      <span className="minimalist-card__corner minimalist-card__corner--bottom-left" aria-hidden="true" />
      <span className="minimalist-card__corner minimalist-card__corner--bottom-right" aria-hidden="true" />
      <header className="minimalist-card__header">
        <p className="minimalist-card__eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </header>
      <div className="minimalist-card__content">{children}</div>
      <footer className="minimalist-card__footer">
        {href && (
          <a href={href} onClick={handleAnchorClick}>
            {linkLabel ?? t('open')}
          </a>
        )}
        {footer}
      </footer>
    </article>
  );
}
