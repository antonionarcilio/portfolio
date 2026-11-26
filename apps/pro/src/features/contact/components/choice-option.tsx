import { cva, type VariantProps } from 'class-variance-authority';
import Image, { type StaticImageData } from 'next/image';

import { RadioMark } from '@/shared/components/radio';
import { ScrambleText } from '@/shared/components/scramble-text';

/**
 * "Opção" (pen.dev `q9tsU`, linha com radio à esquerda) e "Opção em Cartão" (`d6Q7W`, ícone + título + descrição,
 * radio à direita). Hover escurece a borda para `stroke-strong`; foco do teclado e selecionada trocam a borda por
 * uma tracejada `stroke-strong` (o design usa `$ink` tracejado 4/2 — preto 100% numa borda de 1px arredondada
 * serrilha em telas 1x, por isso `stroke-strong`). O fundo continua branco nos dois estados — só a borda e o radio
 * (laranja quando marcado) indicam a escolha; a moldura do ícone e os textos não mudam.
 */
const choiceOptionVariants = cva(
  'transition-interface group flex w-full rounded-lg border bg-alpha-white-100 text-left focus-visible:outline-none',
  {
    variants: {
      // Cartão no mobile (G05 `zGQWq`): ícone, textos e radio alinhados ao topo — a descrição quebra em várias
      // linhas e o radio fica na altura do título. A partir de `tablet` (G01·3) volta a centralizar.
      layout: {
        row: 'items-center gap-md px-lg py-md',
        card: 'items-start gap-[14px] px-[18px] py-lg tablet:items-center',
      },
      // O hover fica só no não selecionado: duas classes `hover:border-*` na mesma opção disputariam pela ordem do CSS.
      // Foco (teclado) e selecionada compartilham a borda tracejada, como o "Anel de foco" do design (`XEAWg`).
      selected: {
        true: 'border-dashed border-stroke-strong',
        false:
          'border-alpha-black-10 hover:border-stroke-strong focus-visible:border-dashed focus-visible:border-stroke-strong',
      },
    },
    defaultVariants: { layout: 'row', selected: false },
  },
);

type ChoiceOptionProps = Required<Pick<VariantProps<typeof choiceOptionVariants>, 'layout'>> & {
  label: string;
  description?: string;
  icon?: StaticImageData;
  selected: boolean;
  onSelect: () => void;
};

function CardIcon({ icon }: { icon: StaticImageData }) {
  return (
    <span aria-hidden className="flex size-[44px] shrink-0 items-center justify-center rounded-md bg-alpha-black-5">
      <Image src={icon} alt="" width={22} height={22} />
    </span>
  );
}

function CardTexts({ label, description }: { label: string; description?: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <span className="font-portfolio text-chat font-semibold text-alpha-black-100">
        <ScrambleText>{label}</ScrambleText>
      </span>
      {description && (
        <span className="font-portfolio text-caption font-regular text-alpha-black-60">
          <ScrambleText>{description}</ScrambleText>
        </span>
      )}
    </span>
  );
}

/**
 * Uma escolha de um `role="radiogroup"`. A linha inteira é o controle (o radio é só desenho).
 * @example <ChoiceOption layout="card" label="Tenho um projeto em mente" description="…" icon={lightbulbIcon} selected={false} onSelect={pick} />
 */
export function ChoiceOption({ layout, label, description, icon, selected, onSelect }: ChoiceOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={choiceOptionVariants({ layout, selected })}
    >
      {layout === 'row' && <RadioMark checked={selected} />}
      {layout === 'card' && icon && <CardIcon icon={icon} />}
      {layout === 'card' ? (
        <CardTexts label={label} description={description} />
      ) : (
        <span className="flex-1 font-portfolio text-chat font-regular text-alpha-black-100">
          <ScrambleText>{label}</ScrambleText>
        </span>
      )}
      {layout === 'card' && <RadioMark checked={selected} />}
    </button>
  );
}
