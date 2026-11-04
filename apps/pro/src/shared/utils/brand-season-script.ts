/** Atributo do <html> que o script abaixo preenche e o CSS da logo lê. */
export const BRAND_SEASON_ATTRIBUTE = 'data-season';

/** Fuso do público-alvo: o mês de evento vira à meia-noite de Brasília, não de UTC. */
const BRAND_SEASON_TIME_ZONE = 'America/Sao_Paulo';

type BrandSeason = 'halloween' | 'christmas';

/** Mês (1–12, no fuso acima) → estação. Fonte única: o script inline e `resolveBrandSeason` leem daqui. */
const BRAND_SEASON_BY_MONTH: Record<number, BrandSeason> = { 10: 'halloween', 12: 'christmas' };

/** Estação ativa em `now`, ou `null` fora de outubro/dezembro (vale a logo padrão). */
export function resolveBrandSeason(now: Date): BrandSeason | null {
  const month = Number(
    new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: BRAND_SEASON_TIME_ZONE }).format(now),
  );
  return BRAND_SEASON_BY_MONTH[month] ?? null;
}

/**
 * Script inline para o <head>: marca o <html> com `data-season="halloween"` em outubro ou
 * `"christmas"` em dezembro (dias 01 a 31); nos demais meses não marca nada e vale a logo padrão.
 * Só cobre o carregamento completo da página: trocar o segmento `[locale]` substitui o <html> e
 * apaga o atributo, então `BrandSeasonSync` o reaplica no cliente. Roda antes da primeira pintura, então a página segue 100% estática (sem `revalidate`) e a
 * troca acontece na meia-noite de Brasília. Se falhar (ex.: sem Intl), cai na logo padrão.
 * @example <script dangerouslySetInnerHTML={{ __html: BRAND_SEASON_SCRIPT }} />
 */
export const BRAND_SEASON_SCRIPT = `(function(){try{
var month=Number(new Intl.DateTimeFormat('en-US',{month:'numeric',timeZone:'${BRAND_SEASON_TIME_ZONE}'}).format(new Date()));
var season=${JSON.stringify(BRAND_SEASON_BY_MONTH)}[month]||'';
if(season)document.documentElement.setAttribute('${BRAND_SEASON_ATTRIBUTE}',season);
}catch(error){}})();`;
