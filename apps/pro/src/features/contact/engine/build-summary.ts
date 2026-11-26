import type { AnswerMap } from './answer-reader';
import type { FlowTexts } from './flow-texts';
import type { ResolvedStep } from './flow-types';

export type SummaryGroup = { id: string; steps: ResolvedStep[] };

/**
 * Blocos da revisão na ordem do caminho. Etapas com o mesmo `summary.group` viram um bloco só (rótulo e
 * "Editar" da primeira etapa do grupo); `summary: false` fica de fora.
 * @example groupSummarySteps(path).map((group) => group.id) // ['intro.reason', 'project.need', 'contact']
 */
export function groupSummarySteps(path: readonly ResolvedStep[]): SummaryGroup[] {
  const groups: SummaryGroup[] = [];
  for (const step of path) {
    const summary = step.definition.summary;
    if (summary === false) continue;
    const id = summary ? `${step.flowId}:${summary.group}` : step.key;
    const existing = groups.find((group) => group.id === id);
    if (existing) existing.steps.push(step);
    else groups.push({ id, steps: [step] });
  }
  return groups;
}

/**
 * Linhas de um bloco da revisão (e do e-mail de notificação): as respostas de cada etapa do grupo, em ordem.
 * @example summaryGroupLines(group, answers, texts) // ['Novo produto']
 */
export function summaryGroupLines(group: SummaryGroup, answers: AnswerMap, texts: FlowTexts): string[] {
  return group.steps.flatMap((step) => {
    const answer = answers[step.key];
    return answer ? texts.answerLines(step, answer) : [];
  });
}
