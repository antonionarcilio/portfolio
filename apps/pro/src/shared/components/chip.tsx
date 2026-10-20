import Image from 'next/image';

type ChipProps = {
  label: string;
  iconSrc: string;
  iconAlt: string;
};

/**
 * Small pill badge with a leading icon, used as a section identifier.
 * @example <Chip label="Qualidade" iconSrc="/icons/check.svg" iconAlt="" />
 */
export function Chip({ label, iconSrc, iconAlt }: ChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-alpha-black-10 bg-alpha-white-100 px-3 py-1.5">
      <Image src={iconSrc} alt={iconAlt} width={16} height={16} aria-hidden={iconAlt === ''} />
      <span className="text-sm font-medium font-portfolio text-grey-700">{label}</span>
    </div>
  );
}
