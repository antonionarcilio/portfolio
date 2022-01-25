import React from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {ThemeContext} from 'styled-components';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {SiMinutemailer} from 'react-icons/si';
import {FaDollarSign, FaGithub} from 'react-icons/fa';
// components
import Head from '@/components/Head';
import Modal from '@/components/Modal';
// types
import {enUS, ptBR} from '@/i18n';
import {I18nTypes} from '@/types/i18n';
// styles
import HomePage, {WavesSvg} from '@/styles/pages/home';
// libs, hook
import {useInfiniteScroll} from '@/hooks/useInfiniteScroll';
import useOutsideClick from '@/hooks/useOutsideClick';
// dynamic import
const NavBar = dynamic(() => import('@/components/NavBar'));

interface ApiResponseTypes {
  data: string[];
  count: number;
}
interface ApiDataResponseTypes {
  urlRepository: string;
  urlSite: string;
  projectName: string;
  projectCover: {
    url: string;
    alt: string;
  };
}

const Home = () => {
  const {colors} = React.useContext(ThemeContext);
  // ref
  const maxPagesRef = React.useRef(0);
  const sentinelRef = React.useRef('js-sentinel').current;
  const modalAreaRef = React.useRef(null);
  const modalUrlRepositoryRef = React.useRef(null);
  const modalUrlSiteRef = React.useRef(null);
  const modalBackgroundRef = React.useRef(null);
  const modalProjectNameRef = React.useRef(null);
  // custom hook
  const {currentPage} = useInfiniteScroll({sentinelRef});
  // state
  const [itemsToBeViewed, setItemsToBeViewed] = React.useState([]);
  const [isVisible, setIsVisible] = React.useState(false);

  const {locale} = useRouter();
  const translate: I18nTypes = locale === 'en-US' ? enUS : ptBR;

  useOutsideClick(modalAreaRef, () => {
    if (isVisible) setIsVisible(false);
  });

  const handleVisibleModal = (
    urlRepository: string,
    urlSite: string,
    background: string,
    projectName: string,
  ) => {
    setIsVisible(currentValue => !currentValue);
    modalUrlRepositoryRef.current = urlRepository;
    modalUrlSiteRef.current = urlSite;
    modalBackgroundRef.current = background;
    modalProjectNameRef.current = projectName;
  };

  const perPage = 6;
  const year = new Date().getFullYear(); // returns the current year

  React.useEffect(() => {
    // prevent loop
    if (currentPage <= maxPagesRef.current || maxPagesRef.current === 0) {
      const ENDPOINT = `/api/v1/lab?per_page=${perPage}&page=${currentPage}`;

      (async () => {
        const response = await axios.get(ENDPOINT);
        const {data, count}: ApiResponseTypes = response.data;

        setItemsToBeViewed(prevDara => [...prevDara, ...data]);
        maxPagesRef.current = Math.ceil(count / perPage);
      })();
    }
  }, [currentPage]);

  //  when reloading the page, go to top of the page
  React.useEffect(() => {
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <>
      <Head title={translate.head.page_homepage} />

      <HomePage.Container>
        <NavBar />

        <HomePage.Header className="bio">
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
                  Lorem Ipsum é simplesmente uma simulação de texto da indústria
                  tipográfica e de impressos, e vem sendo utilizado desde o
                  século XVI, quando um impressor desconhecido pegou uma bandeja
                  de tipos e os embaralhou para fazer um livro de modelos de
                  tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como
                  também ao salto para a editoração eletrônica, permanecendo
                  essencialmente inalterado. Se popularizou na década de 60,
                  quando a Letraset lançou decalques contendo passagens de Lorem
                  Ipsum, e mais recentemente quando passou a ser integrado a
                  softwares de editoração eletrônica como Aldus PageMaker.
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

          <WavesSvg
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
            <g className="waves__parallax">
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
          </WavesSvg>
        </HomePage.Header>

        <HomePage.Main className="laboratory">
          {itemsToBeViewed.length > 0 ? (
            <div className="lab__content">
              {itemsToBeViewed.map((item: ApiDataResponseTypes, index) => (
                <div key={index} className="lab__wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      handleVisibleModal(
                        item.urlRepository,
                        item.urlSite,
                        item.projectCover.url,
                        item.projectName,
                      )
                    }
                  >
                    <img
                      src={item.projectCover.url}
                      alt={item.projectCover.alt}
                      className="project"
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                width: '100vw',
                height: '30vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.secondary,
              }}
            >
              <ReactLoading width={60} type="bubbles" color="#fff" />
            </div>
          )}

          <div
            id={sentinelRef}
            style={{
              width: '100vw',
              height: '1px',
              position: 'relative',
              opacity: '1',
              background: colors.secondary,
              // bottom: '10vh',
              zIndex: -99,
            }}
          />
        </HomePage.Main>

        <HomePage.Footer className="copyright">
          <WavesSvg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
            style={{transform: 'rotate(180deg)', animation: 'reverse'}}
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="waves__parallax">
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
          </WavesSvg>

          <p> Copyright © {year} Antônio Narcilio </p>
        </HomePage.Footer>

        {isVisible && (
          <Modal
            ref={modalAreaRef}
            urlRepository={modalUrlRepositoryRef.current}
            urlSite={modalUrlSiteRef.current}
            projectName={modalProjectNameRef.current}
            background={modalBackgroundRef.current}
          />
        )}
      </HomePage.Container>
    </>
  );
};

export default Home;
