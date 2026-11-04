/**
 * Higienização do texto livre do formulário de contato. Roda no cliente (erro no campo) e no servidor
 * (a validação do cliente não protege a rota). É defesa em profundidade: o e-mail já escapa HTML via React
 * Email e não há banco de dados, então o objetivo é barrar spam, phishing e tentativas de injeção.
 */

/**
 * Faixas de code points removidas: controle (exceto tab, \n e \r), DEL, zero-width/marcas bidi,
 * separadores de linha/parágrafo Unicode, joiners invisíveis e BOM. Por faixa numérica, e não regex,
 * para o arquivo não carregar caracteres invisíveis literais.
 */
const INVISIBLE_CODE_POINT_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x00, 0x08],
  [0x0b, 0x0c],
  [0x0e, 0x1f],
  [0x7f, 0x7f],
  [0x200b, 0x200f],
  [0x2028, 0x202e],
  [0x2060, 0x2064],
  [0xfeff, 0xfeff],
];

function isInvisibleCharacter(character: string): boolean {
  const codePoint = character.codePointAt(0) ?? 0;
  return INVISIBLE_CODE_POINT_RANGES.some(([first, last]) => codePoint >= first && codePoint <= last);
}

function removeInvisibleCharacters(text: string): string {
  return Array.from(text)
    .filter((character) => !isInvisibleCharacter(character))
    .join('');
}

const LINK_PATTERNS: RegExp[] = [
  /\b(?:https?|ftp|file|mailto|tel|sms|data|javascript|vbscript):/i,
  /(?:^|[\s(<\[])\/\/[a-z0-9-]+\./i,
  /\bwww\s*\./i,
  /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|dev|app|br|co|me|xyz|info|biz|site|online|shop|store|link|click|top|ru|cn|tk|ly|gl|to)\b/i,
];

const MARKUP_PATTERNS: RegExp[] = [
  /<\s*\/?\s*[a-z!][^>]*>?/i,
  /&(?:#x?[0-9a-f]+|lt|gt|quot);/i,
  /\bon[a-z]+\s*=/i,
  /\{\{[\s\S]*\}\}|\$\{[\s\S]*\}/,
];

/** Padrões inequívocos de ataque — palavras soltas como "select" ou "drop" não bloqueiam. */
const INJECTION_PATTERNS: RegExp[] = [
  /\bunion\s+(?:all\s+)?select\b/i,
  /;\s*(?:drop|delete|truncate|alter|insert|update)\s+/i,
  /['"]\s*(?:or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /\b(?:or|and)\s+1\s*=\s*1\b/i,
  /(?:^|[\s;])--\s|\/\*[\s\S]*\*\//,
  /\.\.[/\\]|%2e%2e|%00/i,
  /(?:\$|\|\||&&)\s*\(|`[^`]*`/,
];

/**
 * Normaliza (NFKC), remove caracteres invisíveis, unifica quebras de linha e colapsa espaços repetidos.
 * Mantém no máximo uma linha em branco seguida.
 * @example normalizeContactText('  Olá   mundo ') // 'Olá mundo'
 */
export function normalizeContactText(text: string): string {
  return removeInvisibleCharacters(text.normalize('NFKC'))
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export const containsLink = (text: string): boolean => matchesAny(text, LINK_PATTERNS);

export const containsMarkup = (text: string): boolean => matchesAny(text, MARKUP_PATTERNS);

export const containsInjectionPattern = (text: string): boolean => matchesAny(text, INJECTION_PATTERNS);
