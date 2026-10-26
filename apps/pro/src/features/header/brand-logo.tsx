const LOGO_ALT_TEXT = 'Antonio Mascarenhas';
const LOGO_TITLE_TEXT = 'Antônio Mascarenhas';

/**
 * Logomarca do header. Um único elemento: qual arte aparece é decidido só por CSS
 * (`data-season` do script inline do <head> + `data-theme`) — ver header/styles.css.
 * Assim o navegador baixa apenas a imagem da regra ativa e a página segue 100% estática.
 * @example <StickyHeader brandLogo={<BrandLogo />} />
 */
export function BrandLogo() {
  return <div role="img" aria-label={LOGO_ALT_TEXT} title={LOGO_TITLE_TEXT} className="brand-logo" />;
}
