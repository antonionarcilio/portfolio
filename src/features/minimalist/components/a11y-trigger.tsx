import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import accessibility from '@/_assets/icons/accessibility.svg';
import chevronsDownUp from '@/_assets/icons/chevrons-down-up.svg';
import chevronsUpDown from '@/_assets/icons/chevrons-up-down.svg';

import type { MinimalistAppearance, MinimalistInteractionState } from '../types';

export const a11yTriggerVariants = cva('minimalist-a11y-trigger', {
  variants: {
    appearance: { light: 'minimalist-a11y-trigger--light', dark: 'minimalist-a11y-trigger--dark' },
    state: { regular: '', hover: 'minimalist-a11y-trigger--hover', focus: 'minimalist-a11y-trigger--focus' },
    opened: { true: 'minimalist-a11y-trigger--opened', false: 'minimalist-a11y-trigger--closed' },
  },
  defaultVariants: { appearance: 'light', state: 'regular', opened: false },
});

export type A11yTriggerVariantProps = VariantProps<typeof a11yTriggerVariants>;

type MinimalistA11yTriggerProps = {
  activeCount?: number;
  appearance: MinimalistAppearance;
  opened: boolean;
  onClick: () => void;
  state?: MinimalistInteractionState;
};

export function MinimalistA11yTrigger({
  activeCount,
  appearance,
  opened,
  onClick,
  state = 'regular',
}: MinimalistA11yTriggerProps) {
  const t = useTranslations('minimalist.navigation');
  return (
    <button
      type="button"
      className={a11yTriggerVariants({ appearance, state, opened })}
      aria-expanded={opened}
      aria-label={t('accessibility')}
      onClick={onClick}
    >
      <span className="minimalist-a11y-trigger__icons">
        <Image src={accessibility} alt="" width={20} height={20} aria-hidden="true" />
        <Image src={opened ? chevronsDownUp : chevronsUpDown} alt="" width={16} height={16} aria-hidden="true" />
      </span>
      {activeCount !== undefined && <span className="minimalist-a11y-trigger__badge">({activeCount})</span>}
    </button>
  );
}
