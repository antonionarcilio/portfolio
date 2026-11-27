import { formatPhoneInternational } from '@/shared/utils/phone-number';

import { createAnswerReader, type AnswerMap } from './answer-reader';
import { formatAmount, type ChatErrorKey, type CurrencyCode } from './field-validators';
import {
  currencyMessageKey,
  currencyOptionMessageKey,
  fieldMessageKey,
  optionMessageKey,
  stepMessageKey,
  variantMessageKey,
} from './flow-message-keys';
import type { CurrencyDefinition, FieldDefinition, ResolvedStep, StepAnswer } from './flow-types';
import { visibleFields } from './visible-fields';

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

/** Valor de um campo como linha da resposta: "R$ 15.000" com prefixo de moeda; vazio = `undefined`. */
function valueLineWith(currencyOption: FlowTexts['currencyOption']): ValueLine {
  return (step, field, values) => {
    const value = values[field.id] ?? '';
    if (value.length === 0) return undefined;
    // Guardado em E.164; quem lê (visitante e quem atende) vê "+55 11 98765-4321".
    if (field.kind === 'tel') return formatPhoneInternational(value);
    if (!field.currency) return value;
    const code = selectedCurrency(field.currency, values);
    const amount = field.kind === 'amount' ? formatAmount(value, code) : value;
    return `${currencyOption(step, field.id, code, 'symbol')} ${amount}`;
  };
}

const isPresent = (line: string | undefined): line is string => line !== undefined;

function optionLines(step: ResolvedStep, answer: Extract<StepAnswer, { type: 'option' }>, valueLine: ValueLine) {
  if (step.definition.kind === 'fields') return [];
  const detailField = step.definition.options.find((option) => option.id === answer.optionId)?.detailField;
  return detailField ? [valueLine(step, detailField, answer.values ?? {})].filter(isPresent) : [];
}

/** Linhas da resposta; numa etapa de campos, só os que aparecem com as respostas atuais (`visibleWhen`). */
function answerLinesWith(
  optionLabel: FlowTexts['optionLabel'],
  valueLine: ValueLine,
  answers: AnswerMap,
): FlowTexts['answerLines'] {
  return (step, answer) => {
    if (answer.type === 'option') return [optionLabel(step, answer.optionId), ...optionLines(step, answer, valueLine)];
    if (answer.type === 'skipped' || step.definition.kind !== 'fields') return [];
    const fields = visibleFields(step.definition.fields, answers);
    return fields.map((field) => valueLine(step, field, answer.values)).filter(isPresent);
  };
}

type KeyResolver = (step: ResolvedStep, key: string) => string;

/**
 * Troca a chave base pela da variante escolhida em `textVariantFrom` quando ela existe nas mensagens; sem
 * variante (ou sem resposta na etapa de origem), fica a base.
 */
function createKeyResolver(translate: FlowTranslator, answers: AnswerMap): KeyResolver {
  const reader = createAnswerReader(answers);
  return (step, key) => {
    const source = step.definition.textVariantFrom;
    const optionId = source ? reader.option(source) : undefined;
    const variantKey = optionId ? variantMessageKey(step, optionId, key) : undefined;
    return variantKey && translate.has(variantKey) ? variantKey : key;
  };
}

/**
 * Textos das etapas (todas as falas aceitam `{name}`, preenchido com o nome do passo de apresentação). `answers`
 * escolhe as variantes (`textVariantFrom`) e os campos visíveis (`visibleWhen`).
 * @example const texts = createFlowTexts(await getTranslations({ locale, namespace: FLOW_MESSAGES_NAMESPACE }), 'Ana', answers);
 */
export function createFlowTexts(translate: FlowTranslator, visitorName: string, answers: AnswerMap = {}): FlowTexts {
  const values = { name: visitorName };
  const resolve = createKeyResolver(translate, answers);
  const text = (step: ResolvedStep, key: string) => translate(resolve(step, key), values);
  const optional = (step: ResolvedStep, key: string) =>
    translate.has(resolve(step, key)) ? text(step, key) : undefined;
  const optionLabel = (step: ResolvedStep, optionId: string) => text(step, optionMessageKey(step, optionId, 'label'));
  const currencyOption: FlowTexts['currencyOption'] = (step, fieldId, code, key) =>
    text(step, currencyOptionMessageKey(step, fieldId, code, key));
  return {
    title: (step) => text(step, stepMessageKey(step, 'title')),
    prompt: (step) => text(step, stepMessageKey(step, 'prompt')),
    hint: (step) => optional(step, stepMessageKey(step, 'hint')),
    caption: (step) => optional(step, stepMessageKey(step, 'caption')),
    summaryLabel: (step) =>
      optional(step, stepMessageKey(step, 'summaryLabel')) ?? text(step, stepMessageKey(step, 'title')),
    fieldLabel: (step, fieldId) => text(step, fieldMessageKey(step, fieldId, 'label')),
    fieldPlaceholder: (step, fieldId) => text(step, fieldMessageKey(step, fieldId, 'placeholder')),
    optionLabel,
    optionDescription: (step, optionId) => optional(step, optionMessageKey(step, optionId, 'description')),
    currencyPrompt: (step, fieldId, key) => text(step, currencyMessageKey(step, fieldId, key)),
    currencyOption,
    answerLines: answerLinesWith(optionLabel, valueLineWith(currencyOption), answers),
  };
}
