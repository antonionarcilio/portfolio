'use client';

import type { KeyboardEvent, RefObject, WheelEvent } from 'react';
import { useRef } from 'react';

import { MINIMALIST_A11Y_WHEEL_COOLDOWN_MS, consumeA11yWheel, nextCircularIndex } from '../a11y';

export type MinimalistWindowedListItem = { key: string; label: string };

type MinimalistWindowedListProps = {
  items: MinimalistWindowedListItem[];
  selectedIndex: number;
  ariaLabel: string;
  idPrefix: string;
  onSelect: (index: number) => void;
  onWheelConfirm: (direction: -1 | 1) => void;
  listRef?: RefObject<HTMLDivElement | null>;
};

const WINDOW_RADIUS = 2;

/**
 * Lista de janela circular (até 5 itens visíveis, marcador `➤`, gradientes de topo/base)
 * reutilizada pelo painel de acessibilidade e pela lista de experiências.
 * Com um único item, exibe-o estático e desativa wheel/teclado (sem janela circular).
 */
export function MinimalistWindowedList({
  items,
  selectedIndex,
  ariaLabel,
  idPrefix,
  onSelect,
  onWheelConfirm,
  listRef,
}: MinimalistWindowedListProps) {
  const wheelAccumulator = useRef(0);
  const lastConfirmedAt = useRef(0);
  const circularNavigationActive = items.length > 1;
  const windowRadius = circularNavigationActive ? WINDOW_RADIUS : 0;
  const selectedItem = items[selectedIndex];

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!circularNavigationActive) return;
    event.preventDefault();
    // ponytail: fixed cooldown, not real gesture-boundary detection — a deliberate second
    // flick within the window is also swallowed. Revisit with idle-based detection if that's felt.
    if (event.timeStamp - lastConfirmedAt.current < MINIMALIST_A11Y_WHEEL_COOLDOWN_MS) return;
    const result = consumeA11yWheel(wheelAccumulator.current, event.deltaY);
    wheelAccumulator.current = result.accumulator;
    if (result.direction) {
      lastConfirmedAt.current = event.timeStamp;
      onWheelConfirm(result.direction);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!circularNavigationActive) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    onWheelConfirm(event.key === 'ArrowDown' ? 1 : -1);
  };

  return (
    <div
      ref={listRef}
      className="minimalist-windowed-list grid gap-4"
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={selectedItem ? `${idPrefix}-${selectedItem.key}` : undefined}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={circularNavigationActive ? 0 : -1}
    >
      {circularNavigationActive && (
        <span
          className="minimalist-windowed-list__gradient minimalist-windowed-list__gradient--top"
          aria-hidden="true"
        />
      )}
      {Array.from({ length: windowRadius * 2 + 1 }, (_, position) => {
        const offset = position - windowRadius;
        const index = nextCircularIndex(selectedIndex, offset, items.length);
        const item = items[index];
        if (!item) return null;
        const selected = offset === 0;
        return (
          <button
            key={`${item.key}-${position}`}
            id={selected ? `${idPrefix}-${item.key}` : undefined}
            className={`minimalist-windowed-list__option${selected ? ' minimalist-windowed-list__option--selected' : ''}`}
            type="button"
            role="option"
            aria-selected={selected}
            aria-hidden={!selected}
            tabIndex={-1}
            onClick={() => onSelect(index)}
          >
            {selected && (
              <span className="minimalist-windowed-list__marker" aria-hidden="true">
                {'➤'}
              </span>
            )}
            {item.label}
          </button>
        );
      })}
      {circularNavigationActive && (
        <span
          className="minimalist-windowed-list__gradient minimalist-windowed-list__gradient--bottom"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
