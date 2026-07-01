'use client';

import { useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { formatYearRange } from '@/features/gamer/utils/format-experience-date-range';
import type { PortfolioData } from '@/shared/types/portfolio';

import { HOVER_LIFT_SCALE_VARIANT } from '@/features/gamer/animations';
import { AnimatedCard } from './animated-card';
import { EmptyState } from './empty-state';
import { ExperienceModal } from './experience-modal';
import { ScrollList } from './scroll-list';
import { SectionHeading } from './section-heading';
import { ShimmerStatus } from './shimmer-text';
import { Tooltip } from './tooltip';

export function ExperienceSection({
  items,
  flash,
  onFlashEnd,
}: {
  items: PortfolioData['experience'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const [open, setOpen] = useState<PortfolioData['experience'][0] | null>(null);
  const lastData = useRef<PortfolioData['experience'][0] | null>(null);
  if (open !== null) lastData.current = open;

  return (
    <div id="experience-section" className="scroll-mt-[90px]">
      <SectionHeading flash={flash} onFlashEnd={onFlashEnd}>
        Experiência(s)
      </SectionHeading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList maxHeight={170} maxHeightMobile={300} itemCount={items.length} hideScrollHint hideScrollbar>
          {items.map((item, i) => (
            <AnimatedCard
              key={item.company}
              index={i}
              className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan cursor-gamer-pointer"
              whileHover={HOVER_LIFT_SCALE_VARIANT}
              onClick={() => setOpen(item)}
            >
              <div className="min-w-0 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 text-[14px]">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <div className="text-cv-text truncate min-w-0">{item.company}</div>
                    <div className="text-cv-text-dim shrink-0">|</div>
                    <div className="text-cv-text-dim tracking-[0.04em] truncate min-w-0">{item.role}</div>
                  </div>

                  <Tooltip title="Clique e veja mais detalhes" placement="left">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-cv-cyan cursor-gamer-help"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <rect x="0.5" y="0.5" width="13" height="13" stroke="currentColor" />
                      <motion.g
                        style={{ transformOrigin: '50% 50%' }}
                        animate={{ rotate: open === item ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        <line x1="7" y1="3" x2="7" y2="11" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.2" />
                      </motion.g>
                    </motion.svg>
                  </Tooltip>
                </div>

                <div className="text-cv-text-dim text-[12px] leading-[1.6] line-clamp-3">{item.details.join(' ')}</div>

                <div className="flex justify-between items-center">
                  <div className="block w-fit text-cv-cyan text-[11px] tracking-[0.08em]">{formatYearRange(item)}</div>

                  <Tooltip title="Clique e veja em detalhes">
                    <div>
                      <ShimmerStatus
                        text="Conteúdo extra disponível"
                        className="cv-shimmer-hint text-[10px] cursor-gamer-help max-[420px]:hidden"
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </ScrollList>
      )}
      <ExperienceModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
