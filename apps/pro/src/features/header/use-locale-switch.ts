'use client';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { beginLocaleSwitch } from '@/shared/utils/locale-switch-state';

/**
 * Troca o idioma mantendo a rota atual. `scroll: false` — trocar de idioma não é navegar para
 * outra página; o usuário continua lendo do mesmo ponto (ver AGENTS.md, "Efeito de troca de idioma").
 * @example const { currentLocale, switchLocale } = useLocaleSwitch(); switchLocale('en', closePanel);
 */
export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (locale: string, onSwitched?: () => void) => {
    if (locale === currentLocale) return;
    beginLocaleSwitch();
    router.push(pathname, { locale, scroll: false });
    onSwitched?.();
  };

  return { currentLocale, switchLocale };
}
