import type { ProjectTeamMember } from 'portfolio-content-model';

import type { TeamMember } from '@/shared/types/team-member';

export type TeamRoleGroup = {
  role: string;
  members: TeamMember[];
};

function toTeamMember(member: ProjectTeamMember): TeamMember {
  return { name: member.name, photo: member.avatarUrl, profileUrl: member.linkedinUrl };
}

/**
 * Agrupa o time pelo papel, na ordem em que cada papel aparece primeiro; quem tem o mesmo papel
 * vira um grupo de avatares sobrepostos.
 * @example groupTeamByRole([{ name: 'Ana', role: 'Dev', avatarUrl: null }]) // [{ role: 'Dev', members: [...] }]
 */
export function groupTeamByRole(team: ProjectTeamMember[]): TeamRoleGroup[] {
  const groups = new Map<string, TeamRoleGroup>();
  for (const member of team) {
    const group = groups.get(member.role) ?? { role: member.role, members: [] };
    group.members.push(toTeamMember(member));
    groups.set(member.role, group);
  }
  return [...groups.values()];
}
