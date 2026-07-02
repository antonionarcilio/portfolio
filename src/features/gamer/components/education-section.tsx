'use client';

import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import type { PortfolioData } from '@/shared/types/portfolio';

import { HOVER_LIFT_SCALE_VARIANT } from '../animations';
import { AnimatedCard } from './animated-card';
import { CornerBrackets } from './corner-brackets';
import { EmptyState } from './empty-state';
import { ScrollList } from './scroll-list';
import { SectionHeading } from './section-heading';

export function EducationSection({ items }: { items: PortfolioData['education'] }) {
  const { containerRef, getCardRef } = useSnapScroll(items.length, 12);

  return (
    <div>
      <SectionHeading>Formação</SectionHeading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList
          ref={containerRef}
          maxHeight={170}
          maxHeightMobile={280}
          itemCount={items.length}
          hideScrollHint
          hideScrollbar
        >
          {items.map((item, i) => (
            <div key={item.title} className="mb-3 last:mb-0" ref={getCardRef(i)}>
              <AnimatedCard
                index={i}
                className="relative group border border-cv-border bg-cv-panel px-5 py-[18px] border-l-2 border-l-cv-border outline-none focus-visible:outline-none"
                whileHover={HOVER_LIFT_SCALE_VARIANT}
                tabIndex={0}
              >
                <CornerBrackets
                  size="sm"
                  className="border-cv-cyan opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="block text-cv-text text-[14px]">{item.title}</span>
                <span className="text-cv-text-dim text-[12px] mt-1 line-clamp-2">{item.description}</span>
                <span className="block text-cv-cyan text-[12px] mt-1 tracking-[0.08em]">Concluído em {item.year}</span>
              </AnimatedCard>
            </div>
          ))}
        </ScrollList>
      )}
    </div>
  );
}
