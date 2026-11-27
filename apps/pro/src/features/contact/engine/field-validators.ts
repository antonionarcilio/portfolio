import { z } from 'zod';

import { isValidPhone } from '@/shared/utils/phone-number';

import {
  containsExplicitLink,
  containsInjectionPattern,
  containsLink,
  containsMarkup,
  normalizeContactText,
} from '../contact-text-sanitizer';
import type { FieldValidator } from './flow-types';

/**
 * Chaves de `pro.contactChat.errors`. Os validadores devolvem a chave como `message` e o compositor
 * traduz — assim o schema não depende de `next-intl`.
 */
export const CHAT_ERROR_KEYS = [
  'required',
  'tooLong',
  'nameInvalid',
  'emailInvalid',
  'emailDisposable',
  'emailUndeliverable',
  'urlInvalid',
  'phoneInvalid',
  'amountInvalid',
  'linksNotAllowed',
  'contentNotAllowed',
] as const;

export type ChatErrorKey = (typeof CHAT_ERROR_KEYS)[number];

export function isChatErrorKey(message: string): message is ChatErrorKey {
  return (CHAT_ERROR_KEYS as readonly string[]).includes(message);
}

const error = (key: ChatErrorKey): string => key;

/** Letras de qualquer idioma (com acento), espaço, apóstrofo, ponto e hífen — "D'Ávila", "Jr.", "Ana-Maria". */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;
/** Telefone/WhatsApp em E.164 (o que a máscara guarda): "+" e de 8 a 15 dígitos, código do país incluído. */
const E164_PATTERN = /^\+\d{8,15}$/;

/**
 * Teto de cada tipo de campo — também vira o `maxLength` do HTML (ver `contact-fields.ts`). E-mail: limite
 * da RFC 5321; URL: o que navegadores e servidores aceitam com folga; telefone: E.164 ("+" e 15 dígitos).
 */
export const FIELD_MAXIMUM_LENGTHS = { name: 100, email: 254, url: 2048, phone: 16 } as const;

const normalizedText = z.string().transform(normalizeContactText);

/**
 * Barra links, marcação e padrões de injeção. `isLink` decide o que conta como link: no texto livre, qualquer
 * `palavra.tld`; em nomes curtos (empresa, cargo), só endereços explícitos.
 */
function unsafeContentCheck(isLink: (text: string) => boolean) {
  return (text: string, context: z.RefinementCtx): void => {
    if (isLink(text)) context.addIssue({ code: 'custom', message: error('linksNotAllowed') });
    else if (containsMarkup(text) || containsInjectionPattern(text))
      context.addIssue({ code: 'custom', message: error('contentNotAllowed') });
  };
}

/**
 * Aplica "obrigatório" ou "opcional" (vazio passa direto) em cima do validador do conteúdo. Repassa só a
 * `message` de cada falha do conteúdo, que é a chave de erro — um `z.union` embrulharia a chave num
 * `invalid_union` genérico.
 */
function withPresence(required: boolean, content: z.ZodType<string, string>): FieldValidator {
  return normalizedText.transform((text, context) => {
    if (text.length === 0) {
      if (required) context.addIssue({ code: 'custom', message: error('required') });
      return text;
    }
    const result = content.safeParse(text);
    if (result.success) return result.data;
    result.error.issues.forEach((issue) => context.addIssue({ code: 'custom', message: issue.message }));
    return z.NEVER;
  });
}

/**
 * Texto livre (uma ou várias linhas), sem links, marcação nem padrões de injeção.
 * @example freeText({ required: true, maximumLength: 2000 })
 */
export function freeText(options: { required: boolean; maximumLength: number }): FieldValidator {
  const content = z.string().max(options.maximumLength, error('tooLong')).superRefine(unsafeContentCheck(containsLink));
  return withPresence(options.required, content);
}

/**
 * Nome curto de uma linha (empresa, cargo): como `freeText`, mas aceita nomes com cara de domínio
 * ("Booking.com", "Desenvolvedor ASP.NET") — só barra endereços explícitos (`https://`, `www.`).
 * @example organizationText({ required: true, maximumLength: 120 })
 */
export function organizationText(options: { required: boolean; maximumLength: number }): FieldValidator {
  const content = z
    .string()
    .max(options.maximumLength, error('tooLong'))
    .superRefine(unsafeContentCheck(containsExplicitLink));
  return withPresence(options.required, content);
}

