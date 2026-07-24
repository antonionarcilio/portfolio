'use client';

import { animate, motion, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import type { PortfolioData } from '@/shared/types/portfolio';

import { Achievements } from './achievements';
import { ContactSection } from './contact-section';
import { CvFooter } from './cv-footer';
import { CvHeader } from './cv-header';
import { EducationSection } from './education-section';
import { ExperienceSection } from './experience-section';
import { ProjectsSection } from './projects-section';
import { SkillMap } from './skill-map';
import { Stats } from './stats';

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [flashExp, setFlashExp] = useState(false);
  const [flashSkills, setFlashSkills] = useState(false);
  const [flashProjects, setFlashProjects] = useState(false);
  // Drives the master grid: collapsed = map sits in the left column; expanded =
  // map spans both columns while its side panel is open. Toggled by SkillMap.
  const [smCollapsed, setSmCollapsed] = useState(true);
  // MotionValue direto — a animação de opacity do col2 roda fora do ciclo de
  // render do React, evitando race conditions entre setState e o loop interno
  // do Framer Motion que causavam múltiplos writes no atributo opacity.
  const col2Opacity = useMotionValue(1);

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

  return (
    <div className="cv-gamer-wrapper bg-cv-wrapper text-cv-text font-cv-mono text-[14px] leading-[1.5] tracking-[0.02em] min-h-screen">
      <div className="max-w-[1174px] mx-auto px-6 pt-10 pb-10 cv-page-content">
        <CvHeader data={data} />
        <main id="main-content">
          <Stats
            items={data.stats}
            linkedinUrl={data.linkedinUrl}
            onFirstClick={handleScrollToExperience}
            onSecondClick={handleScrollToSkills}
            onThirdClick={handleScrollToProjects}
          />
          <div className={'sm-layout' + (smCollapsed ? ' sm-collapsed' : '')}>
            <div className="sm-skillmap">
              <SkillMap
                onPanelChange={(open) => {
                  if (!open) {
                    // Snap para opacity 0 sincronamente (não via setState, sem render)
                    col2Opacity.set(0);
                    setSmCollapsed(true);
                    // Dois rAFs: garante que o grid novo foi pintado antes do fade-in
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => animate(col2Opacity, 1, { duration: 0.35, ease: 'easeOut' })),
                    );
                  } else {
                    col2Opacity.set(0);
                    setSmCollapsed(false);
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => animate(col2Opacity, 1, { duration: 0.35, ease: 'easeOut' })),
                    );
                  }
                }}
                flash={flashSkills}
                onFlashEnd={() => setFlashSkills(false)}
                skills={data.skillCategories}
                projects={data.projects}
              />
            </div>
            <div className="sm-col1 gap-9">
              <ExperienceSection items={data.experience} flash={flashExp} onFlashEnd={() => setFlashExp(false)} />
              <ProjectsSection
                items={data.projects}
                flash={flashProjects}
                onFlashEnd={() => setFlashProjects(false)}
                expanded={!smCollapsed}
              />
            </div>
            <div className="sm-col2">
              <motion.div className="flex flex-col gap-9" style={{ opacity: col2Opacity }}>
                <div className="sm-contact">
                  <ContactSection data={data} />
                </div>
                <div className="sm-education">
                  <EducationSection items={data.education} />
                </div>
                <div className="sm-achievements">
                  <Achievements items={data.achievements} />
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        <CvFooter openToWork={!data.company} />
      </div>
    </div>
  );
}
