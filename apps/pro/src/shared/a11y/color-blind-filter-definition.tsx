/**
 * Define o filtro SVG que `html.a11y-color-blind-filter` referencia (ver `shared/styles/a11y.css`).
 * É uma daltonização para deuteranopia: o que o olho perde na diferença vermelho/verde é
 * deslocado para verde e azul. Cada linha da matriz soma 1, então branco e cinza não mudam.
 * @example <ColorBlindFilterDefinition />
 */
const DEUTERANOPIA_CORRECTION_MATRIX = [
  '1 0 0 0 0',
  '-0.4375 1.4375 0 0 0',
  '0.2625 -0.5625 1.3 0 0',
  '0 0 0 1 0',
].join(' ');

export function ColorBlindFilterDefinition() {
  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
      <filter id="a11y-color-blind-correction" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={DEUTERANOPIA_CORRECTION_MATRIX} />
      </filter>
    </svg>
  );
}
