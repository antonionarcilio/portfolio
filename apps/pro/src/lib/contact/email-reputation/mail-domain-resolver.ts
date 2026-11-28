import 'server-only';

import type { Resolver } from 'node:dns/promises';

/** `unknown`: o DNS não respondeu a tempo ou falhou — quem chama decide (o contato libera, fail-open). */
export type MailDomainStatus = 'deliverable' | 'undeliverable' | 'unknown';

export type MailDomainResolver = (domain: string) => Promise<MailDomainStatus>;

/** Consultas usadas; o `Resolver` do `node:dns/promises` (com `timeout`) satisfaz o tipo. */
export type DnsLookups = Pick<Resolver, 'resolveMx' | 'resolve4' | 'resolve6'>;

/** Códigos do `node:dns` para "o nome não existe" e "o nome existe, sem esse tipo de registro". */
const NAME_NOT_FOUND = 'ENOTFOUND';
const NO_RECORDS = 'ENODATA';

function dnsErrorCode(error: unknown): string | undefined {
  return error instanceof Error && 'code' in error && typeof error.code === 'string' ? error.code : undefined;
}

function isMissingRecord(error: unknown): boolean {
  const code = dnsErrorCode(error);
  return code === NAME_NOT_FOUND || code === NO_RECORDS;
}

/**
 * Sem MX, a RFC 5321 (5.1) manda entregar no endereço do domínio ("MX implícito") — registro A ou AAAA.
 * Qualquer um dos dois basta; só é `undeliverable` quando ambos confirmam que não existem.
 */
async function resolveImplicitMx(lookups: DnsLookups, domain: string): Promise<MailDomainStatus> {
  const lookupsByFamily = await Promise.allSettled([lookups.resolve4(domain), lookups.resolve6(domain)]);
  const hasAddress = lookupsByFamily.some((lookup) => lookup.status === 'fulfilled' && lookup.value.length > 0);
  if (hasAddress) return 'deliverable';
  const confirmsMissing = lookupsByFamily.every(
    (lookup) => lookup.status === 'fulfilled' || isMissingRecord(lookup.reason),
  );
  return confirmsMissing ? 'undeliverable' : 'unknown';
}

/** "Null MX" (RFC 7505): um único MX vazio declara que o domínio não recebe e-mail. */
function isNullMx(records: Array<{ exchange: string }>): boolean {
  return records.every((record) => record.exchange === '' || record.exchange === '.');
}

/**
 * Diz se o domínio do e-mail recebe mensagens: MX válido, ou MX implícito (registro A ou AAAA). Pega erro de digitação
 * ("gmial.com") e domínios inventados — a lista de descartáveis não cobre esses casos.
 * @example const resolveMailDomain = createMailDomainResolver(new Resolver({ timeout: 2000, tries: 1 }));
 */
export function createMailDomainResolver(lookups: DnsLookups): MailDomainResolver {
  return async (domain) => {
    try {
      const records = await lookups.resolveMx(domain);
      if (records.length === 0) return resolveImplicitMx(lookups, domain);
      return isNullMx(records) ? 'undeliverable' : 'deliverable';
    } catch (error) {
      const code = dnsErrorCode(error);
      if (code === NAME_NOT_FOUND) return 'undeliverable';
      return code === NO_RECORDS ? resolveImplicitMx(lookups, domain) : 'unknown';
    }
  };
}
