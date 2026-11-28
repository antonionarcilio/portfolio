'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useId, useState } from 'react';

import stopwatchIcon from '@/_assets/icons/solar-stopwatch.svg';
import { ActionButton } from '@/shared/components/action-button';
import { Anchor } from '@/shared/components/anchor';
import { Checkbox } from '@/shared/components/checkbox';
import { FieldHint } from '@/shared/components/field-hint';
import { ScrambleText } from '@/shared/components/scramble-text';

import type { SubmitStatus } from '../engine/use-conversation';
import { TurnstileChallenge } from './turnstile-challenge';

type ReviewFooterProps = {
  privacyAccepted: boolean;
  onPrivacyChange: (accepted: boolean) => void;
  submitStatus: SubmitStatus;
  onSubmit: () => void;
  /** Sem chave (Turnstile não configurado) não há widget; o servidor responde 503 ao envio. */
  turnstile: { siteKey: string | undefined; widgetKey: number; token: string; onTokenChange: (token: string) => void };
};

/** Mensagem de cada falha de envio (`pro.contactChat.review.*`); e-mail recusado pede edição, não nova tentativa. */
const SUBMIT_ERROR_KEYS: Partial<Record<SubmitStatus, 'submitFailed' | 'emailDisposable' | 'emailUndeliverable'>> = {
  failed: 'submitFailed',
  emailDisposable: 'emailDisposable',
  emailUndeliverable: 'emailUndeliverable',
};

type PrivacyConsentProps = { checked: boolean; onChange: (checked: boolean) => void; errorId?: string };

/** Página da política de privacidade. Ainda não existe: até ser criada, o link cai no 404 do app. */
const PRIVACY_POLICY_PATH = '/privacy';

/**
 * "Aceite de Privacidade": checkbox + frase com "Política de Privacidade" como `Anchor` (variante `underline`) para
 * a página da política, em nova aba para o visitante não sair da revisão. Os três
 * pedaços quebram como blocos (`flex-wrap`) porque o `ScrambleText` só aceita texto puro. A frase não é
 * `aria-hidden`: um link focável não pode ficar escondido dos leitores de tela (o checkbox repete a frase no nome).
 */
function PrivacyConsent({ checked, onChange, errorId }: PrivacyConsentProps) {
  const t = useTranslations('pro.contactChat.review');
  const sentence = `${t('privacyBefore')} ${t('privacyPolicy')} ${t('privacyAfter')}`;

  return (
    <div className="flex w-full items-start gap-md">
      <Checkbox checked={checked} onChange={onChange} label={sentence} describedBy={errorId} />
      <p className="flex flex-wrap gap-x-xs font-portfolio text-caption font-regular text-alpha-black-100">
        <ScrambleText>{t('privacyBefore')}</ScrambleText>
        <Anchor
          variant="underline"
          label={t('privacyPolicy')}
          href={PRIVACY_POLICY_PATH}
          external
          size="inherit"
          weight="medium"
        />
        <ScrambleText>{t('privacyAfter')}</ScrambleText>
      </p>
    </div>
  );
}

/**
 * Rodapé da revisão (a "Interação" do design nesta etapa): prazo de resposta, aceite de privacidade e o
 * botão "Enviar mensagem" em largura total. Enviar sem o aceite mostra o erro em vez de enviar.
 * @example <ReviewFooter privacyAccepted={accepted} onPrivacyChange={set} submitStatus={status} onSubmit={submit} turnstile={turnstile} />
 */
export function ReviewFooter({
  privacyAccepted,
  onPrivacyChange,
  submitStatus,
  onSubmit,
  turnstile,
}: ReviewFooterProps) {
  const t = useTranslations('pro.contactChat.review');
  const errorId = useId();
  const [showsConsentError, setShowsConsentError] = useState(false);
  const consentErrorId = showsConsentError && !privacyAccepted ? errorId : undefined;
  const isSubmitting = submitStatus === 'submitting';
  const submitErrorKey = SUBMIT_ERROR_KEYS[submitStatus];
  // Com Turnstile, só envia depois do token (em geral chega sozinho em ~1s, sem o visitante ver nada).
  const isAwaitingChallenge = Boolean(turnstile.siteKey) && !turnstile.token;

  const submit = () => {
    if (privacyAccepted) onSubmit();
    else setShowsConsentError(true);
  };

  return (
    // No mobile só o respiro de cima (separa da borda); laterais e base voltam a partir de `tablet`.
    <div className="flex w-full flex-col items-center gap-md border-t border-alpha-black-10 bg-surface pt-lg tablet:px-xl tablet:pb-lg">
      <p className="flex items-center gap-sm font-portfolio text-sm font-medium text-alpha-black-60">
        <Image src={stopwatchIcon} alt="" aria-hidden width={16} height={16} className="opacity-60" />
        <ScrambleText>{t('responseTime')}</ScrambleText>
      </p>
      <div className="flex w-full flex-col gap-xs">
        <PrivacyConsent checked={privacyAccepted} onChange={onPrivacyChange} errorId={consentErrorId} />
        {consentErrorId && <FieldHint id={consentErrorId} text={t('privacyRequired')} status="error" />}
      </div>
      {turnstile.siteKey && (
        <TurnstileChallenge
          key={turnstile.widgetKey}
          siteKey={turnstile.siteKey}
          onTokenChange={turnstile.onTokenChange}
        />
      )}
      <ActionButton
        label={isSubmitting ? t('submitting') : t('submit')}
        fullWidth
        submitting={isSubmitting}
        disabled={isAwaitingChallenge}
        onClick={submit}
      />
      {submitErrorKey && <FieldHint id={`${errorId}-submit`} text={t(submitErrorKey)} status="error" />}
    </div>
  );
}
