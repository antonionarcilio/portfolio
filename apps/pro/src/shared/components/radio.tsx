import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

import radioCheckedFocusLarge from '@/_assets/icons/radio-checked-focus-md.svg';
import radioCheckedFocusSmall from '@/_assets/icons/radio-checked-focus-sm.svg';
import radioCheckedRegularLarge from '@/_assets/icons/radio-checked-regular-md.svg';
import radioCheckedRegularSmall from '@/_assets/icons/radio-checked-regular-sm.svg';

const CHECKED_ASSETS = {
  md: { regular: radioCheckedRegularLarge, focus: radioCheckedFocusLarge, pixels: 18 },
  sm: { regular: radioCheckedRegularSmall, focus: radioCheckedFocusSmall, pixels: 14 },
  // Sem arte própria no Figma: reaproveita os SVGs md (vetoriais) ampliados para 20px.
  lg: { regular: radioCheckedRegularLarge, focus: radioCheckedFocusLarge, pixels: 20 },
} as const;

/**
 * Radio do Figma (nodes 6218:9271 unchecked, 6218:9278 checked). Desmarcado é um anel; hover e
 * focus do `group` pai trocam a borda de `stroke-strong` para `bulb-on`. Marcado usa os SVGs
 * exportados — hover e focus compartilham o mesmo asset (opacidade 0.8).
 */
const radioMarkVariants = cva('transition-interface relative block shrink-0 rounded-full', {
  variants: {
    size: { md: 'size-[18px]', sm: 'size-[14px]', lg: 'size-[20px]' },
    checked: {
      false: 'border-solid border-stroke-strong group-hover:border-bulb-on group-focus-visible:border-bulb-on',
      true: '',
    },
  },
  compoundVariants: [
    { size: 'md', checked: false, className: 'border' },
    { size: 'lg', checked: false, className: 'border' },
    { size: 'sm', checked: false, className: 'border-[0.8px]' },
  ],
  defaultVariants: { size: 'md', checked: false },
});

type RadioMarkProps = Omit<VariantProps<typeof radioMarkVariants>, 'checked'> & { checked: boolean };

/**
 * Só o desenho do radio, sem papel interativo: para quando a linha inteira é o controle (ex.: opções do
 * chat de contato, que já são `role="radio"`). Reage ao hover/foco do ancestral com a classe `group`.
 * @example <button className="group" role="radio" aria-checked={checked}><RadioMark checked={checked} /> Opção</button>
 */
export function RadioMark({ checked, size = 'md' }: RadioMarkProps) {
  const asset = CHECKED_ASSETS[size ?? 'md'];

  return (
    <span aria-hidden className={radioMarkVariants({ size, checked })}>
      {checked && (
        <>
          <Image
            src={asset.regular}
            alt=""
            width={asset.pixels}
            height={asset.pixels}
            className="transition-interface absolute inset-0 block group-hover:opacity-0 group-focus-visible:opacity-0"
          />
          <Image
            src={asset.focus}
            alt=""
            width={asset.pixels}
            height={asset.pixels}
            className="transition-interface absolute inset-0 block opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </>
      )}
    </span>
  );
}

type RadioProps = RadioMarkProps & {
  onSelect: () => void;
  label?: string;
};

/**
 * Botão de rádio. Use dentro de um container `role="radiogroup"`.
 * @example <Radio checked={currentLocale === 'en'} onSelect={() => switchLocale('en')} label="English" />
 */
export function Radio({ checked, onSelect, label, size = 'md' }: RadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      onClick={onSelect}
      className="group shrink-0 rounded-full focus-visible:outline-none hover:cursor-pointer"
    >
      <RadioMark checked={checked} size={size} />
    </button>
  );
}
