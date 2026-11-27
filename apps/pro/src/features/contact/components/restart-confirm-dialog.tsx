'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ConfirmDialog } from '@/shared/components/confirm-dialog';

import type { ShortcutsMenuControls } from './use-shortcuts-menu';

type RestartConfirmation = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  /** Atalho "Reiniciar conversa": fecha o menu com o foco no "/ Atalhos" e abre a confirmação. */
  request: () => void;
  confirm: () => void;
};

/**
 * Estado da confirmação de reinício. Fechar o menu devolvendo o foco ao botão "/ Atalhos" antes de abrir o
 * diálogo faz o diálogo devolver o foco para lá ao "Continuar conversa".
 * @example const restartConfirmation = useRestartConfirmation(shortcuts, conversation.restart);
 */
export function useRestartConfirmation(shortcuts: ShortcutsMenuControls, restart: () => void): RestartConfirmation {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    setIsOpen,
    request: () => {
      shortcuts.close(true);
      setIsOpen(true);
    },
    confirm: () => {
      setIsOpen(false);
      restart();
    },
  };
}

type RestartConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitorName: string;
  onConfirm: () => void;
};

/**
 * G07 · "Reiniciar a conversa?": aberto pelo atalho "Reiniciar conversa" antes de voltar ao Hero, para o
 * visitante não perder as respostas sem querer. "Continuar conversa" fecha e devolve o foco ao botão "/ Atalhos".
 * @example <RestartConfirmDialog open={isOpen} onOpenChange={setIsOpen} visitorName="Mariana" onConfirm={restart} />
 */
export function RestartConfirmDialog({ open, onOpenChange, visitorName, onConfirm }: RestartConfirmDialogProps) {
  const t = useTranslations('pro.contactChat.shortcuts.restartConfirm');

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={t('body', { name: visitorName })}
      dismissLabel={t('keep')}
      confirmLabel={t('confirm')}
      onConfirm={onConfirm}
    />
  );
}
