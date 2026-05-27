'use client';

import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function EducationSection({ items }: { items: PortfolioData['education'] }) {
  return (
    <div>
      <h2 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Formação
      </h2>
      <ScrollList maxHeight={170} maxHeightMobile={280} itemCount={items.length}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.title}
            index={i}
            className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 last:mb-0 border-l-2 border-l-cv-cyan"
            whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
          >
            <span className="block text-cv-text text-[14px]">{item.title}</span>
            <span className="text-cv-text-dim text-[12px] mt-1 line-clamp-2">{item.description}</span>
            <span className="block text-cv-cyan text-[12px] mt-1 tracking-[0.08em]">{item.year}</span>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
