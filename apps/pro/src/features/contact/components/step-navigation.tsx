import { useTranslations } from 'next-intl';

import { BackAction, CancelAction, ShortcutsButton, SkipAction } from './composer-controls';
import type { ShortcutsMenuControls } from './use-shortcuts-menu';

/** O que o compositor de qualquer etapa recebe para montar a linha de ações. */
export type StepNavigation = {
  /** Ausente na primeira etapa (não há para onde voltar). */
  onBack?: () => void;
  /** "Cancelar" no lugar de "Voltar": desfaz um desvio da conversa (G08, "Alterar meu nome"). */
  onCancel?: () => void;
  /** Presente só em etapas `optional`. */
  onSkip?: () => void;
  /** Menu de atalhos (G06): só nas etapas de um fluxo; ausente, o botão "/ Atalhos" não aparece. */
  shortcuts?: ShortcutsMenuControls;
};

/** Lado esquerdo: Voltar + Atalhos. @example <LeadingNavigation navigation={navigation} /> */
export function LeadingNavigation({ navigation }: { navigation: StepNavigation }) {
  const t = useTranslations('pro.contactChat.composer');
  const { shortcuts } = navigation;

  return (
    <>
      {navigation.onBack && <BackAction label={t('back')} onBack={navigation.onBack} />}
      {navigation.onCancel && <CancelAction label={t('cancel')} onCancel={navigation.onCancel} />}
      {shortcuts && (
        <ShortcutsButton
          label={t('shortcuts')}
          onToggle={shortcuts.toggle}
          isOpen={shortcuts.isOpen}
          menuId={shortcuts.menuId}
          triggerRef={shortcuts.triggerRef}
        />
      )}
    </>
  );
}

/** "Pular esta pergunta", quando a etapa é opcional. @example <SkipNavigation navigation={navigation} /> */
export function SkipNavigation({ navigation }: { navigation: StepNavigation }) {
  const t = useTranslations('pro.contactChat.composer');
  return navigation.onSkip ? (
    <SkipAction label={t('skip')} shortLabel={t('skipShort')} onSkip={navigation.onSkip} />
  ) : null;
}
