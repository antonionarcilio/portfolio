import { ALL_FLOWS, findTopicFlow } from '../flows/flow-registry';
import { INTRO_REASON_STEP_KEY, introFlow } from '../flows/intro-flow';
import { createAnswerReader, type AnswerMap } from './answer-reader';
import { REVIEW_STEP_KEY, type FlowDefinition, type ResolvedStep, type StepKey, type StepTarget } from './flow-types';

/** Teto de segurança contra um `next` que crie ciclo entre etapas. */
const MAXIMUM_PATH_LENGTH = 60;

const toStepKey = (flowId: string, stepId: string): StepKey => `${flowId}.${stepId}`;

/** @example findStep('project.deadline')?.definition.kind */
export function findStep(stepKey: string): ResolvedStep | undefined {
  for (const flow of ALL_FLOWS) {
    const definition = flow.steps.find((step) => toStepKey(flow.id, step.id) === stepKey);
    if (definition) return { key: toStepKey(flow.id, definition.id), flowId: flow.id, definition };
  }
  return undefined;
}

function firstStepTarget(flow: FlowDefinition | undefined): StepTarget | undefined {
  const firstStep = flow?.steps[0];
  return firstStep && flow ? toStepKey(flow.id, firstStep.id) : undefined;
}

/** Próxima etapa depois de `step`: o `next` declarado, a seguinte no array ou, no fim do fluxo, a revisão. */
function followingTarget(step: ResolvedStep, answers: AnswerMap): StepTarget | undefined {
  const reader = createAnswerReader(answers);
  if (step.definition.next) return step.definition.next(reader);
  if (step.key === INTRO_REASON_STEP_KEY) return firstStepTarget(findTopicFlow(reader.option(step.key)));
  const flow = ALL_FLOWS.find((candidate) => candidate.id === step.flowId);
  const index = flow?.steps.findIndex((candidate) => candidate.id === step.definition.id) ?? -1;
  const nextStep = flow?.steps[index + 1];
  return nextStep ? toStepKey(step.flowId, nextStep.id) : REVIEW_STEP_KEY;
}

/**
 * Caminho previsto da conversa com as respostas atuais (sem a revisão): intro, depois o fluxo do motivo
 * escolhido, seguindo os `next`. Sem motivo respondido, termina no passo de motivo.
 * @example resolvePath({}).map((step) => step.key) // ['intro.name', 'intro.reason']
 */
export function resolvePath(answers: AnswerMap): ResolvedStep[] {
  const path: ResolvedStep[] = [];
  let target = firstStepTarget(introFlow);
  while (target && target !== REVIEW_STEP_KEY && path.length < MAXIMUM_PATH_LENGTH) {
    const step = findStep(target);
    if (!step) break;
    path.push(step);
    target = followingTarget(step, answers);
  }
  return path;
}

/** O caminho chega à revisão quando o fluxo do motivo foi escolhido. */
export function pathReachesReview(path: readonly ResolvedStep[]): boolean {
  return path.some((step) => step.flowId !== introFlow.id);
}

/**
 * Para onde ir depois de responder `answeredKey` vindo do "Editar" da revisão: a primeira etapa do caminho,
 * depois dela, ainda sem resposta; se todas já tiverem, a revisão. Assim, editar uma resposta volta direto ao
 * resumo, e uma ramificação nova (ex.: "Sim, já existe.") puxa a pergunta que faltava.
 */
export function targetAfterReviewEdit(answeredKey: StepKey, answers: AnswerMap): StepTarget {
  const path = resolvePath(answers);
  const index = path.findIndex((step) => step.key === answeredKey);
  const pending = path.slice(index + 1).find((step) => !answers[step.key]);
  if (pending) return pending.key;
  return pathReachesReview(path) ? REVIEW_STEP_KEY : answeredKey;
}

/**
 * Para onde ir depois de responder `answeredKey` no fluxo normal (inclusive depois de "Voltar"): a etapa
 * seguinte do caminho, já recalculado com a resposta nova — mesmo que ela já tenha resposta, que aparece
 * preenchida no compositor. No fim do caminho, a revisão.
 * @example nextStepInPath('project.need', answers) // 'project.description'
 */
export function nextStepInPath(answeredKey: StepKey, answers: AnswerMap): StepTarget {
  const path = resolvePath(answers);
  const index = path.findIndex((step) => step.key === answeredKey);
  const following = path[index + 1];
  if (following) return following.key;
  return pathReachesReview(path) ? REVIEW_STEP_KEY : answeredKey;
}

/** Etapa anterior à atual no caminho (a última do caminho, quando a atual é a revisão). */
export function previousStepKey(currentTarget: StepTarget, answers: AnswerMap): StepKey | undefined {
  const path = resolvePath(answers);
  if (currentTarget === REVIEW_STEP_KEY) return path.at(-1)?.key;
  const index = path.findIndex((step) => step.key === currentTarget);
  return index > 0 ? path[index - 1]?.key : undefined;
}
