'use client';

import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { AnimatedCard } from './animated-card';
import { FlashHeading } from './flash-heading';
import { ScrollList } from './scroll-list';

export function ServicesSection({
  items,
  flash,
  onFlashEnd,
}: {
  items: PortfolioData['services'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  return (
    <div id="services-section">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Serviços
      </FlashHeading>
      <ScrollList maxHeight={318} maxHeightMobile={480} itemCount={items.length}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.title}
            index={i}
            className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan"
            whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
          >
            <span className="block text-cv-text text-[13px] tracking-[0.04em] mb-[6px]">{item.title}</span>
            <span className="block text-cv-text-dim text-[12px] leading-[1.6]">{item.description}</span>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
