'use client';

import { useId } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { fieldBoxVariants } from '@/shared/variants/field-box-variants';

type BudgetBoundProps = {
  name: string;
  value: string;
  prefix: string;
  placeholder: string;
  onChange: (value: string) => void;
};

type BudgetFieldProps = {
  label: string;
  minimum: BudgetBoundProps;
  maximum: BudgetBoundProps;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
};

type BudgetInputProps = BudgetBoundProps & {
  describedBy?: string;
  isInvalid: boolean;
  required: boolean;
};

function BudgetInput({
  name,
  value,
  prefix,
  placeholder,
  onChange,
  describedBy,
  isInvalid,
  required,
}: BudgetInputProps) {
  const inputId = useId();

  return (
    <div
      className={`${fieldBoxVariants({ status: isInvalid ? 'error' : 'regular' })} min-w-px flex-1 items-center gap-[2px]`}
    >
      <label htmlFor={inputId} className="whitespace-nowrap text-alpha-black-40">
        {prefix}
      </label>
      <input
        id={inputId}
        name={name}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={isInvalid ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-px flex-1 bg-transparent text-alpha-black-80 placeholder:text-alpha-black-40 focus-visible:outline-none"
      />
    </div>
  );
}

/**
 * Faixa de orçamento do Figma (`budge-field`): dois campos lado a lado com o prefixo ("A partir
 * de R$", "Até R$") dentro da caixa. Um único erro pinta os dois.
 * @example <BudgetField label="Orçamento estimado" minimum={{ … }} maximum={{ … }} required />
 */
export function BudgetField({ label, minimum, maximum, required = false, hint, errorMessage }: BudgetFieldProps) {
  const hintId = useId();
  const describedBy = (hint ?? errorMessage) ? hintId : undefined;
  const sharedProps = { describedBy, isInvalid: Boolean(errorMessage), required };

  return (
    <FieldFrame label={{ text: label, required }} hintId={hintId} hint={hint} errorMessage={errorMessage}>
      <div role="group" aria-label={label} className="flex w-full items-start gap-[12px]">
        <BudgetInput {...minimum} {...sharedProps} />
        <BudgetInput {...maximum} {...sharedProps} />
      </div>
    </FieldFrame>
  );
}
