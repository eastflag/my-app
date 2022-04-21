import { ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

declare module '@mui/material/styles/createPalette' {
  interface TypeText {
    white: string;
  }
}

export const paletteTheme = {
  palette: {
    type: 'light',
    primary: {
      main: '#0E1013',
      light: '#5A6172',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#483AEA',
      light: '#9890EC',
      dark: '#1E13B2',
      contrastText: '#FFFFFF',
    },
    third: {
      main: '#FFFFFF',
      contrastText: '#0E1013',
    },
    text: {
      primary: '#0E1013', // text의 기본값으로 적용됨
      secondary: '#5A6172',
      // body: '#FFFFFF', // 하위 항목 자유롭게 추가 및 자유롭게 사용가능 (별도 선언 필요없음) ???
      disabled: '#8D94A5',
      white: '#FFFFFF',
    },
    error: {
      main: '#EA483A',
    },
    warning: {
      main: '#ED6C02',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#6359E5',
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      dark: '#0E1013', // custom background color
    },
    // divider: '#D1D6E0',
    // action: {
    //   selectedOpacity: 0.16,
    // },
    grey: {
      50: '#F9FAFC',
      100: '#EFF2F7',
      200: '#D1D6E0',
      300: '#AAAFBC',
      400: '#8D94A5',
      500: '#70798E',
      600: '#5A6172',
      700: '#444956',
      800: '#262A37',
      900: '#0E1013',
    },
    point: {
      50: '#FBFBFF',
      100: '#F6F5FF',
      200: '#CBC8F5',
      300: '#9890EC',
      400: '#6359E5',
      500: '#483AEA',
      600: '#2F22DF',
      700: '#1E13B2',
      800: '#19108D',
      900: '#100A58',
    },
  },
};
