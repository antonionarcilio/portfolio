'use client';

import { useTranslations } from 'next-intl';

import type { ConversationState } from '../engine/conversation-state';
import type { ResolvedStep } from '../engine/flow-types';
import { promptIdFor } from '../engine/use-conversation';
import type { FlowTexts } from '../engine/use-flow-texts';
import type { AsideMessage } from './conversation-transcript';

/** Falas do "Alterar meu nome" (G08) ficam com as do Grupo 01, em `contact-flows/intro`. */
export const NAME_CHANGE_MESSAGES_NAMESPACE = 'pro.contactChat.flows.intro.nameChange';

export type NameChangeExchange = {
  /** Entre o histórico e a fala atual: a pergunta da etapa (ainda sem resposta) e a fala do visitante. */
  asides: AsideMessage[];
  /** No lugar da fala atual da etapa: "Como você prefere que eu te chame?" ou a confirmação que a retoma. */
  prompt: { id: string; text: string };
};

type NameChangeExchangeOptions = {
  state: ConversationState;
  step: ResolvedStep | undefined;
  texts: FlowTexts;
  visitorName: string;
  /** "Editar resposta" no balão do nome novo: abre o campo de novo. */
  onReopen: () => void;
};

type Translate = (key: string, values?: Record<string, string>) => string;

/** A pergunta da etapa sobe para o histórico com o mesmo id da fala atual: não "digita" nem anima de novo. */
function pendingQuestion(step: ResolvedStep, texts: FlowTexts): AsideMessage {
  return { kind: 'bot', id: promptIdFor(step.key), text: texts.prompt(step), hint: texts.hint(step) };
}

/** G08 · 2: o pedido do visitante e "Como você prefere que eu te chame?". */
function editingExchange(step: ResolvedStep, texts: FlowTexts, translate: Translate): NameChangeExchange {
  const scope = `nameChange:${step.key}`;
  return {
    asides: [pendingQuestion(step, texts), { kind: 'visitor', id: `${scope}:request`, text: translate('request') }],
    prompt: { id: `${scope}:prompt`, text: translate('prompt') },
  };
}

/** G08 · 3: o nome novo e a confirmação, que repete a pergunta da etapa (o texto de apoio ou, sem ele, a fala). */
function confirmedExchange(
  step: ResolvedStep,
  options: NameChangeExchangeOptions,
  translate: Translate,
  editLabel: string,
): NameChangeExchange {
  const { texts, visitorName: name, onReopen } = options;
  const scope = `nameChange:${step.key}`;
  const question = texts.hint(step) ?? texts.prompt(step);
  const edit = { label: editLabel, onEdit: onReopen };
  return {
    asides: [pendingQuestion(step, texts), { kind: 'visitor', id: `${scope}:name:${name}`, text: name, edit }],
    prompt: { id: `${scope}:confirmed:${name}`, text: translate('confirmed', { name, question }) },
  };
}

/**
 * Falas do "Alterar meu nome" (G08) na etapa atual, ou `undefined` fora do desvio. A etapa continua aberta:
 * o cabeçalho e o progresso não mudam, e a confirmação some quando o visitante responde a etapa.
 * @example const exchange = useNameChangeExchange({ state, step, texts, visitorName, onReopen: openNameChange });
 */
export function useNameChangeExchange(options: NameChangeExchangeOptions): NameChangeExchange | undefined {
  const translate = useTranslations(NAME_CHANGE_MESSAGES_NAMESPACE);
  const translateTranscript = useTranslations('pro.contactChat.transcript');
  const { state, step, texts } = options;
  if (state.nameChange === 'idle' || !step) return undefined;
  if (state.nameChange === 'editing') return editingExchange(step, texts, translate);
  return confirmedExchange(step, options, translate, translateTranscript('editAnswer'));
}
