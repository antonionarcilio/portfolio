'use client';

import { motion } from 'framer-motion';

import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import type { PortfolioData } from '@/shared/types/portfolio';

import { AnimatedCard } from './animated-card';
import { EmptyState } from './empty-state';
import { FlashHeading } from './flash-heading';
import { ScrollList } from './scroll-list';
import { SHIMMER_HOVER_VARIANT, ShimmerLabel } from './shimmer-text';

export function ServicesSection({
  items,
  flash,
  onFlashEnd,
  id = 'services-section',
}: {
  items: PortfolioData['services'];
  flash?: boolean;
  onFlashEnd?: () => void;
  id?: string;
}) {
  const { containerRef, getCardRef } = useSnapScroll(items.length);

  return (
    <div id={id}>
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Serviços
      </FlashHeading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList ref={containerRef} maxHeight={318} maxHeightMobile={480} itemCount={items.length}>
          {items.map((item, i) => (
            <div key={item.title} className="mb-3" ref={getCardRef(i)}>
              <AnimatedCard
                index={i}
                className="border border-cv-border bg-cv-panel px-5 py-[18px] border-l-2 border-l-cv-cyan"
                whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
              >
                <div className="flex items-center justify-between gap-[8px] mb-[6px]">
                  <span className="text-cv-text text-[13px] tracking-[0.04em]">{item.title}</span>
                  <motion.a
                    href={item.contactUrl ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={SHIMMER_HOVER_VARIANT}
                    whileFocus={SHIMMER_HOVER_VARIANT}
                    className="cv-shimmer-btn shrink-0 text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan/40 px-[9px] py-[3px] bg-cv-cyan/[0.06] backdrop-blur-[18px] whitespace-nowrap cursor-gamer-pointer"
                  >
                    <ShimmerLabel>Passar Missão</ShimmerLabel>
                  </motion.a>
                </div>
                <span className="block text-cv-text-dim text-[12px] leading-[1.6]">{item.description}</span>
              </AnimatedCard>
            </div>
          ))}
        </ScrollList>
      )}
    </div>
  );
}
