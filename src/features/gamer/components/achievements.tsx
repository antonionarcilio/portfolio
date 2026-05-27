'use client';

import { animate } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';
import { Tooltip } from './tooltip';

function FlipBadge({ src, alt, title, desc }: { src: string; alt: string; title: string; desc: string }) {
  const flipRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  const handleEnter = async () => {
    if (!flipRef.current) return;
    hoveredRef.current = true;
    await animate(flipRef.current, { rotateY: 720 }, { duration: 1.2, ease: 'easeInOut' });
    if (hoveredRef.current && flipRef.current) {
      animate(flipRef.current, { rotateY: 0 }, { duration: 0 });
    }
  };

  const handleLeave = () => {
    if (!flipRef.current) return;
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
  return (
    <div>
      <h2 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Conquistas
      </h2>
      <ScrollList maxHeight={384} maxHeightMobile={384}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.title}
            index={i}
            className="grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] mb-3 cursor-gamer-default"
            whileHover={{ borderColor: '#2bd6ff', x: 3 }}
          >
            <FlipBadge
              src={`/portfolios/gamer/achievements/achievements-${item.badge}.png`}
              alt={item.title}
              title={item.title}
              desc={item.desc}
            />
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
        ))}
      </ScrollList>
    </div>
  );
}
