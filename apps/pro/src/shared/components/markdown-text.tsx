import ReactMarkdown, { type Components } from 'react-markdown';

import { Anchor } from '@/shared/components/anchor';

const markdownComponents: Components = {
  // Links do CMS: `Anchor` sublinhado no tamanho, peso e cor do parágrafo; sem `href` vira só o texto.
  a: ({ children, href }) =>
    href ? (
      <Anchor variant="underline" href={href} external size="inherit" weight="inherit" tone="inherit">
        {children}
      </Anchor>
    ) : (
      <>{children}</>
    ),
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-sm pl-2xl">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-sm pl-2xl">{children}</ol>,
};

type MarkdownTextProps = {
  children: string;
  className?: string;
};

/**
 * Renders CMS markdown (paragraphs, emphasis, lists, links). It sits outside `ScrambleText` on
 * purpose: that component only takes plain strings, and inline markup is one of its documented exceptions.
 * @example <MarkdownText className="gap-2xl">{project.challenge}</MarkdownText>
 */
export function MarkdownText({ children, className }: MarkdownTextProps) {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  );
}
