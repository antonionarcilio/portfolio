import { ReactNode } from 'react';

type LocaleContextProviderTypes = {
  children: ReactNode
}

type LocaleContextTypes = {
  currentLocale: string;
  handleToggle: () => void;
}

export { LocaleContextProviderTypes, LocaleContextTypes };
