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
import { useIsMinimalistA11yAccordionLayout, useIsMinimalistSoundLocked } from '../hooks/use-minimalist-mobile-lock';
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
  // Mobile accordion: the header (aria-expanded/plus) follows selectedIndex instantly, but the
  // panel content follows openIndex, which only advances once the previous panel finishes
  // collapsing — otherwise both panels are briefly open at once and push later items down further
  // than their settled position, then snap back once the old one closes.
  const [openIndex, setOpenIndex] = useState<number | null>(selectedIndex);
  const pendingOpenIndexRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedKey = MINIMALIST_A11Y_OPTION_KEYS[selectedIndex];
  const isSoundLocked = useIsMinimalistSoundLocked();
  const isAccordionLayout = useIsMinimalistA11yAccordionLayout();
  // const isUpscaleLocked = useIsMinimalistUpscaleLocked();
  // const optionLocked =
  //   (isSoundLocked && selectedKey === 'soundEffects') || (isUpscaleLocked && selectedKey === 'upscale');
  const { play: playChangeSound } = useMinimalistSoundEffects(
    MINIMALIST_DEFAULT_SOUND_KEY,
    options.soundEffects && !isSoundLocked,
  );
  const { play: playAccordionSound } = useMinimalistSoundEffects(
    'mouseClickClose',
    options.soundEffects && !isSoundLocked,
  );

  useEffect(() => {
    if (open && !isAccordionLayout) window.requestAnimationFrame(() => listRef.current?.focus());
  }, [open, isAccordionLayout]);

  useEffect(() => {
    setOpenIndex((current) => {
      if (current === selectedIndex) return current;
      pendingOpenIndexRef.current = selectedIndex;
      return null;
    });
  }, [selectedIndex]);

  const handleAccordionPanelExitComplete = () => {
    if (pendingOpenIndexRef.current === null) return;
    setOpenIndex(pendingOpenIndexRef.current);
    pendingOpenIndexRef.current = null;
  };

  const moveSelection = (direction: -1 | 1) => {
    setSelectedIndex((current) => nextCircularIndex(current, direction, MINIMALIST_A11Y_OPTION_KEYS.length));
    playChangeSound();
  };
  const listItems = MINIMALIST_A11Y_OPTION_KEYS.map((key) => ({ key, label: t(`options.${key}.title`) }));

  const renderOptionBody = (key: MinimalistA11yKey) => {
    const locked = isSoundLocked && key === 'soundEffects';
    return (
      <div className="flex flex-col gap-3.5">
        <MarkdownText inline className="minimalist-a11y-panel__description">
          {t(`options.${key}.description`)}
        </MarkdownText>
        <p className="minimalist-a11y-panel__question">{t(`options.${key}.question`)}</p>
        <div
          className="minimalist-a11y-panel__toggles flex items-center gap-2"
          role="group"
          aria-label={t('toggleGroup')}
        >
          <MinimalistSwitchBtn
            appearance={appearance}
            current={options[key]}
            label={t('yes')}
            ariaLabel={t('yesAria')}
            disabled={locked}
            onClick={() => {
              if (!locked && !options[key]) onToggle(key);
            }}
          />
          <Divider appearance={appearance} variant="v1" orientation="vertical" />
          <MinimalistSwitchBtn
            appearance={appearance}
            current={!options[key]}
            label={t('no')}
            ariaLabel={t('noAria')}
            disabled={locked}
            onClick={() => {
              if (!locked && options[key]) onToggle(key);
            }}
          />
        </div>
        <span className="sr-only" aria-live="assertive">
          {t('announcement', { option: t(`options.${key}.title`) })}
        </span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="minimalist-a11y-panel grid place-items-center"
          aria-label={t('landmark')}
          onWheel={(event) => event.stopPropagation()}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="minimalist-a11y-panel__content">
            {isAccordionLayout ? (
              <div className="minimalist-a11y-accordion">
                {MINIMALIST_A11Y_OPTION_KEYS.map((key, index) => {
                  const expanded = index === selectedIndex;
                  const panelOpen = index === openIndex;
                  const summaryId = `minimalist-a11y-accordion-${key}-summary`;
                  const panelId = `minimalist-a11y-accordion-${key}-panel`;
                  return (
                    <div key={key} className="minimalist-a11y-accordion__item">
                      <h3 className="minimalist-a11y-accordion__heading">
                        <button
                          type="button"
                          id={summaryId}
                          className="minimalist-a11y-accordion__summary"
                          aria-expanded={expanded}
                          aria-controls={panelId}
                          onClick={() => {
                            if (index !== selectedIndex) playAccordionSound();
                            setSelectedIndex(index);
                          }}
                        >
                          <motion.span
                            className="minimalist-a11y-accordion__plus"
                            aria-hidden="true"
                            animate={{ rotate: expanded ? 45 : 0 }}
                            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                          >
                            +
                          </motion.span>
                          <span className="minimalist-a11y-accordion__name">{t(`options.${key}.title`)}</span>
                        </button>
                      </h3>
                      <AnimatePresence initial={false} onExitComplete={handleAccordionPanelExitComplete}>
                        {panelOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={summaryId}
                            className="minimalist-a11y-accordion__panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                          >
                            {renderOptionBody(key)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <MinimalistWindowedList
                  items={listItems}
                  selectedIndex={selectedIndex}
                  ariaLabel={t('listLabel')}
                  idPrefix="minimalist-a11y-option"
                  onSelect={setSelectedIndex}
                  onWheelConfirm={moveSelection}
                  listRef={listRef}
                />
                <div
                  className="minimalist-a11y-panel__detail flex max-w-[380px] flex-col gap-[22px]"
                  aria-live="polite"
                >
                  <h2 className="minimalist-a11y-panel__header">
                    {'// '}
                    {t(`options.${selectedKey}.title`)}
                  </h2>
                  {renderOptionBody(selectedKey)}
                </div>
              </>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
