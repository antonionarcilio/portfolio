import Image, { type StaticImageData } from 'next/image';

import { Link } from '@/i18n/navigation';
import { ScrambleText } from '@/shared/components/scramble-text';
import {
  BUTTON_WHITE_ICON_PIXELS,
  buttonWhiteVariants,
  type ButtonWhiteProps,
} from '@/shared/variants/button-white-variants';

/** Ícone de ajuda (ex.: xícara) cresce junto com o botão. */
const HELP_ICON_PIXELS = { sm: 16, md: 18, lg: 20 } as const;

/** O rótulo de ajuda (ex.: "+10") fica em 12px e sobe para 14px no `lg` (a escala de tokens não tem 10px). */
const HELP_LABEL_TEXT_CLASS = { sm: 'text-xs', md: 'text-xs', lg: 'text-sm' } as const;

type TriggerWithHelpProps = {
  label: string;
  iconSrc?: string | StaticImageData;
  /** Shows a small icon in the trailing help slot (e.g. tea cup emoji). */
  helpIconSrc?: string | StaticImageData;
  /** Shows a short text label in the trailing help slot instead of an icon (e.g. "+10"). */
  helpLabel?: string;
  href?: string;
  onClick?: () => void;
  size?: ButtonWhiteProps['size'];
};

/**
 * Primary CTA control using the segmented-control container pattern.
 * Renders a white active button inside a translucent pill container.
 * Optionally shows a help icon (e.g. tea cup) in a trailing wrapper.
 * Renders as a Link when `href` is provided, otherwise as a button.
 * @example <TriggerWithHelp label="Vamos trocar uma ideia" iconSrc="/icons/lucide-arrow-up-right.svg" helpIconSrc="/icons/solar-tea-cup.svg" href="/contact" />
 */
export function TriggerWithHelp({
  label,
  iconSrc,
  helpIconSrc,
  helpLabel,
  href,
  onClick,
  size = 'md',
}: TriggerWithHelpProps) {
  const buttonClass = buttonWhiteVariants({ state: 'active', size });
  const iconPixels = BUTTON_WHITE_ICON_PIXELS[size ?? 'md'];
  const helpLabelTextClass = HELP_LABEL_TEXT_CLASS[size ?? 'md'];
  const helpIconPixels = HELP_ICON_PIXELS[size ?? 'md'];

  const buttonContent = (
    <>
      <div className="flex items-center justify-center">
        <span>
          <ScrambleText>{label}</ScrambleText>
        </span>
      </div>
      {iconSrc && <Image src={iconSrc} alt="" aria-hidden width={iconPixels} height={iconPixels} />}
    </>
  );

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-start bg-alpha-black-5 p-[3px] rounded-[8px] shrink-0">
        <div className="flex gap-px items-center">
          {href ? (
            <Link href={href} className={buttonClass}>
              {buttonContent}
            </Link>
          ) : (
            <button type="button" onClick={onClick} className={buttonClass}>
              {buttonContent}
            </button>
          )}
          {helpIconSrc && (
            <div className="flex items-center justify-center px-[6px]">
              <Image src={helpIconSrc} alt="" aria-hidden width={helpIconPixels} height={helpIconPixels} />
            </div>
          )}
          {helpLabel && (
            <div className="flex items-center justify-center px-[6px]">
              <span
                className={`whitespace-nowrap font-portfolio ${helpLabelTextClass} font-regular text-alpha-black-40`}
              >
                <ScrambleText>{helpLabel}</ScrambleText>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