/** Nome ou apelido (até 100 caracteres). @example personName({ required: true }) */
export function personName(options: { required: boolean }): FieldValidator {
  return withPresence(
    options.required,
    z.string().max(FIELD_MAXIMUM_LENGTHS.name, error('nameInvalid')).regex(NAME_PATTERN, error('nameInvalid')),
  );
}

/**
 * E-mail (até 254 caracteres), em minúsculas — a mesma pessoa não vira dois contatos por causa da caixa.
 * Formato só: descartável e domínio sem servidor de e-mail são conferidos no BFF (`email-check-contract.ts`).
 * @example emailAddress({ required: true })
 */
export function emailAddress(options: { required: boolean }): FieldValidator {
  return withPresence(
    options.required,
    z
      .string()
      .max(FIELD_MAXIMUM_LENGTHS.email, error('emailInvalid'))
      .toLowerCase()
      .pipe(z.email(error('emailInvalid'))),
  );
}

/**
 * Endereço http(s). Aceita sem protocolo ("app.exemplo.com") e completa com https://. O teto vale para o valor
 * JÁ com protocolo: o servidor revalida o que o chat guardou, e os dois precisam concordar.
 */
export function websiteAddress(options: { required: boolean }): FieldValidator {
  const content = z
    .string()
    .transform((text) => (/^https?:\/\//i.test(text) ? text : `https://${text}`))
    .pipe(z.string().max(FIELD_MAXIMUM_LENGTHS.url, error('urlInvalid')))
    .pipe(z.url({ protocol: /^https?$/, error: error('urlInvalid') }));
  return withPresence(options.required, content);
}

/** Valor inteiro só com dígitos, sem zero à esquerda: "15000". Separadores de milhar só na exibição. */
const AMOUNT_PATTERN = /^[1-9]\d*$/;

/**
 * Valor de investimento só com números (o campo `amount` já descarta o resto ao digitar; aqui o servidor garante),
 * maior que zero e com até `maximumDigits` dígitos. A moeda vem do prefixo (`currencyCode`).
 * @example budgetAmount({ required: false, maximumDigits: 12 }).parse('15000') // '15000'
 */
export function budgetAmount(options: { required: boolean; maximumDigits: number }): FieldValidator {
  const content = z.string().max(options.maximumDigits, error('tooLong')).regex(AMOUNT_PATTERN, error('amountInvalid'));
  return withPresence(options.required, content);
}

/**
 * Valor como o visitante leu: dígitos agrupados no padrão da moeda — "15.000" em real, "15,000" em dólar.
 * @example formatAmount('15000', 'BRL') // '15.000'
 */
export function formatAmount(digits: string, code: CurrencyCode): string {
  return new Intl.NumberFormat(AMOUNT_LOCALE_BY_CURRENCY[code]).format(Number(digits));
}

/** Moedas que o chat sabe mostrar (ISO 4217); símbolo e nome vêm de `fields.<id>.currency.options.<código>`. */
export const CURRENCY_CODES = ['BRL', 'USD'] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/** Agrupamento de milhar de cada moeda na exibição ("R$ 15.000", "US$ 15,000"). */
const AMOUNT_LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = { BRL: 'pt-BR', USD: 'en-US' };

/**
 * Código de moeda de uma lista fechada — nunca texto livre: qualquer outro valor falha. Vazio (prefixo nunca
 * tocado, ou sessão salva antes de a moeda existir) vira a primeira da lista.
 * @example currencyCode(['BRL', 'USD']).parse('') // 'BRL'
 */
export function currencyCode(codes: readonly [CurrencyCode, ...CurrencyCode[]]): FieldValidator {
  return z
    .string()
    .transform((text) => text.trim() || codes[0])
    .pipe(z.enum(codes, error('contentNotAllowed')));
}

/**
 * Telefone ou WhatsApp em E.164 (`+5511987654321`), como a máscara do chat guarda: número completo e válido para o
 * país do código (`libphonenumber-js`, ver `shared/utils/phone-number.ts`). Roda igual no chat e no servidor.
 * @example phoneNumber({ required: false }).parse('+5511987654321') // '+5511987654321'
 */
export function phoneNumber(options: { required: boolean }): FieldValidator {
  const content = z
    .string()
    .max(FIELD_MAXIMUM_LENGTHS.phone, error('phoneInvalid'))
    .regex(E164_PATTERN, error('phoneInvalid'))
    .refine(isValidPhone, error('phoneInvalid'));
  return withPresence(options.required, content);
}
