'use client';

import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useMinimalistA11y } from '@/features/minimalist/a11y';
import { anchorVariants } from '@/features/minimalist/components/anchor';
import { AnimatedIcon } from '@/features/minimalist/components/animated-icon';
import {
  IconInteractionProvider,
  useIconInteractionHandlers,
} from '@/features/minimalist/contexts/icon-interaction-context';
import { MinimalistReducedMotionProvider } from '@/features/minimalist/contexts/reduced-motion-context';
import { useMinimalistAppearance } from '@/features/minimalist/hooks/use-minimalist-appearance';
import type { MinimalistAppearance } from '@/features/minimalist/types';
import { Link } from '@/i18n/navigation';

type PortfolioHubLinkProps = {
  appearance: MinimalistAppearance;
  href: '/portfolios/minimalist' | '/portfolios/gamified';
  label: string;
};

function PortfolioHubLink({ appearance, href, label }: PortfolioHubLinkProps) {
  const { state, handlers } = useIconInteractionHandlers({ disabled: false });
  return (
    <Link
      href={href}
      className={clsx('inline-flex items-center gap-1', anchorVariants({ appearance, variant: 'secondary' }))}
      {...handlers}
    >
      {label}
      <IconInteractionProvider value={state}>
        <AnimatedIcon icon={ArrowUpRight} className="minimalist-anchor__icon" />
      </IconInteractionProvider>
    </Link>
  );
}

export function PortfolioHubContent() {
  const t = useTranslations('portfolioHub');
  const { appearance } = useMinimalistAppearance();
  const { options } = useMinimalistA11y();

  return (
    <MinimalistReducedMotionProvider enabled={options.reduceMotion}>
      <div
        className={`minimalist-theme minimalist-theme--${appearance} flex min-h-dvh flex-col items-center justify-center gap-10`}
      >
        <p className="minimalist-kicker">{t('title')}</p>
        <nav className="flex items-center gap-6">
          <PortfolioHubLink appearance={appearance} href="/portfolios/minimalist" label={t('minimalistLabel')} />
          <span className="text-minimalist-muted" aria-hidden="true">
            |
          </span>
          <PortfolioHubLink appearance={appearance} href="/portfolios/gamified" label={t('gamifiedLabel')} />
        </nav>
      </div>
    </MinimalistReducedMotionProvider>
  );
}
