import { useTranslations } from 'next-intl';
import Image from 'next/image';

import profilePhoto from '@/_assets/me/antonio-pixel-art-250x250.jpeg';
import { ButtonUnderline } from '@/shared/components/button-underline';
import { GrayscaleReveal } from '@/shared/components/grayscale-reveal';
import { MarkdownText } from '@/shared/components/markdown-text';
import { ScrambleText } from '@/shared/components/scramble-text';

type ProfileRowProps = {
  name: string;
  role: string;
  location: string;
  /** Markdown bio from the CMS. */
  bio: string;
  /** CMS portrait URL; the bundled photo is the fallback while it is missing. */
  avatarUrl: string | null;
  linkedinUrl: string;
  githubUrl: string;
  email: string;
};

/** Row 1 of the bio section: photo, identity card and bio text on the parent's 3-column subgrid. */
export function ProfileRow({ name, role, location, bio, avatarUrl, linkedinUrl, githubUrl, email }: ProfileRowProps) {
  const t = useTranslations('pro.about.links');

  return (
    <div className="flex min-w-0 flex-col gap-[16px] min-[1020px]:col-span-3 min-[1020px]:grid min-[1020px]:gap-x-[32px] min-[1020px]:[grid-template-columns:subgrid]">
      <GrayscaleReveal className="min-[1020px]:sticky min-[1020px]:top-[var(--header-height)] self-start size-[208px] rounded-[8px] overflow-hidden">
        <Image
          src={avatarUrl ?? profilePhoto}
          alt={name}
          width={208}
          height={208}
          className="block size-full object-cover"
          draggable={false}
        />
      </GrayscaleReveal>

      <div className="min-[1020px]:sticky min-[1020px]:top-[var(--header-height)] self-start flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-1">
          <p className="font-portfolio-title font-regular text-display-xs text-alpha-black-100">
            <ScrambleText>{name}</ScrambleText>
          </p>
          <p className="font-portfolio font-regular text-md text-alpha-black-60">
            <ScrambleText>{role}</ScrambleText>
          </p>
          <p className="font-portfolio font-regular text-md text-alpha-black-60">
            <ScrambleText>{location}</ScrambleText>
          </p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <ButtonUnderline label={t('linkedin')} href={linkedinUrl} external size="lg" />
          <ButtonUnderline label={t('email')} href={`mailto:${email}`} size="lg" />
          <ButtonUnderline label={t('github')} href={githubUrl} external size="lg" />
        </div>
      </div>

      <MarkdownText className="gap-4 font-portfolio font-regular text-md text-alpha-black-100">{bio}</MarkdownText>
    </div>
  );
}
