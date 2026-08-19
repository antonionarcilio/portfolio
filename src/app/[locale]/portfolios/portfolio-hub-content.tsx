'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { anchorIconVariants, anchorVariants } from '@/features/minimalist/components/anchor';
import { useMinimalistAppearance } from '@/features/minimalist/hooks/use-minimalist-appearance';
import type { MinimalistAppearance } from '@/features/minimalist/types';
import { Link } from '@/i18n/navigation';

const MotionLink = motion.create(Link);

type PortfolioHubLinkProps = {
  appearance: MinimalistAppearance;
  href: '/portfolios/minimalist' | '/portfolios/gamified';
  label: string;
};

function PortfolioHubLink({ appearance, href, label }: PortfolioHubLinkProps) {
  return (
    <MotionLink
      href={href}
      initial="initial"
      whileHover="active"
      whileFocus="active"
      className={clsx('inline-flex items-center gap-1', anchorVariants({ appearance, variant: 'secondary' }))}
    >
      {label}
      <motion.span
        className="minimalist-anchor__icon inline-flex items-center"
        aria-hidden="true"
        variants={anchorIconVariants}
      >
        <ArrowUpRight size={14} strokeWidth={1.5} />
      </motion.span>
    </MotionLink>
  );
}

export function PortfolioHubContent() {
  const t = useTranslations('portfolioHub');
  const { appearance } = useMinimalistAppearance();

  return (
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
  );
}
