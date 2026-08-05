'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import chevronLeft from '@/_assets/icons/chevron-left.svg';
import chevronRight from '@/_assets/icons/chevron-right.svg';

import type { MinimalistAppearance } from '../types';
import { paginationVariants } from '../variants';

type PaginationButtonProps = {
  appearance: MinimalistAppearance;
  direction: 'previous' | 'next';
  disabled?: boolean;
  onClick: () => void;
  state?: 'regular' | 'hover' | 'focus';
};

export function PaginationButton({
  appearance,
  direction,
  disabled = false,
  onClick,
  state = 'regular',
}: PaginationButtonProps) {
  const t = useTranslations('minimalist.controls');
  const isPrevious = direction === 'previous';
  return (
    <button
      type="button"
      className={paginationVariants({ appearance, state })}
      aria-label={t(isPrevious ? 'previous' : 'next')}
      disabled={disabled}
      onClick={onClick}
    >
      <Image src={isPrevious ? chevronLeft : chevronRight} alt="" width={12} height={12} aria-hidden="true" />
    </button>
  );
}
