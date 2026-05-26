'use client';

import Image from 'next/image';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { Tooltip } from './tooltip';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function Achievements({ items }: { items: PortfolioData['achievements'] }) {
  return (
    <div>
      <h2 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Conquistas
      </h2>
      <ScrollList maxHeight={276} maxHeightMobile={380}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.title}
            index={i}
            className="grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] mb-3 cursor-default"
            whileHover={{ borderColor: '#2bd6ff', x: 3 }}
          >
            <Tooltip title={item.title} description={item.desc}>
              <Image
                src={`/achievements/achievements-${item.badge}.png`}
                alt={item.title}
                width={56}
                height={56}
                className="object-contain cursor-help"
              />
            </Tooltip>
            <div>
              <div className="flex items-center justify-between text-[13px] text-cv-text">
                <span>{item.title}</span>
                <Tooltip content={item.year} placement="left">
                  <span className="text-[10px] opacity-80 cursor-help">{item.year}</span>
                </Tooltip>
              </div>
              <div className="text-[12px] text-cv-text-dim mt-[3px]">{item.desc}</div>
            </div>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
