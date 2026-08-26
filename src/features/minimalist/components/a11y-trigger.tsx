import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef } from 'react';

import chevronsDownUp from '@/_assets/icons/chevrons-down-up.svg';
import chevronsUpDown from '@/_assets/icons/chevrons-up-down.svg';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { Button } from './button';

type MinimalistA11yTriggerProps = {
  activeCount?: number;
  appearance: MinimalistAppearance;
  opened: boolean;
  onClick: () => void;
};

export const MinimalistA11yTrigger = forwardRef<HTMLButtonElement, MinimalistA11yTriggerProps>(
  function MinimalistA11yTrigger({ activeCount, appearance, opened, onClick }, ref) {
    const t = useTranslations('minimalist.navigation');
    const soundEnabled = useMinimalistSoundPreference();
    const { play: playClickSound } = useMinimalistSoundEffects('mouseClickClose', soundEnabled);
    return (
      <span className="minimalist-a11y-trigger-wrapper inline-flex items-center gap-1">
        <Button
          ref={ref}
          appearance={appearance}
          variant="tertiary"
          size="md"
          label={t('accessibilityName')}
          icon={
            <Image src={opened ? chevronsDownUp : chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />
          }
          aria-expanded={opened}
          aria-label={t('accessibility')}
          onClick={() => {
            playClickSound();
            onClick();
          }}
        />
        {Boolean(activeCount) && (
          <span className="minimalist-a11y-trigger__badge text-minimalist-md text-minimalist-foreground">
            ({activeCount})
          </span>
        )}
      </span>
    );
  },
);
