import { useTranslations } from 'next-intl';

import { Anchor } from '@/shared/components/anchor';
import { ScrambleText } from '@/shared/components/scramble-text';

export type ProfileLinks = { linkedinUrl: string; githubUrl: string };

export type ProfileId = 'linkedin' | 'github';

/**
 * Perfis com URL no CMS, na ordem do design — compartilhado pelos Links Sociais e pelo submenu de atalhos.
 * @example availableProfiles({ linkedinUrl, githubUrl: '' }) // [{ id: 'linkedin', url: linkedinUrl }]
 */
export function availableProfiles(links: ProfileLinks): { id: ProfileId; url: string }[] {
  const profiles: { id: ProfileId; url: string }[] = [
    { id: 'linkedin', url: links.linkedinUrl },
    { id: 'github', url: links.githubUrl },
  ];
  return profiles.filter((profile) => profile.url.length > 0);
}

/**
 * "Links Sociais" ("Onde mais me encontrar"): só os perfis que existem no CMS (hoje LinkedIn e GitHub; o
 * Instagram do design fica de fora até haver URL no CMS). Perfil sem URL não aparece.
 * @example <SocialLinks links={{ linkedinUrl, githubUrl }} />
 */
export function SocialLinks({ links }: { links: ProfileLinks }) {
  const t = useTranslations('pro.contactChat.socialLinks');
  const items = availableProfiles(links).map((profile) => ({ ...profile, label: t(profile.id) }));

  return (
    <div className="flex flex-col items-center gap-[10px]">
      <p className="font-portfolio text-sm font-semibold text-alpha-black-100">
        <ScrambleText>{t('heading')}</ScrambleText>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-[22px]">
        {items.map((item) => (
          <Anchor key={item.id} label={item.label} href={item.url} external tone="muted" />
        ))}
      </div>
    </div>
  );
}
