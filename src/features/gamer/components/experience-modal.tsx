'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { formatExperienceDateRange } from '@/features/gamer/utils/format-experience-date-range';
import { ModalBase } from '@/shared/components/modal-base';
import type { PortfolioData } from '@/shared/types/portfolio';

import { StackBadges } from './stack-badges';
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
  const { opts } = useA11y();
  if (!data) return null;

  return (
    <ModalBase
      open={show}
      onClose={onClose}
      portalId="gamer-portal-root"
      noMotion={opts.reduceMotion}
      drawerTitle={`${data.company} — ${data.role}`}
      overlayClassName="bg-[rgba(3,6,15,0.80)] z-[300] cursor-gamer-pointer"
      drawerContentClassName="z-[300] bg-cv-panel border-t border-cv-cyan cursor-gamer-default font-cv-mono"
      drawerHandleClassName="bg-cv-cyan/30"
    >
      {({ floatingRef, floatingProps, panelStyles, isDrawer }) => (
        <div
          ref={isDrawer ? undefined : floatingRef}
          style={isDrawer ? undefined : panelStyles}
          className={
            isDrawer
              ? 'w-full outline-none flex flex-col overflow-hidden'
              : 'relative max-w-[640px] w-full bg-transparent backdrop-blur-[18px] border border-cv-cyan shadow-[inset_0_0_30px_rgba(43,214,255,0.05),0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(43,214,255,0.18)] outline-none cursor-gamer-default'
          }
          {...(isDrawer ? {} : floatingProps)}
        >
          {/* Corner brackets — desktop only */}
          {!isDrawer && (
            <>
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0 pointer-events-none" />
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0 pointer-events-none" />
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0 pointer-events-none" />
              <span className="absolute w-[10px] h-[10px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0 pointer-events-none" />
            </>
          )}

          {/* Scroll container */}
          <div
            className={
              isDrawer
                ? 'cv-scroll overflow-y-auto overflow-x-hidden px-[24px] pt-[14px] pb-[32px] a11y-drawer-inner'
                : 'cv-scroll overflow-x-hidden max-h-[86vh] px-[30px] pt-[28px] pb-[26px]'
            }
          >
            {/* Close button — desktop only; drawer is dismissed by swipe / overlay tap */}
            {!isDrawer && (
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
            )}

            <span className="block text-cv-cyan text-[10px] tracking-[0.28em] uppercase mb-[14px]">
              {'// Exp_Record'}
            </span>
            <h2 className="text-[22px] text-cv-text m-0 mb-1 tracking-[0.04em]">
              {data.companyUrl ? (
                <a
                  href={data.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[6px] text-cv-text hover:text-cv-cyan transition-colors duration-150 cursor-gamer-pointer group"
                >
                  {data.company}
                  <ExternalLink
                    size={14}
                    className="text-cv-cyan/60 group-hover:text-cv-cyan transition-colors duration-150 shrink-0 translate-y-[-1px]"
                  />
                </a>
              ) : (
                data.company
              )}
            </h2>
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
              Stacks utilizadas
            </span>
            <StackBadges groups={data.stack} />
          </div>
        </div>
      )}
    </ModalBase>
  );
}
