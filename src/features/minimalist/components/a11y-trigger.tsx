import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef } from 'react';

import accessibility from '@/_assets/icons/accessibility.svg';
import chevronsDownUp from '@/_assets/icons/chevrons-down-up.svg';
import chevronsUpDown from '@/_assets/icons/chevrons-up-down.svg';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance, MinimalistInteractionState } from '../types';

export const a11yTriggerVariants = cva(
  'minimalist-a11y-trigger inline-flex items-center gap-1 border-0 bg-transparent p-0 text-minimalist-md text-minimalist-foreground cursor-pointer',
  {
    variants: {
      appearance: { light: 'minimalist-a11y-trigger--light', dark: 'minimalist-a11y-trigger--dark' },
      state: { regular: '', hover: 'minimalist-a11y-trigger--hover', focus: 'minimalist-a11y-trigger--focus' },
      opened: { true: 'minimalist-a11y-trigger--opened', false: 'minimalist-a11y-trigger--closed' },
    },
    defaultVariants: { appearance: 'light', state: 'regular', opened: false },
  },
);

export type A11yTriggerVariantProps = VariantProps<typeof a11yTriggerVariants>;

type MinimalistA11yTriggerProps = {
  activeCount?: number;
  appearance: MinimalistAppearance;
  opened: boolean;
  onClick: () => void;
  state?: MinimalistInteractionState;
};

export const MinimalistA11yTrigger = forwardRef<HTMLButtonElement, MinimalistA11yTriggerProps>(
  function MinimalistA11yTrigger({ activeCount, appearance, opened, onClick, state = 'regular' }, ref) {
    const t = useTranslations('minimalist.navigation');
    const soundEnabled = useMinimalistSoundPreference();
    const { play: playClickSound } = useMinimalistSoundEffects('mouseClickClose', soundEnabled);
    return (
      <button
        type="button"
        className={a11yTriggerVariants({ appearance, state, opened })}
        ref={ref}
        aria-expanded={opened}
        aria-label={t('accessibility')}
        onClick={() => {
          playClickSound();
          onClick();
        }}
      >
        <span className="minimalist-a11y-trigger__icons inline-flex items-center gap-1">
          <Image src={accessibility} alt="" width={20} height={20} aria-hidden="true" />
          <Image src={opened ? chevronsDownUp : chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />
        </span>
        {Boolean(activeCount) && <span className="minimalist-a11y-trigger__badge">({activeCount})</span>}
      </button>
    );
  },
);
