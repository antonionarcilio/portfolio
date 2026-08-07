'use client';

import Image from 'next/image';

import dividerV1 from '@/_assets/icons/divider-v1.svg';

import type { MinimalistAppearance } from '../types';
import { dividerVariants } from '../variants';

type DividerProps = {
  appearance: MinimalistAppearance;
  variant?: 'v1' | 'v2';
  orientation?: 'horizontal' | 'vertical';
};

export function Divider({ appearance, variant = 'v1', orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical')
    return (
      <span
        className={`inline-flex h-4 w-fit items-center ${dividerVariants({ appearance, variant })} minimalist-divider--vertical`}
        role="separator"
        aria-orientation="vertical"
      >
        {variant === 'v1' ? <Image src={dividerV1} alt="" width={6} height={13} aria-hidden="true" /> : '✦'}
      </span>
    );
  return <hr className={dividerVariants({ appearance, variant })} />;
}
