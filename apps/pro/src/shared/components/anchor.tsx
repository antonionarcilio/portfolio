'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useAnimate } from 'framer-motion';
import Image from 'next/image';
import { useEffect, type ReactNode } from 'react';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import { Link } from '@/i18n/navigation';
import { INTERFACE_EASING } from '@/shared/animations';
import { ScrambleText } from '@/shared/components/scramble-text';

const WAVE_PERIOD = 14;
const WAVE_HEIGHT = 4;
const WAVE_TILE_REPEATS = 20;
const WAVE_SVG_WIDTH = WAVE_PERIOD * WAVE_TILE_REPEATS;

const WAVE_ANIMATE = { x: [0, -WAVE_PERIOD] };
const WAVE_TRANSITION = { duration: 1.8, repeat: Infinity, ease: 'linear' as const };

const hoverRevealVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1, transition: { duration: 0.2, ease: INTERFACE_EASING } },
};

function buildWavePathD(): string {
  const midY = WAVE_HEIGHT / 2;
  const halfPeriod = WAVE_PERIOD / 2;
  let d = `M0,${midY}`;
  for (let x = 0, step = 0; x < WAVE_SVG_WIDTH; x += halfPeriod, step += 1) {
    const controlX = x + halfPeriod / 2;
    const controlY = step % 2 === 0 ? 0 : WAVE_HEIGHT;
    d += ` Q${controlX},${controlY} ${x + halfPeriod},${midY}`;
  }
  return d;
}

const WAVE_PATH_D = buildWavePathD();

function WaveUnderline() {
  const [scope, animate] = useAnimate<SVGSVGElement>();

  useEffect(() => {
    if (scope.current) animate(scope.current, WAVE_ANIMATE, WAVE_TRANSITION);
  }, [animate, scope]);

  return (
    <motion.svg
      ref={scope}
      width={WAVE_SVG_WIDTH}
      height={WAVE_HEIGHT}
      viewBox={`0 0 ${WAVE_SVG_WIDTH} ${WAVE_HEIGHT}`}
      fill="none"
    >
      <path d={WAVE_PATH_D} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
    </motion.svg>
  );
}

/** `Link` do next-intl (o `Link` do Next com o prefixo de idioma) animável pelo Framer Motion. */
const MotionLink = motion.create(Link);

const anchorVariants = cva('font-portfolio focus-visible:outline-none', {
  variants: {
    /**
     * `wave`: links soltos (redes sociais, "Visitar projeto", 404) — onda animada no hover/foco e seta ↗.
     * `underline`: link no meio de um texto (aceite de privacidade, links do CMS) — sublinhado fixo, sem seta.
     */
    variant: {
      wave: 'inline-flex shrink-0 items-center gap-[2px]',
      underline: 'transition-interface underline underline-offset-2',
    },
    /** `inherit`: usa o tamanho do texto em volta (variante `underline` dentro de uma frase). */
    size: { inherit: '', md: 'text-sm', lg: 'text-md' },
    /** `medium`: o link é o destaque da frase ("Política de Privacidade"). */
    weight: { inherit: '', regular: 'font-regular', medium: 'font-medium' },
    tone: {
      default: 'text-alpha-black-100 hover:text-alpha-black-70 focus-visible:text-alpha-black-70',
      /** `muted`: links secundários do contato ("Onde mais me encontrar"), em 60% que escurecem no hover. */
      muted: 'text-alpha-black-60 hover:text-alpha-black-100 focus-visible:text-alpha-black-100',
      /** `inherit`: mantém a cor do texto em volta (links do CMS) e só escurece/clareia no hover. */
      inherit: 'hover:text-alpha-black-70 focus-visible:text-alpha-black-70',
    },
  },
  defaultVariants: { variant: 'wave', size: 'md', weight: 'regular', tone: 'default' },
});

/** A seta acompanha o tom do texto (o SVG é preto; `muted` o deixa a 60%). */
const arrowToneVariants = cva('shrink-0', {
  variants: { tone: { default: '', muted: 'opacity-60', inherit: '' } },
  defaultVariants: { tone: 'default' },
});

/** A seta cresce na mesma proporção do texto. */
const ARROW_PIXELS = { inherit: 16, md: 16, lg: 18 } as const;

/**
 * Texto do link: `label` (string, passa pelo `ScrambleText`, como todo texto da interface) ou `children`
 * (nós prontos, inline — links do markdown do CMS, que podem trazer ênfase dentro).
 */
type AnchorContent = { label: string; children?: never } | { label?: never; children: ReactNode };

type AnchorProps = VariantProps<typeof anchorVariants> &
  AnchorContent & {
    /** Rota interna (`/privacy`, recebe o idioma) ou URL completa (`https://…`, `mailto:…`), que passa intacta. */
    href: string;
    /** Abre em nova aba (`target="_blank"` + `rel="noopener noreferrer"`). */
    external?: boolean;
    className?: string;
  };

const EXTERNAL_ATTRIBUTES = { target: '_blank', rel: 'noopener noreferrer' } as const;

function AnchorText({ label, children }: AnchorContent) {
  return label === undefined ? children : <ScrambleText>{label}</ScrambleText>;
}

/**
 * Link de texto do app, sempre sobre o `Link` do Next (via next-intl: rotas internas ganham o idioma e navegam sem
 * recarregar). Variantes `wave` (padrão: onda animada + seta ↗) e `underline` (sublinhado fixo, para links dentro
 * de um texto).
 * @example <Anchor label="LinkedIn" href="https://linkedin.com/in/…" external size="lg" />
 * @example <Anchor variant="underline" label={t('privacyPolicy')} href="/privacy" external size="inherit" weight="medium" />
 */
export function Anchor({ variant, size, weight, tone, href, external = false, className, ...content }: AnchorProps) {
  const classes = `${anchorVariants({ variant, size, weight, tone })}${className ? ` ${className}` : ''}`;
  const externalAttributes = external ? EXTERNAL_ATTRIBUTES : {};

  if (variant === 'underline') {
    return (
      <Link href={href} className={classes} {...externalAttributes}>
        <AnchorText {...content} />
      </Link>
    );
  }
  return (
    <MotionLink
      href={href}
      className={classes}
      initial="initial"
      whileHover="active"
      whileFocus="active"
      {...externalAttributes}
    >
      <span className="relative inline-block">
        <AnchorText {...content} />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[3px] h-1 overflow-hidden"
          variants={hoverRevealVariants}
        >
          <WaveUnderline />
        </motion.span>
      </span>
      <WaveArrow size={size} tone={tone} />
    </MotionLink>
  );
}

function WaveArrow({ size, tone }: Pick<AnchorProps, 'size' | 'tone'>) {
  const pixels = ARROW_PIXELS[size ?? 'md'];
  return (
    <Image
      src={arrowUpRightIcon}
      alt=""
      aria-hidden
      width={pixels}
      height={pixels}
      className={arrowToneVariants({ tone })}
    />
  );
}
