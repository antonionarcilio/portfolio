import { cva, type VariantProps } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { ScrambleText } from '@/shared/components/scramble-text';

/**
 * Badge/label chip with optional leading and trailing icons.
 * Supports 4 visual variants × 3 sizes (sm 12px, md 14px, lg 16px de texto).
 * @example <Chip label="Uma solução" iconLeading="/icons/solar-lightbulb-bolt.svg" variant="outline-v1" size="md" />
 */
const chipVariants = cva(
  'transition-interface inline-flex items-center justify-center overflow-hidden rounded-[50px]',
  {
    variants: {
      variant: {
        'outline-v1':
          'border border-alpha-black-100 hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5 focus-visible:outline-none',
        'outline-v2':
          'bg-alpha-white-100 border border-alpha-black-100 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none',
        'filled-v1':
          'bg-alpha-black-5 hover:bg-alpha-black-10 focus-visible:bg-alpha-black-10 focus-visible:outline-none',
        'filled-v2': 'bg-alpha-white-100 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none',
      },
      size: {
        sm: 'px-[10px] py-[4px]',
        md: 'px-[12px] py-[5px]',
        lg: 'px-[14px] py-[6px]',
      },
      disabled: {
        true: 'opacity-50',
      },
      /** +4px de padding horizontal (ex.: tooltip com nome). `!` vence o `px-*` do `size`, que usa a mesma especificidade. */
      wide: {
        true: '',
      },
    },
    compoundVariants: [
      { size: 'sm', wide: true, class: 'px-[14px]!' },
      { size: 'md', wide: true, class: 'px-[16px]!' },
      { size: 'lg', wide: true, class: 'px-[18px]!' },
    ],
    defaultVariants: {
      variant: 'outline-v1',
      size: 'sm',
    },
  },
);

const chipTextVariants = cva('font-regular font-portfolio text-alpha-black-100 whitespace-nowrap', {
  variants: { size: { sm: 'text-xs', md: 'text-sm', lg: 'text-md' } },
  defaultVariants: { size: 'sm' },
});

/** Ícones crescem na mesma proporção do texto. */
const CHIP_ICON_PIXELS = { sm: 12, md: 14, lg: 16 } as const;

type ChipProps = VariantProps<typeof chipVariants> & {
  label: string;
  iconLeading?: string | StaticImageData;
  iconTrailing?: string | StaticImageData;
};

export function Chip({ label, iconLeading, iconTrailing, variant, size, disabled, wide }: ChipProps) {
  const iconSize = CHIP_ICON_PIXELS[size ?? 'sm'];
  const textClass = chipTextVariants({ size });

  return (
    <div
      className={chipVariants({ variant, size, disabled, wide })}
      aria-disabled={disabled === true ? true : undefined}
    >
      {iconLeading && <Image src={iconLeading} alt="" aria-hidden width={iconSize} height={iconSize} />}
      <div className="flex items-center justify-center px-[4px]">
        <span className={textClass}>
          <ScrambleText>{label}</ScrambleText>
        </span>
      </div>
      {iconTrailing && <Image src={iconTrailing} alt="" aria-hidden width={iconSize} height={iconSize} />}
    </div>
  );
}
