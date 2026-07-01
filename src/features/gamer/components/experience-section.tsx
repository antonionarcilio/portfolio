'use client';

import { useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

import { formatYearRange } from '@/features/gamer/utils/format-experience-date-range';
import type { PortfolioData } from '@/shared/types/portfolio';

import { AnimatedCard } from './animated-card';
import { EmptyState } from './empty-state';
import { ExperienceModal } from './experience-modal';
import { FlashHeading } from './flash-heading';
import { ScrollList } from './scroll-list';
import { SHIMMER_HOVER_VARIANT, ShimmerLabel } from './shimmer-text';
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
    <div id="experience-section">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Experiência(s)
      </FlashHeading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList maxHeight={170} maxHeightMobile={300} itemCount={items.length} hideScrollHint>
          {items.map((item, i) => (
            <AnimatedCard
              key={item.company}
              index={i}
              className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan"
              whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-[8px] text-[14px]">
                  <div className="flex items-baseline gap-[8px] min-w-0">
                    <span className="text-cv-text truncate min-w-0">{item.company}</span>
                    <span className="text-cv-text-dim shrink-0">|</span>
                    <span className="text-cv-text-dim tracking-[0.04em] truncate min-w-0">{item.role}</span>
                  </div>
                  <Tooltip title="Ver detalhes" description="Abre o modal com informações completas" placement="left">
                    <motion.button
                      type="button"
                      whileHover={SHIMMER_HOVER_VARIANT}
                      whileFocus={SHIMMER_HOVER_VARIANT}
                      className="cv-shimmer-btn shrink-0 text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan-dim px-[9px] py-[3px] max-[520px]:p-[4px] bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px] whitespace-nowrap cursor-gamer-pointer"
                      onClick={() => setOpen(item)}
                    >
                      <ShimmerLabel className="max-[520px]:hidden">Expandir</ShimmerLabel>
                      <Maximize2 className="hidden max-[520px]:block" size={14} />
                    </motion.button>
                  </Tooltip>
                </div>
                <span className="text-cv-text-dim text-[12px] mt-[8px] leading-[1.6] line-clamp-2">
                  {item.details.join(' ')}
                </span>
                <span className="block w-fit text-cv-cyan text-[11px] mt-[6px] tracking-[0.08em]">
                  {formatYearRange(item)}
                </span>
              </div>
            </AnimatedCard>
          ))}
        </ScrollList>
      )}
      <ExperienceModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
