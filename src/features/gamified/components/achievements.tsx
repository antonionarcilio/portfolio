'use client';

import { animate } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { HOVER_LIFT_SCALE_VARIANT } from '@/features/gamified/animations';
import { useA11y } from '@/features/gamified/contexts/a11y-context';
import { useActivationProps } from '@/features/gamified/hooks/use-activation-props';
import { useSnapScroll } from '@/features/gamified/hooks/use-snap-scroll';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';
import type { PortfolioData } from '@/shared/types/portfolio';
import { cloudinaryOptimizedUrl } from '@/shared/utils/cloudinary-url';
import { AchievementImageModal } from './achievement-image-modal';
import { AnimatedCard } from './animated-card';
import { CornerBrackets } from './corner-brackets';
import { EmptyState } from './empty-state';
import { ScrollList } from './scroll-list';
import { SectionHeading } from './section-heading';
import { Tooltip } from './tooltip';

function FlipBadge({
  src,
  alt,
  title,
  desc,
  onOpen,
}: {
  src: string;
  alt: string;
  title: string;
  desc: string;
  onOpen: () => void;
}) {
  const flipRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const { opts } = useA11y();
  // Popup only makes sense on viewports wider than 520px; below that, tap keeps the tooltip-only behavior.
  const canPopup = !useIsMobile(521);
  const activationProps = useActivationProps(canPopup ? onOpen : undefined);

  const handleEnter = async () => {
    new window.Image().src = cloudinaryOptimizedUrl(src, 350);
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
        <div
          className={canPopup ? 'cursor-gamified-pointer' : 'cursor-gamified-help'}
          onClick={canPopup ? onOpen : undefined}
          {...activationProps}
        >
          <div ref={flipRef}>
            <Image
              src={cloudinaryOptimizedUrl(src, 112)}
              alt={alt}
              width={56}
              height={56}
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export function Achievements({ items }: { items: PortfolioData['achievements'] }) {
  const tHeadings = useTranslations('gamified.sectionHeadings');
  const { containerRef, getCardRef } = useSnapScroll(items.length, 12);
  const [openBadge, setOpenBadge] = useState<PortfolioData['achievements'][0] | null>(null);
  const lastBadge = useRef<PortfolioData['achievements'][0] | null>(null);
  if (openBadge !== null) lastBadge.current = openBadge;

  return (
    <div>
      <SectionHeading>{tHeadings('achievements')}</SectionHeading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList ref={containerRef} maxHeight={384} maxHeightMobile={384} itemCount={items.length}>
          {items.map((item, i) => (
            <div key={item.title} className="mb-3" ref={getCardRef(i)}>
              <AnimatedCard
                index={i}
                className="relative group grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] cursor-gamified-default outline-none focus-visible:outline-none"
                whileHover={HOVER_LIFT_SCALE_VARIANT}
              >
                <CornerBrackets
                  size="sm"
                  className="border-cv-cyan opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <FlipBadge
                  src={item.badge}
                  alt={item.title}
                  title={item.title}
                  desc={item.desc}
                  onOpen={() => setOpenBadge(item)}
                />
                <div>
                  <div className="flex items-center justify-between text-[13px] text-cv-text">
                    <span>{item.title}</span>
                    <Tooltip content={item.year} placement="left">
                      <span className="text-[11px] opacity-80 cursor-gamified-help">{item.year}</span>
                    </Tooltip>
                  </div>
                  <span className="block text-[12px] text-cv-text-dim mt-[3px]">{item.desc}</span>
                </div>
              </AnimatedCard>
            </div>
          ))}
        </ScrollList>
      )}
      <AchievementImageModal
        data={openBadge ?? lastBadge.current}
        show={openBadge !== null}
        onClose={() => setOpenBadge(null)}
      />
    </div>
  );
}
