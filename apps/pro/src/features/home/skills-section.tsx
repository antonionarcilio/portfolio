import { useTranslations } from 'next-intl';
import Image from 'next/image';

const SKILLS_ROW_1 = [
  { name: 'JavaScript', file: 'javascript' },
  { name: 'TypeScript', file: 'typescript' },
  { name: 'React', file: 'react' },
  { name: 'Next.js', file: 'next' },
  { name: 'Svelte', file: 'svelte' },
  { name: 'OpenCode', file: 'opencode' },
  { name: 'Claude Code', file: 'claudecode' },
  { name: 'Codex', file: 'codex' },
] as const;

const SKILLS_ROW_2 = [
  { name: 'Tailwind CSS', file: 'tailwindcss' },
  { name: 'Motion', file: 'motion' },
  { name: 'Node.js', file: 'nodejs' },
  { name: 'Figma', file: 'figma' },
  { name: 'Docker', file: 'docker' },
  { name: 'WordPress', file: 'wordpress' },
] as const;

export function SkillsSection() {
  const t = useTranslations('pro.home');

  return (
    <section className="mx-auto flex flex-col gap-4" style={{ width: 984 }}>
      <p className="text-sm font-regular font-portfolio text-alpha-black-60">{t('skillsLabel')}</p>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-12 opacity-80">
          {SKILLS_ROW_1.map(({ name, file }) => (
            <Image key={file} src={`/logos/${file}.svg`} alt={name} width={32} height={32} />
          ))}
        </div>
        <div className="flex items-center gap-12 opacity-80">
          {SKILLS_ROW_2.map(({ name, file }) => (
            <Image key={file} src={`/logos/${file}.svg`} alt={name} width={32} height={32} />
          ))}
        </div>
      </div>
    </section>
  );
}
