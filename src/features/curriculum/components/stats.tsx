'use client';

import clsx from 'clsx';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';

export function Stats({
  items,
  onFirstClick,
  onSecondClick,
}: {
  items: CurriculumData['stats'];
  onFirstClick?: () => void;
  onSecondClick?: () => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-9 max-cv:grid-cols-2">
      {items.map((item, i) => {
        const onClick = i === 0 ? onFirstClick : i === 1 ? onSecondClick : undefined;
        const isClickable = i === 0 || i === 1;
        return (
          <div
            key={item.label}
            className={clsx(
              'border border-cv-border bg-cv-panel px-[18px] pt-[22px] pb-[18px] text-center relative transition-[border-color,transform,box-shadow] duration-[250ms] hover:border-cv-cyan hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(43,214,255,0.12)]',
              isClickable ? 'cursor-pointer' : 'cursor-default',
            )}
            onClick={onClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
              isClickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onClick?.();
                    }
                  }
                : undefined
            }
          >
            <div className="text-[36px] text-cv-cyan tracking-[0.04em] [text-shadow:0_0_10px_rgba(43,214,255,0.3)]">
              {item.value}
            </div>
            <div className="text-[11px] text-cv-text-dim tracking-[0.18em] uppercase mt-1">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
