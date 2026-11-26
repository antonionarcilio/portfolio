'use client';

import { useTranslations } from 'next-intl';

import type { TranscriptEntry } from '../engine/build-transcript';
import type { StepKey } from '../engine/flow-types';
import { useEntranceTracker } from '../engine/use-entrance-tracker';
import type { FlowTexts } from '../engine/use-flow-texts';
import { BotMessage } from './bot-message';
import { TypingIndicator } from './typing-indicator';
import { VisitorMessage } from './visitor-message';

type ConversationTranscriptProps = {
  entries: TranscriptEntry[];
  /** Fala atual do bot (pergunta da etapa ou da revisão). */
  currentPrompt: { id: string; text: string; hint?: string } | undefined;
  isTyping: boolean;
  texts: FlowTexts;
  onEdit: (stepKey: StepKey) => void;
  /** Conteúdo depois da fala atual (o resumo, na revisão). */
  trailingContent?: (animateEntrance: boolean) => React.ReactNode;
};

const TRAILING_CONTENT_ID = 'trailing';

/**
 * Coluna de mensagens ("Conversa"): histórico de pares pergunta/resposta, a fala atual (ou o "digitando…")
 * e, na revisão, o resumo. `aria-live` faz o leitor de tela anunciar cada fala nova do bot.
 * @example <ConversationTranscript entries={transcript.entries} currentPrompt={prompt} isTyping={isTyping} texts={texts} onEdit={edit} />
 */
export function ConversationTranscript({
  entries,
  currentPrompt,
  isTyping,
  texts,
  onEdit,
  trailingContent,
}: ConversationTranscriptProps) {
  const t = useTranslations('pro.contactChat.transcript');
  const showsPrompt = Boolean(currentPrompt) && !isTyping;
  const visibleIds = [
    ...entries.map((entry) => entry.id),
    ...(showsPrompt && currentPrompt ? [currentPrompt.id, TRAILING_CONTENT_ID] : []),
  ];
  const isNew = useEntranceTracker(visibleIds);

  return (
    <div aria-live="polite" className="flex w-full flex-1 flex-col justify-end gap-[14px] pt-lg pb-sm">
      {entries.map((entry) =>
        entry.kind === 'bot' ? (
          <BotMessage key={entry.id} text={texts.prompt(entry.step)} animateEntrance={isNew(entry.id)} />
        ) : (
          <VisitorMessage
            key={entry.id}
            lines={entry.answer.type === 'skipped' ? [t('skippedAnswer')] : texts.answerLines(entry.step, entry.answer)}
            animateEntrance={isNew(entry.id)}
            edit={entry.editable ? { label: t('editAnswer'), onEdit: () => onEdit(entry.step.key) } : undefined}
          />
        ),
      )}
      {isTyping && <TypingIndicator label={t('typing')} />}
      {showsPrompt && currentPrompt && (
        <BotMessage
          key={currentPrompt.id}
          text={currentPrompt.text}
          hint={currentPrompt.hint}
          animateEntrance={isNew(currentPrompt.id)}
        />
      )}
      {showsPrompt && trailingContent?.(isNew(TRAILING_CONTENT_ID))}
    </div>
  );
}
