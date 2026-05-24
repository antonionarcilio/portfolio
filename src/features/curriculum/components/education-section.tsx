'use client';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function EducationSection({ items }: { items: CurriculumData['education'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Formação
      </h3>
      <ScrollList maxHeight={170} maxHeightMobile={280}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.title}
            index={i}
            className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 last:mb-0 border-l-2 border-l-cv-cyan"
            whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
          >
            <div className="text-cv-text text-[14px]">{item.title}</div>
            <div className="text-cv-text-dim text-[12px] mt-1">{item.description}</div>
            <div className="text-cv-cyan text-[12px] mt-1 tracking-[0.08em]">{item.year}</div>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
