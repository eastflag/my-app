import { Box, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { APP_BAR_HEIGHT } from '../material_ui/theme';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100%',
    width: '100%',
    maxWidth: '1440px',
    boxSizing: 'border-box',
    paddingTop: `${APP_BAR_HEIGHT.THIN}px`,

    [theme.breakpoints.up('md')]: {
      paddingTop: `${APP_BAR_HEIGHT.NORMAL}px`,
    },

    [theme.breakpoints.up('lg')]: {
      marginLeft: '16px',
      marginRight: '16px',
    },
  },
}));

const MainContainer = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return <Box className={classes.container}>{children}</Box>;
};

export default MainContainer;
