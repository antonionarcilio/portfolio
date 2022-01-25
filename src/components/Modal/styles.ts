import styled, {StyledComponentBase} from 'styled-components';

interface StyledModalTypes extends StyledComponentBase<any, {}> {
  Container?: any;
  Area?: any;
  Charts?: any;
  Content?: any;
  Cover?: any;
}

interface CoverProps {
  Background: string;
}


const ModalPage: StyledModalTypes = styled.div``;

ModalPage.Container = styled.div`
  position: fixed;
  z-index: 99;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  backdrop-filter: blur(8px);
`

ModalPage.Area = styled.div`
  width: 60vw;
  height: 80vh;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  box-shadow: 0px 0px 16px 8px #0000008f;
`;

ModalPage.Charts = styled.div`
  width: 40%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${(props) => props.theme.colors.secondary};
`;

ModalPage.Content = styled.div`
  width: 60%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  main {
    width: 90%;
    height: 30%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: justify;
    gap: 0.5rem;


    p:first-child {
      font-weight: 600;
      text-align: center;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 90%;
    }
    p:last-child {
      font-weight: 300;
    }
  }
  footer {
    width: 100%;
    height: 20%;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    button {
      width: 7rem;
      height: 2rem;
      border-radius: 4px;
      border: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      color: ${(props) => props.theme.colors.text};
      background: ${(props) => props.theme.colors.secondary}
    }
    button a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    button:disabled {
      cursor: not-allowed;
      a {
        cursor: not-allowed;
      }
    }
  }
`;

ModalPage.Cover = styled.header<CoverProps>`
  width: 100%;
  height: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props => `url(${props.Background})`};
  background-repeat: no-repeat;
  background-size: cover;

  border-radius: 0px 8px 0px 0px;

`


export default ModalPage;
