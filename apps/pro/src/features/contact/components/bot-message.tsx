'use client';

import { motion } from 'framer-motion';

import { ScrambleText } from '@/shared/components/scramble-text';

import { chatEnterVariants } from '../animations';

type BotMessageProps = {
  text: string;
  /** Texto de apoio (`text-caption`, `alpha-black-60`) — só na fala atual; o histórico não o repete. */
  hint?: string;
  /** Falas já vistas (histórico, página restaurada) entram sem animação. */
  animateEntrance: boolean;
};

/**
 * "Balão Bot": texto solto à esquerda (sem fundo), até 460px de largura, `text-chat`, com texto de apoio opcional.
 * @example <BotMessage text={texts.prompt(step)} hint={texts.hint(step)} animateEntrance />
 */
export function BotMessage({ text, hint, animateEntrance }: BotMessageProps) {
  return (
    <motion.div
      variants={chatEnterVariants}
      initial={animateEntrance ? 'hidden' : false}
      animate="visible"
      className="flex w-full flex-col gap-xs py-xs"
    >
      <p className="max-w-[460px] font-portfolio text-chat font-regular whitespace-pre-line text-alpha-black-100">
        <ScrambleText>{text}</ScrambleText>
      </p>
      {hint && (
        <p className="max-w-[460px] font-portfolio text-caption font-regular text-alpha-black-60">
          <ScrambleText>{hint}</ScrambleText>
        </p>
      )}
    </motion.div>
  );
}
