import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';
import { ScrambleText } from '@/shared/components/scramble-text';

type ProjectListCardProps = {
  /** Slug of the project's detail page (`/works/<slug>`). */
  slug: string;
  /** Remote image URL from the CMS `gallery`. */
  cover: string;
  title: string;
  role: string;
  year: string;
  techStack: string;
};

/**
 * Project card for the works grid, linking to the project page: desaturated cover (color on hover) with
 * title/year on the left and role/tech stack on the right, below the cover.
 * @example <ProjectListCard cover={cover} title="Bi" role="Frontend" year="2023" techStack="React +5" />
 */
export function ProjectListCard({ slug, cover, title, role, year, techStack }: ProjectListCardProps) {
  return (
    <Link href={`/works/${slug}`} className="block cursor-pointer focus-visible:outline-none">
      <article className="flex w-full flex-col items-start gap-[12px]">
        {/* The saturation overlay turns any transparent backdrop black, so the cover needs an opaque
          base (white). The 5% black card background sits under the cover instead of tinting the image. */}
        <GrayscaleReveal className="h-[337px] w-full overflow-hidden rounded-[8px] bg-alpha-white-100">
          {/* Inside the isolated group so the saturation overlay still sees an opaque backdrop. */}
          <div aria-hidden className="absolute inset-0 bg-alpha-black-5" />
          <Image src={cover} alt={title} fill sizes="477px" draggable={false} className="object-cover" />
        </GrayscaleReveal>

        {/* Sem `whitespace-nowrap`: com fonte mono/espaçamento ampliados o texto não cabe em uma linha e precisa quebrar dentro do card, em vez de invadir o card vizinho. */}
        <div className="flex w-full items-start justify-between gap-[16px]">
          <div className="flex min-w-0 flex-col items-start break-words">
            <h3 className="font-portfolio text-sm font-semibold text-alpha-black-100">
              <ScrambleText>{title}</ScrambleText>
            </h3>
            <p className="font-portfolio text-xs font-regular text-alpha-black-70">{year}</p>
          </div>
          <div className="flex min-w-0 flex-col items-end text-right break-words">
            <p className="font-portfolio text-sm font-semibold text-alpha-black-100">
              <ScrambleText>{role}</ScrambleText>
            </p>
            <p className="font-portfolio text-xs font-regular text-alpha-black-70">{techStack}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
