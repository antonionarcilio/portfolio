// Informando para o typescript as propriedades do tema
import 'styled-components';
// 📃 Sobrescrevendo definições de tipos n o styled-component
// 📃 Precisa add o arquivo no tsconfig.json
declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      primary: string;
      secondary: string;
      text: string;
      placeholder: string;
      placeholderText: string;
      scrollDefault: string;
      scrollHover: string;
      scrollActive: string;
      cyan: string;
      green: string;
      darkGreen: string;
      orange: string;
      pink: string;
      purple: string;
      red: string;
      darkRed: string;
      yellow: string;
      firstWave: string;
      secondWave: string;
      thirdWave: string;
      fourthWave: string;
    },
  }
}
