'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';

import figmaLogoOutline from '@/_assets/icons/misc-logo-figma-outline.svg';
import figmaLogo from '@/_assets/icons/misc-logo-figma.svg';
import githubLogo from '@/_assets/icons/misc-logo-github.svg';

import {
  MINIMALIST_EASE,
  MINIMALIST_LOGO_LINKS_DURATION,
  MINIMALIST_LOGO_LINKS_HIDE_DELAY_MS,
  MINIMALIST_LOGO_LINKS_ICON_STAGGER,
} from '../animations';
import type { MinimalistAppearance } from '../types';
import { Divider } from './divider';

const FIGMA_DESIGN_URL =
  'https://www.figma.com/design/oaRNKV5sEnHE2gffqUbMJl/Portfolio---Minimalist?node-id=2097-18149';
const GITHUB_REPO_URL = 'https://github.com/antonionarcilio/portfolio';
const ICON_SLIDE_OFFSET = 8;

function buildLinks(appearance: MinimalistAppearance) {
  return [
    {
      href: FIGMA_DESIGN_URL,
      src: appearance === 'dark' ? figmaLogoOutline : figmaLogo,
      labelKey: 'figmaLink',
      titleKey: 'figmaTitle',
      invert: false,
    },
    { href: GITHUB_REPO_URL, src: githubLogo, labelKey: 'githubLink', titleKey: 'githubTitle', invert: true },
  ] as const;
}

type LogoLinksProps = {
  appearance: MinimalistAppearance;
  logoSrc: string;
  logoAlt: string;
};

/**
 * Header logo — reveals the Figma/GitHub links beside it on hover/focus. A fixed-width spacer
 * mirrors the reveal's width on the opposite side so the logo itself never shifts position.
 *
 * @example
 * <LogoLinks appearance={appearance} logoSrc={logo} logoAlt={data.name} />
 */
export function LogoLinks({ appearance, logoSrc, logoAlt }: LogoLinksProps) {
  const t = useTranslations('minimalist.header');
  const [isOpen, setIsOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const links = buildLinks(appearance);

  const open = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setIsOpen(true);
  };
  const scheduleClose = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setIsOpen(false), MINIMALIST_LOGO_LINKS_HIDE_DELAY_MS);
  };
  const lastIconDelay = (links.length - 1) * MINIMALIST_LOGO_LINKS_ICON_STAGGER;

  return (
    <div
      className="minimalist__logo-links absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocus={open}
      onBlur={scheduleClose}
    >
      <span className="invisible w-[57.6px] shrink-0" aria-hidden="true" />
      <Image className="minimalist__logo block" src={logoSrc} alt={logoAlt} width={73} height={21} />
      <span className="flex w-[57.6px] shrink-0 items-center gap-2">
        <motion.span
          className="inline-flex"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{
            duration: MINIMALIST_LOGO_LINKS_DURATION,
            ease: MINIMALIST_EASE,
            delay: isOpen ? 0 : lastIconDelay + MINIMALIST_LOGO_LINKS_DURATION,
          }}
        >
          <Divider appearance={appearance} orientation="vertical" />
        </motion.span>
        <span className="flex items-center gap-2">
          {links.map(({ href, src, labelKey, titleKey, invert }, index) => (
            <motion.a
              key={href}
              className="inline-flex h-[18px] w-[18px]"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(labelKey)}
              title={t(titleKey)}
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -ICON_SLIDE_OFFSET }}
              transition={{
                duration: MINIMALIST_LOGO_LINKS_DURATION,
                ease: MINIMALIST_EASE,
                delay: isOpen
                  ? MINIMALIST_LOGO_LINKS_DURATION + index * MINIMALIST_LOGO_LINKS_ICON_STAGGER
                  : index * MINIMALIST_LOGO_LINKS_ICON_STAGGER,
              }}
            >
              <Image
                className={clsx('block', invert && '[filter:var(--minimalist-icon-filter,none)]')}
                src={src}
                alt=""
                width={18}
                height={18}
              />
            </motion.a>
          ))}
        </span>
      </span>
    </div>
  );
}
