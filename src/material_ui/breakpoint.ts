import { ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: false; // removes the `xl` breakpoint
  }
}

export const breakpointTheme = {
  breakpoints: {
    values: {
      sm: 0,
      md: 640,
      lg: 1080,
    },
  },
};
