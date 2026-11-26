'use client';

import type { ResolvedStep, StepAnswer } from '../engine/flow-types';
import type { VerifyEmailAddress } from '../engine/request-email-check';
import type { FlowTexts } from '../engine/use-flow-texts';
import { ChoiceStep } from './choice-step';
import { FieldsStep } from './fields-step';
import type { StepNavigation } from './step-navigation';

type StepComposerProps = {
  step: ResolvedStep;
  texts: FlowTexts;
  previousAnswer: StepAnswer | undefined;
  onAnswer: (answer: StepAnswer) => void;
  navigation: StepNavigation;
  verifyEmail: VerifyEmailAddress;
};

/**
 * Escolhe o compositor pelo `kind` da etapa. O `key` por etapa zera o rascunho e a seleção ao trocar de
 * pergunta (e os repreenche com a resposta salva ao voltar).
 * @example <StepComposer step={step} texts={texts} previousAnswer={answers[step.key]} onAnswer={answer} navigation={navigation} verifyEmail={requestEmailCheck} />
 */
export function StepComposer({ step, verifyEmail, ...props }: StepComposerProps) {
  if (step.definition.kind === 'fields') {
    return <FieldsStep key={step.key} step={step} verifyEmail={verifyEmail} {...props} />;
  }
  return <ChoiceStep key={step.key} step={step} {...props} />;
}
