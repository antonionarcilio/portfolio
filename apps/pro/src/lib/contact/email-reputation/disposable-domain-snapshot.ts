import 'server-only';

import { z } from 'zod';

import snapshotJson from './disposable-email-domains.json';

/** Mesmo piso do script de atualização: menos que isso indica um snapshot corrompido. */
const MINIMUM_DOMAIN_COUNT = 1_000;

const snapshotSchema = z.strictObject({
  source: z.url(),
  fetchedAt: z.iso.datetime(),
  domains: z.array(z.string().min(1)).min(MINIMUM_DOMAIN_COUNT),
});

/**
 * Domínios do snapshot versionado, gerado por `scripts/update-disposable-email-domains.mts`. Validado ao
 * carregar porque é um arquivo editável à mão: um JSON quebrado deve falhar alto, não liberar todo e-mail.
 * @example new Set(loadDisposableDomainSnapshot())
 */
export function loadDisposableDomainSnapshot(): readonly string[] {
  const parsed = snapshotSchema.safeParse(snapshotJson);
  if (parsed.success) return parsed.data.domains;
  throw new Error(
    `Invalid disposable-email-domains.json (${parsed.error.issues[0]?.message}); ` +
      `expected { source: url, fetchedAt: ISO date, domains: string[${MINIMUM_DOMAIN_COUNT}+] }`,
  );
}
