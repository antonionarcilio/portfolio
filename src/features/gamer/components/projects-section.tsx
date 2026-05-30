'use client';

import { useRef, useState } from 'react';

import { Maximize2 } from 'lucide-react';

import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { formatExperienceDateRange } from '@/features/gamer/utils/format-experience-date-range';

import { AnimatedCard } from './animated-card';
import { FlashHeading } from './flash-heading';
import { ProjectModal } from './project-modal';
import { ScrollList } from './scroll-list';
import { Tooltip } from './tooltip';

export function ProjectsSection({
  items,
  flash,
  onFlashEnd,
}: {
  items: PortfolioData['projects'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const [open, setOpen] = useState<PortfolioData['projects'][0] | null>(null);
  const lastData = useRef<PortfolioData['projects'][0] | null>(null);
  if (open !== null) lastData.current = open;
  const { containerRef, getCardRef } = useSnapScroll(items.length);

  return (
    <div id="projects-section">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Principais Projetos
      </FlashHeading>
      <ScrollList ref={containerRef} maxHeight={360} maxHeightMobile={480} itemCount={items.length}>
        {items.map((item, i) => (
          <div key={`${item.company}-${item.projectName}`} className="mb-3" ref={getCardRef(i)}>
            <AnimatedCard
              index={i}
              className="border border-cv-border bg-cv-panel px-5 py-[18px] border-l-2 border-l-cv-cyan"
              whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-[8px] text-[14px]">
                  <div className="flex items-baseline gap-[8px] min-w-0">
                    <span className="text-cv-text truncate min-w-0">{item.projectName}</span>
                    <span className="text-cv-text-dim shrink-0">|</span>
                    <span className="text-cv-text-dim tracking-[0.04em] truncate min-w-0">{item.company}</span>
                  </div>
                  <Tooltip title="Ver detalhes" description="Abre o modal com informações completas" placement="left">
                    <button
                      type="button"
                      className="shrink-0 text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan/40 px-[9px] py-[3px] max-[520px]:p-[4px] bg-cv-cyan/[0.06] backdrop-blur-[18px] whitespace-nowrap cursor-gamer-pointer"
                      onClick={() => setOpen(item)}
                    >
                      <span className="max-[520px]:hidden">Expandir</span>
                      <Maximize2 className="hidden max-[520px]:block" size={14} />
                    </button>
                  </Tooltip>
                </div>
                <span className="text-cv-text-dim text-[12px] mt-[8px] leading-[1.6] line-clamp-2">{item.desc}</span>
                <span className="block w-fit text-cv-cyan text-[11px] mt-[6px] tracking-[0.08em]">
                  {formatExperienceDateRange({ startDate: item.startDate, endDate: item.endDate })}
                </span>
              </div>
            </AnimatedCard>
          </div>
        ))}
      </ScrollList>
      <ProjectModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
