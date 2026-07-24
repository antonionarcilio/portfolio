'use client';

import ReactMarkdown, { type Components } from 'react-markdown';

const blockComponents: Components = { p: ({ children }) => <p className="m-0">{children}</p> };
// Achata parágrafos num fluxo único (sem <p>/<div>) — pro preview truncado por line-clamp continuar sendo um único bloco de texto.
const inlineComponents: Components = { p: ({ children }) => <>{children} </> };

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
      <span className={className}>
        <ReactMarkdown
          components={inlineComponents}
          allowedElements={['p', 'strong', 'em', 'a', 'code']}
          unwrapDisallowed
        >
          {children}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={`flex flex-col gap-[10px] ${className ?? ''}`}>
      <ReactMarkdown components={blockComponents}>{children}</ReactMarkdown>
    </div>
  );
}
