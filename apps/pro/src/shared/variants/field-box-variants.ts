import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Caixa de entrada do formulário (nodes `text-field` 6102:9695, `message-field` 6102:9779 e
 * `budge-field` 6102:9820 do Figma). Hover e foco escurecem a borda para `stroke-strong` (preto 100% numa
 * borda de 1px arredondada serrilha em telas 1x); `error` a deixa vermelha e vence os dois. Vale para o
 * `input`/`textarea` e para o wrapper com prefixo (`focus-within` cobre o foco dos dois casos).
 */
export const fieldBoxVariants = cva(
  'transition-interface flex w-full overflow-hidden rounded-lg border border-solid bg-alpha-black-2 px-lg py-[14px] font-portfolio text-sm font-regular leading-[1.45] text-alpha-black-80 placeholder:text-alpha-black-40 focus-visible:outline-none has-[:disabled]:opacity-50 disabled:opacity-50',
  {
    variants: {
      status: {
        regular: 'border-alpha-black-10 hover:border-stroke-strong focus-within:border-stroke-strong',
        error: 'border-red-500',
      },
      /** Caixa com ícone à esquerda (campos do chat de contato): ícone e texto centralizados, 10px entre eles. */
      withIcon: {
        false: 'items-start',
        true: 'items-center gap-[10px]',
      },
    },
    defaultVariants: { status: 'regular', withIcon: false },
  },
);

export type FieldBoxProps = VariantProps<typeof fieldBoxVariants>;
