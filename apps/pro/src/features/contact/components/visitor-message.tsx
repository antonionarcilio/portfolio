'use client';

import { motion } from 'framer-motion';

import { ScrambleText } from '@/shared/components/scramble-text';

import { chatEnterVariants } from '../animations';

type VisitorMessageProps = {
  /** Uma linha por valor (ex.: e-mail e WhatsApp da mesma etapa). */
  lines: string[];
  animateEntrance: boolean;
  /** Presente só na última resposta: mostra "Editar resposta" abaixo do balão. */
  edit?: { label: string; onEdit: () => void };
};

/**
 * "Balão Visitante": resposta à direita em balão `alpha-black-5`, `rounded-2xl`, até 420px.
 * @example <VisitorMessage lines={['Mariana']} animateEntrance edit={{ label: t('editAnswer'), onEdit }} />
 */
export function VisitorMessage({ lines, animateEntrance, edit }: VisitorMessageProps) {
  return (
    <motion.div
      variants={chatEnterVariants}
      initial={animateEntrance ? 'hidden' : false}
      animate="visible"
      className="flex w-full flex-col items-end gap-xs"
    >
      <div className="max-w-[85%] rounded-2xl tablet:max-w-[420px] bg-alpha-black-5 px-lg py-[10px]">
        {lines.map((line, index) => (
          <p
            key={`${index}-${line}`}
            className="font-portfolio text-chat font-regular break-words text-alpha-black-100"
          >
            <ScrambleText>{line}</ScrambleText>
          </p>
        ))}
      </div>
      {edit && (
        <button
          type="button"
          onClick={edit.onEdit}
          className="transition-interface px-xs font-portfolio text-xs font-regular text-alpha-black-60 hover:text-alpha-black-100 focus-visible:text-alpha-black-100 focus-visible:outline-none"
        >
          <ScrambleText>{edit.label}</ScrambleText>
        </button>
      )}
    </motion.div>
  );
}
