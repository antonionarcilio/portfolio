/**
 * Atualiza o snapshot versionado de domínios de e-mail descartável
 * (`src/lib/contact/email-reputation/disposable-email-domains.json`).
 *
 * Por que um snapshot no repositório e não uma leitura em tempo de execução: a lista pública
 * (disposable-email-domains/disposable-email-domains) não é nossa — a URL pode mudar, o repositório pode sumir
 * ou ser comprometido. O site só lê o arquivo commitado; este script é a única porta de entrada de dados
 * novos, e só grava quando o conteúdo baixado passa nas checagens abaixo (formato de cada linha, tamanho
 * mínimo e encolhimento máximo em relação ao snapshot atual). Se todas as fontes falharem, o snapshot atual
 * continua valendo. Roda semanalmente no GitHub Actions (`update-disposable-email-domains.yml`), que abre um
 * PR com o relatório para revisão humana — nada entra em produção sem merge.
 *
 * Uso (Node 24+, roda TypeScript direto): `npx pnpm --filter pro update:disposable-domains [-- flags]`
 *   --dry-run         baixa, valida e mostra o diff, sem gravar o snapshot.
 *   --force           aceita um encolhimento acima do limite (limpeza grande e legítima na lista pública).
 *   --report=<arq>    grava o relatório em markdown (corpo do PR no workflow).
 */
import { readFile, writeFile } from 'node:fs/promises';

/** Em ordem de preferência: a fonte original e um espelho (jsDelivr) que serve o mesmo arquivo. */
const SOURCE_URLS: readonly string[] = [
  'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/refs/heads/main/disposable_email_blocklist.conf',
  'https://cdn.jsdelivr.net/gh/disposable-email-domains/disposable-email-domains@main/disposable_email_blocklist.conf',
];

const SNAPSHOT_URL = new URL('../src/lib/contact/email-reputation/disposable-email-domains.json', import.meta.url);
const FETCH_TIMEOUT_MILLISECONDS = 15_000;
/** Abaixo disso o arquivo baixado não é a lista (página de erro, arquivo truncado, repositório esvaziado). */
const MINIMUM_DOMAIN_COUNT = 1_000;
/** Encolher mais que 20% de uma vez exige `--force`: protege contra uma lista sabotada ou quebrada. */
const MAXIMUM_SHRINK_RATIO = 0.2;
/** Domínio em minúsculas (rótulos de até 63 caracteres, TLD com letras ou punycode). */
const DOMAIN_PATTERN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9-]{2,63}$/;
/** Quantos domínios adicionados/removidos o relatório lista por extenso. */
const REPORT_LIST_LIMIT = 100;

type DisposableDomainSnapshot = { source: string; fetchedAt: string; domains: string[] };
type CommandOptions = { isDryRun: boolean; isForced: boolean; reportPath: string | undefined };
type DomainDiff = { added: string[]; removed: string[] };

function readCommandOptions(argumentsList: readonly string[]): CommandOptions {
  const reportArgument = argumentsList.find((argument) => argument.startsWith('--report='));
  return {
    isDryRun: argumentsList.includes('--dry-run'),
    isForced: argumentsList.includes('--force'),
    reportPath: reportArgument?.slice('--report='.length) || undefined,
  };
}

function parseBlocklist(text: string): string[] {
  const lines = text
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith('#'));
  const invalid = lines.find((line) => !DOMAIN_PATTERN.test(line));
  if (invalid !== undefined) throw new Error(`Invalid blocklist line "${invalid}"; expected one domain per line`);
  if (lines.length < MINIMUM_DOMAIN_COUNT) {
    throw new Error(`Blocklist has ${lines.length} domains; expected at least ${MINIMUM_DOMAIN_COUNT}`);
  }
  return [...new Set(lines)].sort();
}

async function fetchBlocklist(url: string): Promise<string[]> {
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MILLISECONDS) });
  if (!response.ok) throw new Error(`GET ${url} answered ${response.status}; expected 200`);
  return parseBlocklist(await response.text());
}

