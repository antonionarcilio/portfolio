'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useId, useState, type ReactNode } from 'react';

import arrowLeftIcon from '@/_assets/icons/lucide-arrow-left.svg';
import { ACCORDION_TRANSITION, accordionArrowVariants, accordionPanelVariants } from '@/shared/animations';
import { ScrambleText } from '@/shared/components/scramble-text';

type AccordionProps = {
  label: string;
  defaultExpanded?: boolean;
  children: ReactNode;
};

/**
 * Collapsible section: a header row with an arrow and a bottom-bordered panel. Each instance
 * toggles independently, so several can be open at once.
 * @example <Accordion label="Stack" defaultExpanded><p>Wordpress</p></Accordion>
 */
export function Accordion({ label, defaultExpanded = false, children }: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const panelId = useId();
  const state = expanded ? 'expanded' : 'collapsed';

  return (
    <div className="group/accordion flex w-full flex-col items-start">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((previous) => !previous)}
        className="flex w-full items-center justify-between border-b border-alpha-black-30 pb-[8.5px] pr-[8px] pt-[8px] text-left font-portfolio text-lg font-semibold text-alpha-black-100 text-pretty hover:text-alpha-black-70 focus-visible:text-alpha-black-70 focus-visible:outline-none"
      >
        <span>
          <ScrambleText>{label}</ScrambleText>
        </span>
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={state}
          variants={accordionArrowVariants}
          transition={ACCORDION_TRANSITION}
          className="flex size-[18px] shrink-0 items-center justify-center"
        >
          <Image src={arrowLeftIcon} alt="" width={18} height={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            role="region"
            key="panel"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={accordionPanelVariants}
            transition={ACCORDION_TRANSITION}
            className="w-full overflow-hidden"
          >
            {/* The last accordion drops the panel divider so the list does not end with a stray rule. */}
            <div className="border-b border-alpha-black-30 py-[18px] group-last/accordion:border-b-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
