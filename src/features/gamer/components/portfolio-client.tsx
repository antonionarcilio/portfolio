'use client';

import { useCallback, useEffect, useState } from 'react';

import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { Achievements } from './achievements';
import { ContactSection } from './contact-section';
import { CvFooter } from './cv-footer';
import { CvHeader } from './cv-header';
import { EducationSection } from './education-section';
import { ExperienceSection } from './experience-section';
import { GamesSection } from './games-section';
import { Skills } from './skills';
import { StackSection } from './stack-section';
import { Stats } from './stats';

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [flashExp, setFlashExp] = useState(false);
  const [flashSkills, setFlashSkills] = useState(false);
  const [flashStack, setFlashStack] = useState(false);

  const handleScrollToExperience = useCallback(() => {
    document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => setFlashExp(true), 650);
  }, []);

  const handleScrollToSkills = useCallback(() => {
    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      setFlashSkills(true);
      setFlashStack(true);
    }, 650);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('cv-page-scroll');
    return () => {
      document.documentElement.classList.remove('cv-page-scroll');
    };
  }, []);

  const statsWithDynamic = data.stats.map((s) =>
    s.label === 'Tecnologias' ? { ...s, value: `${data.skills.length}+` } : s,
  );

  return (
    <div className="cv-wrapper bg-cv-wrapper text-cv-text font-cv-mono text-[14px] leading-[1.5] tracking-[0.02em] min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-10">
        <CvHeader data={data} />
        <Stats items={statsWithDynamic} onFirstClick={handleScrollToExperience} onSecondClick={handleScrollToSkills} />
        <div className="grid grid-cols-[1.4fr_1fr] gap-12 max-cv:grid-cols-1 max-cv:gap-9">
          <div className="min-w-0 space-y-9">
            <Skills
              skillCategories={data.skillCategories}
              flash={flashSkills}
              onFlashEnd={() => setFlashSkills(false)}
            />
            {/* Stacks: visível após habilidades só em telas <880px */}
            <div className="hidden max-cv:block">
              <StackSection pills={data.stackPills} flash={flashStack} onFlashEnd={() => setFlashStack(false)} />
            </div>
            <div className="hidden max-cv:block">
              <ContactSection data={data} />
            </div>
            <ExperienceSection items={data.experience} flash={flashExp} onFlashEnd={() => setFlashExp(false)} />
            <EducationSection items={data.education} />
          </div>
          <div className="min-w-0 space-y-9">
            <div className="max-cv:hidden">
              <ContactSection data={data} />
            </div>
            <div className="max-cv:hidden">
              <StackSection pills={data.stackPills} flash={flashStack} onFlashEnd={() => setFlashStack(false)} />
            </div>
            <Achievements items={data.achievements} />
            <GamesSection games={data.games} />
          </div>
        </div>
        <CvFooter />
      </div>
    </div>
  );
}
