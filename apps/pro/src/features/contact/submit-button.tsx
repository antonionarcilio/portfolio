import Image from 'next/image';

import checkIcon from '@/_assets/icons/checkbox-check-md.svg';
import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right-orange.svg';
import { ScrambleText } from '@/shared/components/scramble-text';

type SubmitButtonProps = {
  label: string;
  disabled: boolean;
  /** Depois do envio a seta dá lugar ao mesmo check branco do checkbox. */
  isSent?: boolean;
};

/**
 * Botão de envio do Figma (`btn-submit`, node 6104:9931). Hover/foco clareiam o fundo; desabilitado
 * fica a 50% e sem hover.
 * @example <SubmitButton label={t('submit')} disabled={isSubmitted} />
 */
export function SubmitButton({ label, disabled, isSent = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="transition-interface flex shrink-0 items-center gap-[10px] overflow-hidden rounded-[10px] bg-alpha-black-100 px-[18px] py-[12px] font-portfolio text-sm font-semibold whitespace-nowrap text-alpha-white-100 hover:bg-alpha-black-70 focus-visible:bg-alpha-black-70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-alpha-black-100"
    >
      <ScrambleText>{label}</ScrambleText>
      <span aria-hidden className="flex size-[16px] items-center justify-center">
        {isSent ? (
          <Image src={checkIcon} alt="" width={12} height={12} />
        ) : (
          <Image src={arrowUpRightIcon} alt="" width={16} height={16} />
        )}
      </span>
    </button>
  );
}
