/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { ptBR, enUS } from '@/i18n';
import { I18nTypes } from '@/types/i18n';

// import HotToast from '@/components/HotToast';
// import LocaleSwitcher from '@/components/LocaleSwitcher';
// import CustomReactTooltip from '@/components/CustomReactTooltip';

import { NavigationBar, Line } from './styles';

const HotToast = dynamic(() => (import('@/components/HotToast')));
const CustomReactTooltip = dynamic(() => (import('@/components/CustomReactTooltip')));
const LocaleSwitcher = dynamic(() => (import('@/components/LocaleSwitcher')));

const NavBar = () => {
  const router = useRouter();
  const { query, locale } = router;

  const translate:I18nTypes = locale === 'en-US' ? enUS : ptBR;


  return (
    <>
      <NavigationBar>
        <div>
          {/* <li data-tip={translate.tooltip}>
          </li> */}

        </div>

        <div>
          <LocaleSwitcher />
        </div>
      </NavigationBar>

      <Line />

      <HotToast />
    </>

  );
};

export default NavBar;
