import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { ThemeContext } from 'styled-components';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});

const CustomReactTooltip = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <ReactTooltip
      backgroundColor={colors.pink}
      textColor={colors.secondary}
      effect="solid"
    />
  );
};

export default CustomReactTooltip;
