'use client';

import type { AnchorHTMLAttributes } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

const markdownAnchor = ({ children, href }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const blockComponents: Components = {
  a: markdownAnchor,
  p: ({ children }) => <p className="m-0">{children}</p>,
};
// Achata parágrafos num fluxo único (sem <p>/<div>) — pro preview truncado por line-clamp continuar sendo um único bloco de texto.
const inlineComponents: Components = {
  a: markdownAnchor,
  p: ({ children }) => <>{children} </>,
};

/**
 * Renderiza markdown (parágrafos, ênfase, listas, links) preservando a
 * estrutura do texto de origem — substitui split manual + `<p>` por item.
 *
 * `inline`: achata os parágrafos num único fluxo de texto, para uso em
 * previews truncados por `line-clamp` (onde blocos separados quebrariam o corte).
 */
export function MarkdownText({
  children,
  className,
  inline = false,
}: {
  children: string;
  className?: string;
  inline?: boolean;
}) {
  if (inline) {
    return (
      <div className={className}>
        <ReactMarkdown
          components={inlineComponents}
          allowedElements={['p', 'strong', 'em', 'a', 'code']}
          unwrapDisallowed
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-[10px] ${className ?? ''}`}>
      <ReactMarkdown components={blockComponents}>{children}</ReactMarkdown>
    </div>
  );
}
