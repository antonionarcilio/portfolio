import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';


import Head from '@/components/Head';

import { ptBR, enUS } from '@/i18n';
import { I18nTypes } from '@/types/i18n';

import { Container } from '@/styles/pages/home';

const NavBar = dynamic(() => (import('@/components/NavBar')));

const Home = () => {
  const { locale } = useRouter();
  const translate:I18nTypes = locale === 'en-US' ? enUS : ptBR;

  return (
    <>
      <Head title={translate.head.page_homepage}/>
      <NavBar />

      <Container>
        <h1>{translate.pages.home.title}</h1>
      </Container>
    </>
  );
}

export default Home
