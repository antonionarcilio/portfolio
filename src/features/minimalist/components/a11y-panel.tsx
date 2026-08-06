'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type KeyboardEvent, type WheelEvent } from 'react';

import {
  MINIMALIST_A11Y_OPTION_KEYS,
  MINIMALIST_A11Y_WHEEL_COOLDOWN_MS,
  consumeA11yWheel,
  nextCircularIndex,
  type MinimalistA11yKey,
  type MinimalistA11yOptions,
} from '../a11y';
import { useIsMinimalistSoundLocked } from '../hooks/use-minimalist-mobile-lock';
import { MINIMALIST_DEFAULT_SOUND_KEY } from '../sound-catalog';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { Divider } from './divider';
import { MinimalistSwitchBtn } from './switch-btn';

type MinimalistA11yPanelProps = {
  appearance: MinimalistAppearance;
  open: boolean;
  options: MinimalistA11yOptions;
  onToggle: (key: MinimalistA11yKey) => void;
};

const WINDOW_RADIUS = 2;

export function MinimalistA11yPanel({ appearance, open, options, onToggle }: MinimalistA11yPanelProps) {
  const t = useTranslations('minimalist.a11yPanel');
  const [selectedIndex, setSelectedIndex] = useState(() => MINIMALIST_A11Y_OPTION_KEYS.indexOf('cursorLarge'));
  const wheelAccumulator = useRef(0);
  const lastConfirmedAt = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedKey = MINIMALIST_A11Y_OPTION_KEYS[selectedIndex];
  const isMobileViewport = useIsMinimalistSoundLocked();
  const soundLocked = isMobileViewport && selectedKey === 'soundEffects';
  const { play: playChangeSound } = useMinimalistSoundEffects(
    MINIMALIST_DEFAULT_SOUND_KEY,
    options.soundEffects && !isMobileViewport,
  );

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => listRef.current?.focus());
      return;
    }
    wheelAccumulator.current = 0;
    lastConfirmedAt.current = 0;
  }, [open]);

  const moveSelection = (delta: -1 | 1) => {
    setSelectedIndex((current) => nextCircularIndex(current, delta, MINIMALIST_A11Y_OPTION_KEYS.length));
  };
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    // ponytail: fixed cooldown, not real gesture-boundary detection — a deliberate second
    // flick within the window is also swallowed. Revisit with idle-based detection if that's felt.
    if (event.timeStamp - lastConfirmedAt.current < MINIMALIST_A11Y_WHEEL_COOLDOWN_MS) return;
    const result = consumeA11yWheel(wheelAccumulator.current, event.deltaY);
    wheelAccumulator.current = result.accumulator;
    if (result.direction) {
      lastConfirmedAt.current = event.timeStamp;
      moveSelection(result.direction);
      playChangeSound();
    }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    // Each arrow press is a discrete, deliberate step — unlike wheel, it doesn't need the
    // cooldown that guards against one continuous physical gesture firing many events.
    moveSelection(event.key === 'ArrowDown' ? 1 : -1);
    playChangeSound();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="minimalist-a11y-panel"
          aria-label={t('landmark')}
          onWheel={(event) => event.stopPropagation()}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="minimalist-a11y-panel__content" onKeyDown={handleKeyDown}>
            <div
              ref={listRef}
              className="minimalist-a11y-panel__list"
              role="listbox"
              aria-label={t('listLabel')}
              aria-activedescendant={`minimalist-a11y-option-${selectedKey}`}
              onWheel={handleWheel}
              tabIndex={0}
            >
              <span
                className="minimalist-a11y-panel__gradient minimalist-a11y-panel__gradient--top"
                aria-hidden="true"
              />
              {Array.from({ length: WINDOW_RADIUS * 2 + 1 }, (_, position) => {
                const offset = position - WINDOW_RADIUS;
                const index = nextCircularIndex(selectedIndex, offset, MINIMALIST_A11Y_OPTION_KEYS.length);
                const key = MINIMALIST_A11Y_OPTION_KEYS[index];
                const selected = offset === 0;
                return (
                  <button
                    key={`${key}-${position}`}
                    id={selected ? `minimalist-a11y-option-${key}` : undefined}
                    className={`minimalist-a11y-panel__option${selected ? ' minimalist-a11y-panel__option--selected' : ''}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-hidden={!selected}
                    tabIndex={-1}
                    onClick={() => setSelectedIndex(index)}
                  >
                    {selected && (
                      <span className="minimalist-a11y-panel__marker" aria-hidden="true">
                        {'➤'}
                      </span>
                    )}
                    {t(`options.${key}.title`)}
                  </button>
                );
              })}
              <span
                className="minimalist-a11y-panel__gradient minimalist-a11y-panel__gradient--bottom"
                aria-hidden="true"
              />
            </div>
            <div className="minimalist-a11y-panel__detail" aria-live="polite">
              <h2 className="minimalist-a11y-panel__header">
                {'// '}
                {t(`options.${selectedKey}.title`)}
              </h2>
              <p>{t(`options.${selectedKey}.description`)}</p>
              <p className="minimalist-a11y-panel__question">{t(`options.${selectedKey}.question`)}</p>
              <div className="minimalist-a11y-panel__toggles" role="group" aria-label={t('toggleGroup')}>
                <MinimalistSwitchBtn
                  appearance={appearance}
                  current={options[selectedKey]}
                  label={t('yes')}
                  ariaLabel={t('yesAria')}
                  disabled={soundLocked}
                  onClick={() => {
                    if (!options[selectedKey]) onToggle(selectedKey);
                  }}
                />
                <Divider appearance={appearance} variant="v1" orientation="vertical" />
                <MinimalistSwitchBtn
                  appearance={appearance}
                  current={!options[selectedKey]}
                  label={t('no')}
                  ariaLabel={t('noAria')}
                  disabled={soundLocked}
                  onClick={() => {
                    if (options[selectedKey]) onToggle(selectedKey);
                  }}
                />
              </div>
              <span className="sr-only" aria-live="assertive">
                {t('announcement', { option: t(`options.${selectedKey}.title`) })}
              </span>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
