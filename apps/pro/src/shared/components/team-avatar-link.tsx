'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';

import arrowUpRightIcon from '@/_assets/icons/lucide-arrow-up-right.svg';
import { avatarLiftVariants, avatarNameChipVariants } from '@/shared/animations';
import { Chip } from '@/shared/components/chip';
import { TeamAvatar } from '@/shared/components/team-avatar';
import type { TeamMember } from '@/shared/types/team-member';

type TeamAvatarLinkProps = {
  member: TeamMember;
};

/**
 * Avatar that links to the person's profile. On hover/focus it lifts, reveals its color and shows
 * a chip with the name above it. On touch there is no hover, so the first tap only reveals the chip
 * (the second tap opens the profile; a tap anywhere else hides it again).
 * @example <TeamAvatarLink member={{ name: 'Elis Souza', photo: null }} />
 */
export function TeamAvatarLink({ member }: TeamAvatarLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const lastPointerTypeRef = useRef<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Toque fora do avatar esconde o chip (também troca de avatar: o novo toque abre o outro).
  useEffect(() => {
    if (!isRevealed) return;
    const hideOnOutsidePointer = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && linkRef.current?.contains(event.target)) return;
      setIsRevealed(false);
    };
    document.addEventListener('pointerdown', hideOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', hideOnOutsidePointer);
  }, [isRevealed]);

  const rememberPointerType = (event: PointerEvent<HTMLAnchorElement>) => {
    lastPointerTypeRef.current = event.pointerType;
  };

  const revealOnFirstTouchTap = (event: MouseEvent<HTMLAnchorElement>) => {
    const wasTouch = lastPointerTypeRef.current === 'touch';
    // Teclado (Enter) dispara `click` sem `pointerdown` antes: o tipo guardado é consumido a cada clique.
    lastPointerTypeRef.current = null;
    if (!wasTouch) return;
    if (isRevealed) {
      setIsRevealed(false);
      return;
    }
    event.preventDefault();
    setIsRevealed(true);
  };

  return (
    <motion.a
      ref={linkRef}
      href={member.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial="rest"
      animate={isRevealed ? 'hover' : 'rest'}
      whileHover="hover"
      whileFocus="hover"
      data-revealed={isRevealed}
      onPointerDown={rememberPointerType}
      onClick={revealOnFirstTouchTap}
      className="relative block cursor-pointer rounded-full focus-visible:outline-none data-[revealed=true]:z-10"
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
