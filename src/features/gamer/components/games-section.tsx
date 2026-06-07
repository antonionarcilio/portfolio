'use client';

import Image from 'next/image';

import { useSnapScroll } from '@/features/gamer/hooks/use-snap-scroll';
import type { PortfolioData } from '@/shared/types/portfolio';
import { AnimatedCard } from './animated-card';
import { ScrollList } from './scroll-list';
import { Tooltip } from './tooltip';

export function GamesSection({ games }: { games: PortfolioData['games'] }) {
  const { containerRef, getCardRef } = useSnapScroll(games.length);

  return (
    <div>
      <h2 className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]">
        Jogos Recentes
      </h2>
      <ScrollList ref={containerRef} maxHeight={360} maxHeightMobile={360} itemCount={games.length}>
        {games.map((game, i) => (
          <div key={game.title} className="mb-[10px]" ref={getCardRef(i)}>
            <AnimatedCard
              index={i}
              className="grid grid-cols-[56px_1fr] gap-[14px] items-start border border-cv-border bg-cv-panel px-[14px] py-3"
              whileHover={{ borderColor: '#2bd6ff', backgroundColor: '#0a1626', x: 3 }}
            >
              <div className="w-14 h-14 flex items-center justify-center border border-cv-border bg-cv-bg2 overflow-hidden rounded-[8px]">
                <Tooltip title={game.title} description={game.tag}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover p-[6px] rounded-[8px] cursor-gamer-help"
                  />
                </Tooltip>
              </div>
              <div>
                <div className="flex items-center justify-between text-[13px] text-cv-text">
                  <span>{game.title}</span>
                  <Tooltip content={game.sub} placement="left">
                    <span className="text-[11px] opacity-80 cursor-gamer-help">{game.sub}</span>
                  </Tooltip>
                </div>
                <span className="block text-[11px] text-cv-orange mt-[6px]">{game.tag}</span>
              </div>
            </AnimatedCard>
          </div>
        ))}
      </ScrollList>
    </div>
  );
}
