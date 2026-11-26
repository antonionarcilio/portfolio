'use client';

import * as Dialog from '@radix-ui/react-dialog';

import { ActionButton } from '@/shared/components/action-button';
import { ResponsiveDialog } from '@/shared/components/responsive-dialog';
import { ScrambleText } from '@/shared/components/scramble-text';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Ação segura (botão primário, recebe o foco ao abrir): só fecha o diálogo. */
  dismissLabel: string;
  /** Ação que se quer confirmar (botão `ghost`, pesa menos que a segura). */
  confirmLabel: string;
  onConfirm: () => void;
};

/**
 * Confirmação de uma ação que não pode ser desfeita (G07 · Reiniciar conversa): título em Calistoga, texto de
 * apoio e duas ações — a segura em destaque e primeiro (foco inicial), a confirmação sem borda. Modal a partir
 * de `tablet` (botões lado a lado), bottom sheet abaixo (botões empilhados). Esc, clique no véu e arrastar a
 * folha para baixo equivalem à ação segura.
 * @example <ConfirmDialog open={isOpen} onOpenChange={setIsOpen} title={t('title')} description={t('body')} dismissLabel={t('keep')} confirmLabel={t('confirm')} onConfirm={restart} />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  dismissLabel,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-lg">
        <Dialog.Title className="font-portfolio-title text-display-sm font-regular text-alpha-black-100">
          <ScrambleText>{title}</ScrambleText>
        </Dialog.Title>
        <Dialog.Description className="font-portfolio text-chat font-regular text-alpha-black-60">
          <ScrambleText>{description}</ScrambleText>
        </Dialog.Description>
        {/* Grade, não flex: os botões são `shrink-0` e dividem a linha meio a meio a partir de `tablet`. */}
        <div className="grid grid-cols-1 gap-md pt-sm tablet:grid-cols-2">
          <ActionButton label={dismissLabel} onClick={() => onOpenChange(false)} fullWidth />
          <ActionButton label={confirmLabel} onClick={onConfirm} variant="ghost" fullWidth />
        </div>
      </div>
    </ResponsiveDialog>
  );
}
