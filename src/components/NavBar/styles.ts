import styled from 'styled-components';

export const NavigationBar = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

  height: 10vh;
  gap: 1rem;
  padding: 0 6rem;

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: 1rem;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .code-page-button {
    outline: none;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    /* gap: 1rem; */
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.primary};
    border: 1px solid ${(props) => props.theme.colors.pink};

    span {
      padding: 0.4rem;
    }

    span:last-child {
      background: ${(props) => props.theme.colors.pink};
      color: ${(props) => props.theme.colors.primary};

      cursor: not-allowed;
    }
  }
`;
