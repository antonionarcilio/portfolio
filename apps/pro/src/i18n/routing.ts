import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'portfolio-content-model';

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  // O HTML já declara hreflang (+ x-default) via metadata; o cabeçalho `Link` automático duplicaria as entradas.
  alternateLinks: false,
});
