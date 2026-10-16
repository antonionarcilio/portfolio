import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef } from 'react';

import accessibilityIcon from '@/_assets/icons/accessibility.svg';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { MinimalistA11yActiveBadge } from './a11y-active-badge';
import { AnimatedIcon } from './animated-icon';
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
      <span className="minimalist-a11y-trigger-wrapper ms-auto inline-flex items-center gap-1">
        <Image
          className="minimalist-a11y-trigger__icon"
          src={accessibilityIcon}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
        />
        <Button
          ref={ref}
          appearance={appearance}
          variant="tertiary"
          size="md"
          label={t('accessibilityName')}
          icon={<AnimatedIcon icon={opened ? 'chevrons-down-up' : 'chevrons-up-down'} size={16} />}
          aria-expanded={opened}
          aria-label={t('accessibility')}
          onClick={() => {
            playClickSound();
            onClick();
          }}
        />
        {Boolean(activeCount) && (
          <MinimalistA11yActiveBadge count={activeCount ?? 0} label={t('activeCount', { count: activeCount ?? 0 })} />
        )}
      </span>
    );
  },
);
