'use client';

import { useTranslations } from 'next-intl';

import { BudgetField } from '@/shared/components/budget-field';
import { Checkbox } from '@/shared/components/checkbox';
import { FieldHint } from '@/shared/components/field-hint';
import { MessageField } from '@/shared/components/message-field';
import { OptionScroller } from '@/shared/components/option-scroller';
import { ScrambleText } from '@/shared/components/scramble-text';
import { TextField } from '@/shared/components/text-field';

import type { ContactFieldName } from './contact-form-schema';
import { CONTACT_OPTION_GROUPS, CONTACT_OPTION_KEYS } from './contact-options';
import { SubmitButton } from './submit-button';
import type { ContactFormState } from './use-contact-form';

type ContactFormFieldsProps = {
  form: ContactFormState;
};

/** Traduz o erro do campo (chave devolvida pelo schema) ou devolve `undefined` quando não há erro. */
function useFieldErrorMessage({ errors }: ContactFormState): (field: ContactFieldName) => string | undefined {
  const t = useTranslations('pro.contactPage.errors');
  return (field) => {
    const errorKey = errors[field];
    return errorKey ? t(errorKey) : undefined;
  };
}

function IdentificationFields({ form }: ContactFormFieldsProps) {
  const t = useTranslations('pro.contactPage.fields');
  const errorMessageFor = useFieldErrorMessage(form);

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <TextField
        name="name"
        label={t('name.label')}
        placeholder={t('name.placeholder')}
        value={form.values.name}
        onChange={(value) => form.setFieldValue('name', value)}
        autoComplete="name"
        errorMessage={errorMessageFor('name')}
        required
      />
      <TextField
        name="email"
        type="email"
        label={t('email.label')}
        placeholder={t('email.placeholder')}
        value={form.values.email}
        onChange={(value) => form.setFieldValue('email', value)}
        autoComplete="email"
        errorMessage={errorMessageFor('email')}
        required
      />
    </div>
  );
}

function OptionGroups({ form }: ContactFormFieldsProps) {
  const t = useTranslations('pro.contactPage');

  return CONTACT_OPTION_GROUPS.map((group) => (
    <OptionScroller
      key={group}
      label={t(`fields.${group}.label`)}
      hint={t(`fields.${group}.hint`)}
      options={CONTACT_OPTION_KEYS[group].map((option) => ({ value: option, label: t(`options.${group}.${option}`) }))}
      value={form.values[group]}
      onChange={(value) => form.setFieldValue(group, value)}
    />
  ));
}

function ProjectDetailsFields({ form }: ContactFormFieldsProps) {
  const t = useTranslations('pro.contactPage.fields');
  const errorMessageFor = useFieldErrorMessage(form);
  const budgetErrorMessage = errorMessageFor('budgetMinimum') ?? errorMessageFor('budgetMaximum');

  return (
    <>
      <MessageField
        name="projectDescription"
        label={t('projectDescription.label')}
        placeholder={t('projectDescription.placeholder')}
        hint={t('projectDescription.hint')}
        value={form.values.projectDescription}
        onChange={(value) => form.setFieldValue('projectDescription', value)}
        errorMessage={errorMessageFor('projectDescription')}
        required
      />
      <BudgetField
        label={t('budget.label')}
        hint={t('budget.hint')}
        errorMessage={budgetErrorMessage}
        minimum={{
          name: 'budgetMinimum',
          prefix: t('budget.minimumPrefix'),
          placeholder: t('budget.minimumPlaceholder'),
          value: form.values.budgetMinimum,
          onChange: (value) => form.setFieldValue('budgetMinimum', value),
        }}
        maximum={{
          name: 'budgetMaximum',
          prefix: t('budget.maximumPrefix'),
          placeholder: t('budget.maximumPlaceholder'),
          value: form.values.budgetMaximum,
          onChange: (value) => form.setFieldValue('budgetMaximum', value),
        }}
        required
      />
    </>
  );
}

function ConsentAndSubmit({ form }: ContactFormFieldsProps) {
  const t = useTranslations('pro.contactPage');
  const errorMessageFor = useFieldErrorMessage(form);
  const consentError = errorMessageFor('consent');
  const isSubmitted = form.status === 'success';

  return (
    <div className="flex w-full flex-col gap-[6px]">
      {consentError && <FieldHint id="contact-consent-error" text={consentError} status="error" />}
      <div className="flex w-full items-center gap-[8px]">
        <label className="flex min-w-px flex-1 items-center gap-[8px]">
          <Checkbox
            name="consent"
            label={t('consent')}
            checked={form.values.consent}
            onChange={(checked) => form.setFieldValue('consent', checked)}
            describedBy={consentError ? 'contact-consent-error' : undefined}
          />
          <span className="font-portfolio text-xs leading-[1.4] font-regular text-alpha-black-60">
            <ScrambleText>{t('consent')}</ScrambleText>
          </span>
        </label>
        <SubmitButton
          label={isSubmitted ? t('success.submit') : t('submit')}
          disabled={isSubmitted}
          isSent={isSubmitted}
        />
      </div>
    </div>
  );
}

/**
 * Coluna 2: cartão com o formulário. Depois de enviado (ou enquanto envia) o `fieldset` desabilita
 * todos os campos, os scrollers, o checkbox e o botão.
 * @example <ContactFormColumn form={useContactForm(sendContactMessage)} />
 */
export function ContactFormColumn({ form }: ContactFormFieldsProps) {
  const t = useTranslations('pro.contactPage');
  const isLocked = form.status === 'submitting' || form.status === 'success';

  return (
    <form
      noValidate
      onSubmit={form.submit}
      className="w-[520px] shrink-0 overflow-hidden rounded-[20px] bg-alpha-white-100 p-[24px] shadow-[0px_18px_48px_-18px_rgba(0,0,0,0.12)]"
    >
      <fieldset disabled={isLocked} className="flex min-w-0 flex-col gap-[22px] border-0 p-0">
        <IdentificationFields form={form} />
        <div role="separator" className="h-px w-full bg-alpha-black-10" />
        <OptionGroups form={form} />
        <ProjectDetailsFields form={form} />
        {form.status === 'failed' && <FieldHint id="contact-submit-failed" text={t('submitFailed')} status="error" />}
        <ConsentAndSubmit form={form} />
      </fieldset>
    </form>
  );
}
