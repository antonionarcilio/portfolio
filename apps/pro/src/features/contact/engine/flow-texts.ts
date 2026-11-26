import type { ChatErrorKey, CurrencyCode } from './field-validators';
import {
  currencyMessageKey,
  currencyOptionMessageKey,
  fieldMessageKey,
  optionMessageKey,
  stepMessageKey,
} from './flow-message-keys';
import type { CurrencyDefinition, FieldDefinition, ResolvedStep, StepAnswer } from './flow-types';

/**
 * O mínimo de um tradutor do next-intl usado pelos textos dos fluxos — `useTranslations` (cliente) e
 * `getTranslations` (servidor, e-mail) satisfazem, ambos no namespace `FLOW_MESSAGES_NAMESPACE`.
 */
export type FlowTranslator = {
  (key: string, values?: Record<string, string>): string;
  has: (key: string) => boolean;
};

export type FlowTexts = {
  title: (step: ResolvedStep) => string;
  prompt: (step: ResolvedStep) => string;
  /** Texto de apoio da fala atual (ex.: "Qual problema deseja resolver?"); `undefined` quando não há. */
  hint: (step: ResolvedStep) => string | undefined;
  /** Legenda opcional do compositor ("SEU NOME"); `undefined` quando o fluxo não definiu. */
  caption: (step: ResolvedStep) => string | undefined;
  summaryLabel: (step: ResolvedStep) => string;
  fieldLabel: (step: ResolvedStep, fieldId: string) => string;
  fieldPlaceholder: (step: ResolvedStep, fieldId: string) => string;
  /**
   * Erro próprio de um campo (G08: "Informe como prefere ser chamado."); ausente ou `undefined`, o compositor
   * usa a mensagem genérica de `pro.contactChat.errors`.
   */
  fieldError?: (step: ResolvedStep, fieldId: string, errorKey: ChatErrorKey) => string | undefined;
  optionLabel: (step: ResolvedStep, optionId: string) => string;
  optionDescription: (step: ResolvedStep, optionId: string) => string | undefined;
  /** Título ("Moeda") e texto de apoio do menu/drawer de moeda de um campo com `currency`. */
  currencyPrompt: (step: ResolvedStep, fieldId: string, key: 'title' | 'description') => string;
  /** Símbolo ("R$") ou nome ("Real brasileiro") de uma moeda do campo. */
  currencyOption: (step: ResolvedStep, fieldId: string, code: CurrencyCode, key: 'symbol' | 'name') => string;
  /** Linhas da resposta como o visitante "disse" (balão, revisão e e-mail). Pulada = `[]`. */
  answerLines: (step: ResolvedStep, answer: StepAnswer) => string[];
};

/**
 * Moeda gravada, se for uma da lista do prefixo; senão (nada gravado, sessão antiga ou adulterada), a primeira.
 * @example selectedCurrency(rangeField.currency, { range: '10 mil', currency: 'USD' }) // 'USD'
 */
export function selectedCurrency(currency: CurrencyDefinition, values: Record<string, string>): CurrencyCode {
  return currency.codes.find((code) => code === values[currency.id]) ?? currency.codes[0];
}

type ValueLine = (step: ResolvedStep, field: FieldDefinition, values: Record<string, string>) => string | undefined;

/** Valor de um campo como linha da resposta: "R$ 10 a 20 mil" com prefixo de moeda; vazio = `undefined`. */
function valueLineWith(currencyOption: FlowTexts['currencyOption']): ValueLine {
  return (step, field, values) => {
    const value = values[field.id] ?? '';
    if (value.length === 0) return undefined;
    if (!field.currency) return value;
    return `${currencyOption(step, field.id, selectedCurrency(field.currency, values), 'symbol')} ${value}`;
  };
}

const isPresent = (line: string | undefined): line is string => line !== undefined;

function optionLines(step: ResolvedStep, answer: Extract<StepAnswer, { type: 'option' }>, valueLine: ValueLine) {
  if (step.definition.kind === 'fields') return [];
  const detailField = step.definition.options.find((option) => option.id === answer.optionId)?.detailField;
  return detailField ? [valueLine(step, detailField, answer.values ?? {})].filter(isPresent) : [];
}

function answerLinesWith(optionLabel: FlowTexts['optionLabel'], valueLine: ValueLine): FlowTexts['answerLines'] {
  return (step, answer) => {
    if (answer.type === 'option') return [optionLabel(step, answer.optionId), ...optionLines(step, answer, valueLine)];
    if (answer.type === 'skipped' || step.definition.kind !== 'fields') return [];
    return step.definition.fields.map((field) => valueLine(step, field, answer.values)).filter(isPresent);
  };
}

/**
 * Textos das etapas (todas as falas aceitam `{name}`, preenchido com o nome do passo de apresentação).
 * @example const texts = createFlowTexts(await getTranslations({ locale, namespace: FLOW_MESSAGES_NAMESPACE }), 'Ana');
 */
export function createFlowTexts(translate: FlowTranslator, visitorName: string): FlowTexts {
  const values = { name: visitorName };
  const text = (key: string) => translate(key, values);
  const optional = (key: string) => (translate.has(key) ? text(key) : undefined);
  const optionLabel = (step: ResolvedStep, optionId: string) => text(optionMessageKey(step, optionId, 'label'));
  const currencyOption: FlowTexts['currencyOption'] = (step, fieldId, code, key) =>
    text(currencyOptionMessageKey(step, fieldId, code, key));
  return {
    title: (step) => text(stepMessageKey(step, 'title')),
    prompt: (step) => text(stepMessageKey(step, 'prompt')),
    hint: (step) => optional(stepMessageKey(step, 'hint')),
    caption: (step) => optional(stepMessageKey(step, 'caption')),
    summaryLabel: (step) => optional(stepMessageKey(step, 'summaryLabel')) ?? text(stepMessageKey(step, 'title')),
    fieldLabel: (step, fieldId) => text(fieldMessageKey(step, fieldId, 'label')),
    fieldPlaceholder: (step, fieldId) => text(fieldMessageKey(step, fieldId, 'placeholder')),
    optionLabel,
    optionDescription: (step, optionId) => optional(optionMessageKey(step, optionId, 'description')),
    currencyPrompt: (step, fieldId, key) => text(currencyMessageKey(step, fieldId, key)),
    currencyOption,
    answerLines: answerLinesWith(optionLabel, valueLineWith(currencyOption)),
  };
}
