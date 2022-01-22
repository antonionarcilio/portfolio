import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import Head from '@/components/Head';
import HotToast from '@/components/HotToast';
import LottieAnimation from '@/components/LottieAnimation';

import { enUS, ptBR } from '@/i18n';
import { I18nTypes } from '@/types/i18n';
import loadingAnimation from '@/assets/animations/404-error.json';

import Container from './styles';

const NotFound = () => {
  const router = useRouter();
  const { locale } = router;
  const translate:I18nTypes = locale === 'en-US' ? enUS : ptBR;

  // Redirecionando para a pagina home
  useEffect(() => {
    toast.error(`${translate.toast.page_not_found.toast1}`);

    setTimeout(() => {
      toast(`${translate.toast.page_not_found.toast2}`, {
        icon: '⌛',
      });
    }, 1000);

    setTimeout(() => {
      // replace: não adiciona uma nova entrada url (nao add a rota no caminho)
      router.replace('/');
    }, 6000);
  }, []);

  return (
    <>
      <Head title={translate.head.page_not_found} />

      <Container>
        <LottieAnimation
          ID="404"
          Width={600}
          Height={600}
          LoadingAnimation={loadingAnimation}
        />
      </Container>

      <HotToast />
    </>
  );
}

export default NotFound;
