import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

import radioCheckedFocusLarge from '@/_assets/icons/radio-checked-focus-md.svg';
import radioCheckedFocusSmall from '@/_assets/icons/radio-checked-focus-sm.svg';
import radioCheckedRegularLarge from '@/_assets/icons/radio-checked-regular-md.svg';
import radioCheckedRegularSmall from '@/_assets/icons/radio-checked-regular-sm.svg';

const CHECKED_ASSETS = {
  md: { regular: radioCheckedRegularLarge, focus: radioCheckedFocusLarge, pixels: 18 },
  sm: { regular: radioCheckedRegularSmall, focus: radioCheckedFocusSmall, pixels: 14 },
} as const;

/**
 * Radio do Figma (nodes 6218:9271 unchecked, 6218:9278 checked). Desmarcado é um anel; hover e
 * focus trocam a borda de `alpha-black-50` para `bulb-on`. Marcado usa os SVGs exportados — hover
 * e focus compartilham o mesmo asset (opacidade 0.8).
 */
const radioVariants = cva('group relative shrink-0 rounded-full focus-visible:outline-none hover:cursor-pointer', {
  variants: {
    size: { md: 'size-[18px]', sm: 'size-[14px]' },
    checked: {
      false: 'border-solid border-alpha-black-50 hover:border-bulb-on focus-visible:border-bulb-on',
      true: '',
    },
  },
  compoundVariants: [
    { size: 'md', checked: false, className: 'border' },
    { size: 'sm', checked: false, className: 'border-[0.8px]' },
  ],
  defaultVariants: { size: 'md', checked: false },
});

type RadioProps = Omit<VariantProps<typeof radioVariants>, 'checked'> & {
  checked: boolean;
  onSelect: () => void;
  label?: string;
};

/**
 * Botão de rádio. Use dentro de um container `role="radiogroup"`.
 * @example <Radio checked={currentLocale === 'en'} onSelect={() => switchLocale('en')} label="English" />
 */
export function Radio({ checked, onSelect, label, size = 'md' }: RadioProps) {
  const asset = CHECKED_ASSETS[size ?? 'md'];

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      onClick={onSelect}
      className={radioVariants({ size, checked })}
    >
      {checked && (
        <>
          <Image
            src={asset.regular}
            alt=""
            aria-hidden
            width={asset.pixels}
            height={asset.pixels}
            className="absolute inset-0 block group-hover:hidden group-focus-visible:hidden"
          />
          <Image
            src={asset.focus}
            alt=""
            aria-hidden
            width={asset.pixels}
            height={asset.pixels}
            className="absolute inset-0 hidden group-hover:block group-focus-visible:block"
          />
        </>
      )}
    </button>
  );
}
