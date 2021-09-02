import styled from 'styled-components';

export const SwitcherLanguage = styled.button`
  border: 0;
  outline: 0;
  margin: 0;
  padding: 0;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${(props) => props.theme.colors.text};

  svg {
    width: 28px;
    border-radius: 2px;
  }
`;
