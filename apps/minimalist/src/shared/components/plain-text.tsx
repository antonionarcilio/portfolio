import type { HTMLAttributes } from 'react';

function stripMarkdownSyntax(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, (codeBlock) => codeBlock.replace(/^```[^\n]*\n?|```$/g, ''))
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}(?:[-+*]|\d+\.)\s+/gm, '')
    .replace(/(?:\*\*|__|~~|`)/g, '')
    .replace(/([*_])(?=\S)(.*?\S)\1/g, '$2')
    .replace(/\\([\\`*_[\]{}()#+.!-])/g, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

export function PlainText({ children, ...props }: HTMLAttributes<HTMLParagraphElement> & { children: string }) {
  return <p {...props}>{stripMarkdownSyntax(children)}</p>;
}
