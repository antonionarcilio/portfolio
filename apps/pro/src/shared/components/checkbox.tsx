'use client';

import { cva } from 'class-variance-authority';
import Image from 'next/image';

import checkIcon from '@/_assets/icons/checkbox-check-md.svg';
import checkedRegularIcon from '@/_assets/icons/checkbox-checked-regular-md.svg';

/**
 * Checkbox `md` do Figma (nodes 6104:9959 desmarcado, 6104:9971 marcado). Desmarcado é um anel
 * que passa de `alpha-black-50` para `bulb-on` no hover/foco. Marcado usa o SVG exportado e, no
 * hover/foco, um fundo `bulb-on` a 80% com o check branco por cima.
 */
const checkboxVariants = cva(
  'group relative size-[18px] shrink-0 rounded-[5px] focus-visible:outline-none hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      checked: {
        false:
          'border border-solid border-alpha-black-50 hover:border-bulb-on focus-visible:border-bulb-on disabled:hover:border-alpha-black-50',
        true: '',
      },
    },
    defaultVariants: { checked: false },
  },
);

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  name?: string;
  describedBy?: string;
};

/**
 * Checkbox controlado. `label` é o nome acessível; envolva o botão e o texto visível num
 * `<label>` para o texto também marcar/desmarcar. Dentro de um `<fieldset disabled>` fica desabilitado.
 * @example <Checkbox checked={consent} onChange={setConsent} label="Concordo em receber uma resposta" />
 */
export function Checkbox({ checked, onChange, label, name, describedBy }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      name={name}
      aria-checked={checked}
      aria-label={label}
      aria-invalid={describedBy ? true : undefined}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={checkboxVariants({ checked })}
    >
      {checked && (
        <>
          <Image
            src={checkedRegularIcon}
            alt=""
            aria-hidden
            width={18}
            height={18}
            className="absolute inset-0 block group-hover:hidden group-focus-visible:hidden group-disabled:block"
          />
          <span className="absolute inset-0 hidden items-center justify-center rounded-[5px] bg-bulb-on opacity-80 group-hover:flex group-focus-visible:flex group-disabled:hidden">
            <Image src={checkIcon} alt="" aria-hidden width={12} height={12} />
          </span>
        </>
      )}
    </button>
  );
}
