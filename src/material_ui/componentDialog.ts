import { ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

export const componentDialogtheme = {
  components: {
    MuiDialog: {
      defaultProps: {
        maxWidth: false,
      },
      // styleOverrides: {
      //   paperFullWidth: {
      //     margin: '0px',
      //     width: '100%',
      //   },
      // },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          color: '#0E1013',
          padding: '21px 24px 12.6px 24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#0E1013',
          padding: '24px 32px !important',
          // Dialog box용 custom scroll 설정
          overflowY: 'overlay',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            marginTop: '24px',
            marginBottom: '24px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#0E1013',
            borderRadius: '5px',
            border: '3px white solid',
          },
          '&::-webkit-scrollbar-button': {
            display: 'none',
          },
        },
        // dividers - 2nd Type Dialog Action Buttons (With padding & shadow)
        dividers: {
          borderTop: 'none',
          borderBottom: 'none',
          '& + .MuiDialogActions-root': {
            padding: '16px 32px',
            boxShadow: '0px 1px 20px 0px #00183D0A,  0px 6px 12px 0px #00183D14, 0px 2px 16px -1px #00183D1A',
          },
        },
      },
    },
    MuiDialogActions: {
      defaultProps: {
        // disableSpacing: true,
      },
      styleOverrides: {
        root: {
          padding: '0px',
          '& > .MuiButton-root': {
            borderRadius: '0px',
          },
        },
      },
    },
  },
};
