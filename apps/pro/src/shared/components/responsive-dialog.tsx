'use client';

import type { ReactNode } from 'react';

import { BottomSheet } from '@/shared/components/bottom-sheet';
import { ModalDialog } from '@/shared/components/modal-dialog';
import { TABLET_AND_UP_MEDIA_QUERY, useMediaQuery } from '@/shared/hooks/use-media-query';

type ResponsiveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Precisa conter um `Dialog.Title` (e de preferência um `Dialog.Description`) do Radix. */
  children: ReactNode;
};

/**
 * Diálogo que troca de forma com a largura (G07): modal centralizado a partir de `tablet`; abaixo, bottom sheet
 * (a mesma base do menu mobile do header) com 24px de laterais e 34px de base.
 * @example <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>{content}</ResponsiveDialog>
 */
export function ResponsiveDialog({ open, onOpenChange, children }: ResponsiveDialogProps) {
  const isTabletUp = useMediaQuery(TABLET_AND_UP_MEDIA_QUERY);

  if (isTabletUp) {
    return (
      <ModalDialog open={open} onOpenChange={onOpenChange}>
        {children}
      </ModalDialog>
    );
  }
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} tone="strong">
      {/* `pt-lg`: os 16px do design entre a alça e o título. */}
      <div className="px-2xl pt-lg pb-[34px]">{children}</div>
    </BottomSheet>
  );
}
