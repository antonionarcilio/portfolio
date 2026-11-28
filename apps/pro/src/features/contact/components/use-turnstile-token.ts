'use client';

import { useEffect, useState } from 'react';

import type { SubmitStatus } from '../engine/use-conversation';

type TurnstileToken = {
  token: string;
  setToken: (token: string) => void;
  /** Muda quando o token é descartado (envio que falhou, saída da revisão): como `key` do widget, força um desafio novo. */
  widgetKey: number;
};

const isFailure = (status: SubmitStatus): boolean => status !== 'idle' && status !== 'submitting';

/**
 * Token do Turnstile da revisão. Descartado (e o widget recriado) quando:
 * - um envio falha: o servidor consome o token na verificação, ele vale uma vez;
 * - o visitante sai da revisão (`isActive` falso): o widget desmonta, o `onExpire` (~5 min) deixa de disparar
 *   e um token guardado poderia voltar vencido.
 * @example const turnstile = useTurnstileToken(conversation.submitStatus, isReview);
 */
export function useTurnstileToken(submitStatus: SubmitStatus, isActive: boolean): TurnstileToken {
  const [token, setToken] = useState('');
  const [widgetKey, setWidgetKey] = useState(0);

  useEffect(() => {
    if (isActive && !isFailure(submitStatus)) return;
    setToken('');
    setWidgetKey((current) => current + 1);
  }, [submitStatus, isActive]);

  return { token, setToken, widgetKey };
}
