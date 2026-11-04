import { cva, type VariantProps } from 'class-variance-authority';

import { ScrambleText } from '@/shared/components/scramble-text';

/**
 * Texto de apoio abaixo do campo (node `hint-area` 6102:9754). Escurece quando o `group` pai
 * recebe hover; em `error` fica vermelho (rosa no hover).
 */
const fieldHintVariants = cva('transition-interface font-portfolio text-xs font-regular tracking-[0.48px]', {
  variants: {
    status: {
      regular: 'text-alpha-black-50 group-hover:text-alpha-black-100',
      error: 'text-red-500 group-hover:text-pink-500',
    },
  },
  defaultVariants: { status: 'regular' },
});

type FieldHintProps = VariantProps<typeof fieldHintVariants> & {
  id: string;
  text: string;
};

/**
 * @example <FieldHint id={hintId} text={t('hint')} status={errorMessage ? 'error' : 'regular'} />
 */
export function FieldHint({ id, text, status }: FieldHintProps) {
  return (
    <p id={id} className={fieldHintVariants({ status })} role={status === 'error' ? 'alert' : undefined}>
      <ScrambleText>{text}</ScrambleText>
    </p>
  );
}
