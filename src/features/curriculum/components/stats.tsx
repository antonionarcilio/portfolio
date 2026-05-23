'use client';

import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';

function CounterValue({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const isNumeric = match !== null;
  const target = isNumeric ? parseInt(match![1]) : 0;
  const suffix = isNumeric ? match![2] : '';

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return controls.stop;
  }, [isInView, target, isNumeric]);

  if (!isNumeric) return <>{value}</>;

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

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
              <CounterValue value={item.value} />
            </div>
            <div className="text-[11px] text-cv-text-dim tracking-[0.18em] uppercase mt-1">{item.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
