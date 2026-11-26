import { fieldMessageKey, optionMessageKey, stepMessageKey } from './flow-message-keys';
import type { ResolvedStep, StepAnswer } from './flow-types';

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
  optionLabel: (step: ResolvedStep, optionId: string) => string;
  optionDescription: (step: ResolvedStep, optionId: string) => string | undefined;
  /** Linhas da resposta como o visitante "disse" (balão, revisão e e-mail). Pulada = `[]`. */
  answerLines: (step: ResolvedStep, answer: StepAnswer) => string[];
};

function fieldLines(step: ResolvedStep, values: Record<string, string>): string[] {
  if (step.definition.kind !== 'fields') return [];
  return step.definition.fields.map((field) => values[field.id] ?? '').filter((value) => value.length > 0);
}

function answerLinesWith(optionLabel: FlowTexts['optionLabel']): FlowTexts['answerLines'] {
  return (step, answer) => {
    if (answer.type === 'option') {
      const detailValues = Object.values(answer.values ?? {}).filter((value) => value.length > 0);
      return [optionLabel(step, answer.optionId), ...detailValues];
    }
    return answer.type === 'fields' ? fieldLines(step, answer.values) : [];
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
    answerLines: answerLinesWith(optionLabel),
  };
}
