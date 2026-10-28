'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import highlightLinksIcon from '@/_assets/icons/lucide-highligh-links.svg';
import languagesIcon from '@/_assets/icons/lucide-languages.svg';
import cursorIcon from '@/_assets/icons/solar-cursor.svg';
import meditationRoundIcon from '@/_assets/icons/solar-meditation-round.svg';
import runningIcon from '@/_assets/icons/solar-running.svg';
import sunFogIcon from '@/_assets/icons/solar-sun-fog.svg';
import sunIcon from '@/_assets/icons/solar-sun.svg';
import { Radio } from '@/shared/components/radio';
import { ScrambleText } from '@/shared/components/scramble-text';
import { ToggleSwitch } from '@/shared/components/toggle-switch';
import { useTheme, type Theme } from '@/shared/contexts/theme-context';
import type { A11yFeatures } from './a11y-dropdown';
import { listItemVariants, listStaggerDelay } from './animations';
import { useLocaleSwitch } from './use-locale-switch';

/** Todos os ícones dos menus de ferramentas (visuais, acessibilidade, idiomas) têm o mesmo tamanho. */
const PANEL_ICON_PIXELS = 22;

type PanelRowProps = {
  /** Posição na lista: define o atraso da entrada sequencial. */
  index: number;
  icon: StaticImageData;
  label: string;
  control: ReactNode;
};

function PanelRow({ index, icon, label, control }: PanelRowProps) {
  return (
    <motion.div
      variants={listItemVariants}
      custom={listStaggerDelay(index)}
      initial="hidden"
      animate="visible"
      className="flex w-full items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Image src={icon} alt="" aria-hidden width={PANEL_ICON_PIXELS} height={PANEL_ICON_PIXELS} />
        <span className="whitespace-nowrap text-md font-regular font-portfolio text-alpha-black-100">
          <ScrambleText>{label}</ScrambleText>
        </span>
      </div>
      {control}
    </motion.div>
  );
}

const THEME_OPTIONS: { theme: Theme; icon: StaticImageData; labelKey: 'themeDay' | 'themeSunset' }[] = [
  { theme: 'day', icon: sunIcon, labelKey: 'themeDay' },
  { theme: 'sunset', icon: sunFogIcon, labelKey: 'themeSunset' },
];

export function VisualsList() {
  const t = useTranslations('pro.island');
  const { theme, selectTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label={t('tabVisuals')} className="flex flex-col gap-4">
      {THEME_OPTIONS.map((option, index) => (
        <PanelRow
          index={index}
          key={option.theme}
          icon={option.icon}
          label={t(option.labelKey)}
          control={
            <Radio
              size="lg"
              checked={theme === option.theme}
              onSelect={() => selectTheme(option.theme)}
              label={t(option.labelKey)}
            />
          }
        />
      ))}
    </div>
  );
}

const ACCESSIBILITY_OPTIONS: { key: keyof A11yFeatures; icon: StaticImageData; iconChecked?: StaticImageData }[] = [
  { key: 'bigCursor', icon: cursorIcon },
  { key: 'highlightLinks', icon: highlightLinksIcon },
  // `biggerText` (aumentar texto) fica oculto por enquanto: ampliar a raiz quebra layouts em px que ainda precisam de ajuste.
  { key: 'pauseAnimations', icon: runningIcon, iconChecked: meditationRoundIcon },
];

type AccessibilityListProps = { features: A11yFeatures; onToggle: (key: keyof A11yFeatures) => void };

export function AccessibilityList({ features, onToggle }: AccessibilityListProps) {
  const t = useTranslations('pro.a11y');

  return (
    <div className="flex flex-col gap-4">
      {ACCESSIBILITY_OPTIONS.map(({ key, icon, iconChecked }, index) => (
        <PanelRow
          index={index}
          key={key}
          icon={iconChecked && features[key] ? iconChecked : icon}
          label={t(key)}
          control={<ToggleSwitch checked={features[key]} onChange={() => onToggle(key)} label={t(key)} />}
        />
      ))}
    </div>
  );
}

const LANGUAGE_OPTIONS: { code: string; labelKey: 'portuguese' | 'english' }[] = [
  { code: 'pt-BR', labelKey: 'portuguese' },
  { code: 'en', labelKey: 'english' },
];

export function LanguagesList({ onSwitched }: { onSwitched: () => void }) {
  const t = useTranslations('pro.i18n');
  const navigationLabels = useTranslations('pro.nav');
  const { currentLocale, switchLocale } = useLocaleSwitch();

  return (
    <div role="radiogroup" aria-label={navigationLabels('languageLabel')} className="flex flex-col gap-4">
      {LANGUAGE_OPTIONS.map(({ code, labelKey }, index) => (
        <PanelRow
          index={index}
          key={code}
          icon={languagesIcon}
          label={t(labelKey)}
          control={
            <Radio
              size="lg"
              checked={currentLocale === code}
              onSelect={() => switchLocale(code, onSwitched)}
              label={t(labelKey)}
            />
          }
        />
      ))}
    </div>
  );
}
