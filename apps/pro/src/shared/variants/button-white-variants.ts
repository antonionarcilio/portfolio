import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Botão "button-white" do Figma (`active` = branco com sombra; `inactive` = sem fundo até o hover; `sliding` = item inativo sobre a pílula, com hover; `slidingCurrent` = item atual, sobre a pílula branca, sem hover).
 * Tamanhos: `sm` 12px, `md` 14px e `lg` 16px de texto; a altura e o padding acompanham a mesma
 * proporção (24 → 29 → 33px de altura).
 */
export const buttonWhiteVariants = cva(
  'transition-interface flex items-center justify-center gap-1 rounded-[6px] border font-regular font-portfolio text-alpha-black-100 whitespace-nowrap focus-visible:outline-none',
  {
    variants: {
      state: {
        active:
          'border-alpha-white-100 bg-alpha-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] hover:border-alpha-black-60 focus-visible:border-alpha-black-60',
        inactive: 'border-transparent hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5',
        // O fundo branco vem de uma pílula deslizante atrás do botão (ver features/header/sliding-pill).
        sliding: 'relative z-10 border-transparent hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5',
        slidingCurrent:
          'relative z-10 border-transparent hover:border-alpha-black-60 focus-visible:border-alpha-black-60',
      },
      size: {
        sm: 'h-[24px] px-[8px] text-xs',
        md: 'h-[29px] px-[10px] text-sm',
        lg: 'h-[33px] px-[12px] text-md',
      },
    },
    defaultVariants: { state: 'active', size: 'md' },
  },
);

export type ButtonWhiteProps = VariantProps<typeof buttonWhiteVariants>;

/** Ícones dentro do botão crescem na mesma proporção do texto. */
export const BUTTON_WHITE_ICON_PIXELS = { sm: 10, md: 12, lg: 14 } as const;
