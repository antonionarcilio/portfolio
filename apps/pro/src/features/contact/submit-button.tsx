import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

import checkIcon from '@/_assets/icons/checkbox-check-md.svg';
import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right-orange.svg';
import { ScrambleText } from '@/shared/components/scramble-text';
import { Spinner } from '@/shared/components/spinner';

const submitButtonVariant = cva(
  'transition-interface flex shrink-0 items-center gap-[10px] overflow-hidden rounded-[10px] bg-alpha-black-100 px-[18px] py-[12px] font-portfolio text-sm font-semibold whitespace-nowrap text-alpha-white-100 hover:bg-alpha-black-70 focus-visible:bg-alpha-black-70 focus-visible:outline-none disabled:hover:bg-alpha-black-100',
  {
    variants: {
      // Enviando: botão travado, mas sem esmaecer — o spinner precisa ficar legível. Enviado: 50%, como desabilitado.
      state: {
        idle: 'cursor-pointer',
        submitting: 'cursor-progress',
        sent: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: { state: 'idle' },
  },
);

type SubmitButtonProps = {
  label: string;
} & NonNullable<VariantProps<typeof submitButtonVariant>>;

function StateIcon({ state }: { state: SubmitButtonProps['state'] }) {
  if (state === 'submitting') return <Spinner sizePixels={16} />;
  if (state === 'sent') return <Image src={checkIcon} alt="" width={12} height={12} />;
  return <Image src={arrowUpRightIcon} alt="" width={16} height={16} />;
}

/**
 * Botão de envio do Figma (`btn-submit`, node 6104:9931). Hover/foco clareiam o fundo. Em `submitting`
 * troca a seta por um spinner (o texto do `label` diz "aguarde"); em `sent`, pelo check branco.
 * Fora de `idle` o botão fica desabilitado.
 * @example <SubmitButton label={t('submitting')} state="submitting" />
 */
export function SubmitButton({ label, state = 'idle' }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={state !== 'idle'}
      aria-busy={state === 'submitting'}
      className={submitButtonVariant({ state })}
    >
      <ScrambleText>{label}</ScrambleText>
      <span aria-hidden className="flex size-[16px] items-center justify-center">
        <StateIcon state={state} />
      </span>
    </button>
  );
}
