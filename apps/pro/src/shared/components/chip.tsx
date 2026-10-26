import { cva, type VariantProps } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { ScrambleText } from '@/shared/components/scramble-text';

/**
 * Badge/label chip with optional leading and trailing icons.
 * Supports 4 visual variants × 2 sizes.
 * @example <Chip label="Uma solução" iconLeading="/icons/solar-lightbulb-bolt.svg" variant="outline-v1" size="md" />
 */
const chipVariants = cva('inline-flex items-center justify-center overflow-hidden rounded-[50px]', {
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
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'outline-v1',
    size: 'sm',
  },
});

type ChipProps = VariantProps<typeof chipVariants> & {
  label: string;
  iconLeading?: string | StaticImageData;
  iconTrailing?: string | StaticImageData;
};

export function Chip({ label, iconLeading, iconTrailing, variant, size, disabled }: ChipProps) {
  const iconSize = size === 'md' ? 14 : 12;
  const textClass =
    size === 'md'
      ? 'text-sm font-regular font-portfolio text-alpha-black-100 whitespace-nowrap'
      : 'text-xs font-regular font-portfolio text-alpha-black-100 whitespace-nowrap';

  return (
    <div className={chipVariants({ variant, size, disabled })} aria-disabled={disabled === true ? true : undefined}>
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
