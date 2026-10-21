import Image, { type StaticImageData } from 'next/image';

import { Link } from '@/i18n/navigation';

type TriggerWithHelpProps = {
  label: string;
  iconSrc?: string | StaticImageData;
  /** Shows a small icon in the trailing help slot (e.g. tea cup emoji). */
  helpIconSrc?: string | StaticImageData;
  /** Shows a short text label in the trailing help slot instead of an icon (e.g. "+10"). */
  helpLabel?: string;
  href?: string;
  onClick?: () => void;
};

/**
 * Primary CTA control using the segmented-control container pattern.
 * Renders a white active button inside a translucent pill container.
 * Optionally shows a help icon (e.g. tea cup) in a trailing wrapper.
 * Renders as a Link when `href` is provided, otherwise as a button.
 * @example <TriggerWithHelp label="Vamos trocar uma ideia" iconSrc="/icons/lucide-arrow-up-right.svg" helpIconSrc="/icons/solar-tea-cup.svg" href="/contact" />
 */
export function TriggerWithHelp({ label, iconSrc, helpIconSrc, helpLabel, href, onClick }: TriggerWithHelpProps) {
  const buttonClass =
    'flex items-center gap-1 bg-alpha-white-100 border border-alpha-white-100 rounded-[6px] px-[10px] h-[29px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] text-sm font-regular font-portfolio text-alpha-black-100 whitespace-nowrap hover:border-alpha-black-60 focus-visible:border-alpha-black-60 focus-visible:outline-none';

  const buttonContent = (
    <>
      <div className="flex items-center justify-center">
        <span className="text-sm font-regular font-portfolio text-alpha-black-100 whitespace-nowrap">{label}</span>
      </div>
      {iconSrc && <Image src={iconSrc} alt="" aria-hidden width={12} height={12} />}
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
              <Image src={helpIconSrc} alt="" aria-hidden width={18} height={18} />
            </div>
          )}
          {helpLabel && (
            <div className="flex items-center justify-center px-[6px]">
              <span className="whitespace-nowrap font-portfolio text-xs font-regular text-alpha-black-40">
                {helpLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
