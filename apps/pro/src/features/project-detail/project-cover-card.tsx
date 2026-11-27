import Image from 'next/image';

import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';

type ProjectCoverCardProps = {
  /** Remote image URL from the CMS `gallery`. */
  cover: string;
  alt: string;
  /** Primeira capa da página (a do hero): sobe a prioridade de download. */
  isHero?: boolean;
};

/**
 * Project card v2: the cover alone, desaturated and revealing its color on hover, over the card's
 * black 5% background.
 * @example <ProjectCoverCard cover={project.galleryImages[0]} alt="Portal — screenshot 1" />
 */
export function ProjectCoverCard({ cover, alt, isHero = false }: ProjectCoverCardProps) {
  return (
    // Opaque white base: the saturation overlay turns any transparent backdrop black. The 5% layer
    // sits under the image, inside the isolated group, so only the card background is tinted.
    <GrayscaleReveal className="aspect-[450/337] w-full shrink-0 overflow-hidden rounded-md bg-alpha-white-100">
      <div aria-hidden className="absolute inset-0 bg-alpha-black-5" />
      <Image
        src={cover}
        alt={alt}
        fill
        sizes="450px"
        draggable={false}
        fetchPriority={isHero ? 'high' : 'auto'}
        loading={isHero ? 'eager' : 'lazy'}
        className="object-cover"
      />
    </GrayscaleReveal>
  );
}
