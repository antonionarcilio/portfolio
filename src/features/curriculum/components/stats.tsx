'use client';

import { motion } from 'framer-motion';

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
          <motion.div
            key={item.label}
            className={`border border-cv-border bg-cv-panel px-[18px] pt-[22px] pb-[18px] text-center relative ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            whileHover={{ borderColor: '#2bd6ff', y: -2, boxShadow: '0 0 24px rgba(43,214,255,0.12)' }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
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
          </motion.div>
        );
      })}
    </div>
  );
}
