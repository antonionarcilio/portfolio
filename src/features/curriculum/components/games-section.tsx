'use client';

import Image from 'next/image';

import { Tooltip } from '@/components/tooltip';
import type { CurriculumData } from '@/features/curriculum/types/curriculum';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function GamesSection({ games }: { games: CurriculumData['games'] }) {
  return (
    <div>
      <h3 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Jogos Recentes
      </h3>
      <ScrollList maxHeight={196} maxHeightMobile={366}>
        {games.map((game, i) => (
          <AnimatedCard
            key={game.title}
            index={i}
            className="grid grid-cols-[44px_1fr] gap-[14px] items-start border border-cv-border bg-cv-panel px-[14px] py-3 mb-[10px]"
            whileHover={{ borderColor: '#2bd6ff', backgroundColor: '#0a1626', x: 3 }}
          >
            <div className="w-9 h-9 flex items-center justify-center border border-cv-border bg-cv-bg2 overflow-hidden rounded-[6px]">
              <Image src={game.image} alt={game.title} width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div>
              <Tooltip content={game.title}>
                <div className="text-[13px] text-cv-text">{game.title}</div>
              </Tooltip>
              <div className="text-[11px] text-cv-text-dim mt-[2px]">{game.sub}</div>
              <Tooltip content={game.tag}>
                <div className="text-[11px] text-cv-orange mt-[6px] flex items-start gap-[6px] before:content-['◆'] before:text-[8px] before:mt-[2px] before:shrink-0">
                  {game.tag}
                </div>
              </Tooltip>
            </div>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
