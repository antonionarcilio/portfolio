'use client';

import { useTranslations } from 'next-intl';

import { useSnapScroll } from '@/features/gamified/hooks/use-snap-scroll';
import type { PortfolioData } from 'portfolio-content-model';

import { HOVER_LIFT_SCALE_VARIANT } from '../animations';
import { AnimatedCard } from './animated-card';
import { CornerBrackets } from './corner-brackets';
import { EmptyState } from './empty-state';
import { ScrollList } from './scroll-list';
import { SectionHeading } from './section-heading';

/** `@Instituição` do subtexto da formação: vira link (nova aba) só quando o CMS traz `institution_url`. */
function EducationInstitution({ name, href }: { name: string; href?: string }) {
  if (!href) return <>{`@${name}`}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-[3px] hover:text-cv-cyan/80 transition-colors duration-150 cursor-gamified-pointer"
    >
      {`@${name}`}
    </a>
  );
}

export function EducationSection({ items }: { items: PortfolioData['education'] }) {
  const t = useTranslations('gamified.education');
  const tHeadings = useTranslations('gamified.sectionHeadings');
  const { containerRef, getCardRef } = useSnapScroll(items.length, 12);

  return (
    <div>
      <SectionHeading>{tHeadings('education')}</SectionHeading>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollList
          ref={containerRef}
          maxHeight={170}
          maxHeightMobile={280}
          itemCount={items.length}
          hideScrollHint
          hideScrollbar
        >
          {items.map((item, i) => (
            <div key={item.title} className="mb-3 last:mb-0" ref={getCardRef(i)}>
              <AnimatedCard
                index={i}
                className="relative group border border-cv-border bg-cv-panel px-5 py-[18px] border-l-2 border-l-cv-border"
                whileHover={HOVER_LIFT_SCALE_VARIANT}
              >
                <CornerBrackets
                  size="sm"
                  className="border-cv-cyan opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
                <span className="block text-cv-text text-[14px]">{item.title}</span>
                <span className="block text-cv-cyan text-[12px] mt-1 tracking-[0.08em]">
                  {t('conclusion', { year: item.year })}{' '}
                  <EducationInstitution name={item.institution} href={item.institutionUrl} />
                </span>
              </AnimatedCard>
            </div>
          ))}
        </ScrollList>
      )}
    </div>
  );
}
