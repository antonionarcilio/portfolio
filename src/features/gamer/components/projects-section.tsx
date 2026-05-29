'use client';

import { useRef, useState } from 'react';

import { Maximize2 } from 'lucide-react';

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

  return (
    <div id="projects-section">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Principais Projetos
      </FlashHeading>
      <ScrollList maxHeight={240} maxHeightMobile={480} itemCount={items.length}>
        {items.map((item, i) => (
          <AnimatedCard
            key={`${item.company}-${item.projectName}`}
            index={i}
            className="relative border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan"
            whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-[8px] text-[14px] max-[520px]:pr-[30px]">
                <span className="text-cv-text max-[520px]:truncate max-[520px]:min-w-0">{item.projectName}</span>
                <span className="text-cv-text-dim">|</span>
                <span className="text-cv-text-dim tracking-[0.04em] max-[520px]:truncate max-[520px]:min-w-0">
                  {item.company}
                </span>
              </div>
              <span className="text-cv-text-dim text-[12px] mt-[8px] leading-[1.6] line-clamp-2">{item.desc}</span>
              <span className="block text-cv-cyan text-[11px] mt-[6px] tracking-[0.08em]">
                {formatExperienceDateRange({ startDate: item.startDate, endDate: item.endDate })}
              </span>
            </div>
            <Tooltip title="Ver detalhes" description="Abre o modal com informações completas" placement="left">
              <button
                type="button"
                className="absolute top-[17px] right-[17px] text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan/40 px-[9px] py-[3px] max-[520px]:p-[4px] bg-cv-cyan/[0.06] backdrop-blur-[18px] whitespace-nowrap cursor-gamer-pointer"
                onClick={() => setOpen(item)}
              >
                <span className="max-[520px]:hidden">Expandir</span>
                <Maximize2 className="hidden max-[520px]:block" size={14} />
              </button>
            </Tooltip>
          </AnimatedCard>
        ))}
      </ScrollList>
      <ProjectModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
