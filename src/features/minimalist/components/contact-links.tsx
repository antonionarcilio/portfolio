import { Fragment } from 'react';

import type { PortfolioData } from '@/shared/types/portfolio';

import type { MinimalistAppearance } from '../types';
import { MinimalistAnchor } from './anchor';
import { Divider } from './divider';

export type ContactLink = { key: string; href: string; label: string };

export function buildContactLinks(data: PortfolioData): ContactLink[] {
  return data.contacts.map((contact) => ({ key: contact.url, href: contact.url, label: contact.label }));
}

export function ContactLinks({ data, appearance }: { data: PortfolioData; appearance: MinimalistAppearance }) {
  return (
    <div className="minimalist__about-meta flex flex-wrap items-center gap-x-2 gap-y-2 mt-[6px]">
      {buildContactLinks(data).map((link, index) => (
        <Fragment key={link.key}>
          {index > 0 && <Divider appearance={appearance} variant="v1" orientation="vertical" />}
          <MinimalistAnchor appearance={appearance} href={link.href} variant="secondary">
            {link.label}
          </MinimalistAnchor>
        </Fragment>
      ))}
    </div>
  );
}
