import Image from 'next/image';

type TriggerWithHelpProps = {
  label: string;
  iconSrc?: string;
  iconAlt?: string;
  href?: string;
  onClick?: () => void;
};

/**
 * Primary CTA button with a trailing icon (arrow/action indicator).
 * Renders as an anchor when `href` is provided, otherwise as a button.
 * @example <TriggerWithHelp label="Vamos trocar uma ideia" iconSrc="/icons/arrow.svg" iconAlt="" href="/contact" />
 */
export function TriggerWithHelp({ label, iconSrc, iconAlt = '', href, onClick }: TriggerWithHelpProps) {
  const content = (
    <>
      <span className="text-md font-medium font-portfolio text-grey-700">{label}</span>
      {iconSrc && <Image src={iconSrc} alt={iconAlt} width={16} height={16} aria-hidden={iconAlt === ''} />}
    </>
  );

  const className =
    'inline-flex items-center gap-2 rounded-full border border-alpha-black-10 bg-alpha-white-100 px-4 py-2.5 hover:bg-alpha-black-5 transition-colors';

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
