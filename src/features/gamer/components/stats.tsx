'use client';

import { animate, motion, useInView } from 'framer-motion';
import { Infinity as InfinityIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { Tooltip } from './tooltip';

const STAGGER_DELAY = 0.12;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  }),
};

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
};

export function Stats({
  items,
  onFirstClick,
  onSecondClick,
  onThirdClick,
}: {
  items: PortfolioData['stats'];
  onFirstClick?: () => void;
  onSecondClick?: () => void;
  onThirdClick?: () => void;
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
            custom={i * STAGGER_DELAY}
            variants={cardVariants}
            initial={noMotion ? { opacity: 1, scale: 1, y: 0 } : 'hidden'}
            animate={noMotion ? { opacity: 1, scale: 1, y: 0 } : isInView ? 'visible' : 'hidden'}
            whileHover={
              noMotion
                ? undefined
                : {
                    borderColor: '#2bd6ff',
                    y: -2,
                    boxShadow: '0 0 24px rgba(43,214,255,0.12)',
                    transition: { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] },
                  }
            }
            transition={noMotion ? { duration: 0 } : undefined}
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
              {i === 3 ? (
                <div className="h-[54px] flex items-center justify-center">
                  <InfinityIcon size={38} strokeWidth={2.2} />
                </div>
              ) : (
                <CounterValue value={item.value} ready={noMotion || cardAnimated[i]} noMotion={noMotion} />
              )}
            </div>
            <span className="block text-[11px] text-cv-text-dim tracking-[0.18em] uppercase mt-1">{item.label}</span>
            {action && onClick && (
              <Tooltip title={action.tooltip} description={action.description} placement="bottom">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-[10px] text-cv-cyan tracking-[0.16em] uppercase border border-cv-cyan-dim px-[7px] py-[2px] bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px] whitespace-nowrap cursor-gamer-pointer"
                  onClick={onClick}
                >
                  {action.label}
                </button>
              </Tooltip>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
