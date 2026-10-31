'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { avatarSaturationVariants } from '@/shared/animations';
import type { TeamMember } from '@/shared/types/team-member';

const MAX_INITIALS = 2;

function extractInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => word[0].toUpperCase())
    .join('');
}

type TeamAvatarProps = {
  member: TeamMember;
};

/**
 * 26px round photo, desaturated by default. Inside a motion parent that switches between the
 * `rest` and `hover` variants (see `TeamAvatarGroup`), the color is revealed on `hover`.
 * @example <TeamAvatar member={{ name: 'Elis Souza', photo: avatarUrl }} />
 */
export function TeamAvatar({ member }: TeamAvatarProps) {
  return (
    // Opaque base: the saturation overlay turns any transparent backdrop black.
    <div className="relative isolate size-[26px] shrink-0 overflow-hidden rounded-full bg-alpha-white-100">
      {member.photo ? (
        <Image src={member.photo} alt={member.name} fill sizes="26px" draggable={false} className="object-cover" />
      ) : (
        <span
          role="img"
          aria-label={member.name}
          className="flex size-full items-center justify-center bg-alpha-black-10 font-portfolio text-xs font-semibold text-alpha-black-70"
        >
          {extractInitials(member.name)}
        </span>
      )}
      <motion.div
        aria-hidden="true"
        variants={avatarSaturationVariants}
        className="pointer-events-none absolute inset-0 bg-alpha-black-100 mix-blend-saturation"
      />
    </div>
  );
}
