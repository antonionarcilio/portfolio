import clsx from 'clsx';
import { SearchX } from 'lucide-react';

export function EmptyState({
  message = 'Nenhum dado encontrado',
  subtext = 'Ainda não há informações cadastradas nesta seção.',
  className = 'pt-[32px] pb-[36px]',
}: {
  message?: string;
  subtext?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={clsx(
        'flex flex-col items-center justify-center gap-[8px] border border-dashed border-cv-border bg-cv-panel px-[18px] text-center cursor-gamer-default',
        className,
      )}
    >
      <SearchX size={22} strokeWidth={1.5} className="text-cv-cyan opacity-70" aria-hidden="true" />
      <span className="text-cv-text text-[12px] tracking-[0.04em]">{message}</span>
      {subtext && <span className="text-cv-text-dim text-[11px] tracking-[0.02em] leading-[1.5]">{subtext}</span>}
    </div>
  );
}
