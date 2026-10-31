import ReactMarkdown, { type Components } from 'react-markdown';

const markdownComponents: Components = {
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
      {children}
    </a>
  ),
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-[8px] pl-[24px]">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-[8px] pl-[24px]">{children}</ol>,
};

type MarkdownTextProps = {
  children: string;
  className?: string;
};

/**
 * Renders CMS markdown (paragraphs, emphasis, lists, links). It sits outside `ScrambleText` on
 * purpose: that component only takes plain strings, and inline markup is one of its documented exceptions.
 * @example <MarkdownText className="gap-[24px]">{project.challenge}</MarkdownText>
 */
export function MarkdownText({ children, className }: MarkdownTextProps) {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  );
}
