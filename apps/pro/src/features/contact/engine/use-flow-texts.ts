'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { FLOW_MESSAGES_NAMESPACE } from './flow-message-keys';
import { createFlowTexts, type FlowTexts, type FlowTranslator } from './flow-texts';

export type { FlowTexts } from './flow-texts';

/**
 * Textos das etapas no cliente (ver `createFlowTexts`, que o e-mail também usa no servidor).
 * @example const texts = useFlowTexts(name); texts.prompt(step)
 */
export function useFlowTexts(visitorName: string): FlowTexts {
  const translate: FlowTranslator = useTranslations(FLOW_MESSAGES_NAMESPACE);
  return useMemo(() => createFlowTexts(translate, visitorName), [translate, visitorName]);
}
