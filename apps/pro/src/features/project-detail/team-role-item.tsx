import { ScrambleText } from '@/shared/components/scramble-text';
import { TeamAvatarGroup } from '@/shared/components/team-avatar-group';
import { TEAM_MEMBERS, type TeamMemberId } from '@/shared/data/team-members';

type TeamRoleItemProps = {
  roleLabel: string;
  memberIds: TeamMemberId[];
};

/**
 * A role followed by who held it: one avatar, or an overlapping group for several people. Hovering
 * an avatar reveals its color and name.
 * @example <TeamRoleItem roleLabel="Developer" memberIds={['antonioMascarenhas']} />
 */
export function TeamRoleItem({ roleLabel, memberIds }: TeamRoleItemProps) {
  const members = memberIds.map((memberId) => TEAM_MEMBERS[memberId]);

  return (
    <span className="flex items-center gap-[4px] font-portfolio text-md font-regular text-alpha-black-100">
      <ScrambleText>{roleLabel}</ScrambleText>
      <TeamAvatarGroup members={members} />
    </span>
  );
}
