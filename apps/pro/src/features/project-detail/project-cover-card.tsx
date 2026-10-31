import Image from 'next/image';

import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';

type ProjectCoverCardProps = {
  /** Remote image URL from the CMS `gallery`. */
  cover: string;
  alt: string;
};

/**
 * Project card v2: the cover alone, desaturated and revealing its color on hover, over the card's
 * black 5% background.
 * @example <ProjectCoverCard cover={project.galleryImages[0]} alt="Portal — screenshot 1" />
 */
export function ProjectCoverCard({ cover, alt }: ProjectCoverCardProps) {
  return (
    // Opaque white base: the saturation overlay turns any transparent backdrop black. The 5% layer
    // sits under the image, inside the isolated group, so only the card background is tinted.
    <GrayscaleReveal className="h-[337px] w-[450px] shrink-0 overflow-hidden rounded-[8px] bg-alpha-white-100">
      <div aria-hidden className="absolute inset-0 bg-alpha-black-5" />
      <Image src={cover} alt={alt} fill sizes="450px" draggable={false} className="object-cover" />
    </GrayscaleReveal>
  );
}
