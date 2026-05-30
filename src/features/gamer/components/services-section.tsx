'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { AnimatedCard } from './animated-card';
import { FlashHeading } from './flash-heading';

const PAGE_SIZE = 3;

export function ServicesSection({
  items,
  flash,
  onFlashEnd,
}: {
  items: PortfolioData['services'];
  flash?: boolean;
  onFlashEnd?: () => void;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div id="services-section">
      <FlashHeading flash={flash} onFlashEnd={onFlashEnd}>
        Serviços
      </FlashHeading>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {pageItems.map((item, i) => (
            <AnimatedCard
              key={item.title}
              index={i}
              className="border border-cv-border bg-cv-panel px-5 py-[18px] mb-3 border-l-2 border-l-cv-cyan"
              whileHover={{ x: 3, backgroundColor: '#0a1626', boxShadow: '0 0 18px rgba(43,214,255,0.10)' }}
            >
              <span className="block text-cv-text text-[13px] tracking-[0.04em] mb-[6px]">{item.title}</span>
              <span className="block text-cv-text-dim text-[12px] leading-[1.6]">{item.description}</span>
            </AnimatedCard>
          ))}
        </motion.div>
      </AnimatePresence>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 text-[11px] text-cv-cyan tracking-[0.12em] uppercase border border-cv-cyan/40 px-[10px] py-[4px] bg-cv-cyan/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-gamer-pointer"
          >
            <ChevronLeft size={12} />
            Anterior
          </button>
          <span className="text-[10px] text-cv-text-dim tracking-[0.1em]">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 text-[11px] text-cv-cyan tracking-[0.12em] uppercase border border-cv-cyan/40 px-[10px] py-[4px] bg-cv-cyan/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-gamer-pointer"
          >
            Próximo
            <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
