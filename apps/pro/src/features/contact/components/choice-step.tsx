'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { useA11y } from '@/shared/contexts/a11y-context';

import { OPTION_CONFIRM_MILLISECONDS } from '../animations';
import { selectedCurrency } from '../engine/flow-texts';
import type { FieldDefinition, ResolvedStep, StepAnswer } from '../engine/flow-types';
import type { FlowTexts } from '../engine/use-flow-texts';
import { hasFieldErrors, validateFields, type FieldErrors } from '../engine/validate-fields';
import { ChatField } from './chat-field';
import { ChoiceOption } from './choice-option';
import { ComposerCard } from './composer-card';
import { SendButton } from './composer-controls';
import { CurrencyAmountField } from './currency-amount-field';
import { LeadingNavigation, SkipNavigation, type StepNavigation } from './step-navigation';

type ChoiceStepProps = {
  step: ResolvedStep;
  texts: FlowTexts;
  previousAnswer: StepAnswer | undefined;
  onAnswer: (answer: StepAnswer) => void;
  navigation: StepNavigation;
};

/**
 * Mostra a seleção por um instante (estado "Motivo selecionado" do design) antes de responder; com
 * animações pausadas, responde na hora.
 */
function useDelayedAnswer(onAnswer: (answer: StepAnswer) => void): (optionId: string) => void {
  const { features } = useA11y();
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (optionId: string) => {
    window.clearTimeout(timerRef.current);
    const answer: StepAnswer = { type: 'option', optionId };
    if (features.pauseAnimations) onAnswer(answer);
    else timerRef.current = window.setTimeout(() => onAnswer(answer), OPTION_CONFIRM_MILLISECONDS);
  };
}

type DetailFieldState = {
  /** Rascunho por id: o valor do campo e, se ele tiver prefixo de moeda, o código da moeda. */
  draft: Record<string, string>;
  errorKey: (field: FieldDefinition) => FieldErrors[string];
  change: (valueId: string, value: string) => void;
  /** Valida o campo e responde com a opção + o valor; com erro, só mostra a mensagem. */
  submit: (optionId: string, field: FieldDefinition) => void;
};

/**
 * Rascunho e validação do `detailField` da opção marcada (G02 · Investimento: faixa revelada na mesma caixa).
 * @example const detail = useDetailField(previousAnswer, onAnswer); detail.submit('defined', rangeField)
 */
function useDetailField(
  previousAnswer: StepAnswer | undefined,
  onAnswer: (answer: StepAnswer) => void,
): DetailFieldState {
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    previousAnswer?.type === 'option' ? { ...(previousAnswer.values ?? {}) } : {},
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  return {
    draft,
    errorKey: (field) => errors[field.id],
    change: (valueId, value) => {
      setDraft((current) => ({ ...current, [valueId]: value }));
      setErrors({});
    },
    submit: (optionId, field) => {
      const result = validateFields([field], draft);
      if (hasFieldErrors(result.errors)) setErrors(result.errors);
      else onAnswer({ type: 'option', optionId, values: result.values });
    },
  };
}

type OptionDetailFieldProps = {
  field: FieldDefinition;
  step: ResolvedStep;
  texts: FlowTexts;
  detail: DetailFieldState;
};

/** Campo revelado pela opção; com `currency`, ganha o prefixo "R$ ▾" (G02·6 · Moeda). */
function OptionDetailField({ field, step, texts, detail }: OptionDetailFieldProps) {
  const chatField = {
    field,
    step,
    texts,
    value: detail.draft[field.id] ?? '',
    errorKey: detail.errorKey(field),
    autoFocus: true,
    readOnly: false,
    onChange: (value: string) => detail.change(field.id, value),
  };
  const currency = field.currency;
  if (!currency) return <ChatField {...chatField} />;
  return (
    <CurrencyAmountField
      {...chatField}
      currency={currency}
      selectedCurrency={selectedCurrency(currency, detail.draft)}
      onCurrencyChange={(code) => detail.change(currency.id, code)}
    />
  );
}

/**
 * Etapas `options` (linhas) e `cards` (cartões com ícone): escolher uma opção já responde — exceto a que tem
 * `detailField`, que revela o campo na mesma caixa e espera o envio pelo botão ↑.
 * @example <ChoiceStep step={step} texts={texts} previousAnswer={answers[step.key]} onAnswer={answer} navigation={navigation} />
 */
export function ChoiceStep({ step, texts, previousAnswer, onAnswer, navigation }: ChoiceStepProps) {
  const t = useTranslations('pro.contactChat.composer');
  const initialChoice = previousAnswer?.type === 'option' ? previousAnswer.optionId : undefined;
  const [selectedId, setSelectedId] = useState(initialChoice);
  const answerSoon = useDelayedAnswer(onAnswer);
  const detail = useDetailField(previousAnswer, onAnswer);
  if (step.definition.kind === 'fields') return null;
  const { options } = step.definition;
  const layout = step.definition.kind === 'cards' ? 'card' : 'row';
  const detailField = options.find((option) => option.id === selectedId)?.detailField;
  const showsNavigation = step.definition.navigation !== 'hidden';

  const select = (optionId: string) => {
    setSelectedId(optionId);
    if (!options.find((option) => option.id === optionId)?.detailField) answerSoon(optionId);
  };

  const submitDetail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedId && detailField) detail.submit(selectedId, detailField);
  };

  return (
    <ComposerCard
      caption={texts.caption(step) ?? t('chooseOption')}
      onSubmit={detailField ? submitDetail : undefined}
      leadingActions={showsNavigation ? <LeadingNavigation navigation={navigation} /> : undefined}
      trailingActions={
        <>
          {showsNavigation && navigation.onSkip && <SkipNavigation navigation={navigation} />}
          {detailField && <SendButton label={t('send')} disabled={false} />}
        </>
      }
    >
      <div role="radiogroup" aria-label={texts.prompt(step)} className="flex w-full flex-col gap-md">
        {options.map((option) => (
          <ChoiceOption
            key={option.id}
            layout={layout}
            label={texts.optionLabel(step, option.id)}
            description={layout === 'card' ? texts.optionDescription(step, option.id) : undefined}
            icon={option.icon}
            selected={selectedId === option.id}
            onSelect={() => select(option.id)}
          />
        ))}
      </div>
      {detailField && <OptionDetailField field={detailField} step={step} texts={texts} detail={detail} />}
    </ComposerCard>
  );
}
