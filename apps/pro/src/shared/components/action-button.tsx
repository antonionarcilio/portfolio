import { cva, type VariantProps } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { Link } from '@/i18n/navigation';
import { ScrambleText } from '@/shared/components/scramble-text';
import { Spinner } from '@/shared/components/spinner';

/**
 * Botões de ação do chat de contato ("Botão Primário v2"/"Botão Secundário v2" do design, Pencil `I9CuK`/`q4QUo`):
 * `label-sm`, `rounded-lg`, 44px de altura. Anatomia em duas camadas: a casca (`p-[2px]`) e o miolo
 * `rounded-md` com o conteúdo. Primário é o CTA preto com miolo "costurado" (borda tracejada branca + sombra
 * interna); secundário é branco sem borda (G07: "Reiniciar conversa" ao lado do primário, para a ação destrutiva
 * pesar menos) e ganha a sombra interna só no hover/foco. Hover/foco baixam a opacidade (primário 80%,
 * secundário 70%); desabilitado fica a 40%; `submitting` troca o ícone pelo spinner.
 */
const actionButtonVariants = cva(
  'group/action-button transition-interface flex shrink-0 rounded-lg p-[2px] font-portfolio text-sm font-semibold whitespace-nowrap focus-visible:outline-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-alpha-black-100 text-alpha-white-100 shadow-action-button not-disabled:hover:opacity-80 focus-visible:opacity-80',
        secondary: 'bg-alpha-white-100 text-alpha-black-100 not-disabled:hover:opacity-70 focus-visible:opacity-70',
      },
      fullWidth: { true: 'w-full', false: '' },
      submitting: { true: 'cursor-progress disabled:opacity-100', false: '' },
    },
    defaultVariants: { variant: 'primary', fullWidth: false, submitting: false },
  },
);

/**
 * Miolo ("Miolo" no Pencil): padding total (casca + miolo) de 12×22px no primário e 12×18px no secundário.
 * O 1px da borda tracejada do primário sai do padding (9×19px) para a altura bater 44px nas duas variantes.
 */
const actionButtonInnerVariants = cva(
  'transition-interface flex flex-1 items-center justify-center gap-sm rounded-md',
  {
    variants: {
      variant: {
        primary: 'border border-dashed border-alpha-white-100 px-[19px] py-[9px] inset-shadow-action-button',
        secondary:
          'px-lg py-[10px] group-focus-visible/action-button:inset-shadow-action-button group-not-disabled/action-button:group-hover/action-button:inset-shadow-action-button',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

type ActionButtonProps = VariantProps<typeof actionButtonVariants> & {
  label: string;
  /** Ícone de 16px depois do texto (opcional; no design é a seta laranja, desligada em todos os usos atuais). */
  icon?: StaticImageData;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  /** Rota interna (com locale): renderiza um link com o mesmo visual em vez de `<button>`. */
  href?: string;
};

type ActionButtonContentProps = Pick<ActionButtonProps, 'label' | 'icon' | 'submitting' | 'variant'>;

function ActionButtonContent({ label, icon, submitting, variant }: ActionButtonContentProps) {
  return (
    <span className={actionButtonInnerVariants({ variant })}>
      <ScrambleText>{label}</ScrambleText>
      {submitting && <Spinner sizePixels={16} />}
      {!submitting && icon && <Image src={icon} alt="" aria-hidden width={16} height={16} className="shrink-0" />}
    </span>
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
  const content = <ActionButtonContent label={label} icon={icon} submitting={submitting} variant={variant} />;
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
