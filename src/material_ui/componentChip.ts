import { ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

export const componentChipTheme = {
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: ['Poppins', 'Pretendard'].join(','),
          fontWeight: 400,
          fontSize: '1rem',
          borderRadius: 9999,
          backgroundColor: '#EFF2F7',
          height: 'fit-content',
        },
        sizeMedium: {
          padding: '8px 2px',
        },
        sizeSmall: {
          padding: '5px 6px',
        },
        colorPrimary: {
          backgroundColor: '#0E1013',
        },
        colorSecondary: {
          backgroundColor: '#483AEA',
        },
        deleteIconSmall: {
          marginRight: '1px',
        },
      },
    },
  },
};
