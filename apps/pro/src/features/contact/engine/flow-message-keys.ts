import type { ResolvedStep } from './flow-types';

/**
 * Chaves das mensagens de cada etapa, relativas ao namespace `pro.contactChat.flows`. Os arquivos ficam em
 * `messages/contact-flows/<pasta>/<locale>.json` (um por fluxo, ver `src/i18n/contact-flow-messages.ts`) e
 * seguem este formato:
 *
 * ```json
 * { "steps": { "<stepId>": {
 *   "title": "Cabeçalho da conversa", "prompt": "Fala do bot (aceita {name})",
 *   "hint": "Texto de apoio sob a fala atual (opcional; some no histórico)",
 *   "caption": "Legenda do compositor (opcional)", "summaryLabel": "Rótulo na revisão (opcional, padrão = title)",
 *   "fields": { "<fieldId>": { "label": "…", "placeholder": "…" } },
 *   "options": { "<optionId>": { "label": "…", "description": "Só em cards" } }
 * } } }
 * ```
 */
export const FLOW_MESSAGES_NAMESPACE = 'pro.contactChat.flows';

type StepTextKey = 'title' | 'prompt' | 'hint' | 'caption' | 'summaryLabel';

const stepRoot = (step: ResolvedStep): string => `${step.flowId}.steps.${step.definition.id}`;

/** @example stepMessageKey(step, 'prompt') // 'project.steps.deadline.prompt' */
export function stepMessageKey(step: ResolvedStep, key: StepTextKey): string {
  return `${stepRoot(step)}.${key}`;
}

/** @example fieldMessageKey(step, 'email', 'placeholder') */
export function fieldMessageKey(step: ResolvedStep, fieldId: string, key: 'label' | 'placeholder'): string {
  return `${stepRoot(step)}.fields.${fieldId}.${key}`;
}

/** @example optionMessageKey(step, 'project', 'description') */
export function optionMessageKey(step: ResolvedStep, optionId: string, key: 'label' | 'description'): string {
  return `${stepRoot(step)}.options.${optionId}.${key}`;
}
