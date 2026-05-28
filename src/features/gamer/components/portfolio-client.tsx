'use client';

import { MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';
import { useA11y } from '@/features/gamer/contexts/a11y-context';

import { Achievements } from './achievements';
import { ContactSection } from './contact-section';
import { CvFooter } from './cv-footer';
import { CvHeader } from './cv-header';
import { EducationSection } from './education-section';
import { ExperienceSection } from './experience-section';
import { GamesSection } from './games-section';
import { ProjectsSection } from './projects-section';
import { Skills } from './skills';
import { Stats } from './stats';

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const { opts } = useA11y();
  const [flashExp, setFlashExp] = useState(false);
  const [flashSkills, setFlashSkills] = useState(false);
  const [flashProjects, setFlashProjects] = useState(false);

  const handleScrollToExperience = useCallback(() => {
    document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => setFlashExp(true), 650);
  }, []);

  const handleScrollToSkills = useCallback(() => {
    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => setFlashSkills(true), 650);
  }, []);

  const handleScrollToProjects = useCallback(() => {
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => setFlashProjects(true), 650);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('cv-page-scroll', 'cv-gamer-root');
    return () => {
      document.documentElement.classList.remove('cv-page-scroll', 'cv-gamer-root');
    };
  }, []);

  const statsWithDynamic = data.stats.map((s) =>
    s.label === 'Tecnologias' ? { ...s, value: `${data.skills.length}+` } : s,
  );

  return (
    <MotionConfig reducedMotion={opts.reduceMotion ? 'always' : 'never'}>
      <div className="cv-gamer-wrapper bg-cv-wrapper text-cv-text font-cv-mono text-[14px] leading-[1.5] tracking-[0.02em] min-h-screen">
        <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-10">
          <CvHeader data={data} />
          <Stats
            items={statsWithDynamic}
            onFirstClick={handleScrollToExperience}
            onSecondClick={handleScrollToSkills}
            onThirdClick={handleScrollToProjects}
          />
          <div className="grid grid-cols-[1.4fr_1fr] gap-12 max-cv:grid-cols-1 max-cv:gap-9">
            <div className="min-w-0 space-y-9">
              <Skills
                skillCategories={data.skillCategories}
                flash={flashSkills}
                onFlashEnd={() => setFlashSkills(false)}
              />
              {/* Contato e Formação: visíveis aqui só em telas <880px */}
              <div className="hidden max-cv:block">
                <ContactSection data={data} />
              </div>
              <div className="hidden max-cv:block">
                <EducationSection items={data.education} />
              </div>
              <ExperienceSection items={data.experience} flash={flashExp} onFlashEnd={() => setFlashExp(false)} />
              <ProjectsSection items={data.projects} flash={flashProjects} onFlashEnd={() => setFlashProjects(false)} />
            </div>
            <div className="min-w-0 space-y-9">
              <div className="max-cv:hidden">
                <ContactSection data={data} />
              </div>
              <div className="max-cv:hidden cv:mb-[25px]">
                <EducationSection items={data.education} />
              </div>
              <Achievements items={data.achievements} />
              <GamesSection games={data.games} />
            </div>
          </div>
          <CvFooter />
        </div>
      </div>
    </MotionConfig>
  );
}
