'use client';

import { Turnstile } from '@marsidev/react-turnstile';

type TurnstileFieldProps = {
  siteKey: string;
  onTokenChange: (token: string) => void;
};

/**
 * Widget do Cloudflare Turnstile. Só aparece quando a Cloudflare exige interação; o token expira
 * em ~5 min, por isso é limpo em `onExpire` e `onError`.
 * @example <TurnstileField key={form.turnstileWidgetKey} siteKey={siteKey} onTokenChange={form.setTurnstileToken} />
 */
export function TurnstileField({ siteKey, onTokenChange }: TurnstileFieldProps) {
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
