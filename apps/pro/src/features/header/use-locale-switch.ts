'use client';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { beginLocaleSwitch } from '@/shared/utils/locale-switch-state';

/**
 * Troca o idioma mantendo a rota atual. `scroll: false` — trocar de idioma não é navegar para
 * outra página; o usuário continua lendo do mesmo ponto (ver AGENTS.md, "Efeito de troca de idioma").
 * @example const { currentLocale, switchLocale } = useLocaleSwitch(); switchLocale('en', closePanel);
 * @param delayMilliseconds adia a navegação (e o scramble) para depois de `onSwitched`, p.ex. até um drawer fechar.
 */
export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (locale: string, onSwitched?: () => void, delayMilliseconds = 0) => {
    if (locale === currentLocale) return;
    const navigate = () => {
      beginLocaleSwitch();
      router.push(pathname, { locale, scroll: false });
    };
    if (delayMilliseconds === 0) {
      navigate();
      onSwitched?.();
      return;
    }
    // `onSwitched` roda antes: é ele que inicia o fechamento que a navegação precisa esperar.
    onSwitched?.();
    window.setTimeout(navigate, delayMilliseconds);
  };

  return { currentLocale, switchLocale };
}
