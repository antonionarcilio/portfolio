'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';

import { Tooltip } from '@/components/tooltip';
import type { CurriculumData } from '@/features/curriculum/types/curriculum';

import { ExperienceModal } from './experience-modal';

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
    <div id="experience-section">
      <h3
        className={clsx(
          "flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]",
          flash && 'animate-flash-header',
        )}
        onAnimationEnd={onFlashEnd}
      >
        Experiência(s)
      </h3>
      {items.map((item) => (
        <div
          key={item.company}
          role="button"
          tabIndex={0}
          className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan transition-[border-color,background,transform,box-shadow] duration-[250ms] cursor-pointer hover:bg-cv-panel2 hover:translate-x-[3px] hover:shadow-[0_0_18px_rgba(43,214,255,0.10)]"
          onClick={() => setOpen(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(item);
            }
          }}
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
            <Tooltip content="Clique para expandir" placement="left">
              <span className="text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan-dim px-[9px] py-[3px] bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px] whitespace-nowrap shrink-0">
                Expandir
              </span>
            </Tooltip>
          </div>
        </div>
      ))}
      <ExperienceModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
