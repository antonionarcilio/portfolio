import { cva, type VariantProps } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { Link } from '@/i18n/navigation';
import { ScrambleText } from '@/shared/components/scramble-text';
import { Spinner } from '@/shared/components/spinner';

/**
 * Botões de ação do chat de contato ("Botão Primário v2"/"Botão Secundário v2" do design, Pencil `I9CuK`/`q4QUo`):
 * `label-sm`, `rounded-lg`, 44px de altura. Anatomia em duas camadas: a casca (`p-[2px]`) e o miolo
 * `rounded-md` com o conteúdo. Primário é o CTA preto com miolo "costurado" (contorno tracejado branco em SVG +
 * sombra interna); secundário é só a caixa branca, sem borda nem sombra (`q4QUo`; G07: "Reiniciar conversa" ao
 * lado do primário, para a ação destrutiva pesar menos). Estados do design:
 * - primário: hover 70%; foco 60% (só a opacidade, sem anel);
 * - secundário: hover 60%; foco 80% + contorno `stroke-focus` (preto) de 1px por fora;
 * - desabilitado a 40% nos dois; `submitting` troca o ícone pelo spinner.
 */
const actionButtonVariants = cva(
  'group/action-button transition-interface flex shrink-0 rounded-lg p-[2px] font-portfolio text-sm font-semibold whitespace-nowrap disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-alpha-black-100 text-alpha-white-100 shadow-action-button not-disabled:hover:opacity-70 focus-visible:opacity-60 focus-visible:outline-none',
        secondary:
          'bg-alpha-white-100 text-alpha-black-100 not-disabled:hover:opacity-60 focus-visible:opacity-80 focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-stroke-focus',
      },
      fullWidth: { true: 'w-full', false: '' },
      submitting: { true: 'cursor-progress disabled:opacity-100', false: '' },
    },
    defaultVariants: { variant: 'primary', fullWidth: false, submitting: false },
  },
);

/**
 * Miolo ("Miolo" no Pencil): padding total (casca + miolo) de 12×22px no primário e 12×18px no secundário, 44px de
 * altura nas duas. O tracejado do primário é o `StitchedOutline` (SVG por cima do miolo), que não ocupa espaço —
 * como o stroke `inner` do Pencil —, então o padding é o do design (10×20px).
 */
const actionButtonInnerVariants = cva(
  'transition-interface flex flex-1 items-center justify-center gap-sm rounded-md',
  {
    variants: {
      variant: {
        primary: 'relative overflow-hidden px-xl py-[10px] inset-shadow-action-button',
        secondary: 'px-lg py-[10px]',
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

/** Raio do miolo em px — o mesmo do `rounded-md` (8px) que recorta o SVG. */
const CORE_RADIUS_PIXELS = 8;

/**
 * Contorno "costurado" do miolo do primário, fiel ao stroke do Pencil (`fYAd2`: 1px branco, `inner`, tracejado
 * 4/2, raio 8). O `border-dashed` do CSS não aceita o padrão do traço e soma 1px à caixa; aqui o traço de 2px fica
 * centrado na borda e o `overflow-hidden rounded-md` do miolo recorta a metade de fora, sobrando 1px por dentro.
 * `currentColor` segue a cor do texto (inclusive no alto contraste).
 */
function StitchedOutline() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" fill="none">
      <rect
        width="100%"
        height="100%"
        rx={CORE_RADIUS_PIXELS}
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="4 2"
      />
    </svg>
  );
}

function ActionButtonContent({ label, icon, submitting, variant }: ActionButtonContentProps) {
  return (
    <span className={actionButtonInnerVariants({ variant })}>
      {(variant ?? 'primary') === 'primary' && <StitchedOutline />}
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
