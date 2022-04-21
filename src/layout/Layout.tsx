import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Outlet } from 'react-router-dom';
import CommonToast from '../components/common/CommonToast';
import AppBar from './AppBar';
import Dim from './Dim';
import MainContainer from './MainContainer';

const useStyles = makeStyles(() => ({
  layout: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    overflow: 'overlay',
  },
}));

const Layout = () => {
  const classes = useStyles();
  return (
    <Box className={classes.layout}>
      <Dim />
      <AppBar />
      <MainContainer>
        <Outlet />
        <CommonToast />
      </MainContainer>
    </Box>
  );
};

export default Layout;
