import type { StaticImageData } from 'next/image';

import adonhiramCorreiaPhoto from '@/_assets/team-member/adonhiram-correia.png';
import antonioMascarenhasPhoto from '@/_assets/team-member/antonio-mascarenhas.png';
import arthurZattaPhoto from '@/_assets/team-member/arthur-zatta.png';
import brenoAlexsandroPhoto from '@/_assets/team-member/breno-alexsandro.png';
import carolinaProcopioPhoto from '@/_assets/team-member/carolina-procopio.png';
import elisSouzaPhoto from '@/_assets/team-member/elis-souza.png';
import kenMatsumotoPhoto from '@/_assets/team-member/ken-matsumoto.png';
import thallesNevesPhoto from '@/_assets/team-member/thalles-neves.png';

export type TeamMember = {
  /** Proper names are the same in every locale, so they are not translated. */
  name: string;
  photo: StaticImageData;
  /** Where the avatar link goes. TODO: placeholder URLs — replace with each person's real profile. */
  profileUrl: string;
};

export const TEAM_MEMBERS = {
  adonhiramCorreia: {
    name: 'Adonhiram Correia',
    photo: adonhiramCorreiaPhoto,
    profileUrl: 'https://example.com/team/adonhiram-correia',
  },
  antonioMascarenhas: {
    name: 'Antônio Mascarenhas',
    photo: antonioMascarenhasPhoto,
    profileUrl: 'https://example.com/team/antonio-mascarenhas',
  },
  arthurZatta: { name: 'Arthur Zatta', photo: arthurZattaPhoto, profileUrl: 'https://example.com/team/arthur-zatta' },
  brenoAlexsandro: {
    name: 'Breno Alexsandro',
    photo: brenoAlexsandroPhoto,
    profileUrl: 'https://example.com/team/breno-alexsandro',
  },
  carolinaProcopio: {
    name: 'Carolina Procópio',
    photo: carolinaProcopioPhoto,
    profileUrl: 'https://example.com/team/carolina-procopio',
  },
  elisSouza: { name: 'Elis Souza', photo: elisSouzaPhoto, profileUrl: 'https://example.com/team/elis-souza' },
  kenMatsumoto: {
    name: 'Ken Matsumoto',
    photo: kenMatsumotoPhoto,
    profileUrl: 'https://example.com/team/ken-matsumoto',
  },
  thallesNeves: {
    name: 'Thalles Neves',
    photo: thallesNevesPhoto,
    profileUrl: 'https://example.com/team/thalles-neves',
  },
} as const satisfies Record<string, TeamMember>;

export type TeamMemberId = keyof typeof TEAM_MEMBERS;
