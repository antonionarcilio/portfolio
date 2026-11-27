import { createAnswerReader, type AnswerMap } from './answer-reader';
import type { FieldDefinition, StepAnswer } from './flow-types';

/**
 * Campos de uma etapa que aparecem com as respostas atuais (`visibleWhen`). Usado pela tela, pelo resumo, pelo
 * payload e pela validação do servidor, para os quatro concordarem.
 * @example visibleFields(contactStep.fields, answers).map((field) => field.id) // ['email', 'whatsapp', 'url']
 */
export function visibleFields(fields: readonly FieldDefinition[], answers: AnswerMap): FieldDefinition[] {
  const reader = createAnswerReader(answers);
  return fields.filter((field) => field.visibleWhen?.(reader) ?? true);
}

/**
 * Resposta de campos sem os valores de campos escondidos — ex.: o link do projeto preenchido antes de o visitante
 * voltar e trocar a necessidade para "Criar do zero". Outras respostas passam iguais.
 * @example withoutHiddenFields(contactStep.fields, answer, answers)
 */
export function withoutHiddenFields(
  fields: readonly FieldDefinition[],
  answer: StepAnswer,
  answers: AnswerMap,
): StepAnswer {
  if (answer.type !== 'fields') return answer;
  const visibleIds = new Set(visibleFields(fields, answers).map((field) => field.id));
  const values = Object.fromEntries(Object.entries(answer.values).filter(([fieldId]) => visibleIds.has(fieldId)));
  return { type: 'fields', values };
}
