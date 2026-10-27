'use client';

import { motion } from 'framer-motion';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import { avatarLiftVariants, avatarNameChipVariants } from '@/shared/animations';
import { Chip } from '@/shared/components/chip';
import { TeamAvatar } from '@/shared/components/team-avatar';
import type { TeamMember } from '@/shared/data/team-members';

type TeamAvatarLinkProps = {
  member: TeamMember;
};

/**
 * Avatar that links to the person's profile. On hover/focus it lifts, reveals its color and shows
 * a chip with the name above it.
 * @example <TeamAvatarLink member={TEAM_MEMBERS.elisSouza} />
 */
export function TeamAvatarLink({ member }: TeamAvatarLinkProps) {
  return (
    <motion.a
      href={member.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      className="relative block cursor-pointer rounded-full focus-visible:outline-none"
    >
      <motion.div variants={avatarLiftVariants} className="relative">
        <TeamAvatar member={member} />
        {/* The name is already the photo's alt text, so the chip is decorative for screen readers. */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-[28px] left-1/2 -translate-x-1/2">
          <motion.div variants={avatarNameChipVariants}>
            <Chip label={member.name} variant="outline-v2" wide iconTrailing={arrowUpRightIcon} />
          </motion.div>
        </div>
      </motion.div>
    </motion.a>
  );
}
