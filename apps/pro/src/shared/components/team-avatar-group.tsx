import { TeamAvatarLink } from '@/shared/components/team-avatar-link';
import type { TeamMember } from '@/shared/data/team-members';

type TeamAvatarGroupProps = {
  members: readonly TeamMember[];
};

/**
 * Overlapping row of team avatars (a single member is just a row of one). See `TeamAvatarLink`
 * for the hover/focus behavior of each avatar.
 * @example <TeamAvatarGroup members={[TEAM_MEMBERS.elisSouza, TEAM_MEMBERS.kenMatsumoto]} />
 */
export function TeamAvatarGroup({ members }: TeamAvatarGroupProps) {
  return (
    <ul className="flex items-center">
      {members.map((member) => (
        <li key={member.name} className="relative -mr-[4px] last:mr-0 hover:z-10 focus-within:z-10">
          <TeamAvatarLink member={member} />
        </li>
      ))}
    </ul>
  );
}
