import { cva, type VariantProps } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { Link } from '@/i18n/navigation';
import { ScrambleText } from '@/shared/components/scramble-text';
import { Spinner } from '@/shared/components/spinner';

/**
 * Botões de ação do chat de contato ("Botão Primário"/"Botão Secundário" do design): `label-sm`,
 * `rounded-lg`, 12×18px de padding. Primário é o CTA preto (hover/foco clareiam para `alpha-black-70`);
 * secundário é branco com borda preta; `ghost` é o secundário sem borda (G07: "Reiniciar conversa" ao lado do
 * primário, para a ação destrutiva pesar menos). Desabilitado fica a 50%; `submitting` troca o ícone pelo spinner.
 */
const actionButtonVariants = cva(
  'transition-interface flex shrink-0 items-center gap-[10px] rounded-lg px-[18px] py-md font-portfolio text-sm font-semibold whitespace-nowrap focus-visible:outline-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-alpha-black-100 text-alpha-white-100 hover:bg-alpha-black-70 focus-visible:bg-alpha-black-70 disabled:hover:bg-alpha-black-100',
        secondary:
          'border border-stroke-strong bg-alpha-white-100 text-alpha-black-100 hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5',
        ghost: 'bg-alpha-white-100 text-alpha-black-100 hover:bg-alpha-black-5 focus-visible:bg-alpha-black-5',
      },
      fullWidth: { true: 'w-full justify-center', false: 'justify-between' },
      submitting: { true: 'cursor-progress disabled:opacity-100', false: '' },
    },
    defaultVariants: { variant: 'primary', fullWidth: false, submitting: false },
  },
);

type ActionButtonProps = VariantProps<typeof actionButtonVariants> & {
  label: string;
  /** Ícone de 16px depois do texto (opcional). */
  icon?: StaticImageData;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  /** Rota interna (com locale): renderiza um link com o mesmo visual em vez de `<button>`. */
  href?: string;
};

function ActionButtonContent({ label, icon, submitting }: Pick<ActionButtonProps, 'label' | 'icon' | 'submitting'>) {
  return (
    <>
      <ScrambleText>{label}</ScrambleText>
      {submitting && <Spinner sizePixels={16} />}
      {!submitting && icon && <Image src={icon} alt="" aria-hidden width={16} height={16} className="shrink-0" />}
    </>
  );
}

/**
 * @example <ActionButton label={t('start')} onClick={start} />
 * @example <ActionButton label={t('backHome')} href="/" onClick={clearSavedConversation} />
 */
export function ActionButton({
  label,
  icon,
  type = 'button',
  disabled,
  onClick,
  variant,
  fullWidth,
  submitting,
  href,
}: ActionButtonProps) {
  const className = actionButtonVariants({ variant, fullWidth, submitting });
  const content = <ActionButtonContent label={label} icon={icon} submitting={submitting} />;
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled || submitting === true}
      aria-busy={submitting === true ? true : undefined}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}
