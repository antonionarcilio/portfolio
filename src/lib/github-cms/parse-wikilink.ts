export interface WikiLink {
  path: string;
  label?: string;
}

const WIKILINK_PATTERN = /^\[\[([^|\]]+)(?:\|([^\]]+))?\]\]$/;

/**
 * Parseia "[[path|label]]" ou "[[path]]" em { path, label }.
 * Só faz parsing de string — resolução de path (prefixo/sufixo) fica em get-cms-graph.ts.
 */
export function parseWikiLink(raw: string): WikiLink {
  const match = WIKILINK_PATTERN.exec(raw.trim());
  if (!match) throw new Error(`parseWikiLink: valor não é um wikilink válido: ${JSON.stringify(raw)}`);
  const [, path, label] = match;
  return label ? { path, label } : { path };
}

export function parseWikiLinks(raw: string | string[] | null | undefined): WikiLink[] {
  if (raw === null || raw === undefined) return [];
  const values = Array.isArray(raw) ? raw : [raw];
  return values.map(parseWikiLink);
}
