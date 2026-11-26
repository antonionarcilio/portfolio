import { ScrambleText } from '@/shared/components/scramble-text';

type SummaryBlockProps = {
  label: string;
  /** Uma linha por valor; vazio mostra `emptyText`. */
  lines: string[];
  emptyText: string;
  editLabel: string;
  /** Nome acessível do botão ("Editar Prazo"), já que o texto visível é só "Editar". */
  editAccessibleLabel: string;
  onEdit: () => void;
};

/**
 * "Resumo · Bloco": rótulo em caixa-alta (140px), valor e "Editar". Divisória entre blocos via
 * `border-b` (o último bloco não tem — ver o `last:` abaixo). Abaixo de `tablet` (G05 `AJNo8`) rótulo, valor
 * e "Editar" empilham com 6px entre eles; a partir de `tablet`, rótulo | valor | "Editar" em linha.
 * @example <SummaryBlock label="Prazo" lines={['Nas próximas 2 a 4 semanas.']} emptyText="—" editLabel="Editar" editAccessibleLabel="Editar Prazo" onEdit={edit} />
 */
export function SummaryBlock({ label, lines, emptyText, editLabel, editAccessibleLabel, onEdit }: SummaryBlockProps) {
  const shownLines = lines.length > 0 ? lines : [emptyText];

  return (
    <div className="flex flex-col border-b border-alpha-black-10 py-[14px] last:border-b-0 gap-[6px] tablet:flex-row tablet:gap-lg">
      <dt className="font-portfolio text-overline font-semibold tracking-[1px] text-alpha-black-60 uppercase tablet:w-[140px] tablet:shrink-0 tablet:pt-[3px]">
        <ScrambleText>{label}</ScrambleText>
      </dt>
      <dd className="flex min-w-0 flex-1 flex-col items-start gap-[6px] tablet:flex-row tablet:justify-between tablet:gap-lg">
        <span className="flex min-w-0 flex-col">
          {shownLines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              className="font-portfolio text-sm font-regular break-words text-alpha-black-100"
            >
              <ScrambleText>{line}</ScrambleText>
            </span>
          ))}
        </span>
        <button
          type="button"
          aria-label={editAccessibleLabel}
          onClick={onEdit}
          className="transition-interface shrink-0 py-[2px] font-portfolio text-caption font-regular text-alpha-black-100 hover:text-alpha-black-60 focus-visible:text-alpha-black-60 focus-visible:outline-none"
        >
          <ScrambleText>{editLabel}</ScrambleText>
        </button>
      </dd>
    </div>
  );
}
