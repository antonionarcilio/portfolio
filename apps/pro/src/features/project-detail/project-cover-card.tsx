import Image, { type StaticImageData } from 'next/image';

import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';

type ProjectCoverCardProps = {
  cover: StaticImageData;
  alt: string;
};

/**
 * Project card v2: the cover alone, desaturated and revealing its color on hover.
 * @example <ProjectCoverCard cover={cover} alt="Blog Escallo — screenshot 1" />
 */
export function ProjectCoverCard({ cover, alt }: ProjectCoverCardProps) {
  return (
    // Opaque white base: the saturation overlay turns any transparent backdrop black. The cover
    // images already carry the 5% black tint and rounded corners (same as the works grid card).
    <GrayscaleReveal className="h-[337px] w-[450px] shrink-0 overflow-hidden rounded-[8px] bg-alpha-white-100">
      <Image src={cover} alt={alt} fill sizes="450px" draggable={false} className="object-cover" />
    </GrayscaleReveal>
  );
}
