import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

import Head from '@/components/Head';
import { LocaleContextProvider } from '@/contexts/LocaleContext';

import dark from '@/styles/themes/dark';
// import light from '@/styles/themes/light';

import GlobalStyles from '@/styles/global';

export default function App({ Component, pageProps }:AppProps) {
  return (
    <>
      <ThemeProvider theme={dark}>
        <LocaleContextProvider>

          <Head title="Template" />
          <GlobalStyles />
          <Component {...pageProps} />

        </LocaleContextProvider>

      </ThemeProvider>
    </>
  );
}
