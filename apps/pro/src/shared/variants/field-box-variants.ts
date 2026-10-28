import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Caixa de entrada do formulário (nodes `text-field` 6102:9695, `message-field` 6102:9779 e
 * `budge-field` 6102:9820 do Figma). Hover e foco escurecem a borda; `error` a deixa vermelha
 * e vence os dois. Vale para o `input`/`textarea` e para o wrapper com prefixo do orçamento
 * (`focus-within` cobre o foco dos dois casos).
 */
export const fieldBoxVariants = cva(
  'flex w-full items-start overflow-hidden rounded-[10px] border border-solid bg-alpha-black-2 px-[16px] py-[14px] font-portfolio text-sm font-regular leading-[1.45] text-alpha-black-80 placeholder:text-alpha-black-40 focus-visible:outline-none has-[:disabled]:opacity-50 disabled:opacity-50',
  {
    variants: {
      status: {
        regular: 'border-alpha-black-10 hover:border-alpha-black-100 focus-within:border-alpha-black-100',
        error: 'border-red-500',
      },
    },
    defaultVariants: { status: 'regular' },
  },
);

export type FieldBoxProps = VariantProps<typeof fieldBoxVariants>;
