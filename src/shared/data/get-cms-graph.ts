import 'server-only';

import matter from 'gray-matter';

import { fetchCmsFile } from '@/lib/github-cms/fetch-cms-file';
import { parseWikiLink, type WikiLink } from '@/lib/github-cms/parse-wikilink';
import { DEFAULT_LOCALE, type SupportedLocale } from '@/shared/i18n/locales';

export interface CmsNode {
  key: string;
  frontmatter: Record<string, unknown>;
}

export type CmsGraph = Map<string, CmsNode>;

const CMS_FETCH_CONCURRENCY = 6;

/** Mapeia em lotes de tamanho fixo — evita abrir dezenas de conexões simultâneas pro mesmo host (UND_ERR_CONNECT_TIMEOUT sob rajada). */
async function mapWithConcurrencyLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}

function rootFetchPath(locale: SupportedLocale): string {
  return locale === DEFAULT_LOCALE ? 'content/index.md' : `content/index.${locale}.md`;
}

/** Path final do arquivo a buscar: adiciona `.md` se ainda não tiver (tolera `.md` já presente no wikilink). */
function resolveWikiLinkPath(link: WikiLink): string {
  const withoutExtension = link.path.replace(/\.md$/, '');
  return `${withoutExtension}.md`;
}

/** Chave do nó no grafo: sem prefixo `content/`, sem `.md`, sem sufixo `/index`/`/index.en`. Root vira `""`. */
function normalizeKey(fetchPath: string): string {
  const withoutPrefix = fetchPath.replace(/^content\//, '').replace(/\.md$/, '');
  if (withoutPrefix === 'index' || withoutPrefix === 'index.en') return '';
  return withoutPrefix.replace(/\/index(\.en)?$/, '');
}

/** Chave de um wikilink no grafo — mesma normalização usada na travessia BFS. */
export function wikiLinkToKey(link: WikiLink): string {
  return normalizeKey(resolveWikiLinkPath(link));
}

/** Resolve os wikilinks de um campo do frontmatter (escalar ou lista) em nós do grafo, na ordem de origem — ignora links não resolvidos. */
export function resolveWikiLinks(graph: CmsGraph, raw: string | string[] | null | undefined): CmsNode[] {
  const values = raw === null || raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
  return values
    .map(tryParseWikiLink)
    .filter((link): link is WikiLink => link !== null)
    .map((link) => graph.get(wikiLinkToKey(link)))
    .filter((node): node is CmsNode => node !== undefined);
}

function tryParseWikiLink(value: unknown): WikiLink | null {
  if (typeof value !== 'string') return null;
  try {
    return parseWikiLink(value);
  } catch {
    return null;
  }
}

/** Extrai todos os wikilinks presentes nos campos do frontmatter (escalares ou listas). */
function extractWikiLinks(frontmatter: Record<string, unknown>): WikiLink[] {
  const links: WikiLink[] = [];
  for (const value of Object.values(frontmatter)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      const link = tryParseWikiLink(item);
      if (link) links.push(link);
    }
  }
  return links;
}

async function fetchRootFrontmatter(locale: SupportedLocale): Promise<Record<string, unknown>> {
  const text = (await fetchCmsFile(rootFetchPath(locale))) ?? (await fetchCmsFile(rootFetchPath(DEFAULT_LOCALE)));
  if (text === null) {
    throw new Error(`get-cms-graph: arquivo raiz não encontrado para locale ${locale}`);
  }
  return matter(text).data as Record<string, unknown>;
}

const graphCache = new Map<SupportedLocale, Promise<CmsGraph>>();

/**
 * Monta o grafo de conteúdo via BFS a partir do arquivo raiz (`content/index.md`),
 * seguindo os wikilinks presentes no frontmatter — só o que é alcançável a partir
 * do root entra no grafo (root é a única fonte de verdade da UI).
 *
 * Cacheado por locale para a vida do processo (não por request como o `cache()`
 * do React): em dev, sem isso, cada navegação refazia o BFS inteiro — dezenas de
 * fetches em paralelo pro mesmo host, o que estourava o limite de conexões
 * simultâneas do undici (UND_ERR_CONNECT_TIMEOUT). Agora só roda uma vez por
 * locale; para pegar conteúdo atualizado em dev, reinicie o servidor.
 */
export function getCmsGraph(locale: SupportedLocale): Promise<CmsGraph> {
  const cached = graphCache.get(locale);
  if (cached) return cached;
  const promise = buildCmsGraph(locale);
  graphCache.set(locale, promise);
  return promise;
}

async function buildCmsGraph(locale: SupportedLocale): Promise<CmsGraph> {
  const graph: CmsGraph = new Map();
  const rootFrontmatter = await fetchRootFrontmatter(locale);
  graph.set('', { key: '', frontmatter: rootFrontmatter });

  let frontier = extractWikiLinks(rootFrontmatter);

  while (frontier.length > 0) {
    const seenKeys = new Set(graph.keys());
    const toFetch = frontier.filter((link) => {
      const key = normalizeKey(resolveWikiLinkPath(link));
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
    const results = await mapWithConcurrencyLimit(toFetch, CMS_FETCH_CONCURRENCY, async (link) => {
      const fetchPath = resolveWikiLinkPath(link);
      const key = normalizeKey(fetchPath);
      const text = await fetchCmsFile(fetchPath);
      if (text === null) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[cms] wikilink não resolvido: ${fetchPath}`);
        }
        return null;
      }
      return { key, frontmatter: matter(text).data as Record<string, unknown> };
    });

    const nextFrontier: WikiLink[] = [];
    for (const node of results) {
      if (!node || graph.has(node.key)) continue;
      graph.set(node.key, node);
      nextFrontier.push(...extractWikiLinks(node.frontmatter));
    }
    frontier = nextFrontier;
  }

  return graph;
}
