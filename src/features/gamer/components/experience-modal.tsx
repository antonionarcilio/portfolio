'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import type { CurriculumData } from '@/features/gamer/types/curriculum';
import { Tooltip } from './tooltip';

export function ExperienceModal({
  data,
  show,
  onClose,
}: {
  data: CurriculumData['experience'][0] | null;
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-[rgba(3,6,15,0.78)] backdrop-blur-[4px] flex items-center justify-center p-6 z-[300]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 12 }}
            transition={{ ease: [0.2, 0.7, 0.2, 1], duration: 0.25 }}
            className="relative max-w-[640px] w-full max-h-[86vh] cv-scroll overflow-x-hidden bg-cv-panel border border-cv-cyan px-[30px] pt-[28px] pb-[26px] shadow-[inset_0_0_40px_rgba(43,214,255,0.06),0_0_60px_rgba(43,214,255,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan top-[-5px] left-[-5px] border-r-0 border-b-0" />
            <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan top-[-5px] right-[-5px] border-l-0 border-b-0" />
            <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan bottom-[-5px] left-[-5px] border-r-0 border-t-0" />
            <span className="absolute w-[16px] h-[16px] border-2 border-cv-cyan bottom-[-5px] right-[-5px] border-l-0 border-t-0" />
            <div className="absolute top-3 right-[14px]">
              <Tooltip key={String(show)} content="Fechar" placement="left" className="!z-[9999]">
                <motion.button
                  className="bg-transparent border border-cv-border text-cv-cyan font-cv-mono text-[16px] w-7 h-7 flex items-center justify-center cursor-pointer leading-none"
                  onClick={onClose}
                  whileHover={{ borderColor: '#2bd6ff', boxShadow: '0 0 12px #2bd6ff' }}
                  transition={{ duration: 0.2 }}
                  aria-label="Fechar"
                >
                  ×
                </motion.button>
              </Tooltip>
            </div>
            <div className="text-cv-cyan text-[10px] tracking-[0.28em] uppercase mb-[14px]">{'// Exp_Record'}</div>
            <h2 className="text-[22px] text-cv-text m-0 mb-1 tracking-[0.04em]">{data.company}</h2>
            <div className="text-[14px] text-cv-cyan tracking-[0.08em]">{data.role}</div>
            <div className="mt-[6px] text-[12px] text-cv-text-dim tracking-[0.14em] uppercase">{data.date}</div>
            <div className="h-px bg-cv-border my-[18px]" />
            <div className="space-y-3">
              {data.details.map((p, i) => (
                <p key={i} className="text-cv-text text-[13px] leading-[1.65] m-0">
                  {p}
                </p>
              ))}
            </div>
            <div className="text-cv-cyan text-[11px] tracking-[0.22em] uppercase mt-[18px] mb-[10px]">
              Stack utilizada
            </div>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
