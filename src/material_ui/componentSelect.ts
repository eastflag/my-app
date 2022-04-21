import { ThemeOptions } from '@mui/material';

interface IThemeOptions extends ThemeOptions {}
export const componentSelectTheme = {
  components: {
    MuiInputBase: {
      styleOverrides: {
        formControl: {
          '& .MuiSvgIcon-root': {
            color: '#00183D8A',
            '&.Mui-disabled': {
              color: '#00183D8A',
            },
          },
        },
        adornedStart: {
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },
        inputAdornedStart: {
          marginLeft: '8px',
        },
      },
    },
  },
};
