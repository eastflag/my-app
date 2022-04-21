import { createTheme, ThemeOptions } from '@mui/material/styles';
import merge from 'lodash/merge';
import { breakpointTheme } from './breakpoint';
import { componentButtonTheme } from './componentButton';
import { componentCheckboxTheme } from './componentCheckbox';
import { componentChipTheme } from './componentChip';
import { componentDialogtheme } from './componentDialog';
import { componentSelectTheme } from './componentSelect';
import { componentTableTheme } from './componentTable';
import { paletteTheme } from './palette';
import { typographyTheme } from './typography';

interface IThemeOptions extends ThemeOptions {}

declare module '@mui/material' {
  interface IconButtonPropsColorOverrides {
    third: true; // Add icon button third color for
  }
}

export enum APP_BAR_HEIGHT {
  NORMAL = 88,
  THIN = 64,
}

const test: ThemeOptions = {
  components: {
    MuiInputBase: {
      defaultProps: {
        autoComplete: 'off',
      },
    },
  },
};

export const themeStyles = {
  spacing: 8,
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '10px 28px 10px 16px',
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          minWidth: '30px !important',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none', // Remove Link underline
        },
      },
    },
    // Switch style
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& > .MuiSwitch-track': {
            backgroundColor: '#70798E',
          },
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: 'white',
          },
          '&.Mui-checked + span': {
            opacity: '1 !important',
          },
        },
      },
    },
    // Input typography
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: ['Poppins', 'Pretendard'].join(','),
          fontWeight: 400,
          fontSize: '1rem', // label painted 75% scale automatically
          // Error인 input field 의 값이 없을때, inactive 상태에서 label 색상은 error색상이 아닌 기본 라벨색상으로 표시되도록 설정
          '&.Mui-error[data-shrink="false"]': {
            color: '#5A6172',
          },
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        autoComplete: 'off', // 모든 input field에 대해 autofill/autocomplete off 처리
      },
      styleOverrides: {
        root: {
          // number type input field는 오른쪽 정렬
          '& input[type=number]': {
            textAlign: 'right',
          },
          // input number의 spin(+/-) button은 미표시
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            marginLeft: '0px',
            display: 'none',
          },
          // Disabled Input field border color & dotted style
          '&.Mui-disabled > .MuiOutlinedInput-notchedOutline': {
            borderStyle: 'dotted',
            borderColor: '#70798E4D !important',
          },
        },
        input: {
          fontFamily: ['Poppins', 'Pretendard'].join(','),
          fontWeight: 400,
          fontSize: '1rem',
          // Input field disable background color
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7 !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#70798E4D',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: ['Poppins', 'Pretendard'].join(','),
          fontWeight: 400,
          fontSize: '0.75rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        iconOutline: {
          color: '#00183D8A',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        // ???
        marginNormal: {
          marginTop: '0px',
          marginBottom: '16px',
        },
        marginDense: {
          marginTop: '0px',
          marginBottom: '8px',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        },
        label: {
          '&.Mui-disabled': {
            color: '#00183D42',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          padding: '12px',
          color: '#444956',
          '&:hover': {
            backgroundColor: '#00183D0D',
          },
        },
        sizeSmall: {
          padding: '4px',
          color: '#444956',
          '&:hover': {
            backgroundColor: '#00183D0D',
          },
        },
        colorThird: {
          color: '#FFFFFF !important', // size가 "medium"인 경우, 해당 css color(#444956)가 우선적으로 적용되어 부득이하게 !important 사용.
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: ['Poppins', 'Pretendard'].join(','),
          fontWeight: 400,
          fontSize: '1.25rem',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        leaveDelay: 1000,
      },
      styleOverrides: {
        tooltipPlacementTop: {
          '& .MuiTooltip-arrow': {
            left: 'calc(50% - 0.5rem) !important',
            transform: 'unset !important',
          },
        },
        tooltipPlacementBottom: {
          '& .MuiTooltip-arrow': {
            left: 'calc(50% - 0.5rem) !important',
            transform: 'unset !important',
          },
        },
        tooltipPlacementLeft: {
          '& .MuiTooltip-arrow': {
            top: 'calc(50% - 0.35rem) !important',
            transform: 'unset !important',
          },
        },
        tooltipPlacementRight: {
          '& .MuiTooltip-arrow': {
            top: 'calc(50% - 0.35rem) !important',
            transform: 'unset !important',
          },
        },

        tooltip: {
          fontFamily: ['Poppins500-AS700', 'Pretendard'].join(','),
          fontWeight: 700,
          padding: '8px 16px',
          fontSize: '0.8125rem',
          backgroundColor: '#0E1013',
          '& .MuiTooltip-arrow::before': {
            backgroundColor: '#0E1013',
          },
        },
        standardError: {
          backgroundColor: '#FDEDEB', // alert error backgroundColor - error light
          color: '#A43229', // alert error font color - error dark
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#EA483A', // alert error icon color - error main
          },
        },
        standardWarning: {
          backgroundColor: '#FDF0E6',
          color: '#A64C01',
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#ED6C02',
          },
        },
        standardSuccess: {
          backgroundColor: '#EDF7ED',
          color: '#357B38',
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#4CAF50',
          },
        },
        standardInfo: {
          backgroundColor: '#EFF2F7',
          color: '#444956',
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#483AEA',
          },
        },
        action: {
          paddingTop: '0',
          alignItems: 'center',
          '& .MuiButton-text': {
            color: 'inherit', // alert 내 action button color
          },
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontFamily: ['Poppins500-AS700', 'Pretendard'].join(','),
          fontWeight: 700,
          fontSize: '1rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          whiteSpace: 'pre-line',
        },
        standardError: {
          backgroundColor: '#FDEDEB', // alert error backgroundColor - error light
          color: '#A43229', // alert error font color - error dark
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#EA483A', // alert error icon color - error main
          },
        },
        standardWarning: {
          backgroundColor: '#FDF0E6',
          color: '#A64C01',
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#ED6C02',
          },
        },
        standardSuccess: {
          backgroundColor: '#EDF7ED',
          color: '#357B38',
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#4CAF50',
          },
        },
        standardInfo: {
          backgroundColor: '#EFF2F7',
          color: '#444956',
          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#483AEA',
          },
        },
        action: {
          marginRight: '0px',
          paddingTop: '0',
          alignItems: 'center',
          '& .MuiButton-text': {
            color: 'inherit', // alert 내 action button color
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body: 'p',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderTitle: {
          fontFamily: ['Poppins500-AS700', 'Pretendard'].join(','),
          fontWeight: 700,
          fontSize: '14/16rem',
        },
        row: {
          '&.Mui-selected': {
            backgroundColor: '#00183D29',
            '&:hover': {
              backgroundColor: '#00183D35',
            },
          },
          '&:hover': {
            backgroundColor: '#00183D14',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          left: 0,
          boxShadow: 'none',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: ['Poppins500-AS600', 'Pretendard'].join(','),
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          paddingLeft: '8px',
          paddingRight: '8px',
          fontWeight: 600,
          fontSize: '1.125rem',
          color: '#8D94A5',
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          '& > .MuiStepConnector-line': {
            borderColor: '#D1D6E0',
          },
        },
      },
    },
    // MuiContainer: {
    //   styleOverrides: {
    //     maxWidthLg: {
    //       maxWidth: '1440px !important',
    //     },
    //   },
    // },
  },
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginTop: '100px',
        width: '500px',
        height: '300px',
        border: '1px solid gray',
      },
      editor: {
        // borderBottom: '1px solid gray',
        height: 'auto',
        overflowY: 'auto',
        maxHeight: '100%',
      },
    },
  },
};

merge(
  themeStyles,
  breakpointTheme,
  typographyTheme,
  paletteTheme,
  componentButtonTheme,
  componentCheckboxTheme,
  componentChipTheme,
  componentSelectTheme,
  componentDialogtheme,
  componentTableTheme
);
const theme = createTheme(themeStyles as IThemeOptions);

export default theme;
