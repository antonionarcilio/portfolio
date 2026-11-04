'use client';
import { useLocale } from 'next-intl';
import { useLayoutEffect } from 'react';

import { BRAND_SEASON_ATTRIBUTE, resolveBrandSeason } from '@/shared/utils/brand-season-script';

/**
 * Reaplica `data-season` no <html> depois de uma troca de idioma. O script inline do <head> só
 * roda no carregamento completo; a troca de `[locale]` substitui o <html> e a logo sazonal
 * voltaria para a padrão. Layout effect para o atributo existir antes da pintura.
 * @example <BrandSeasonSync />
 */
export function BrandSeasonSync() {
  const locale = useLocale();

  useLayoutEffect(() => {
    const season = resolveBrandSeason(new Date());
    if (season) document.documentElement.setAttribute(BRAND_SEASON_ATTRIBUTE, season);
  }, [locale]);

  return null;
}
