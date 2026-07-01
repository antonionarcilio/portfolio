'use client';

import clsx from 'clsx';
import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { CARD_STAGGER_STEP, HOVER_LIFT_VARIANT, cardVariants } from '@/features/gamer/animations';
import { useA11y } from '@/features/gamer/contexts/a11y-context';
import type { PortfolioData } from '@/shared/types/portfolio';
import { CvButton, shimmerChip } from './cv-button';
import { Tooltip } from './tooltip';

function CounterValue({ value, ready, noMotion }: { value: string; ready: boolean; noMotion: boolean }) {
  const match = value.match(/^(\d+)(.*)$/);
  const isNumeric = match !== null;
  const target = isNumeric ? parseInt(match![1]) : 0;
  const suffix = isNumeric ? match![2] : '';

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ready || !isInView || !isNumeric || noMotion) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return controls.stop;
  }, [ready, isInView, target, isNumeric, noMotion]);

  if (!isNumeric) return <>{value}</>;

  return (
    <span ref={ref}>
      {noMotion ? target : count}
      {suffix}
    </span>
  );
}

const CARD_ACTIONS: Record<number, { label: string; tooltip: string; description: string }> = {
  0: {
    label: 'Ver',
    tooltip: 'Ver experiências',
    description: 'Rola até a seção de experiências profissionais',
  },
  1: {
    label: 'Ver',
    tooltip: 'Ver habilidades',
    description: 'Rola até a seção de habilidades e tecnologias',
  },
  2: {
    label: 'Ver',
    tooltip: 'Ver projetos',
    description: 'Rola até a seção de projetos',
  },
  3: {
    label: 'Ver',
    tooltip: 'Ver serviços',
    description: 'Rola até a seção de serviços',
  },
};

export function Stats({
  items,
  onFirstClick,
  onSecondClick,
  onThirdClick,
  onFourthClick,
}: {
  items: PortfolioData['stats'];
  onFirstClick?: () => void;
  onSecondClick?: () => void;
  onThirdClick?: () => void;
  onFourthClick?: () => void;
}) {
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '0px 0px -40px 0px' });
  const [cardAnimated, setCardAnimated] = useState<boolean[]>(() => new Array(items.length).fill(false));

  // Marca todos os cards como animados imediatamente quando noMotion está ativo
  useEffect(() => {
    if (noMotion) {
      setCardAnimated(new Array(items.length).fill(true));
    }
  }, [noMotion, items.length]);

  const clickHandlers: Record<number, (() => void) | undefined> = {
    0: onFirstClick,
    1: onSecondClick,
    2: onThirdClick,
    3: onFourthClick,
  };

  return (
    <div ref={containerRef} className="grid grid-cols-4 gap-4 mb-9 max-cv:grid-cols-2">
      {items.map((item, i) => {
        const action = CARD_ACTIONS[i];
        const onClick = clickHandlers[i];

        return (
          <motion.div
            key={item.label}
            className="border border-cv-border bg-cv-panel px-[18px] pt-[22px] pb-[18px] text-center relative cursor-gamer-default"
            custom={i * CARD_STAGGER_STEP}
            variants={cardVariants}
            initial={noMotion ? { opacity: 1, scale: 1, y: 0 } : 'hidden'}
            animate={noMotion ? { opacity: 1, scale: 1, y: 0 } : isInView ? 'visible' : 'hidden'}
            transition={noMotion ? { duration: 0 } : undefined}
            whileHover={HOVER_LIFT_VARIANT}
            onAnimationComplete={(definition) => {
              if (definition === 'visible') {
                setCardAnimated((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }
            }}
          >
            <div className="text-[36px] text-cv-cyan tracking-[0.04em] [text-shadow:0_0_10px_rgba(43,214,255,0.3)]">
              <CounterValue value={item.value} ready={noMotion || cardAnimated[i]} noMotion={noMotion} />
            </div>
            <span className="block text-[11px] text-cv-text-dim tracking-[0.18em] uppercase mt-1">{item.label}</span>
            {action && onClick && (
              <Tooltip title={action.tooltip} description={action.description} placement="bottom">
                <CvButton
                  variant="shimmer"
                  className={clsx('absolute top-2 right-2', shimmerChip({ size: 'sm' }))}
                  onClick={onClick}
                >
                  {action.label}
                </CvButton>
              </Tooltip>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
