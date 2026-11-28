import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { loadContactFlowMessages, withContactFlowMessages } from './contact-flow-messages';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const [baseMessages, contactFlowMessages] = await Promise.all([
    import(`../../messages/${locale}.json`).then((module) => module.default),
    loadContactFlowMessages(locale),
  ]);

  return {
    locale,
    messages: withContactFlowMessages(baseMessages, contactFlowMessages),
  };
});
