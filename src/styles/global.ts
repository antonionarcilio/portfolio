import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.text};
    overflow-x: hidden;
  }

  body,
  input,
  textarea,
  button {
    font: 400 1rem "inter", sans-serif;
  }

  /* ############################### SCROLL ################################ */

  body::-webkit-scrollbar-thumb {
    min-height: 10px !important;
    border-radius: 8px !important;
    background: ${(props) => props.theme.colors.scrollDefault} !important;
    box-shadow: none !important;

    border: 4px solid ${(props) => props.theme.colors.primary} !important;

    &:hover {
      -webkit-appearance: none !important;
      background: ${(props) => props.theme.colors.scrollHover} !important;
    }
    &:active {
      -webkit-appearance: none !important;
      background: ${(props) => props.theme.colors.scrollActive} !important;
    }
  }

  body::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.primary} !important;
    margin-top: 1.5px;
  }

  body::-webkit-scrollbar {
    /* width: 14px !important; */
    width: 0px !important;

    &:horizontal {
      height: 10px !important;
    }
  }


  button {
    cursor: pointer;
  }

  a {
    color: inherit; /* herda a cor do container dos links */
    text-decoration: none;
  }

  /* ################################ HACKS ################################ */

  .scroll--disable {
   overflow: hidden;
  }
  .scroll--only-vertical {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .scroll--only-horizontal {
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .scrollbar--hide {
    ::-webkit-scrollbar {
      width: 0px !important;

      &:horizontal {
        height: 0px !important;
      }
    }
  }
  .scrollbar--show {
    ::-webkit-scrollbar {
      width: 8px !important;

      &:horizontal {
        height: 0px !important;
      }
    }
  }



  @media (max-width: 1000px) {
    html {
      font-size: 93.75%;
    }
  }

  @media (max-width: 720px) {
    html {
      font-size: 87.5%;
    }
  }

`;

// export const GlobalContainer = styled.div`
//   /* margin-left: calc(1024px / 15); */
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 100vh;

//   @media (max-width: 720px) {
//     margin: 0 auto;
//   }
// `;
