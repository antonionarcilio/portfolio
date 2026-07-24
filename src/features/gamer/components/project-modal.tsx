'use client';

import { ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { formatExperienceDateRange } from '@/features/gamer/utils/format-experience-date-range';
import { MarkdownText } from '@/shared/components/markdown-text';
import type { PortfolioData } from '@/shared/types/portfolio';

import { DetailModalShell } from './detail-modal-shell';
import { StackBadges } from './stack-badges';

export function ProjectModal({
  data,
  show,
  onClose,
}: {
  data: PortfolioData['projects'][0] | null;
  show: boolean;
  onClose: () => void;
}) {
  const { opts } = useA11y();
  const locale = useLocale();
  const t = useTranslations('project');
  if (!data) return null;

  return (
    <DetailModalShell
      show={show}
      onClose={onClose}
      noMotion={opts.reduceMotion}
      drawerTitle={`${data.projectName} — ${data.company}`}
      panelClassName="max-w-[640px] w-full"
    >
      {({ isDrawer }) => (
        <div
          className={
            isDrawer
              ? 'cv-scroll overflow-y-auto overflow-x-hidden px-[24px] pt-[14px] pb-[32px] a11y-drawer-inner'
              : 'cv-scroll overflow-x-hidden max-h-[86vh] px-[30px] pt-[28px] pb-[26px]'
          }
        >
          <span className="block text-cv-cyan text-[10px] tracking-[0.28em] uppercase mb-[14px]">
            {t('projectRecord')}
          </span>
          <h2 className="text-[22px] text-cv-text m-0 mb-1 tracking-[0.04em]">{data.projectName}</h2>
          <span className="block text-[14px] text-cv-cyan tracking-[0.08em]">
            {data.companyUrl ? (
              <a
                href={data.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[5px] text-cv-cyan hover:text-cv-cyan/80 transition-colors duration-150 cursor-gamer-pointer group"
              >
                {data.company}
                <ExternalLink
                  size={11}
                  className="opacity-60 group-hover:opacity-100 transition-opacity duration-150 shrink-0 translate-y-[-1px]"
                />
              </a>
            ) : (
              data.company
            )}
          </span>
          <span className="block mt-[6px] text-[12px] text-cv-text-dim tracking-[0.14em] uppercase">
            {data.dateNote ??
              formatExperienceDateRange({ startDate: data.startDate, endDate: data.endDate }, locale, t('present'))}
          </span>
          <div className="h-px bg-cv-border my-[18px]" />
          <MarkdownText className="text-cv-text text-[13px] leading-[1.65]">{data.desc}</MarkdownText>
          <span className="block text-cv-cyan text-[11px] tracking-[0.22em] uppercase mt-[18px] mb-[10px]">
            {t('stacksUsed')}
          </span>
          <StackBadges groups={[data.stacks]} />
        </div>
      )}
    </DetailModalShell>
  );
}
