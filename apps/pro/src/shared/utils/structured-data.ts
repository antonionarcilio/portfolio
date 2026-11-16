import { env } from '@/env';
import { getPathname } from '@/i18n/navigation';
import type { routing } from '@/i18n/routing';

type SupportedLocale = (typeof routing.locales)[number];
type JsonLdNode = Record<string, unknown>;

export type PersonReference = {
  name: string;
  role: string;
  email: string;
  /** Localização do CMS no formato "Cidade, UF - País" (ex.: "São Luís, MA - Brasil"). */
  location: string;
  profileUrls: string[];
};

/** URL absoluta e canônica de uma página, a mesma usada em canonical/sitemap. */
export function buildAbsoluteUrl(locale: SupportedLocale, pathname: string): string {
  return `${env.MY_DOMAIN}${getPathname({ locale, href: pathname })}`;
}

// `@id` estáveis (independentes de locale) ligam Person, WebSite, ProfilePage e CreativeWork em um só grafo.
export function personId(): string {
  return `${env.MY_DOMAIN}/#person`;
}

export function websiteId(): string {
  return `${env.MY_DOMAIN}/#website`;
}

const LOCATION_PATTERN = /^([^,]+),\s*([^-]+?)\s*-\s*(.+)$/;

/** Converte "Cidade, UF - País" em PostalAddress; se o formato divergir, usa o texto inteiro como cidade. */
function buildAddressNode(location: string): JsonLdNode {
  const match = LOCATION_PATTERN.exec(location.trim());
  if (!match) return { '@type': 'PostalAddress', addressLocality: location.trim() };
  const [, locality, region, country] = match;
  return { '@type': 'PostalAddress', addressLocality: locality, addressRegion: region, addressCountry: country };
}

export function buildPersonNode(locale: SupportedLocale, person: PersonReference): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': personId(),
    name: person.name,
    jobTitle: person.role,
    // schema.org espera o endereço puro, sem o prefixo `mailto:` que o CMS entrega para os links.
    email: person.email.replace(/^mailto:/i, ''),
    address: buildAddressNode(person.location),
    url: buildAbsoluteUrl(locale, '/'),
    sameAs: person.profileUrls,
  };
}

export function buildWebsiteNode(locale: SupportedLocale, siteName: string): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    name: siteName,
    url: buildAbsoluteUrl(locale, '/'),
    inLanguage: locale,
    publisher: { '@id': personId() },
  };
}

export function buildProfilePageNode(locale: SupportedLocale, title: string): JsonLdNode {
  return {
    '@type': 'ProfilePage',
    name: title,
    url: buildAbsoluteUrl(locale, '/about'),
    inLanguage: locale,
    isPartOf: { '@id': websiteId() },
    mainEntity: { '@id': personId() },
  };
}

export type CreativeWorkInput = {
  locale: SupportedLocale;
  slug: string;
  name: string;
  description: string;
  startDate: string;
  keywords: string[];
  imageUrl?: string;
};

export function buildCreativeWorkNode(input: CreativeWorkInput): JsonLdNode {
  const { locale, slug, name, description, startDate, keywords, imageUrl } = input;
  return {
    '@type': 'CreativeWork',
    name,
    description,
    url: buildAbsoluteUrl(locale, `/works/${slug}`),
    inLanguage: locale,
    dateCreated: startDate,
    keywords,
    ...(imageUrl ? { image: imageUrl } : {}),
    author: { '@id': personId() },
    isPartOf: { '@id': websiteId() },
  };
}

export function buildContactPageNode(locale: SupportedLocale, title: string): JsonLdNode {
  return {
    '@type': 'ContactPage',
    name: title,
    url: buildAbsoluteUrl(locale, '/contact'),
    inLanguage: locale,
    isPartOf: { '@id': websiteId() },
    mainEntity: { '@id': personId() },
  };
}

export type BreadcrumbStep = { name: string; pathname: string };

export function buildBreadcrumbNode(locale: SupportedLocale, steps: BreadcrumbStep[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: steps.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: buildAbsoluteUrl(locale, step.pathname),
    })),
  };
}

export type CollectionItem = { slug: string; name: string };

/** Índice de projetos: `ItemList` com a URL de cada `/works/<slug>`, na ordem exibida na página. */
export function buildCollectionPageNode(locale: SupportedLocale, title: string, items: CollectionItem[]): JsonLdNode {
  return {
    '@type': 'CollectionPage',
    name: title,
    url: buildAbsoluteUrl(locale, '/works'),
    inLanguage: locale,
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: buildAbsoluteUrl(locale, `/works/${item.slug}`),
      })),
    },
  };
}

/** Embrulha nós em um único documento `@graph`, pronto para `serializeJsonLd`. */
export function buildJsonLdGraph(nodes: JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
