import type { AnswerMap } from './answer-reader';
import { resolvePath } from './conversation-path';
import { REVIEW_STEP_KEY, type ResolvedStep, type StepTarget } from './flow-types';

/**
 * Indicador "Etapa X de N" do cabeçalho. No design, o motivo (Grupo 01) é a etapa 1 e a revisão é a última;
 * no meio contam só as etapas `progress: 'counted'` do fluxo escolhido (as `inherit` repetem o número).
 */
export type ConversationProgress =
  | { kind: 'intro'; fraction: number }
  | { kind: 'step'; current: number; total: number; fraction: number };

/** No design, "Início" preenche 10px de um trilho de 104px. */
const INTRO_FRACTION = 10 / 104;

/** O passo de motivo do Grupo 01 conta como etapa 1. */
const INTRO_STEP_COUNT = 1;

const isCounted = (step: ResolvedStep): boolean =>
  step.definition.progress === undefined || step.definition.progress === 'counted';

function countedUntil(path: readonly ResolvedStep[], endIndex: number): number {
  return path.slice(0, endIndex + 1).filter(isCounted).length;
}

function stepProgress(current: number, total: number): ConversationProgress {
  return { kind: 'step', current, total, fraction: current / total };
}

/**
 * @example computeProgress('project.need', answers) // { kind: 'step', current: 2, total: 4, fraction: 0.5 }
 */
export function computeProgress(target: StepTarget, answers: AnswerMap): ConversationProgress {
  const path = resolvePath(answers);
  const total = INTRO_STEP_COUNT + path.filter(isCounted).length + 1;
  if (target === REVIEW_STEP_KEY) return stepProgress(total, total);

  const index = path.findIndex((step) => step.key === target);
  const step = path[index];
  if (!step || step.definition.progress === 'intro') return { kind: 'intro', fraction: INTRO_FRACTION };
  return stepProgress(INTRO_STEP_COUNT + Math.max(countedUntil(path, index), 1), total);
}
