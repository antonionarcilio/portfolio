import {createContext, useState} from 'react';
import {
  LocaleContextProviderTypes,
  LocaleContextTypes,
} from '@/types/locale-context';
import {useRouter} from 'next/router';

const LocaleContext = createContext({} as LocaleContextTypes);

const LocaleContextProvider = ({children}: LocaleContextProviderTypes) => {
  const router = useRouter();
  const {locale} = router;
  const [currentLocale, setCurrentLocale] = useState(locale ?? 'en-US');

  const handleToggle = () => {
    switch (locale) {
      case 'pt-BR':
        router.push(router.asPath, router.asPath, {locale: 'en-US'});
        setCurrentLocale('en-US');
        break;
      case 'en-US':
        router.push(router.asPath, router.asPath, {locale: 'pt-BR'});
        setCurrentLocale('pt-BR');
        break;
      default:
        router.push(router.asPath, router.asPath, {locale: 'en-US'});
    }
  };

  return (
    <LocaleContext.Provider value={{currentLocale, handleToggle}}>
      {/* eslint-disable-next-line react/prop-types */}
      {children}
    </LocaleContext.Provider>
  );
};

export {LocaleContextProvider, LocaleContext};
