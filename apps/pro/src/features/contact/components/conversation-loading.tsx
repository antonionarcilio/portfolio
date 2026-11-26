'use client';

import { useTranslations } from 'next-intl';

import { ScrambleText } from '@/shared/components/scramble-text';
import { Spinner } from '@/shared/components/spinner';

/**
 * Loading centralizado mostrado ao recarregar com uma conversa salva, antes de o chat reaparecer. Ocupa a
 * mesma altura do chat para a página não pular quando ele entra. `role="status"` anuncia o texto.
 * @example {conversation.hydration === 'restoring' && <ConversationLoading />}
 */
export function ConversationLoading() {
  const t = useTranslations('pro.contactChat');

  return (
    <div
      role="status"
      className="contact-chat-viewport flex w-full flex-col items-center justify-center gap-md text-alpha-black-60"
    >
      <Spinner sizePixels={28} />
      <p className="font-portfolio text-caption font-regular">
        <ScrambleText>{t('restoring')}</ScrambleText>
      </p>
    </div>
  );
}
