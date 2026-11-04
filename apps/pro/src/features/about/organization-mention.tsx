import { ButtonUnderline } from '@/shared/components/button-underline';
import { ScrambleText } from '@/shared/components/scramble-text';

type OrganizationMentionProps = {
  /** Texto já com o arroba, ex.: `@ PUC Minas`. */
  text: string;
  /** Site da organização no CMS; sem ele o texto fica sem link. */
  href?: string;
  /** Classes de tipografia/cor do texto simples (o link usa o estilo de `ButtonUnderline`). */
  plainClassName: string;
};

/**
 * `@ Organização` das páginas de experiência e formação: âncora com sublinhado ondulado (nova aba) quando o
 * CMS traz a URL; texto simples quando não traz.
 * @example <OrganizationMention text="@ PUC Minas" href="https://www.pucminas.br" plainClassName="text-md" />
 */
export function OrganizationMention({ text, href, plainClassName }: OrganizationMentionProps) {
  if (!href) {
    return (
      <p className={plainClassName}>
        <ScrambleText>{text}</ScrambleText>
      </p>
    );
  }
  return <ButtonUnderline label={text} href={href} external size="lg" className="self-start" />;
}
