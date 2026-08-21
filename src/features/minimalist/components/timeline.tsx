import type {
  MinimalistAppearance,
  MinimalistTimelineActiveStep,
  MinimalistTimelineProps,
  MinimalistTimelineStepState,
} from '../types';
import { timelineStepVariants, timelineVariants } from '../variants';

type TimelineStepProps = {
  appearance: MinimalistAppearance;
  state: MinimalistTimelineStepState;
};

function TimelineStep({ appearance, state }: TimelineStepProps) {
  return <span className={timelineStepVariants({ appearance, state })} aria-hidden="true" />;
}

type TimelineItemProps = {
  appearance: MinimalistAppearance;
  activeStep: MinimalistTimelineActiveStep;
};

function TimelineItem({ appearance, activeStep }: TimelineItemProps) {
  return (
    <div className="minimalist-timeline__item flex h-[230px] flex-col items-center">
      <TimelineStep appearance={appearance} state={activeStep === 'start' ? 'active' : 'inactive'} />
      <span
        className="minimalist-timeline__line-wrapper flex w-[14px] flex-1 items-stretch justify-center"
        aria-hidden="true"
      >
        <span className="minimalist-timeline__line w-px bg-minimalist-foreground" />
      </span>
      <TimelineStep appearance={appearance} state={activeStep === 'end' ? 'active' : 'inactive'} />
    </div>
  );
}

export function TimelineExperience({ startYear, endYear, activeStep, appearance }: MinimalistTimelineProps) {
  return (
    <div className={timelineVariants({ appearance })} data-minimalist-timeline="experience">
      <span className="minimalist-timeline__label text-minimalist-sm font-weight-minimalist-medium leading-minimalist-text-sm text-right">
        {startYear}
      </span>
      <TimelineItem appearance={appearance} activeStep={activeStep} />
      <span className="minimalist-timeline__label text-minimalist-sm font-weight-minimalist-medium leading-minimalist-text-sm text-right">
        {endYear}
      </span>
    </div>
  );
}
