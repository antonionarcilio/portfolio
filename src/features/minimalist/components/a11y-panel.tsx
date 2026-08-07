'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { MarkdownText } from '@/shared/components/markdown-text';

import {
  MINIMALIST_A11Y_OPTION_KEYS,
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
import { MinimalistWindowedList } from './windowed-list';

type MinimalistA11yPanelProps = {
  appearance: MinimalistAppearance;
  open: boolean;
  options: MinimalistA11yOptions;
  onToggle: (key: MinimalistA11yKey) => void;
};

export function MinimalistA11yPanel({ appearance, open, options, onToggle }: MinimalistA11yPanelProps) {
  const t = useTranslations('minimalist.a11yPanel');
  const [selectedIndex, setSelectedIndex] = useState(() => MINIMALIST_A11Y_OPTION_KEYS.indexOf('cursorLarge'));
  const listRef = useRef<HTMLDivElement>(null);
  const selectedKey = MINIMALIST_A11Y_OPTION_KEYS[selectedIndex];
  const isMobileViewport = useIsMinimalistSoundLocked();
  // const isUpscaleLocked = useIsMinimalistUpscaleLocked();
  const optionLocked = isMobileViewport && selectedKey === 'soundEffects';
  // const optionLocked =
  //   (isMobileViewport && selectedKey === 'soundEffects') || (isUpscaleLocked && selectedKey === 'upscale');
  const { play: playChangeSound } = useMinimalistSoundEffects(
    MINIMALIST_DEFAULT_SOUND_KEY,
    options.soundEffects && !isMobileViewport,
  );

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => listRef.current?.focus());
  }, [open]);

  const moveSelection = (direction: -1 | 1) => {
    setSelectedIndex((current) => nextCircularIndex(current, direction, MINIMALIST_A11Y_OPTION_KEYS.length));
    playChangeSound();
  };
  const listItems = MINIMALIST_A11Y_OPTION_KEYS.map((key) => ({ key, label: t(`options.${key}.title`) }));

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="minimalist-a11y-panel grid place-items-center p-8"
          aria-label={t('landmark')}
          onWheel={(event) => event.stopPropagation()}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="minimalist-a11y-panel__content">
            <MinimalistWindowedList
              items={listItems}
              selectedIndex={selectedIndex}
              ariaLabel={t('listLabel')}
              idPrefix="minimalist-a11y-option"
              onSelect={setSelectedIndex}
              onWheelConfirm={moveSelection}
              listRef={listRef}
            />
            <div className="minimalist-a11y-panel__detail flex max-w-[380px] flex-col gap-[22px]" aria-live="polite">
              <h2 className="minimalist-a11y-panel__header">
                {'// '}
                {t(`options.${selectedKey}.title`)}
              </h2>
              <div className="flex flex-col gap-3.5">
                <MarkdownText inline className="minimalist-a11y-panel__description">
                  {t(`options.${selectedKey}.description`)}
                </MarkdownText>
                <p className="minimalist-a11y-panel__question">{t(`options.${selectedKey}.question`)}</p>
                <div
                  className="minimalist-a11y-panel__toggles flex items-center gap-2"
                  role="group"
                  aria-label={t('toggleGroup')}
                >
                  <MinimalistSwitchBtn
                    appearance={appearance}
                    current={options[selectedKey]}
                    label={t('yes')}
                    ariaLabel={t('yesAria')}
                    disabled={optionLocked}
                    onClick={() => {
                      if (!optionLocked && !options[selectedKey]) onToggle(selectedKey);
                    }}
                  />
                  <Divider appearance={appearance} variant="v1" orientation="vertical" />
                  <MinimalistSwitchBtn
                    appearance={appearance}
                    current={!options[selectedKey]}
                    label={t('no')}
                    ariaLabel={t('noAria')}
                    disabled={optionLocked}
                    onClick={() => {
                      if (!optionLocked && options[selectedKey]) onToggle(selectedKey);
                    }}
                  />
                </div>
                <span className="sr-only" aria-live="assertive">
                  {t('announcement', { option: t(`options.${selectedKey}.title`) })}
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
