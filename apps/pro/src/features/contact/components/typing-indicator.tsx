'use client';

import { motion } from 'framer-motion';

import {
  TYPING_DOT_ANIMATE,
  TYPING_DOT_STAGGER_SECONDS,
  TYPING_DOT_TRANSITION,
  chatEnterVariants,
} from '../animations';

const DOT_INDEXES = [0, 1, 2] as const;

/**
 * "Digitando…" do bot: três pontos pulsando no lugar onde a próxima fala vai aparecer. O texto acessível
 * vai em `label` (a região da conversa é `aria-live`, então o leitor de tela anuncia).
 * @example <TypingIndicator label={t('transcript.typing')} />
 */
export function TypingIndicator({ label }: { label: string }) {
  return (
    <motion.div variants={chatEnterVariants} initial="hidden" animate="visible" className="flex w-full">
      <span role="status" aria-label={label} className="flex h-[31px] items-center gap-xs py-xs">
        {DOT_INDEXES.map((index) => (
          <motion.span
            key={index}
            aria-hidden
            className="size-[6px] rounded-full bg-alpha-black-40"
            animate={TYPING_DOT_ANIMATE}
            transition={{ ...TYPING_DOT_TRANSITION, delay: index * TYPING_DOT_STAGGER_SECONDS }}
          />
        ))}
      </span>
    </motion.div>
  );
}
