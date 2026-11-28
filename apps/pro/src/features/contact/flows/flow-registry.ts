import type { FlowDefinition } from '../engine/flow-types';
import { introFlow } from './intro-flow';
import { opportunityFlow } from './opportunity-flow';
import { otherSubjectsFlow } from './other-subjects-flow';
import { projectFlow } from './project-flow';

/**
 * Fluxos abertos pelo passo de motivo (`intro.reason`). O id de cada um é também o id da opção no motivo e a
 * chave das mensagens (`pro.contactChat.flows.<id>`). Para um fluxo novo: crie o arquivo, registre aqui,
 * adicione a opção em `intro-flow.ts` e as mensagens em `messages/contact-flows/<pasta>/`.
 */
export const TOPIC_FLOWS: readonly FlowDefinition[] = [projectFlow, opportunityFlow, otherSubjectsFlow];

/** Todos os fluxos que o motor conhece, para achar uma etapa pela chave. */
export const ALL_FLOWS: readonly FlowDefinition[] = [introFlow, ...TOPIC_FLOWS];

/** @example findTopicFlow('project')?.steps.length */
export function findTopicFlow(flowId: string | undefined): FlowDefinition | undefined {
  return TOPIC_FLOWS.find((flow) => flow.id === flowId);
}
