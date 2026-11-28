'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { AnswerMap } from './answer-reader';
import { FLOW_MESSAGES_NAMESPACE } from './flow-message-keys';
import { createFlowTexts, type FlowTexts, type FlowTranslator } from './flow-texts';

export type { FlowTexts } from './flow-texts';

/**
 * Textos das etapas no cliente (ver `createFlowTexts`, que o e-mail também usa no servidor). As respostas
 * escolhem as variantes de texto (`textVariantFrom`) e os campos visíveis do resumo (`visibleWhen`).
 * @example const texts = useFlowTexts(name, state.answers); texts.prompt(step)
 */
export function useFlowTexts(visitorName: string, answers: AnswerMap): FlowTexts {
  const translate: FlowTranslator = useTranslations(FLOW_MESSAGES_NAMESPACE);
  return useMemo(() => createFlowTexts(translate, visitorName, answers), [translate, visitorName, answers]);
}
