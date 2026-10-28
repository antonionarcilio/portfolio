'use client';

import { useId } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { ScrambleText } from '@/shared/components/scramble-text';
import { useScrollEdges } from '@/shared/hooks/use-scroll-edges';
import { buttonWhiteVariants } from '@/shared/variants/button-white-variants';

export type OptionScrollerOption = { value: string; label: string };

type OptionScrollerProps = {
  label: string;
  options: OptionScrollerOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
};

type ScrollerButtonProps = {
  option: OptionScrollerOption;
  isSelected: boolean;
  onSelect: () => void;
};

function ScrollerButton({ option, isSelected, onSelect }: ScrollerButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={`${buttonWhiteVariants({ state: isSelected ? 'active' : 'inactive', size: 'md' })} shrink-0 disabled:pointer-events-none disabled:opacity-50`}
    >
      <ScrambleText>{option.label}</ScrambleText>
    </button>
  );
}

/**
 * Seletor de opção única do Figma (`swiper-buttons`, node 4401:7132): faixa cinza com botões
 * brancos que rola na horizontal e esmaece a borda que tem conteúdo escondido. Clicar na opção
 * ativa a desmarca — o campo é opcional.
 * @example <OptionScroller label="Qual o prazo?" options={deadlines} value={deadline} onChange={setDeadline} />
 */
export function OptionScroller({ label, options, value, onChange, hint }: OptionScrollerProps) {
  const labelId = useId();
  const hintId = `${labelId}-hint`;
  const { scrollRef, handleScroll, hasHiddenStart, hasHiddenEnd } = useScrollEdges();

  return (
    <FieldFrame label={{ text: label, id: labelId }} hintId={hintId} hint={hint}>
      <div className="w-full rounded-[8px] bg-alpha-black-5 p-[3px]">
        <div
          ref={scrollRef}
          role="group"
          aria-labelledby={labelId}
          aria-describedby={hint ? hintId : undefined}
          data-fade-start={hasHiddenStart || undefined}
          data-fade-end={hasHiddenEnd || undefined}
          onScroll={handleScroll}
          className="option-scroller flex items-center gap-[2px] overflow-x-auto"
        >
          {options.map((option) => (
            <ScrollerButton
              key={option.value}
              option={option}
              isSelected={option.value === value}
              onSelect={() => onChange(option.value === value ? '' : option.value)}
            />
          ))}
        </div>
      </div>
    </FieldFrame>
  );
}
