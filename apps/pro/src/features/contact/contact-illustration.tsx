'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import { ILLUSTRATION_FADE_TRANSITION, illustrationFadeVariants } from '@/shared/animations';

import { CONTACT_ILLUSTRATIONS, type ContactIllustrationState } from './contact-illustration-state';

type ContactIllustrationProps = {
  state: ContactIllustrationState;
};

/**
 * Posição de cada arte dentro do quadro de 370px (como no Figma). O SVG exportado é recortado no
 * traço, então cada ilustração tem o próprio recuo.
 */
const ILLUSTRATION_INSET_CLASS: Record<ContactIllustrationState, string> = {
  empty: 'inset-[11.42%_8.46%_11.42%_8.71%]',
  filling: 'inset-[9.68%_10.83%_9.92%_21.43%]',
  submitted: 'inset-[9.78%_20.41%_9.67%_20.6%]',
};

/**
 * Ilustração da coluna 1, trocada com fade conforme o estado do formulário.
 * @example <ContactIllustration state={resolveContactIllustrationState(values, isSubmitted)} />
 */
export function ContactIllustration({ state }: ContactIllustrationProps) {
  return (
    <div className="flex size-[390px] items-start justify-end overflow-hidden p-[10px]">
      <div className="relative size-[370px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state}
            className={`absolute ${ILLUSTRATION_INSET_CLASS[state]}`}
            variants={illustrationFadeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={ILLUSTRATION_FADE_TRANSITION}
          >
            <Image src={CONTACT_ILLUSTRATIONS[state]} alt="" aria-hidden fill draggable={false} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
