'use client';

import { useMinimalistA11y } from '@/features/minimalist/a11y';
import { MinimalistRecruiter } from '@/features/minimalist/components/recruiter';
import type { PortfolioData } from '@/shared/types/portfolio';

type MinimalistPageContentProps = {
  data: PortfolioData;
  locale: 'en' | 'pt-BR';
};

export function MinimalistPageContent({ data, locale }: MinimalistPageContentProps) {
  const { options, toggle } = useMinimalistA11y();
  return <MinimalistRecruiter data={data} locale={locale} a11yOptions={options} toggleA11y={toggle} />;
}
