'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { avatarSaturationVariants } from '@/shared/animations';
import type { TeamMember } from '@/shared/data/team-members';

type TeamAvatarProps = {
  member: TeamMember;
};

/**
 * 26px round photo, desaturated by default. Inside a motion parent that switches between the
 * `rest` and `hover` variants (see `TeamAvatarGroup`), the color is revealed on `hover`.
 * @example <TeamAvatar member={TEAM_MEMBERS.elisSouza} />
 */
export function TeamAvatar({ member }: TeamAvatarProps) {
  return (
    // Opaque base: the saturation overlay turns any transparent backdrop black.
    <div className="relative isolate size-[26px] shrink-0 overflow-hidden rounded-full bg-alpha-white-100">
      <Image src={member.photo} alt={member.name} fill sizes="26px" draggable={false} className="object-cover" />
      <motion.div
        aria-hidden="true"
        variants={avatarSaturationVariants}
        className="pointer-events-none absolute inset-0 bg-alpha-black-100 mix-blend-saturation"
      />
    </div>
  );
}
