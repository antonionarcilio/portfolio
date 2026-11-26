import { INTRO_FLOW_ID } from '../flows/intro-flow';
import type { AnswerMap } from './answer-reader';
import { resolvePath } from './conversation-path';
import { REVIEW_STEP_KEY, type ResolvedStep, type StepAnswer, type StepTarget } from './flow-types';

export type TranscriptEntry =
  | { kind: 'bot'; id: string; step: ResolvedStep }
  | { kind: 'visitor'; id: string; step: ResolvedStep; answer: StepAnswer; editable: boolean };

export type Transcript = {
  /** Perguntas já respondidas (bot + visitante), na ordem do caminho. */
  entries: TranscriptEntry[];
  /** Etapa aberta no compositor; `undefined` na revisão. */
  currentStep: ResolvedStep | undefined;
};

function answeredPair(step: ResolvedStep, answer: StepAnswer): TranscriptEntry[] {
  return [
    { kind: 'bot', id: `bot:${step.key}`, step },
    { kind: 'visitor', id: `visitor:${step.key}`, step, answer, editable: false },
  ];
}

/**
 * Só a última resposta do visitante mostra "Editar resposta", e só dentro de um fluxo (no Grupo 01 o
 * design não mostra; na revisão cada bloco já tem o seu "Editar").
 */
function markLastAnswerEditable(entries: TranscriptEntry[], currentStep: ResolvedStep | undefined): void {
  const last = entries.at(-1);
  if (last?.kind !== 'visitor' || !currentStep || currentStep.flowId === INTRO_FLOW_ID) return;
  last.editable = true;
}

/**
 * Histórico derivado do caminho: tudo antes da etapa atual vira par pergunta/resposta. Voltar ou editar
 * só move `currentTarget` — o histórico "encolhe" sozinho.
 * @example buildTranscript('project.need', answers).entries.length // 4 (nome e motivo respondidos)
 */
export function buildTranscript(currentTarget: StepTarget, answers: AnswerMap): Transcript {
  const path = resolvePath(answers);
  const currentIndex =
    currentTarget === REVIEW_STEP_KEY ? path.length : path.findIndex((step) => step.key === currentTarget);
  const answered = path.slice(0, Math.max(currentIndex, 0));
  const entries = answered.flatMap((step) => {
    const answer = answers[step.key];
    return answer ? answeredPair(step, answer) : [];
  });
  const currentStep = path[currentIndex];
  markLastAnswerEditable(entries, currentStep);
  return { entries, currentStep };
}
