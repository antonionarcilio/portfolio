import { ScrambleText } from '@/shared/components/scramble-text';
import { TeamAvatarGroup } from '@/shared/components/team-avatar-group';
import type { TeamMember } from '@/shared/types/team-member';

type TeamRoleItemProps = {
  roleLabel: string;
  members: TeamMember[];
};

/**
 * A role followed by who held it: one avatar, or an overlapping group for several people. Hovering
 * an avatar reveals its color and name.
 * @example <TeamRoleItem roleLabel="Developer" members={[{ name: 'Antônio Mascarenhas', photo: null }]} />
 */
export function TeamRoleItem({ roleLabel, members }: TeamRoleItemProps) {
  return (
    <span className="flex items-center gap-[4px] font-portfolio text-md font-regular text-alpha-black-100">
      <ScrambleText>{roleLabel}</ScrambleText>
      <TeamAvatarGroup members={members} />
    </span>
  );
}
