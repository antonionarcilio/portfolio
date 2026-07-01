'use client';

import { animate } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { HOVER_SHIFT_X_VARIANT } from '@/features/gamer/animations';
import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import type { PortfolioData } from '@/shared/types/portfolio';
import { AnimatedCard } from './animated-card';
import { EmptyState } from './empty-state';
import { Heading } from './flash-heading';
import { ScrollList } from './scroll-list';
import { Tooltip } from './tooltip';

function FlipBadge({ src, alt, title, desc }: { src: string; alt: string; title: string; desc: string }) {
  const flipRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const { opts } = useA11y();

  const handleEnter = async () => {
    if (!flipRef.current || opts.reduceMotion) return;
    hoveredRef.current = true;
    await animate(flipRef.current, { rotateY: 720 }, { duration: 1.2, ease: 'easeInOut' });
    if (hoveredRef.current && flipRef.current) {
      animate(flipRef.current, { rotateY: 0 }, { duration: 0 });
    }
  };

  const handleLeave = () => {
    if (!flipRef.current || opts.reduceMotion) return;
    hoveredRef.current = false;
    animate(flipRef.current, { rotateY: 0 }, { duration: 0.5, ease: 'easeOut' });
  };

  return (
    <div style={{ perspective: '300px' }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Tooltip title={title} description={desc}>
        <div className="cursor-gamer-help">
          <div ref={flipRef}>
            <Image src={src} alt={alt} width={56} height={56} className="object-contain" />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export function Achievements({ items }: { items: PortfolioData['achievements'] }) {
  const { containerRef, getCardRef } = useSnapScroll(items.length, 12);

  return (
    <div>
      <Heading>Conquistas</Heading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList ref={containerRef} maxHeight={384} maxHeightMobile={384} itemCount={items.length}>
          {items.map((item, i) => (
            <div key={item.title} className="mb-3" ref={getCardRef(i)}>
              <AnimatedCard
                index={i}
                className="grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] cursor-gamer-default"
                whileHover={HOVER_SHIFT_X_VARIANT}
              >
                <FlipBadge src={item.badge} alt={item.title} title={item.title} desc={item.desc} />
                <div>
                  <div className="flex items-center justify-between text-[13px] text-cv-text">
                    <span>{item.title}</span>
                    <Tooltip content={item.year} placement="left">
                      <span className="text-[11px] opacity-80 cursor-gamer-help">{item.year}</span>
                    </Tooltip>
                  </div>
                  <span className="block text-[12px] text-cv-text-dim mt-[3px]">{item.desc}</span>
                </div>
              </AnimatedCard>
            </div>
          ))}
        </ScrollList>
      )}
    </div>
  );
}
