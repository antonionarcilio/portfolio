'use client';

import Image from 'next/image';

import type { CurriculumData } from '@/features/curriculum/types/curriculum';

import { ScrollList } from './scroll-list';

export function Achievements({ items }: { items: CurriculumData['achievements'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Conquistas
      </h3>
      <ScrollList maxHeight={276}>
        {items.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] mb-3 transition-[border-color,transform] duration-[250ms] cursor-default hover:border-cv-cyan hover:translate-x-[3px]"
          >
            <Image
              src={`/achievements/achievements-${item.badge}.png`}
              alt={item.title}
              width={56}
              height={56}
              className="object-contain"
            />
            <div>
              <div className="text-[13px] text-cv-text">{item.title}</div>
              <div className="text-[12px] text-cv-text-dim mt-[3px]">{item.desc}</div>
            </div>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}
