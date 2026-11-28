import { ScrambleText } from '@/shared/components/scramble-text';

import { ProgressIndicator } from './progress-indicator';

type ChatHeaderProps = {
  title: string;
  subtitle: string;
  progressLabel: string;
  progressFraction: number;
};

/**
 * "Cabeçalho da Conversa": título da etapa em Calistoga, subtítulo (some abaixo de `tablet`, como no
 * mobile do design) e o progresso à direita.
 * @example <ChatHeader title="Prazo" subtitle="Conversa guiada · cerca de 2 minutos" progressLabel="Etapa 5 de 8" progressFraction={0.625} />
 */
export function ChatHeader({ title, subtitle, progressLabel, progressFraction }: ChatHeaderProps) {
  return (
    // No mobile sem respiro vertical (a tela é curta); o `py-md` volta a partir de `tablet`.
    <header className="flex items-center justify-between gap-lg tablet:py-md">
      <div className="flex min-w-0 flex-col gap-[2px]">
        <h1 className="font-portfolio-title text-xl font-regular text-alpha-black-100">
          <ScrambleText>{title}</ScrambleText>
        </h1>
        <p className="font-portfolio text-xs font-regular text-alpha-black-60 max-tablet:hidden">
          <ScrambleText>{subtitle}</ScrambleText>
        </p>
      </div>
      <ProgressIndicator label={progressLabel} fraction={progressFraction} />
    </header>
  );
}
