/** Devolve `true` quando o domínio (ou um domínio pai dele) é de e-mail descartável. */
export type DisposableDomainChecker = (domain: string) => boolean;

type DomainLists = { blockedDomains: Iterable<string>; allowedDomains: Iterable<string> };

/**
 * O próprio domínio e cada domínio pai — serviços descartáveis criam subdomínios à vontade
 * ("x7.mailinator.com"), então bloquear só o nome exato deixaria passar quase tudo.
 * @example domainWithParents('a.b.mailinator.com') // ['a.b.mailinator.com', 'b.mailinator.com', 'mailinator.com', 'com']
 */
function domainWithParents(domain: string): string[] {
  const labels = domain.split('.');
  return labels.map((_, index) => labels.slice(index).join('.'));
}

/**
 * Checagem em memória (Set) contra a lista bloqueada; a lista liberada vence. Monte uma vez por instância.
 * @example const isDisposable = createDisposableDomainChecker({ blockedDomains, allowedDomains }); isDisposable('mailinator.com') // true
 */
export function createDisposableDomainChecker({
  blockedDomains,
  allowedDomains,
}: DomainLists): DisposableDomainChecker {
  const blocked = new Set(blockedDomains);
  const allowed = new Set(allowedDomains);
  return (domain) => {
    const candidates = domainWithParents(domain.toLowerCase());
    if (candidates.some((candidate) => allowed.has(candidate))) return false;
    return candidates.some((candidate) => blocked.has(candidate));
  };
}
