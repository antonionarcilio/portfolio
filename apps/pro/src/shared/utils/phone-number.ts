import {
  AsYouType,
  getCountryCallingCode,
  isValidPhoneNumber,
  validatePhoneNumberLength,
  type CountryCode,
} from 'libphonenumber-js';

/**
 * Única porta de entrada do `libphonenumber-js` no app (metadados `min`, o padrão: valida o tamanho por país e um
 * padrão básico dos dígitos). Números são guardados em E.164 (`+5511987654321`), sem depender do idioma da página;
 * o país "de casa" só decide como um número digitado sem "+" é lido e como ele aparece na caixa.
 */
export type PhoneCountry = CountryCode;

/** E.164: "+" e no máximo 15 dígitos (código do país incluído). */
const E164_MAXIMUM_DIGITS = 15;

const digitsOf = (text: string): string => text.replace(/\D/g, '');

const isInternationalInput = (text: string): boolean => text.trim().startsWith('+');

/** E.164 (parcial enquanto o visitante digita) de um texto digitado; sem "+", lido como número de `homeCountry`. */
function toE164(text: string, homeCountry: PhoneCountry): string {
  const digits = digitsOf(text);
  if (isInternationalInput(text)) return `+${digits}`;
  if (!digits) return '';
  const formatter = new AsYouType(homeCountry);
  formatter.input(digits);
  return formatter.getNumberValue() ?? `+${getCountryCallingCode(homeCountry)}${digits}`;
}

/**
 * Limitador: `true` quando o número já passou do tamanho que o país permite (ou dos 15 dígitos do E.164) — a máscara
 * descarta o dígito em vez de aceitar um número que nunca seria válido.
 * @example isPhoneTooLong('+55119876543210') // true (celular brasileiro tem 11 dígitos)
 */
export function isPhoneTooLong(value: string): boolean {
  if (digitsOf(value).length > E164_MAXIMUM_DIGITS) return true;
  return value.length > 1 && validatePhoneNumberLength(value) === 'TOO_LONG';
}

/**
 * Valor a guardar para o que o visitante digitou: E.164 (parcial enquanto digita), vazio sem dígitos e "+" quando
 * só o "+" foi digitado. `undefined` quando o novo dígito passaria do tamanho máximo (limitador).
 * @example phoneValueOf('(11) 98765-4321', 'BR') // '+5511987654321'
 */
export function phoneValueOf(text: string, homeCountry: PhoneCountry): string | undefined {
  if (isInternationalInput(text) && !digitsOf(text)) return '+';
  const value = toE164(text, homeCountry);
  return isPhoneTooLong(value) ? undefined : value;
}

/**
 * Número como o visitante lê. `national` mostra os números do país de casa sem o código ("(11) 98765-4321"); os de
 * outros países, e o estilo `international`, ficam com "+" e código ("+44 20 7946 0958").
 * @example formatPhone('+5511987654321', 'BR', 'national') // '(11) 98765-4321'
 */
export function formatPhone(value: string, homeCountry: PhoneCountry, style: 'national' | 'international'): string {
  if (!value || value === '+') return value;
  const international = new AsYouType();
  const internationalText = international.input(value);
  const isHome = international.getCallingCode() === getCountryCallingCode(homeCountry);
  if (style === 'international' || !isHome) return internationalText;
  return new AsYouType(homeCountry).input(international.getNationalNumber());
}

/**
 * Número no formato internacional, sem depender do país de casa — o resumo da conversa e o e-mail de quem atende.
 * @example formatPhoneInternational('+5511987654321') // '+55 11 98765-4321'
 */
export function formatPhoneInternational(value: string): string {
  return value ? new AsYouType().input(value) : value;
}

/**
 * Número completo e válido para o país do código (E.164 com "+"). Roda no chat e no servidor.
 * @example isValidPhone('+5511987654321') // true
 */
export function isValidPhone(value: string): boolean {
  return isInternationalInput(value) && isValidPhoneNumber(value);
}
