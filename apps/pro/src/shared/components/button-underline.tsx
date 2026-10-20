type ButtonUnderlineProps = {
  label: string;
  href: string;
  external?: boolean;
};

/**
 * Text link with underline style, used for secondary CTAs.
 * @example <ButtonUnderline label="LinkedIn ↗" href="https://linkedin.com/..." external />
 */
export function ButtonUnderline({ label, href, external = false }: ButtonUnderlineProps) {
  return (
    <a
      href={href}
      className="text-md font-medium font-portfolio text-grey-700 underline underline-offset-4 hover:text-grey-500 transition-colors"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label}
    </a>
  );
}
