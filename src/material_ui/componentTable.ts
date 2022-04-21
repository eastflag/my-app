import { createTheme, ThemeOptions } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/styles';
import { breakpointTheme } from './breakpoint';
import { typographyTheme } from './typography';
import { paletteTheme } from './palette';
import { componentButtonTheme } from './componentButton';
import { componentCheckboxTheme } from './componentCheckbox';
import { componentDialogtheme } from './componentDialog';

interface IThemeOptions extends ThemeOptions {}

export const componentTableTheme = {
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgrounColor: '#FFFFFF',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        head: {
          '& .MuiTableCell-head': {
            borderBottom: '1px solid #5A6172',
          },
        },
        root: {
          '&.Mui-selected': {
            backgroundColor: '#F6F5FF',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#E3E3EE',
          },
        },
        hover: {
          '&:hover': {
            backgroundColor: '#00183D0D',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: '12px',
          paddingBottom: '12px',
        },
        paddingCheckbox: {
          padding: '0 0 0 4px',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#EFF2F7',
          },
          '&.Mui-selected': {
            backgroundColor: '#0E1013',
            color: '#FFFFFF',
          },
        },
      },
    },
  },
};
