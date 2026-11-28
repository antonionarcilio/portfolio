'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { findStep } from '../engine/conversation-path';
import type { StepAnswer } from '../engine/flow-types';
import type { VerifyEmailAddress } from '../engine/request-email-check';
import type { FlowTexts } from '../engine/use-flow-texts';
import { INTRO_NAME_STEP_KEY } from '../flows/intro-flow';
import { FieldsStep } from './fields-step';
import { NAME_CHANGE_MESSAGES_NAMESPACE } from './use-name-change-exchange';

type NameChangeComposerProps = {
  texts: FlowTexts;
  /** Nome atual (`intro.name`): o campo abre preenchido com ele. */
  currentName: StepAnswer | undefined;
  onChangeName: (answer: StepAnswer) => void;
  onCancel: () => void;
  verifyEmail: VerifyEmailAddress;
};

/** Textos do campo de nome no desvio: rótulo e erro próprios do G08, sem a legenda "SEU NOME" do Grupo 01. */
function useNameChangeTexts(texts: FlowTexts): FlowTexts {
  const translate = useTranslations(NAME_CHANGE_MESSAGES_NAMESPACE);
  return useMemo(
    () => ({
      ...texts,
      caption: () => undefined,
      fieldLabel: (_step, fieldId) => translate(`fields.${fieldId}.label`),
      fieldPlaceholder: (_step, fieldId) => translate(`fields.${fieldId}.placeholder`),
      fieldError: (_step, _fieldId, errorKey) =>
        translate.has(`errors.${errorKey}`) ? translate(`errors.${errorKey}`) : undefined,
    }),
    [texts, translate],
  );
}

/**
 * Compositor do "Alterar meu nome" (G08 · Editar nome): o mesmo campo e validador de `intro.name` — o servidor
 * continua lendo o nome dali —, com "Cancelar" no lugar de "Voltar" e sem atalhos nem "Pular".
 * @example <NameChangeComposer texts={texts} currentName={answers['intro.name']} onChangeName={changeName} onCancel={cancel} verifyEmail={requestEmailCheck} />
 */
export function NameChangeComposer({
  texts,
  currentName,
  onChangeName,
  onCancel,
  verifyEmail,
}: NameChangeComposerProps) {
  const nameTexts = useNameChangeTexts(texts);
  const nameStep = findStep(INTRO_NAME_STEP_KEY);
  if (!nameStep) throw new Error(`Step "${INTRO_NAME_STEP_KEY}" not found; expected it in intro-flow.ts`);
  return (
    <FieldsStep
      step={nameStep}
      texts={nameTexts}
      previousAnswer={currentName}
      onAnswer={onChangeName}
      navigation={{ onCancel }}
      verifyEmail={verifyEmail}
    />
  );
}
