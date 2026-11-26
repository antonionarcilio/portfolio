'use client';

import { cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';

import type { FieldDefinition, ResolvedStep, StepAnswer } from '../engine/flow-types';
import type { VerifyEmailAddress } from '../engine/request-email-check';
import type { FlowTexts } from '../engine/use-flow-texts';
import { hasFieldErrors } from '../engine/validate-fields';
import { ChatField } from './chat-field';
import { ComposerCard } from './composer-card';
import { SendButton } from './composer-controls';
import { LeadingNavigation, SkipNavigation, type StepNavigation } from './step-navigation';
import { useFieldsSubmission } from './use-fields-submission';

type FieldsStepProps = {
  step: ResolvedStep;
  texts: FlowTexts;
  previousAnswer: StepAnswer | undefined;
  onAnswer: (answer: StepAnswer) => void;
  navigation: StepNavigation;
  /** Checagem de e-mail no BFF (descartável, domínio sem servidor de e-mail) depois do formato. */
  verifyEmail: VerifyEmailAddress;
};

function initialDraft(previousAnswer: StepAnswer | undefined): Record<string, string> {
  return previousAnswer?.type === 'fields' ? { ...previousAnswer.values } : {};
}

/** Uma linha de campos: empilhada no mobile; com mais de um campo, lado a lado a partir de `tablet`. */
const fieldRowVariants = cva('flex w-full flex-col gap-md', {
  variants: { multiple: { true: 'tablet:flex-row tablet:gap-[14px]', false: '' } },
  defaultVariants: { multiple: false },
});

function findField(fields: readonly FieldDefinition[], fieldId: string): FieldDefinition {
  const field = fields.find((candidate) => candidate.id === fieldId);
  if (field) return field;
  const known = fields.map((candidate) => candidate.id).join(', ');
  throw new Error(`Field "${fieldId}" listed in rows is not in the step; expected one of: ${known}`);
}

/**
 * Linhas de campos do design: as do fluxo (`rows`) ou, sem elas, dois campos curtos lado a lado e o resto empilhado.
 * @example resolveFieldRows(fields, [['fullName', 'email'], ['whatsapp']])
 */
function resolveFieldRows(
  fields: readonly FieldDefinition[],
  rows: readonly (readonly string[])[] | undefined,
): FieldDefinition[][] {
  if (rows) return rows.map((row) => row.map((fieldId) => findField(fields, fieldId)));
  const sideBySide = fields.length === 2 && fields.every((field) => field.kind !== 'textarea');
  return sideBySide ? [[...fields]] : fields.map((field) => [field]);
}

/**
 * Rascunho que já pode ser enviado (pen.dev "Botão Enviar": G02 · 7 fica desabilitado com só o WhatsApp,
 * G03 · 6 habilita com o LinkedIn opcional vazio): todo obrigatório preenchido ou, sem obrigatórios, algum.
 * @example isDraftSendable([emailField(), whatsappField()], { whatsapp: '11999999999' }) // false
 */
function isDraftSendable(fields: readonly FieldDefinition[], draft: Record<string, string>): boolean {
  const isFilled = (field: FieldDefinition) => Boolean((draft[field.id] ?? '').trim());
  const requiredFields = fields.filter((field) => field.required);
  return requiredFields.length > 0 ? requiredFields.every(isFilled) : fields.some(isFilled);
}

/**
 * Etapas `fields`: um ou mais campos, validados ao enviar (Enter ou botão) — formato no cliente e, para
 * e-mails, a checagem no BFF. O erro some ao editar o campo.
 * @example <FieldsStep step={step} texts={texts} previousAnswer={answers[step.key]} onAnswer={answer} navigation={navigation} verifyEmail={requestEmailCheck} />
 */
export function FieldsStep({ step, texts, previousAnswer, onAnswer, navigation, verifyEmail }: FieldsStepProps) {
  const t = useTranslations('pro.contactChat');
  const [draft, setDraft] = useState(() => initialDraft(previousAnswer));
  const fields = step.definition.kind === 'fields' ? step.definition.fields : [];
  const { errors, isVerifying, clearError, submitDraft } = useFieldsSubmission(fields, verifyEmail, onAnswer);
  if (step.definition.kind !== 'fields') return null;
  // Com erro à vista (G05 "Campo com erro de validação") o envio espera a edição, que apaga o erro.
  const canSend = isDraftSendable(fields, draft) && !hasFieldErrors(errors) && !isVerifying;

  const change = (fieldId: string, value: string) => {
    setDraft((current) => ({ ...current, [fieldId]: value }));
    clearError(fieldId);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isVerifying) void submitDraft(draft);
  };

  const showsNavigation = step.definition.navigation !== 'hidden';

  return (
    <ComposerCard
      caption={texts.caption(step)}
      onSubmit={submit}
      leadingActions={showsNavigation ? <LeadingNavigation navigation={navigation} /> : undefined}
      trailingActions={
        <>
          {showsNavigation && <SkipNavigation navigation={navigation} />}
          <SendButton label={t('composer.send')} disabled={!canSend} />
        </>
      }
    >
      <div className="flex w-full flex-col gap-md">
        {resolveFieldRows(fields, step.definition.rows).map((row) => (
          <div key={row.map((field) => field.id).join('|')} className={fieldRowVariants({ multiple: row.length > 1 })}>
            {row.map((field) => (
              <ChatField
                key={field.id}
                field={field}
                step={step}
                texts={texts}
                value={draft[field.id] ?? ''}
                errorKey={errors[field.id]}
                autoFocus={field.id === fields[0]?.id}
                readOnly={isVerifying}
                onChange={(value) => change(field.id, value)}
              />
            ))}
          </div>
        ))}
      </div>
    </ComposerCard>
  );
}
