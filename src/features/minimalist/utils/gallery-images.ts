/** Slide de fallback do carrossel de projeto — usado para completar galerias curtas. */
export const GALLERY_PLACEHOLDER = '/portfolios/minimalist/placeholder-gallery.svg';

/** O carrossel do painel expandido sempre mostra ao menos 3 slides. */
export const MINIMUM_GALLERY_SLIDES = 3;

/**
 * Completa a lista de imagens do carrossel até {@link MINIMUM_GALLERY_SLIDES} com o
 * placeholder. Listas com 3+ imagens passam intactas.
 *
 * @example padGalleryImages(['a.png']) // ['a.png', placeholder, placeholder]
 */
export function padGalleryImages(images: string[]): string[] {
  const missing = MINIMUM_GALLERY_SLIDES - images.length;
  if (missing <= 0) return images;
  return [...images, ...Array.from({ length: missing }, () => GALLERY_PLACEHOLDER)];
}
