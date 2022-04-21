import { ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

declare module '@mui/material' {
  interface ButtonPropsSizeOverrides {
    xlarge: true; // Add Button Size XLarge
  }
  interface ButtonPropsColorOverrides {
    third: true; // Add button third color for
  }

  interface ButtonPropsVariantOverrides {
    roundContained: true; // Add Button variant for round type
    roundOutlined: true; // Add Button variant for round type
  }
}

// 1. Button size 추가 xlarge
// 2. Button 각 size별 padding 등 변경
// 3. Button variant 추가 (라운드형)
// 4. Button color 추가 (white 배경 대응용)

// 4. Typography lineHeight 변경 -  Component 만들어야할듯

export const componentButtonTheme = {
  components: {
    // Button
    MuiButton: {
      defaultProps: {
        // disableRipple: true, // No more ripple, on the whole application
        disableElevation: true, // No more elevation, on the whole application
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // disable uppercase
          borderRadius: 0,
          boxSizing: 'border-box !important',
          // 버튼 비활성화시 기본설정 (font 컬러, 높이 문제로 border 제거, outline color 설정, 배경 투명)
          // -> contained button 들의 비활성화 배경색 별도 설정 필요
          // -> outlinedThird button 들의 별도 설정 필요
          '&.Mui-disabled': {
            color: '#00183D42',
            border: 'none',
            outlineColor: '#EFF2F7',
            backgroundColor: 'transparent',
            // Safari 상에서 borderRadius 가 outline 에 적용안됨에 대한 CSS 대응
            '&::before': {
              border: '1px solid #EFF2F7',
            },
          },
        },

        //  custom button size - xlarge
        sizeXlarge: {
          fontFamily: ['Poppins600-AS800', 'Pretendard'].join(','),
          fontWeight: 800,
          fontSize: '1.25rem',
          padding: '14.5px 32px',
        },

        sizeLarge: {
          fontFamily: ['Poppins600-AS800', 'Pretendard'].join(','),
          fontWeight: 800,
          fontSize: '1.125rem',
          padding: '12.25px 24px',
        },

        sizeMedium: {
          fontFamily: ['Poppins600-AS700', 'Pretendard'].join(','),
          fontWeight: 700,
          fontSize: '1rem',
          padding: '10px 16px',
        },

        sizeSmall: {
          fontFamily: ['Poppins600-AS500', 'Pretendard'].join(','),
          fontWeight: 500,
          fontSize: '0.8125rem',
          padding: '5.625px 12px',
        },

        textSizeXlarge: {
          padding: '14.5px 15px',
        },

        textSizeLarge: {
          padding: '12.25px 11px',
        },

        textSizeMedium: {
          padding: '10px 8px',
        },

        textSizeSmall: {
          padding: '5.625px 5px',
        },

        roundContainedSizeXlarge: {
          padding: '14.5px 40px',
        },

        roundContainedSizeLarge: {
          padding: '12.25px 32px',
        },

        roundContainedSizeMedium: {
          padding: '10px 24px',
        },

        roundContainedSizeSmall: {
          padding: '5.625px 16px',
        },

        roundOutlinedSizeXlarge: {
          padding: '14.5px 40px',
        },

        roundOutlinedSizeLarge: {
          padding: '12.25px 32px',
        },

        roundOutlinedSizeMedium: {
          padding: '10px 24px',
        },

        roundOutlinedSizeSmall: {
          padding: '5.625px 16px',
        },

        containedPrimary: {
          '&:hover': {
            backgroundColor: '#483AEA',
          },
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },

        containedSecondary: {
          // '&:hover': {
          //   backgroundColor: 'secondary.dark 컬러 그대로 사용',
          // },
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },

        containedThird: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },

        roundContainedPrimary: {
          backgroundColor: '#0E1013',
          color: '#FFFFFF',
          borderRadius: 9999,
          '&:hover': {
            backgroundColor: '#483AEA',
          },
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },

        roundContainedSecondary: {
          backgroundColor: '#483AEA',
          color: '#FFFFFF',
          borderRadius: 9999,
          '&:hover': {
            backgroundColor: '#1E13B2',
          },
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },

        roundContainedThird: {
          backgroundColor: '#FFFFFF',
          color: '#0E1013',
          borderRadius: 9999,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-disabled': {
            backgroundColor: '#EFF2F7',
          },
        },

        outlinedPrimary: {
          color: '#444956',
          border: 'none',
          outline: '1px solid #70798E4D',
          '&:hover': {
            border: 'none',
            backgroundColor: '#483AEA0A',
          },
        },

        outlinedSecondary: {
          // color: 'secondary 컬러 그대로 사용',
          border: 'none',
          outline: '1px solid #CBC8F5',
          '&:hover': {
            border: 'none',
            backgroundColor: '#483AEA0A',
          },
        },

        outlinedThird: {
          color: '#FFFFFF',
          border: 'none',
          outline: '1px solid #F9FAFC4D',
          '&:hover': {
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-disabled': {
            color: '#444956',
            outlineColor: '#444956',
          },
        },

        // roundContainedThird: {
        //   backgroundColor: '#FFFFFF',
        //   color: '#0E1013',
        //   '&:hover': {
        //     backgroundColor: 'rgba(255, 255, 255, 0.5)',
        //   },
        // },

        roundOutlinedPrimary: {
          borderRadius: 9999,
          // Safari 상에서 borderRadius 가 outline 에 적용안됨에 대한 CSS 대응
          '&::before': {
            border: '1px solid #70798E4D',
            content: '""',
            position: 'absolute',
            borderRadius: 9999,
            width: '100%',
            height: '100%',
          },
          color: '#444956',
          '&:hover': {
            backgroundColor: '#483AEA0A',
          },
        },

        roundOutlinedSecondary: {
          borderRadius: 9999,
          // Safari 상에서 borderRadius 가 outline 에 적용안됨에 대한 CSS 대응
          '&::before': {
            border: '1px solid #CBC8F5',
            content: '""',
            position: 'absolute',
            borderRadius: 9999,
            width: '100%',
            height: '100%',
          },
          color: '#483AEA',
          '&:hover': {
            backgroundColor: '#483AEA0A',
          },
        },

        roundOutlinedThird: {
          borderRadius: 9999,
          // Safari 상에서 borderRadius 가 outline 에 적용안됨에 대한 CSS 대응
          '&::before': {
            border: '1px solid #F9FAFC4D',
            content: '""',
            position: 'absolute',
            borderRadius: 9999,
            width: '100%',
            height: '100%',
          },
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-disabled': {
            color: '#444956',
            outlineColor: '#444956',
            // Safari 상에서 borderRadius 가 outline 에 적용안됨에 대한 CSS 대응
            '&::before': {
              border: '1px solid #444956',
            },
          },
        },

        textPrimary: {
          color: '#444956',
          '&:hover': {
            backgroundColor: '#483AEA0A',
          },
        },

        textSecondary: {
          // color: '#secondary 컬러 그대로 사용',
          '&:hover': {
            backgroundColor: '#483AEA0A',
          },
        },

        textThird: {
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-disabled': {
            color: '#444956',
          },
        },
      },
    },
  },
};
