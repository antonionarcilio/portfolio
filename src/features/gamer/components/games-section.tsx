'use client';

import Image from 'next/image';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { Tooltip } from './tooltip';

import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';

export function GamesSection({ games }: { games: PortfolioData['games'] }) {
  return (
    <div>
      <h2 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Jogos Recentes
      </h2>
      <ScrollList maxHeight={294} maxHeightMobile={390}>
        {games.map((game, i) => (
          <AnimatedCard
            key={game.title}
            index={i}
            className="grid grid-cols-[44px_1fr] gap-[14px] items-start border border-cv-border bg-cv-panel px-[14px] py-3 mb-[10px]"
            whileHover={{ borderColor: '#2bd6ff', backgroundColor: '#0a1626', x: 3 }}
          >
            <div className="w-9 h-9 flex items-center justify-center border border-cv-border bg-cv-bg2 overflow-hidden rounded-[6px]">
              <Tooltip title={game.title} description={game.tag}>
                <Image
                  src={game.image}
                  alt={game.title}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover cursor-help"
                />
              </Tooltip>
            </div>
            <div>
              <div className="flex items-center justify-between text-[13px] text-cv-text">
                <span>{game.title}</span>
                <Tooltip content={game.sub} placement="left">
                  <span className="text-[10px] opacity-80 cursor-help">{game.sub}</span>
                </Tooltip>
              </div>
              <div className="text-[11px] text-cv-orange mt-[6px]">{game.tag}</div>
            </div>
          </AnimatedCard>
        ))}
      </ScrollList>
    </div>
  );
}
