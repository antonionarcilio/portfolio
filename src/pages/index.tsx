import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import React from 'react';
import {SiMinutemailer} from 'react-icons/si';
import {FaDollarSign, FaGithub} from 'react-icons/fa';

import Head from '@/components/Head';

import {ptBR, enUS} from '@/i18n';
import {I18nTypes} from '@/types/i18n';

import HomePage from '@/styles/pages/home';
import {ThemeContext} from 'styled-components';

const NavBar = dynamic(() => import('@/components/NavBar'));

const Home = () => {
  const {locale} = useRouter();
  const translate: I18nTypes = locale === 'en-US' ? enUS : ptBR;
  const {colors} = React.useContext(ThemeContext);

  const year = new Date().getFullYear(); // returns the current year

  return (
    <>
      <Head title={translate.head.page_homepage} />
      <NavBar />

      <HomePage.Container>
        <header className="bio">
          <div className="bio__content">
            <img
              src="https://avatars.githubusercontent.com/u/49988118?v=4"
              alt="Antonio Narcilio"
              className="bio__photo"
            />

            <div className="bio__wrapper">
              <header>
                <p className="name">Antônio Narcilio</p>
                <p className="profession">
                  Analista e Desenvolvedor de Sistemas | Web Developer |
                  Front-End
                </p>
              </header>

              <main>
                <p className="about">
                  Me chamo Antônio Narcilio sou Análise e Desenvolvimento de
                  Sistemas e sou apaixonado por aquilo que faço, buscando sempre
                  dar o meu melhor. Tenho conhecimento e práticas em
                  desenvolvimento Web tanto na parte do back-end quanto também
                  no front-end que é a "área" na qual eu mais me identifico.
                </p>
                <br />
                <span className="stacks">
                  <img
                    alt="JavaScript"
                    title="JavaScript"
                    src="https://img.shields.io/badge/Java%20Script-F7DF1E?style=flat&logo=JavaScript&logoColor=black"
                  />
                  &ensp;
                  <img
                    alt="TypeScript"
                    title="TypeScript"
                    src="https://img.shields.io/badge/Type%20Script-2F95E3?style=flat&logo=TypeScript&logoColor=white"
                  />
                  &ensp;
                  <img
                    alt="ReactJs"
                    title="ReactJs"
                    src="https://img.shields.io/badge/React%20JS-5CCFEE?style=flat&logo=React&logoColor=white"
                  />
                  &ensp;
                  <img
                    alt="NextJs"
                    title="NextJs"
                    src="https://img.shields.io/badge/Next%20JS-f8f8f8?style=flat&logo=Vercel&logoColor=black"
                  />
                  &ensp;
                  <img
                    alt="NodeJs"
                    title="NodeJs"
                    src="https://img.shields.io/badge/Node%20JS-339933?style=flat&logo=Node.Js&logoColor=white"
                  />
                  &ensp;
                </span>
              </main>

              <footer>
                <a
                  className="contact"
                  target="_blank"
                  href="https://www.linkedin.com/in/antonionarcilio"
                >
                  <SiMinutemailer /> Contact Me
                </a>

                <a
                  className="donate"
                  target="_blank"
                  href="https://buymeacoffee.com/antonionarcilio"
                >
                  <FaDollarSign /> Buy me a coffee
                </a>

                <a
                  className="donate"
                  target="_blank"
                  href="https://github.com/AntonioNarcilio"
                >
                  <FaGithub /> GitHub
                </a>
              </footer>
            </div>
          </div>

          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill={colors.firstWave}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill={colors.secondWave}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill={colors.thirdWave}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="7"
                fill={colors.fourthWave}
              />
            </g>
          </svg>
        </header>

        <main className="laboratory">
          <div className="lab__content">
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
            <div className="lab__wrapper">
              <img src="/images/hls-player.png" alt="" className="project" />
            </div>
          </div>
        </main>

        <footer className="copyright">
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
            style={{transform: 'rotate(180deg)'}}
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill={colors.firstWave}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill={colors.secondWave}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill={colors.thirdWave}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="7"
                fill={colors.fourthWave}
              />
            </g>
          </svg>

          <p> Copyright © {year} Antônio Narcilio </p>
        </footer>
      </HomePage.Container>
    </>
  );
};

export default Home;