async function fetchFromFirstWorkingSource(): Promise<{ source: string; domains: string[] }> {
  for (const source of SOURCE_URLS) {
    try {
      return { source, domains: await fetchBlocklist(source) };
    } catch (error) {
      console.error(JSON.stringify({ event: 'source_failed', source, reason: String(error) }));
    }
  }
  throw new Error(`Every source failed (${SOURCE_URLS.join(', ')}); the current snapshot was kept`);
}

async function readCurrentDomains(): Promise<string[]> {
  try {
    const snapshot = JSON.parse(await readFile(SNAPSHOT_URL, 'utf8')) as DisposableDomainSnapshot;
    return snapshot.domains;
  } catch {
    return [];
  }
}

function diffDomains(current: readonly string[], next: readonly string[]): DomainDiff {
  const currentSet = new Set(current);
  const nextSet = new Set(next);
  return {
    added: next.filter((domain) => !currentSet.has(domain)),
    removed: current.filter((domain) => !nextSet.has(domain)),
  };
}

function assertAcceptableShrink(currentCount: number, nextCount: number, isForced: boolean): void {
  const shrinkRatio = currentCount === 0 ? 0 : (currentCount - nextCount) / currentCount;
  if (shrinkRatio <= MAXIMUM_SHRINK_RATIO || isForced) return;
  throw new Error(
    `Blocklist shrank from ${currentCount} to ${nextCount} domains (${Math.round(shrinkRatio * 100)}%); ` +
      `expected at most ${MAXIMUM_SHRINK_RATIO * 100}% — rerun with --force if the drop is legitimate`,
  );
}

function domainListSection(title: string, domains: readonly string[]): string {
  if (domains.length === 0) return `### ${title}: 0\n`;
  const listed = domains.slice(0, REPORT_LIST_LIMIT).map((domain) => `- \`${domain}\``);
  const hidden = domains.length - listed.length;
  return [`### ${title}: ${domains.length}`, ...listed, hidden > 0 ? `- … e mais ${hidden}` : ''].join('\n');
}

/** Relatório para quem revisa: removidos voltam a ser aceitos no formulário; adicionados podem gerar falso positivo. */
function buildReport(source: string, currentCount: number, nextCount: number, diff: DomainDiff): string {
  return [
    '## Atualização da lista de e-mails descartáveis',
    `Fonte: ${source}`,
    `Domínios: ${currentCount} → ${nextCount}`,
    'Revise os **removidos** (voltam a ser aceitos no contato) e confira se algum **adicionado** é um provedor real ' +
      'usado por clientes — nesse caso, inclua-o em `ALLOWED_EMAIL_DOMAINS` (`email-domain-overrides.ts`).',
    domainListSection('Adicionados', diff.added),
    domainListSection('Removidos', diff.removed),
  ].join('\n\n');
}

async function writeSnapshot(source: string, domains: string[]): Promise<void> {
  const snapshot: DisposableDomainSnapshot = { source, fetchedAt: new Date().toISOString(), domains };
  await writeFile(SNAPSHOT_URL, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function updateSnapshot({ isDryRun, isForced, reportPath }: CommandOptions): Promise<void> {
  const { source, domains } = await fetchFromFirstWorkingSource();
  const current = await readCurrentDomains();
  assertAcceptableShrink(current.length, domains.length, isForced);
  const diff = diffDomains(current, domains);
  const report = buildReport(source, current.length, domains.length, diff);
  console.log(report);
  if (reportPath) await writeFile(reportPath, `${report}\n`);
  if (diff.added.length === 0 && diff.removed.length === 0) return console.log('\nSnapshot already up to date.');
  if (isDryRun) return console.log('\n--dry-run: snapshot not written.');
  await writeSnapshot(source, domains);
  console.log('\nSnapshot written.');
}

await updateSnapshot(readCommandOptions(process.argv.slice(2)));
