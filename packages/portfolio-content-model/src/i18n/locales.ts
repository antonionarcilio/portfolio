/**
 * Configuração central de i18n para todos os portfolios.
 *
 * Ao adicionar um novo locale:
 *  1. Inclua o código aqui em `SUPPORTED_LOCALES`.
 *  2. Adicione o conteúdo correspondente no repositório do CMS (`portfolio-cms`).
 *  3. O webhook de revalidação (`src/app/api/revalidate/route.ts`) deriva os paths
 *     automaticamente a partir desta lista — nenhuma outra alteração é necessária.
 */
export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
