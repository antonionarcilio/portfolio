import 'server-only';

import { Resolver } from 'node:dns/promises';

import type { EmailCheckVerdict } from '@/features/contact/email-check-contract';

import { createDisposableDomainChecker, type DisposableDomainChecker } from './disposable-domain-checker';
import { loadDisposableDomainSnapshot } from './disposable-domain-snapshot';
import { ALLOWED_EMAIL_DOMAINS, EXTRA_BLOCKED_EMAIL_DOMAINS } from './email-domain-overrides';
import { createMailDomainResolver, type MailDomainResolver } from './mail-domain-resolver';

/** Recebe um e-mail já validado pelo schema (formato e tamanho) e devolve o veredito. */
export type ContactEmailChecker = (email: string) => Promise<EmailCheckVerdict>;

type EmailCheckerDependencies = { isDisposableDomain: DisposableDomainChecker; resolveMailDomain: MailDomainResolver };

/** Curto: a checagem roda no envio da etapa e no POST final — DNS lento não pode travar o visitante. */
const DNS_TIMEOUT_MILLISECONDS = 2_000;

function domainOf(email: string): string {
  return email.slice(email.lastIndexOf('@') + 1).toLowerCase();
}

/**
 * Lista de descartáveis primeiro (em memória, sem rede); depois o DNS. DNS indisponível libera (fail-open):
 * perder um lead real por instabilidade de rede custa mais que deixar passar um e-mail ruim.
 * @example const verdict = await createContactEmailChecker(dependencies)('ana@mailinator.com') // 'disposable'
 */
export function createContactEmailChecker({
  isDisposableDomain,
  resolveMailDomain,
}: EmailCheckerDependencies): ContactEmailChecker {
  return async (email) => {
    const domain = domainOf(email);
    if (isDisposableDomain(domain)) return 'disposable';
    return (await resolveMailDomain(domain)) === 'undeliverable' ? 'undeliverable' : 'accepted';
  };
}

let defaultEmailChecker: ContactEmailChecker | null = null;

/**
 * Checker com o snapshot versionado + ajustes locais e o DNS do sistema. Memorizado: o Set de ~10 mil domínios
 * é montado uma vez por instância do servidor, não a cada request.
 * @example const checkEmail = getDefaultContactEmailChecker();
 */
export function getDefaultContactEmailChecker(): ContactEmailChecker {
  defaultEmailChecker ??= createContactEmailChecker({
    isDisposableDomain: createDisposableDomainChecker({
      blockedDomains: [...loadDisposableDomainSnapshot(), ...EXTRA_BLOCKED_EMAIL_DOMAINS],
      allowedDomains: ALLOWED_EMAIL_DOMAINS,
    }),
    resolveMailDomain: createMailDomainResolver(new Resolver({ timeout: DNS_TIMEOUT_MILLISECONDS, tries: 1 })),
  });
  return defaultEmailChecker;
}
