import Image, { type StaticImageData } from 'next/image';

import { Link } from '@/i18n/navigation';
import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';

type ProjectCardProps = {
  href: string;
  imageSrc: string | StaticImageData;
  title: string;
  year: string;
  role: string;
  techStack: string;
};

/**
 * iPad mockup card that reveals project metadata (title/year, role/tech) on hover.
 * Regular state: card with the project screenshot in an iPad frame.
 * Hover state: same card with title/year overlay at top and role/tech overlay at bottom.
 */
export function ProjectCard({ href, imageSrc, title, year, role, techStack }: ProjectCardProps) {
  return (
    <Link href={href} className="group relative block h-[337px] w-[450px] overflow-hidden rounded-[8px]">
      {/* Opaque base (white): the saturation overlay turns any transparent backdrop black. */}
      <GrayscaleReveal className="h-full w-full bg-alpha-white-100">
        {/* Card background (black 5%) sits under the image, inside the isolated group so the
            saturation overlay still sees an opaque backdrop. */}
        <div aria-hidden className="absolute inset-0 bg-alpha-black-5" />
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </GrayscaleReveal>

      {/* Title / year — revealed on hover. pointer-events-none keeps the hover on the cover. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[52px] items-center justify-center gap-[6px] px-3 py-[6px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="min-w-0 text-center font-portfolio text-sm font-semibold text-alpha-black-100">{title}</p>
        <p className="shrink-0 font-portfolio text-xs font-regular text-alpha-black-40">|</p>
        <p className="min-w-0 text-center font-portfolio text-sm font-regular text-alpha-black-70">{year}</p>
      </div>

      {/* Role / tech stack — revealed on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[52px] items-center justify-center gap-[6px] px-3 py-[6px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="min-w-0 text-center font-portfolio text-sm font-semibold text-alpha-black-100">{role}</p>
        <p className="shrink-0 font-portfolio text-xs font-regular text-alpha-black-40">|</p>
        <p className="min-w-0 text-center font-portfolio text-xs font-regular text-alpha-black-70">{techStack}</p>
      </div>
    </Link>
  );
}
