'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { dialogOverlayVariants, dialogPanelVariants } from '@/shared/animations';
import { useA11y } from '@/shared/contexts/a11y-context';
import { useReturnFocus } from '@/shared/hooks/use-return-focus';
import { scrimVariants } from '@/shared/variants/scrim-variants';

type ModalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Precisa conter um `Dialog.Title` (e de preferência um `Dialog.Description`) do Radix. */
  children: ReactNode;
};

/**
 * Modal centralizado (Radix Dialog — o mesmo que a vaul usa por baixo): véu forte, painel branco de até 460px,
 * cantos de 20px e 28px de padding (G07 `QYfRC`). Portal, foco preso, Esc, clique fora e trava de rolagem vêm
 * do Radix; entrada e saída com Framer Motion, desligadas com "pausar animações".
 * @example <ModalDialog open={isOpen} onOpenChange={setIsOpen}><Dialog.Title>…</Dialog.Title></ModalDialog>
 */
export function ModalDialog({ open, onOpenChange, children }: ModalDialogProps) {
  const { features } = useA11y();
  const returnFocus = useReturnFocus();
  const motionProps = {
    initial: features.pauseAnimations ? false : ('hidden' as const),
    animate: 'visible' as const,
    exit: features.pauseAnimations ? undefined : ('hidden' as const),
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                variants={dialogOverlayVariants}
                {...motionProps}
                className={scrimVariants({ tone: 'strong' })}
              />
            </Dialog.Overlay>
            {/* Camada só de posicionamento: deixa o clique passar para o véu (fecha o diálogo). */}
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-lg">
              <Dialog.Content asChild forceMount {...returnFocus}>
                <motion.div
                  variants={dialogPanelVariants}
                  {...motionProps}
                  className="pointer-events-auto w-full max-w-[460px] rounded-2xl bg-alpha-white-100 p-[28px] shadow-lg outline-none"
                >
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
