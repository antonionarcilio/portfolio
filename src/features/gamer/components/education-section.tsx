'use client';

import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import type { PortfolioData } from '@/shared/types/portfolio';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function EducationSection({ items }: { items: PortfolioData['education'] }) {
  const { containerRef, getCardRef } = useSnapScroll(items.length);

  return (
    <div>
      <h2 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Formação
      </h2>
      <ScrollList ref={containerRef} maxHeight={170} maxHeightMobile={280} itemCount={items.length}>
        {items.map((item, i) => (
          <div key={item.title} className="mb-3 last:mb-0" ref={getCardRef(i)}>
            <AnimatedCard
              index={i}
              className="border border-cv-border bg-cv-panel px-5 py-[18px] border-l-2 border-l-cv-cyan"
              whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
            >
              <span className="block text-cv-text text-[14px]">{item.title}</span>
              <span className="text-cv-text-dim text-[12px] mt-1 line-clamp-2">{item.description}</span>
              <span className="block text-cv-cyan text-[12px] mt-1 tracking-[0.08em]">{item.year}</span>
            </AnimatedCard>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}
