'use client';

import { SVGInjector } from '@tanem/svg-injector';
import DOMPurify from 'dompurify';
import { useEffect, useRef } from 'react';

// ─── helpers ──────────────────────────────────────────────────────────────────

function _sanitize(svg: SVGSVGElement) {
  DOMPurify.sanitize(svg, {
    IN_PLACE: true,
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject'],
  });
}

/**
 * Converts every fill/stroke in the SVG to `currentColor` so the CSS `color`
 * property on the wrapper element controls the icon's color.
 *
 * Sets fill/stroke on the root <svg> so icons that have no explicit attributes
 * on child elements (e.g. Lucide/Feather-style) still inherit the color.
 * Child elements with explicit non-none values are also updated.
 * `fill="none"` is intentional (transparent areas) and left untouched.
 */
function _applyCurrentColor(svg: SVGSVGElement) {
  _sanitize(svg);
  // Equivalent to: path[fill] { fill: currentColor } — only elements with an
  // explicit fill/stroke attribute are recolored; root and unset elements untouched.
  svg.querySelectorAll<Element>('[fill]:not([fill="none"])').forEach((el) => el.setAttribute('fill', 'currentColor'));
  svg
    .querySelectorAll<Element>('[stroke]:not([stroke="none"])')
    .forEach((el) => el.setAttribute('stroke', 'currentColor'));
}

/**
 * Sets an explicit hex/rgb color on every fill/stroke in the SVG.
 * Used for canvas rendering — CSS variables don't resolve in SVG attributes
 * set via setAttribute, so a concrete color value is required here.
 */
function _applyHexColor(svg: SVGSVGElement, color: string) {
  _sanitize(svg);
  // querySelectorAll skips the root element, so handle it explicitly.
  // SVGs like Lucide/Feather carry stroke="currentColor" only on the root;
  // without this, currentColor renders as black in a standalone image context.
  const rf = svg.getAttribute('fill');
  if (rf && rf !== 'none') svg.setAttribute('fill', color);
  const rs = svg.getAttribute('stroke');
  if (rs && rs !== 'none') svg.setAttribute('stroke', color);
  // Descendants with explicit non-none fill/stroke
  svg.querySelectorAll<Element>('[fill]:not([fill="none"])').forEach((el) => el.setAttribute('fill', color));
  svg.querySelectorAll<Element>('[stroke]:not([stroke="none"])').forEach((el) => el.setAttribute('stroke', color));
}

// ─── SvgIcon ──────────────────────────────────────────────────────────────────

interface SvgIconProps {
  src: string;
  size?: number;
  width?: number;
  height?: number;
  /**
   * Color for the icon. Accepts any CSS value including custom properties
   * (e.g. `"var(--cyan)"`). Applied as the CSS `color` property on the wrapper
   * so `currentColor` inside the SVG resolves correctly.
   * Defaults to `currentColor` (inherits from the parent element).
   */
  color?: string;
  /** Overrides stroke-width on all stroked elements. */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an SVG from a URL as inline `<svg>` via @tanem/svg-injector.
 * Inline SVG enables full CSS color control — pass any CSS color to `color`.
 * Requests are cached by the injector: same URL is fetched at most once.
 * Each SVG is sanitized with DOMPurify before DOM insertion.
 *
 * Usage:
 *   <SvgIcon src={url} size={20} color="var(--cyan)" />
 */
export function SvgIcon({
  src,
  size = 24,
  width,
  height,
  color = 'currentColor',
  strokeWidth,
  className,
  style,
}: SvgIconProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !src) return;

    container.replaceChildren();

    const img = document.createElement('img');
    img.setAttribute('data-src', src);
    img.width = width ?? size;
    img.height = height ?? size;
    img.alt = '';
    container.appendChild(img);

    SVGInjector(img, {
      beforeEach(svg) {
        _applyCurrentColor(svg);
        if (strokeWidth !== undefined) {
          const sw = String(strokeWidth);
          // Set on root so children without an explicit stroke-width inherit it.
          svg.setAttribute('stroke-width', sw);
          // Override on descendants that carry their own stroke-width attribute.
          svg.querySelectorAll<Element>('[stroke-width]').forEach((el) => el.setAttribute('stroke-width', sw));
        }
      },
    });
  }, [src, size, width, height, strokeWidth]);

  return (
    <span
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color, ...style }}
    />
  );
}

// ─── preloadSvgForCanvas ──────────────────────────────────────────────────────

/**
 * Fetches and processes an SVG for canvas `drawImage`, sharing the SVGInjector
 * request cache with SvgIcon — same URL is fetched at most once per session.
 * `color` must be a concrete value (hex, rgb) — CSS variables do not resolve
 * in SVG presentation attributes set via setAttribute.
 *
 * Returns an HTMLCanvasElement with the SVG rendered at `size × size` px.
 *
 * Usage:
 *   preloadSvgForCanvas(url, '#2bd6ff', 16).then(oc => cache[id] = oc)
 */
export function preloadSvgForCanvas(url: string, color: string, size = 16): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(container);

    const holder = document.createElement('img');
    holder.setAttribute('data-src', url);
    container.appendChild(holder);

    SVGInjector(holder, {
      beforeEach(svg) {
        _applyHexColor(svg, color);
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
      },
      afterEach(err, svg) {
        if (container.parentNode) container.parentNode.removeChild(container);

        if (err || !svg) {
          reject(err ?? new Error('svg injection failed'));
          return;
        }

        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const oc = document.createElement('canvas');
          oc.width = size;
          oc.height = size;
          oc.getContext('2d')?.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(blobUrl);
          resolve(oc);
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('canvas image load failed'));
        };
        img.src = blobUrl;
      },
    });
  });
}
