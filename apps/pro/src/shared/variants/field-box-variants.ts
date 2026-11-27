import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Caixa de entrada do formulário (nodes `text-field` 6102:9695, `message-field` 6102:9779 e
 * `budge-field` 6102:9820 do Figma; `Campo de Texto` g0uGY e `Área de Texto` X4rPHk do pen.dev). Hover
 * escurece a borda para `stroke-strong`; selecionado (foco) a deixa preta (`stroke-focus`, o `$ink` do
 * protótipo) e o hover não a clareia de volta (`not-focus-within`). Fundo, rótulo e ícone não mudam no foco.
 * `error` deixa a borda vermelha e vence os dois. Vale para o `input`/`textarea` e para o wrapper com ícone
 * (`focus-within` cobre o foco dos dois casos).
 */
export const fieldBoxVariants = cva(
  'transition-interface flex w-full overflow-hidden rounded-lg border border-solid bg-alpha-black-2 font-portfolio text-sm font-regular leading-[1.45] text-alpha-black-80 placeholder:text-alpha-black-40 focus-visible:outline-none has-[:disabled]:opacity-50 disabled:opacity-50',
  {
    variants: {
      /**
       * `false`: a caixa sem padding, quando o padding fica no controle dentro dela — a área de texto, que rola
       * dentro da `OverlayScrollArea` e precisa do respiro do lado de dentro da rolagem.
       */
      padded: { true: 'px-lg py-[14px]', false: '' },
      status: {
        regular: 'border-alpha-black-10 hover:not-focus-within:border-stroke-strong focus-within:border-stroke-focus',
        error: 'border-red-500',
      },
      /** Caixa com ícone à esquerda (campos do chat de contato): ícone e texto centralizados, 10px entre eles. */
      withIcon: {
        false: 'items-start',
        true: 'items-center gap-[10px]',
      },
    },
    defaultVariants: { status: 'regular', withIcon: false, padded: true },
  },
);

export type FieldBoxProps = VariantProps<typeof fieldBoxVariants>;
