'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import type { A11yFeatures } from '@/shared/a11y/store';
import { AnimatedIcon } from '@/shared/components/animated-icon/animated-icon';
import type { AnimatedIconName } from '@/shared/components/animated-icon/animated-icon-registry';
import { Radio } from '@/shared/components/radio';
import { ScrambleText } from '@/shared/components/scramble-text';
import { ToggleSwitch } from '@/shared/components/toggle-switch';
import { useTheme, type Theme } from '@/shared/contexts/theme-context';
import { A11Y_OPTIONS } from './a11y-options';
import { listItemVariants, listStaggerDelay } from './animations';
import { useLocaleSwitch } from './use-locale-switch';

/** Todos os ícones dos menus de ferramentas (visuais, acessibilidade, idiomas) têm o mesmo tamanho. */
const PANEL_ICON_PIXELS = 22;

type PanelRowProps = {
  /** Posição na lista: define o atraso da entrada sequencial. */
  index: number;
  /** Imagem estática ou nome de um ícone animado (anima no hover/foco da linha inteira). */
  icon: StaticImageData | AnimatedIconName;
  label: string;
  control: ReactNode;
};

function PanelRowIcon({ icon }: { icon: StaticImageData | AnimatedIconName }) {
  // `key`: uma instância por ícone (ex.: corredor ⇄ meditação), senão o React reaproveitaria a anterior.
  if (typeof icon === 'string') {
    return <AnimatedIcon key={icon} name={icon} sizePixels={PANEL_ICON_PIXELS} trigger="parent" />;
  }
  return <Image src={icon} alt="" aria-hidden width={PANEL_ICON_PIXELS} height={PANEL_ICON_PIXELS} />;
}

function PanelRow({ index, icon, label, control }: PanelRowProps) {
  return (
    <motion.div
      variants={listItemVariants}
      custom={listStaggerDelay(index)}
      initial="hidden"
      animate="visible"
      data-animated-icon-host
      className="flex w-full items-center justify-between"
    >
      <div className="flex items-center gap-md">
        <PanelRowIcon icon={icon} />
        <span className="whitespace-nowrap text-md font-regular font-portfolio text-alpha-black-100">
          <ScrambleText>{label}</ScrambleText>
        </span>
      </div>
      {control}
    </motion.div>
  );
}

const THEME_OPTIONS: { theme: Theme; icon: AnimatedIconName; labelKey: 'themeDay' | 'themeSunset' }[] = [
  { theme: 'day', icon: 'sun', labelKey: 'themeDay' },
  { theme: 'sunset', icon: 'sun-fog', labelKey: 'themeSunset' },
];

export function VisualsList() {
  const t = useTranslations('pro.island');
  const { theme, selectTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label={t('tabVisuals')} className="flex flex-col gap-lg">
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

type AccessibilityListProps = { features: A11yFeatures; onToggle: (key: keyof A11yFeatures) => void };

export function AccessibilityList({ features, onToggle }: AccessibilityListProps) {
  const t = useTranslations('pro.a11y');

  return (
    <div className="flex flex-col gap-lg">
      {A11Y_OPTIONS.map(({ key, icon, iconChecked }, index) => (
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

type LanguagesListProps = { onSwitched: () => void; switchDelayMilliseconds?: number };

export function LanguagesList({ onSwitched, switchDelayMilliseconds }: LanguagesListProps) {
  const t = useTranslations('pro.i18n');
  const navigationLabels = useTranslations('pro.nav');
  const { currentLocale, switchLocale } = useLocaleSwitch();

  return (
    <div role="radiogroup" aria-label={navigationLabels('languageLabel')} className="flex flex-col gap-lg">
      {LANGUAGE_OPTIONS.map(({ code, labelKey }, index) => (
        <PanelRow
          index={index}
          key={code}
          icon="languages"
          label={t(labelKey)}
          control={
            <Radio
              size="lg"
              checked={currentLocale === code}
              onSelect={() => switchLocale(code, onSwitched, switchDelayMilliseconds)}
              label={t(labelKey)}
            />
          }
        />
      ))}
    </div>
  );
}
