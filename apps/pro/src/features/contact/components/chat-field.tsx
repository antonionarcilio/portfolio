'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { SupportedLocale } from 'portfolio-content-model';
import type { ComponentProps, ReactNode } from 'react';

import { MessageField } from '@/shared/components/message-field';
import { TextField } from '@/shared/components/text-field';
import type { PhoneCountry } from '@/shared/utils/phone-number';

import type { ChatErrorKey, CurrencyCode } from '../engine/field-validators';
import type { FieldDefinition, ResolvedStep } from '../engine/flow-types';
import type { FlowTexts } from '../engine/use-flow-texts';
import { amountDisplayLength, useAmountMask } from './use-amount-mask';
import { usePhoneMask } from './use-phone-mask';

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
  /** Controle dentro da caixa, antes do texto (só campos de uma linha) — ex.: o seletor de moeda da faixa. */
  prefix?: ReactNode;
  /** Moeda que define o agrupamento da máscara dos campos `amount` ("15.000" em real, "15,000" em dólar). */
  amountCurrency?: CurrencyCode;
};

/** País "de casa" do telefone por idioma: como um número digitado sem "+" é lido e mostrado. */
const PHONE_COUNTRY_BY_LOCALE: Record<SupportedLocale, PhoneCountry> = { 'pt-BR': 'BR', en: 'US' };

type SharedFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'icon' | 'prefix' | 'autoComplete'>;

type AmountFieldProps = { shared: SharedFieldProps; currency: CurrencyCode; maximumDigits: number; prefix: ReactNode };

/**
 * Campo `amount`: teclado numérico e máscara com os milhares separados conforme a moeda; o valor guardado
 * continua só com dígitos (o que o servidor valida), com o limitador em `maximumDigits`.
 */
function AmountField({ shared, currency, maximumDigits, prefix }: AmountFieldProps) {
  const mask = useAmountMask(shared.value, currency, maximumDigits, shared.onChange);
  return (
    <TextField
      {...shared}
      value={mask.display}
      onChange={mask.change}
      maxLength={amountDisplayLength(maximumDigits)}
      inputRef={mask.inputRef}
      type="text"
      inputMode="numeric"
      prefix={prefix}
      autoComplete="off"
    />
  );
}

type PhoneFieldProps = { shared: SharedFieldProps; field: FieldDefinition };

/**
 * Campo `tel`: máscara do país do idioma (ou internacional, começando com "+"), limitada ao tamanho que o país
 * permite; guarda E.164.
 */
function PhoneField({ shared, field }: PhoneFieldProps) {
  const homeCountry = PHONE_COUNTRY_BY_LOCALE[useLocale() as SupportedLocale] ?? 'BR';
  const mask = usePhoneMask(shared.value, homeCountry, shared.onChange);
  return (
    <TextField
      {...shared}
      value={mask.display}
      onChange={mask.change}
      maxLength={undefined}
      inputRef={mask.inputRef}
      type="tel"
      icon={field.icon}
      autoComplete={field.autoComplete}
    />
  );
}

/**
 * Um campo do compositor: área de texto alta ou campo de uma linha com ícone. Rótulo e placeholder vêm das
 * mensagens da etapa (`fields.<id>`); o erro, de `pro.contactChat.errors`. Campos `amount` e `tel` têm máscara.
 * @example <ChatField field={field} step={step} texts={texts} value={value} errorKey={undefined} autoFocus onChange={setValue} />
 */
export function ChatField({
  field,
  step,
  texts,
  value,
  errorKey,
  autoFocus,
  readOnly,
  onChange,
  prefix,
  amountCurrency = 'BRL',
}: ChatFieldProps) {
  const t = useTranslations('pro.contactChat');
  const shared = {
    name: field.id,
    label: texts.fieldLabel(step, field.id),
    placeholder: texts.fieldPlaceholder(step, field.id),
    value,
    onChange,
    required: field.required,
    errorMessage: errorKey ? (texts.fieldError?.(step, field.id, errorKey) ?? t(`errors.${errorKey}`)) : undefined,
    labelCasing: 'sentence' as const,
    optionalText: t('composer.optional'),
    autoFocus,
    maxLength: field.maximumLength,
    readOnly,
  };
  if (field.kind === 'textarea') return <MessageField {...shared} height="tall" />;
  if (field.kind === 'tel') return <PhoneField shared={shared} field={field} />;
  if (field.kind === 'amount') {
    return (
      <AmountField shared={shared} currency={amountCurrency} maximumDigits={field.maximumLength} prefix={prefix} />
    );
  }
  return (
    <TextField {...shared} type={field.kind} icon={field.icon} prefix={prefix} autoComplete={field.autoComplete} />
  );
}
