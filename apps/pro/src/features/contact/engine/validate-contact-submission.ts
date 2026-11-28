import type { SupportedLocale } from 'portfolio-content-model';

import { INTRO_NAME_STEP_KEY, INTRO_REASON_STEP_KEY } from '../flows/intro-flow';
import { createAnswerReader, type AnswerMap } from './answer-reader';
import type { ContactSubmission } from './contact-submission';
import { pathReachesReview, resolvePath } from './conversation-path';
import type { FieldDefinition, ResolvedStep, StepAnswer } from './flow-types';
import { validateFields, valueFieldsOf } from './validate-fields';
import { visibleFields } from './visible-fields';

/** Contato pronto para os e-mails: tudo derivado no servidor a partir das respostas já validadas. */
export type ValidatedContact = {
  locale: SupportedLocale;
  flowId: string;
  visitorName: string;
  email: string;
  /** Respostas normalizadas pelos validadores, só do caminho atual. */
  answers: AnswerMap;
};

/** `reason` vai para o log estruturado: só ids de etapa e campo, nunca o valor digitado. */
type Checked<Value> = { ok: true; value: Value } | { ok: false; reason: string };

const accept = <Value>(value: Value): Checked<Value> => ({ ok: true, value });
const reject = (reason: string): { ok: false; reason: string } => ({ ok: false, reason });

/**
 * Campos de uma resposta: só ids conhecidos (campos e prefixos de moeda), cada um aprovado pelo `validator`
 * do próprio campo — a moeda, só de uma lista fechada.
 */
function checkValues(
  fields: readonly FieldDefinition[],
  values: Record<string, string>,
): Checked<Record<string, string>> {
  const knownIds = valueFieldsOf(fields).map((field) => field.id);
  const unknown = Object.keys(values).find((fieldId) => !knownIds.includes(fieldId));
  if (unknown) return reject(`unexpected_field:${unknown}`);
  const result = validateFields(fields, values);
  const invalid = knownIds.find((fieldId) => result.errors[fieldId]);
  return invalid ? reject(`invalid_field:${invalid}`) : accept(result.values);
}

function checkOptionAnswer(step: ResolvedStep, answer: Extract<StepAnswer, { type: 'option' }>): Checked<StepAnswer> {
  if (step.definition.kind === 'fields') return reject(`option_on_fields_step:${step.key}`);
  const option = step.definition.options.find((candidate) => candidate.id === answer.optionId);
  if (!option) return reject(`unknown_option:${step.key}`);
  if (!answer.values) return accept({ type: 'option', optionId: option.id });
  const values = checkValues(option.detailField ? [option.detailField] : [], answer.values);
  return values.ok ? accept({ type: 'option', optionId: option.id, values: values.value }) : values;
}

/** Só os campos visíveis com as respostas enviadas (`visibleWhen`): um campo escondido no payload é recusado. */
function checkFieldsAnswer(
  step: ResolvedStep,
  answer: Extract<StepAnswer, { type: 'fields' }>,
  submitted: AnswerMap,
): Checked<StepAnswer> {
  if (step.definition.kind !== 'fields') return reject(`fields_on_option_step:${step.key}`);
  const values = checkValues(visibleFields(step.definition.fields, submitted), answer.values);
  return values.ok ? accept({ type: 'fields', values: values.value }) : values;
}

/** Obrigatória precisa de resposta; "pulada" (ou ausente) só onde o fluxo permite pular. */
function checkStepAnswer(step: ResolvedStep, submitted: AnswerMap): Checked<StepAnswer | undefined> {
  const answer = submitted[step.key];
  const isOptional = Boolean(step.definition.optional);
  if (!answer) return isOptional ? accept(undefined) : reject(`missing_answer:${step.key}`);
  if (answer.type === 'skipped') return isOptional ? accept(answer) : reject(`skipped_required:${step.key}`);
  return answer.type === 'option' ? checkOptionAnswer(step, answer) : checkFieldsAnswer(step, answer, submitted);
}

function toAnswerMap(submission: ContactSubmission): Checked<AnswerMap> {
  const map: Record<string, StepAnswer> = {};
  for (const { step, answer } of submission.answers) {
    if (map[step]) return reject(`duplicate_step:${step}`);
    map[step] = answer;
  }
  return accept(map);
}

/** Revalida cada etapa do caminho; devolve as respostas normalizadas ou o primeiro problema. */
function checkPathAnswers(path: readonly ResolvedStep[], submitted: AnswerMap): Checked<AnswerMap> {
  const validated: Record<string, StepAnswer> = {};
  for (const step of path) {
    const result = checkStepAnswer(step, submitted);
    if (!result.ok) return result;
    if (result.value) validated[step.key] = result.value;
  }
  return accept(validated);
}

/** Só etapas que o caminho percorre: resposta de etapa fora dele foi montada à mão. */
function checkSubmittedPath(submitted: AnswerMap): Checked<readonly ResolvedStep[]> {
  const path = resolvePath(submitted);
  if (!pathReachesReview(path)) return reject('incomplete_path');
  const unexpected = Object.keys(submitted).find((stepKey) => !path.some((step) => step.key === stepKey));
  return unexpected ? reject(`unexpected_step:${unexpected}`) : accept(path);
}

/** Primeiro campo `email` preenchido do caminho — todo fluxo tem um obrigatório na etapa de contato. */
function findEmail(path: readonly ResolvedStep[], answers: AnswerMap): string | undefined {
  const reader = createAnswerReader(answers);
  for (const step of path) {
    if (step.definition.kind !== 'fields') continue;
    const emailField = step.definition.fields.find((field) => field.kind === 'email');
    const email = emailField ? reader.field(step.key, emailField.id) : undefined;
    if (email) return email;
  }
  return undefined;
}

function deriveContact(
  locale: SupportedLocale,
  path: readonly ResolvedStep[],
  answers: AnswerMap,
): Checked<ValidatedContact> {
  const reader = createAnswerReader(answers);
  const visitorName = reader.field(INTRO_NAME_STEP_KEY, 'name');
  const flowId = reader.option(INTRO_REASON_STEP_KEY);
  const email = findEmail(path, answers);
  if (!visitorName || !flowId || !email) return reject('missing_identity');
  return accept({ locale, flowId, visitorName, email, answers });
}

/**
 * Fronteira de confiança do chat: o servidor refaz o caminho com o mesmo motor dos fluxos e só aceita
 * respostas que o chat poderia ter produzido — etapas do caminho, opções existentes, campos conhecidos
 * aprovados pelos validadores. Nome, e-mail e fluxo saem daqui, nunca do cliente.
 * @example const result = validateContactSubmission(body); if (!result.ok) log(result.reason);
 */
export function validateContactSubmission(submission: ContactSubmission): Checked<ValidatedContact> {
  const submitted = toAnswerMap(submission);
  if (!submitted.ok) return submitted;
  const path = checkSubmittedPath(submitted.value);
  if (!path.ok) return path;
  const answers = checkPathAnswers(path.value, submitted.value);
  if (!answers.ok) return answers;
  return deriveContact(submission.locale, path.value, answers.value);
}
