import { ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

declare module '@mui/material' {}

export const componentCheckboxTheme = {
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#00183D0D',
          },
          '&.Mui-disabled': {
            color: '#00183D42',
          },
        },
      },
    },
  },
};
