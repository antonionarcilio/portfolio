export type TeamMember = {
  /** Proper names are the same in every locale, so they are not translated. */
  name: string;
  /** Remote avatar URL from the CMS; `null` renders the member's initials instead. */
  photo: string | null;
  /** LinkedIn URL from the CMS; the avatar is not a link while this is undefined. */
  profileUrl?: string;
};
