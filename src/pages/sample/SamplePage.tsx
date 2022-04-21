import { Box, IconButton, Typography, Link, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginRight: '20px',
  },
  box: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  boxMain: {
    margin: '40px',
    maxWidth: '1440px',
  },
}));

const SamplePage = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const sampleList = [
    {
      // label: 'Mobx List',
      label: 'Mobx List',
      url: '/sample/list',
    },
    {
      label: 'Mobx Local State',
      url: '/sample/mobxLocalState',
    },
    {
      label: 'Form',
      url: '/sample/form',
    },
    {
      label: 'Url with Search Params',
      url: '/sample/urlWithSearchParam',
    },
    {
      label: 'Private Page',
      url: '/privateTest',
    },
    {
      label: 'I18N',
      url: '/sample/i18n',
    },
    {
      label: 'Components',
      url: '/sample/components',
    },
    {
      label: 'serviceTerms',
      url: '/sample/serviceTerms',
    },
    {
      label: 'Go to Layout',
      url: '/',
    },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" aria-label="menu">
            <MenuIcon color="action" />
          </IconButton>
          <Typography variant="h6" component="div" className={classes.title}>
            Sample Page
          </Typography>
          <Box className={classes.box}>
            {sampleList &&
              sampleList.map((item) => (
                <Button key={item.label} variant="contained" component={RouterLink} to={item.url}>
                  {item.label}
                </Button>
              ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container className={classes.boxMain}>
        <Outlet />
      </Container>
    </>
  );
};

export default SamplePage;
