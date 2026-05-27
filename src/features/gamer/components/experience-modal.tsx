'use client';

import { motion } from 'framer-motion';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { formatExperienceDateRange } from '@/features/gamer/utils/format-experience-date-range';
import { ModalBase } from '@/shared/modal-base';

import { Tooltip } from './tooltip';

export function ExperienceModal({
  data,
  show,
  onClose,
}: {
  data: PortfolioData['experience'][0] | null;
  show: boolean;
  onClose: () => void;
}) {
  if (!data) return null;

  return (
    <ModalBase open={show} onClose={onClose} portalId="gamer-portal-root">
      {({ floatingRef, floatingProps, panelStyles }) => (
        // Outer wrapper: no overflow — allows corner spans to extend outside without clipping
        <div
          ref={floatingRef}
          style={panelStyles}
          className="relative max-w-[640px] w-full bg-cv-panel border border-cv-cyan shadow-[inset_0_0_30px_rgba(43,214,255,0.05),0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(43,214,255,0.18)] outline-none cursor-gamer-default"
          {...floatingProps}
        >
          {/* Corner brackets — no overflow on parent so they render outside the box */}
          <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-3px] left-[-3px] border-r-0 border-b-0 pointer-events-none" />
          <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-3px] right-[-3px] border-l-0 border-b-0 pointer-events-none" />
          <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-3px] left-[-3px] border-r-0 border-t-0 pointer-events-none" />
          <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-3px] right-[-3px] border-l-0 border-t-0 pointer-events-none" />

          {/* Inner scroll container */}
          <div className="cv-scroll overflow-x-hidden max-h-[86vh] px-[30px] pt-[28px] pb-[26px]">
            <div className="absolute top-3 right-[14px]">
              <Tooltip key={String(show)} content="Fechar" placement="left" className="!z-[9999]">
                <motion.button
                  className="bg-transparent border border-cv-border text-cv-cyan font-cv-mono text-[16px] w-7 h-7 flex items-center justify-center cursor-gamer-pointer leading-none outline-none"
                  onClick={onClose}
                  whileHover={{ borderColor: '#2bd6ff', boxShadow: '0 0 12px rgba(43,214,255,0.5)' }}
                  transition={{ duration: 0.15 }}
                  aria-label="Fechar"
                >
                  ×
                </motion.button>
              </Tooltip>
            </div>

            <span className="block text-cv-cyan text-[10px] tracking-[0.28em] uppercase mb-[14px]">
              {'// Exp_Record'}
            </span>
            <h2 className="text-[22px] text-cv-text m-0 mb-1 tracking-[0.04em]">{data.company}</h2>
            <span className="block text-[14px] text-cv-cyan tracking-[0.08em]">{data.role}</span>
            <span className="block mt-[6px] text-[12px] text-cv-text-dim tracking-[0.14em] uppercase">
              {formatExperienceDateRange(data)}
            </span>
            <div className="h-px bg-cv-border my-[18px]" />
            <div className="space-y-3">
              {data.details.map((p, i) => (
                <p key={i} className="text-cv-text text-[13px] leading-[1.65] m-0">
                  {p}
                </p>
              ))}
            </div>
            <span className="block text-cv-cyan text-[11px] tracking-[0.22em] uppercase mt-[18px] mb-[10px]">
              Stack utilizada
            </span>
            <div className="flex flex-wrap gap-2">
              {data.stack.map((s) => (
                <span
                  key={s}
                  className="border border-cv-cyan-dim text-cv-cyan bg-[rgba(43,214,255,0.06)] px-[10px] py-1 text-[11px] tracking-[0.1em]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </ModalBase>
  );
}
