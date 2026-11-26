'use client';

import { Turnstile } from '@marsidev/react-turnstile';

type TurnstileChallengeProps = {
  siteKey: string;
  onTokenChange: (token: string) => void;
};

/**
 * Widget do Cloudflare Turnstile na revisão do chat. `interaction-only`: invisível, só aparece quando a
 * Cloudflare exige interação. O token expira em ~5 min e vale uma vez — limpo em `onExpire`/`onError`, e o
 * widget é recriado (via `key`) depois de um envio que falhou (ver `useTurnstileToken`).
 * @example <TurnstileChallenge key={turnstile.widgetKey} siteKey={siteKey} onTokenChange={turnstile.setToken} />
 */
export function TurnstileChallenge({ siteKey, onTokenChange }: TurnstileChallengeProps) {
  return (
    <Turnstile
      siteKey={siteKey}
      options={{ appearance: 'interaction-only', size: 'flexible' }}
      onSuccess={onTokenChange}
      onExpire={() => onTokenChange('')}
      onError={() => onTokenChange('')}
    />
  );
}
