import styled, { StyledComponentBase } from 'styled-components';
export interface StyledHomeTypes extends StyledComponentBase<any, {}> {
  Container?: any;
  Header?: any;
  Main?: any;
  Footer?: any;
}

const HomePage: StyledHomeTypes = styled.div``;

HomePage.Container = styled.div`
  width: 100%;
  min-height: 100vh;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;

  h1 {
    font-size: 50px;
    color: ${(props) => props.theme.colors.text};
  }
`;

HomePage.Header = styled.header`
&.bio {
  width: 100%;
  min-height: 90vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

&.bio .bio__content {
  display: flex;
  flex-direction: row;

  padding: 4rem 12rem 0rem;
  gap: 2rem;

  img.bio__photo {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 50%;
    border: 6px solid ${(props) => props.theme.colors.text};
    box-shadow: 0px 8px 10px 2px #00000070;
  }

  .bio__wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;
  }

  .bio__wrapper header {
    height: 100%;
    font-size: 1rem;
  }
  .bio__wrapper header p.name {
    font-size: 2rem;
    font-weight: 600;
  }
  .bio__wrapper header p.profession {
    font-size: 1rem;
    font-weight: 300;
  }

  .bio__wrapper main {
    text-align: justify;
  }

  .bio__wrapper footer {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;

    a {
      background: ${(props) => props.theme.colors.secondary};
      padding: 0.6rem;
      color: ${(props) => props.theme.colors.text};
      border: 0;
      outline: 0;
      border-radius: 4px;

      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 0.5rem;
    }
  }
}

`

HomePage.Main = styled.main`
&.laboratory {
  width: 100%;

  .lab__content {
    width: 100%;
    min-height: 50vh;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    padding: 6rem 6rem;
    gap: 1rem;

    position:relative;
    text-align:center;
    background-color: ${(props) => props.theme.colors.secondary};
  }

  .lab__wrapper {
    width: 100%;
    height: 220px;
  }
  .lab__wrapper button {
    background: transparent;
    outline: 0;
    border: 0;
  }
  .lab__wrapper img.project {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
}
`

HomePage.Footer = styled.footer`
&.copyright {
  width: 100%;

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 20vh;
  }
}
`

export const WavesSvg = styled.svg`
/* ANIMATION */

.waves__parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}
.waves__parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.waves__parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.waves__parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.waves__parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px,0,0);
  }
  100% {
    transform: translate3d(85px,0,0);
  }
}
`

export default HomePage;
