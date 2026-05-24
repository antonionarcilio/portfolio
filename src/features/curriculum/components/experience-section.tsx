'use client';

import { useRef, useState } from 'react';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';
import { Tooltip } from './tooltip';

import { AnimatedCard } from './animated-card';
import { ExperienceModal } from './experience-modal';
import { FlashHeading } from './flash-heading';
import { ScrollList } from './scroll-list';

export function ExperienceSection({
  items,
  flash,
  onFlashEnd,
}: {
  items: CurriculumData['experience'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const [open, setOpen] = useState<CurriculumData['experience'][0] | null>(null);
  const lastData = useRef<CurriculumData['experience'][0] | null>(null);
  if (open !== null) lastData.current = open;

  return (
    <div id="experience-section" className="mb-[15px]">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Experiência(s)
      </FlashHeading>
      <ScrollList maxHeight={170} maxHeightMobile={300}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.company}
            index={i}
            className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan"
            whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-baseline gap-[8px] text-[14px] max-[550px]:flex-col max-[550px]:items-start max-[550px]:gap-[2px]">
                  <span className="text-cv-text">{item.company}</span>
                  <span className="text-cv-text-dim max-[550px]:hidden">|</span>
                  <span className="text-cv-text-dim tracking-[0.04em]">{item.role}</span>
                </div>
                <div className="text-cv-text-dim text-[12px] mt-[8px] leading-[1.6] line-clamp-2">
                  {item.details.join(' ')}
                </div>
                <div className="text-cv-cyan text-[11px] mt-[6px] tracking-[0.08em]">{item.date}</div>
              </div>
              <Tooltip title="Ver detalhes" description="Abre o modal com informações completas" placement="left">
                <button
                  type="button"
                  className="text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan-dim px-[9px] py-[3px] bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px] whitespace-nowrap shrink-0 cursor-pointer"
                  onClick={() => setOpen(item)}
                >
                  Expandir
                </button>
              </Tooltip>
            </div>
          </AnimatedCard>
        ))}
      </ScrollList>
      <ExperienceModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
