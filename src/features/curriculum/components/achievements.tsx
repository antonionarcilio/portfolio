'use client';

import Image from 'next/image';

import { Tooltip } from './tooltip';
import type { CurriculumData } from '@/features/curriculum/types/curriculum';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function Achievements({ items }: { items: CurriculumData['achievements'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Conquistas
      </h3>
      <ScrollList maxHeight={276} maxHeightMobile={380}>
        {items.map((item, i) => (
          <AnimatedCard
            key={item.title}
            index={i}
            className="grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] mb-3 cursor-default"
            whileHover={{ borderColor: '#2bd6ff', x: 3 }}
          >
            <Image
              src={`/achievements/achievements-${item.badge}.png`}
              alt={item.title}
              width={56}
              height={56}
              className="object-contain"
            />
            <div>
              <Tooltip content={item.title}>
                <div className="text-[13px] text-cv-text cursor-help">{item.title}</div>
              </Tooltip>
              <Tooltip content={item.desc}>
                <div className="text-[12px] text-cv-text-dim mt-[3px] cursor-help">{item.desc}</div>
              </Tooltip>
            </div>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
