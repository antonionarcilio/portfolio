'use client';

import { useTranslations } from 'next-intl';

import { MessageField } from '@/shared/components/message-field';
import { TextField } from '@/shared/components/text-field';

import type { ChatErrorKey } from '../engine/field-validators';
import type { FieldDefinition, ResolvedStep } from '../engine/flow-types';
import type { FlowTexts } from '../engine/use-flow-texts';

type ChatFieldProps = {
  field: FieldDefinition;
  step: ResolvedStep;
  texts: FlowTexts;
  value: string;
  errorKey: ChatErrorKey | undefined;
  autoFocus: boolean;
  /** Enquanto o e-mail é verificado no BFF: o valor enviado é o que fica, então não pode mudar no meio. */
  readOnly: boolean;
  onChange: (value: string) => void;
};

/**
 * Um campo do compositor: área de texto alta ou campo de uma linha com ícone. Rótulo e placeholder vêm das
 * mensagens da etapa (`fields.<id>`); o erro, de `pro.contactChat.errors`.
 * @example <ChatField field={field} step={step} texts={texts} value={value} errorKey={undefined} autoFocus onChange={setValue} />
 */
export function ChatField({ field, step, texts, value, errorKey, autoFocus, readOnly, onChange }: ChatFieldProps) {
  const t = useTranslations('pro.contactChat');
  const shared = {
    name: field.id,
    label: texts.fieldLabel(step, field.id),
    placeholder: texts.fieldPlaceholder(step, field.id),
    value,
    onChange,
    required: field.required,
    errorMessage: errorKey ? t(`errors.${errorKey}`) : undefined,
    labelCasing: 'sentence' as const,
    optionalText: t('composer.optional'),
    autoFocus,
    maxLength: field.maximumLength,
    readOnly,
  };
  if (field.kind === 'textarea') return <MessageField {...shared} height="tall" />;
  return <TextField {...shared} type={field.kind} icon={field.icon} autoComplete={field.autoComplete} />;
}
