'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { FlashHeading } from './flash-heading';

const tagVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const, delay },
  }),
};

const pillVariant = cva('border px-[14px] py-[7px] text-[12px] tracking-[0.12em]  font-cv-mono relative', {
  variants: {
    technology: {
      js: 'text-[#e3d34a] border-[#e3d34a] bg-[rgba(227,211,74,0.08)]',
      ts: 'text-[#4ea2ff] border-[#4ea2ff] bg-[rgba(78,162,255,0.08)]',
      rct: 'text-[#2bd6ff] border-[#2bd6ff] bg-[rgba(43,214,255,0.08)]',
      nxt: 'text-[#e0e0e0] border-[#6b7c88] bg-[rgba(255,255,255,0.04)]',
      nd: 'text-[#4ed46a] border-[#4ed46a] bg-[rgba(78,212,106,0.08)]',
      wp: 'text-[#4ed46a] border-[#4ed46a] bg-[rgba(78,212,106,0.06)]',
      html: 'text-[#ff8a3d] border-[#ff8a3d] bg-[rgba(255,138,61,0.08)]',
      css: 'text-[#4ea2ff] border-[#4ea2ff] bg-[rgba(78,162,255,0.08)]',
      git: 'text-[#d967a7] border-[#d967a7] bg-[rgba(217,103,167,0.08)]',
      api: 'text-[#2bd6ff] border-[#2bd6ff] bg-[rgba(43,214,255,0.06)]',
      claude: 'text-[#DB7758] border-[#DB7758] bg-[rgba(219,119,88,0.08)]',
    },
  },
});

// Hex values used as inline style data — not CSS classes, so kept outside CVA
const PILL_GLOW: Record<string, string> = {
  js: '#e3d34a',
  ts: '#4ea2ff',
  rct: '#2bd6ff',
  nxt: '#e0e0e0',
  nd: '#4ed46a',
  wp: '#4ed46a',
  html: '#ff8a3d',
  css: '#4ea2ff',
  git: '#d967a7',
  api: '#2bd6ff',
  claude: '#DB7758',
};

type Technology = NonNullable<Parameters<typeof pillVariant>[0]>['technology'];

export function StackSection({
  pills,
  flash,
  onFlashEnd,
}: {
  pills: PortfolioData['stackPills'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '0px 0px -40px 0px' });

  return (
    <div>
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Stacks
      </FlashHeading>
      <div ref={containerRef} className="flex flex-wrap gap-[10px]">
        {pills.map((p, i) => (
          <motion.div
            key={p.label}
            className={clsx(pillVariant({ technology: p.cls as Technology }))}
            custom={i * 0.06}
            variants={tagVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={{ y: -1, filter: 'brightness(1.2)', boxShadow: `0 0 14px ${PILL_GLOW[p.cls] ?? '#2bd6ff'}` }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {p.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
