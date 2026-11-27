import type { AnswerReader, StepAnswer, StepKey } from './flow-types';

export type AnswerMap = Readonly<Record<string, StepAnswer>>;

/**
 * Leitor tipado das respostas, entregue ao `next` de cada etapa.
 * @example createAnswerReader(answers).option('intro.reason') // 'project'
 */
export function createAnswerReader(answers: AnswerMap): AnswerReader {
  return {
    option: (stepKey: StepKey) => {
      const answer = answers[stepKey];
      return answer?.type === 'option' ? answer.optionId : undefined;
    },
    field: (stepKey: StepKey, fieldId: string) => {
      const answer = answers[stepKey];
      if (answer?.type === 'fields') return answer.values[fieldId];
      return answer?.type === 'option' ? answer.values?.[fieldId] : undefined;
    },
  };
}
