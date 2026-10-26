/** Atributo do <html> que o script abaixo preenche e o CSS da logo lê. */
export const BRAND_SEASON_ATTRIBUTE = 'data-season';

/** Fuso do público-alvo: o mês de evento vira à meia-noite de Brasília, não de UTC. */
const BRAND_SEASON_TIME_ZONE = 'America/Sao_Paulo';

const OCTOBER = 10;
const DECEMBER = 12;

/**
 * Script inline para o <head>: marca o <html> com `data-season="halloween"` em outubro ou
 * `"christmas"` em dezembro (dias 01 a 31); nos demais meses não marca nada e vale a logo padrão.
 * Roda antes da primeira pintura, então a página segue 100% estática (sem `revalidate`) e a
 * troca acontece na meia-noite de Brasília. Se falhar (ex.: sem Intl), cai na logo padrão.
 * @example <script dangerouslySetInnerHTML={{ __html: BRAND_SEASON_SCRIPT }} />
 */
export const BRAND_SEASON_SCRIPT = `(function(){try{
var month=Number(new Intl.DateTimeFormat('en-US',{month:'numeric',timeZone:'${BRAND_SEASON_TIME_ZONE}'}).format(new Date()));
var season=month===${OCTOBER}?'halloween':month===${DECEMBER}?'christmas':'';
if(season)document.documentElement.setAttribute('${BRAND_SEASON_ATTRIBUTE}',season);
}catch(error){}})();`;
