'use client';

import { motion } from 'framer-motion';

import { INTERFACE_EASING } from '@/shared/animations';
import { ScrambleText } from '@/shared/components/scramble-text';

const FILL_TRANSITION = { duration: 0.4, ease: INTERFACE_EASING };

type ProgressIndicatorProps = {
  label: string;
  /** 0–1 do trilho preenchido. */
  fraction: number;
};

/**
 * "Indicador de Progresso" do design: rótulo ("Etapa 4 de 8", "Início", "Concluído") sobre um trilho de
 * 104×4px com preenchimento `bulb-on`. O preenchimento desliza ao trocar de etapa.
 * @example <ProgressIndicator label="Etapa 4 de 8" fraction={0.5} />
 */
export function ProgressIndicator({ label, fraction }: ProgressIndicatorProps) {
  const percentage = Math.round(Math.min(Math.max(fraction, 0), 1) * 100);

  return (
    <div className="flex shrink-0 flex-col items-end gap-[6px]">
      <p className="font-portfolio text-xs font-medium text-alpha-black-60">
        <ScrambleText>{label}</ScrambleText>
      </p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={label}
        className="h-xs w-[104px] overflow-hidden rounded-full bg-alpha-black-10"
      >
        <motion.div
          className="h-full rounded-full bg-bulb-on"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={FILL_TRANSITION}
        />
      </div>
    </div>
  );
}
