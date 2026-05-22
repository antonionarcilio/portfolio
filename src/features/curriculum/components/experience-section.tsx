'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';

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
        Experiências
      </h3>
      {items.map((item) => (
        <div
          key={item.company}
          role="button"
          tabIndex={0}
          className="group relative border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan transition-[border-color,background,transform,box-shadow] duration-[250ms] cursor-pointer hover:bg-cv-panel2 hover:translate-x-[3px] hover:shadow-[0_0_18px_rgba(43,214,255,0.10)]"
          onClick={() => setOpen(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(item);
            }
          }}
        >
          <span className="absolute top-[-13px] right-[20px] text-[10px] text-cv-cyan tracking-[0.16em] uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-90 border border-cv-cyan-dim px-[9px] py-[3px] bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px]">
            Expandir ⊞
          </span>
          <div className="flex justify-between items-baseline flex-wrap gap-2">
            <div>
              <div className="text-[16px] text-cv-text">{item.company}</div>
              <div className="text-[13px] text-cv-cyan mt-1 tracking-[0.06em]">{item.role}</div>
            </div>
            <div className="text-cv-cyan text-[11px] tracking-[0.14em] border border-cv-cyan-dim px-[9px] py-[3px] bg-[rgba(43,214,255,0.06)] whitespace-nowrap">
              {item.date}
            </div>
          </div>
          <div className="text-cv-text-dim text-[13px] mt-[10px] pl-3 border-l border-cv-border line-clamp-2">
            {item.description}
          </div>
        </div>
      ))}
      <ExperienceModal data={open ?? lastData.current} show={open !== null} onClose={() => setOpen(null)} />
    </div>
  );
}
