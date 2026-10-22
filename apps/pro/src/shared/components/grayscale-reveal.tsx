import type { ReactNode } from 'react';

type GrayscaleRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wraps any content with a desaturation overlay (mix-blend-mode:saturation).
 * Hover reveals the original colors with a smooth 500ms transition.
 * Reusable across profile images, project covers, and any colorful graphic.
 * @example <GrayscaleReveal className="rounded-lg overflow-hidden"><Image .../></GrayscaleReveal>
 */
export function GrayscaleReveal({ children, className }: GrayscaleRevealProps) {
  return (
    <div className={`group/grayscale relative isolate ${className ?? ''}`}>
      {children}
      {/* Black overlay with saturation blend mode removes color from whatever is behind it.
          isolate on the parent keeps the blend scoped to this container. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-alpha-black-100 mix-blend-saturation transition-opacity duration-500 group-hover/grayscale:opacity-0"
      />
    </div>
  );
}
