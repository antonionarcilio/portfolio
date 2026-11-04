'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

import chevronsDownUp from '@/_assets/icons/chevrons-down-up.svg';
import chevronsUpDown from '@/_assets/icons/chevrons-up-down.svg';

import { flipDemoExpansionTransition, flipDemoFadeTransition } from './animations';
import type { FlipDemoContent } from './content';
import { useFlipCard } from './use-flip-card';

const CARD_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const CORNER_POSITION_CLASS: Record<(typeof CARD_CORNERS)[number], string> = {
  'top-left': 'top-0 left-0 border-t border-l',
  'top-right': 'top-0 right-0 border-t border-r',
  'bottom-left': 'bottom-0 left-0 border-b border-l',
  'bottom-right': 'bottom-0 right-0 border-b border-r',
};
const cardExpansionTransition = { ...flipDemoExpansionTransition, opacity: flipDemoFadeTransition };
const seedTransition = { duration: 0, opacity: flipDemoFadeTransition };

// Cloned from `src/features/minimalist/utils/scroll-expanded-content.ts` — small enough to inline.
function scrollExpandedContent(content: HTMLElement, key: string): boolean {
  const direction = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  if (!direction) return false;
  const maximumScrollTop = Math.max(content.scrollHeight - content.clientHeight, 0);
  const hasRoom = direction > 0 ? content.scrollTop < maximumScrollTop - 1 : content.scrollTop > 1;
  if (!hasRoom) return false;
  content.scrollBy({ top: direction * Math.max(content.clientHeight * 0.8, 1), behavior: 'auto' });
  return true;
}

type FlipDemoCardProps = {
  containerRef: RefObject<HTMLElement | null>;
  content: FlipDemoContent;
  expanded: boolean;
  onExpandedChange: () => void;
};

export function FlipDemoCard({ containerRef, content, expanded, onExpandedChange }: FlipDemoCardProps) {
  const t = useTranslations('labs.posts.flip');
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  const flip = useFlipCard({ containerRef, expanded });
  const expandedContentId = 'flip-demo-expanded-content';

  useLayoutEffect(() => {
    const el = expandedContentRef.current;
    if (!expanded || !el) {
      setShowExpandedGradient(false);
      return;
    }
    const updateGradient = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 1;
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setShowExpandedGradient(hasOverflow && !atEnd);
    };
    updateGradient();
    el.addEventListener('scroll', updateGradient, { passive: true });
    const resizeObserver = new ResizeObserver(updateGradient);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener('scroll', updateGradient);
      resizeObserver.disconnect();
    };
  }, [expanded]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!expanded || !expandedContentRef.current || !scrollExpandedContent(expandedContentRef.current, event.key))
      return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      ref={flip.slotRef}
      className="min-w-0"
      style={flip.slotSize ? { height: flip.slotSize.height, width: flip.slotSize.width } : { width: 420 }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <motion.article
        key={flip.overlayCycle}
        data-expanded={expanded ? 'true' : 'false'}
        animate={{
          ...(flip.isOverlay && flip.overlayGeometry ? flip.overlayGeometry[flip.overlayTarget] : {}),
          opacity: 1,
        }}
        transition={flip.isSeedingOverlay ? seedTransition : cardExpansionTransition}
        onKeyDown={handleKeyDown}
        className={
          'flex h-full w-full flex-col gap-5.5 border border-zinc-700 bg-transparent p-[22px] text-zinc-100' +
          (flip.isOverlay ? ' absolute z-10 m-0 overflow-hidden bg-zinc-950' : ' relative') +
          (flip.showExpandedLayout ? ' grid grid-rows-[auto_minmax(0,1fr)_auto] gap-8 overflow-hidden bg-zinc-950' : '')
        }
      >
        {CARD_CORNERS.map((corner) => (
          <motion.span
            key={corner}
            className={`pointer-events-none absolute h-4 w-4 border-zinc-100 ${CORNER_POSITION_CLASS[corner]} ${
              flip.showExpandedLayout ? '!opacity-0' : ''
            }`}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={flipDemoFadeTransition}
            aria-hidden="true"
          />
        ))}

        <header className="flex items-center justify-between gap-5">
          <p className="text-sm text-zinc-400">{`// ${content.projectName}`}</p>
          <h2 className="text-right text-sm tracking-wide text-zinc-100 uppercase">
            {expanded ? content.expertiseArea : content.period}
          </h2>
        </header>

        <div className={flip.showExpandedLayout ? 'flex min-h-0 flex-col gap-4 overflow-hidden' : 'contents'}>
          {!flip.showExpandedLayout && <p className="text-base font-light text-zinc-300">{content.excerpt}</p>}

          {flip.showExpandedLayout && (
            <div className="relative min-h-0 flex-1 overflow-hidden" onWheel={(event) => event.stopPropagation()}>
              <div
                ref={expandedContentRef}
                id={expandedContentId}
                tabIndex={0}
                className="h-full min-h-0 overflow-y-auto text-base font-light text-zinc-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onWheel={(event) => event.stopPropagation()}
              >
                <p className="mb-4 font-light text-zinc-300">{content.excerpt}</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-100">{t('workedAsLabel')}</h3>
                    <p className="text-zinc-300">{content.expertiseArea}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{t('periodLabel')}</h3>
                    <p className="text-zinc-300">{content.period}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{t('companyLabel')}</h3>
                    <p className="text-zinc-300">{content.company}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{t('aboutLabel')}</h3>
                    <p className="text-zinc-300">{content.description}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{t('stackLabel')}</h3>
                    <p className="text-zinc-300">{content.stack.join(' + ')}</p>
                  </div>
                </div>
              </div>
              {showExpandedGradient && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 bottom-0 left-0 h-[72px] bg-gradient-to-b from-transparent to-zinc-950"
                />
              )}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-5">
          <a
            href={content.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 underline-offset-4 hover:underline"
          >
            {t('openLabel')}
          </a>
          <motion.button
            type="button"
            aria-expanded={expanded}
            aria-controls={expandedContentId}
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.96 }}
            className="ml-auto inline-flex items-center gap-1 text-sm text-zinc-100 uppercase"
            onPointerDown={() => {
              if (!expanded) flip.captureExpansionGeometry();
            }}
            onClick={() => {
              flip.requestExpand();
              onExpandedChange();
            }}
          >
            {expanded ? t('collapseLabel') : t('expandLabel')}
            <Image src={expanded ? chevronsDownUp : chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />
          </motion.button>
        </footer>
      </motion.article>
    </div>
  );
}
