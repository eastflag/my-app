import { Language, NotificationsNone, Search } from '@mui/icons-material';
import {
  AppBar as MuiAppBar,
  Button,
  Divider,
  Icon,
  IconButton,
  Theme,
  Typography,
  useScrollTrigger,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ContextMenu from '../components/common/ContextMenu';
import ProfileMenu from '../components/common/ProfileMenu';
import WalletButton from '../components/common/WalletButton';
import Spacer from '../components/common/Spacer';
import { useStore } from '../contexts/StoreProvider';
import { APP_BAR_HEIGHT } from '../material_ui/theme';
import { Menu } from '../stores/menu/MenuStore';
import { CustomContentDialog } from '../components/common/custom/CustomContentDialog';
import { commonWalletServiceInstance } from '../services/common/CommonWalletService';
import { BlockchainType, WalletStatus } from '../services/common/model/CommonWallet';
import { showToast } from '../components/common/CommonToast';
import CustomMetamaskIcon from '../components/common/custom/svgIcon/CustomMetamaskIcon';
import CustomPhantomIcon from '../components/common/custom/svgIcon/CustomPhantomIcon';
import CustomBinanceIcon from '../components/common/custom/svgIcon/CustomBinanceIcon';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: 99,
    '& button, & a': {
      transitionDuration: '0s',
    },

    height: `${APP_BAR_HEIGHT.THIN}px`,

    [theme.breakpoints.up('md')]: {
      height: `${APP_BAR_HEIGHT.NORMAL}px`,
    },
  },
  divider: {
    position: 'fixed',
    width: '100%',
    boxSizing: 'border-box',
    borderColor: '#70798E29',
    top: `${APP_BAR_HEIGHT.THIN}px`,

    [theme.breakpoints.up('md')]: {
      top: `${APP_BAR_HEIGHT.NORMAL}px`,
    },
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapper: {
    width: '100%',
    maxWidth: '1440px',
    marginLeft: '16px',
    marginRight: '16px',
  },
  logoBox: {},
  menuBox: {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  toolBox: {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  // 로고 이미지 대체 시, 삭제 예정
  logoText: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '32px',
  },
  signUpButton: {
    minWidth: '110px',
  },
  contextMenuBox: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  walletButton: {
    width: '100%',
  },
}));

const AppBar = observer(() => {
  const { menuListStore, appBarStore, sessionStore, walletStore } = useStore();
  const menuList = menuListStore.menuList ?? ([] as Menu[]);
  const location = useLocation();
  const { t } = useTranslation();
  const walletNames: { [blockchainType in BlockchainType]: string } = {
    [BlockchainType.ETHEREUM]: 'Metamask',
    [BlockchainType.SOLANA]: 'Phantom',
  };
  const walletExtensionDownloadUrls: { [blockchainType in BlockchainType]: string } = {
    [BlockchainType.ETHEREUM]: 'https://metamask.io/download/',
    [BlockchainType.SOLANA]: 'https://phantom.app/download',
  };

  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: undefined,
  });
  const isTransparent = appBarStore.isTransparent ? !isScrolled : false;
  let isLogged = sessionStore.isLogged;

  const colorSet = {
    appBar: isTransparent ? ('transparent' as const) : ('inherit' as const), // casting as const to make literal
    logo: isTransparent ? 'white' : '#262A37', // TODO: remove when text is replaced by image
    button: isTransparent ? ('third' as const) : ('primary' as const), // casting as const to make literal
    dividerHidden: isTransparent ? true : false,
  };

  // TODO: '/signUp', '/login' URL 직접 접근 시 logout 여부 및 상단바 메뉴 노출 여부 확인 후 추가 개발
  if (
    location.pathname.indexOf('/login') > -1 ||
    location.pathname.indexOf('/signUp') > -1 ||
    location.pathname.indexOf('/member') > -1
  ) {
    isLogged = false;
  }

  const handleCloseSelectWalletDialog = () => {
    walletStore.setShowSelectWalletDialog(false);
  };

  const handleCloseInstallExtensionDialog = () => {
    walletStore.setShowInstallExtensionDialog(false);
  };

  const handleGoToInstallButtonClick = (blockchainType: BlockchainType) => {
    window.open(walletExtensionDownloadUrls[blockchainType]);
    walletStore.setShowInstallExtensionDialog(false);
  };

  const handleWalletClick = async (blockchainType: BlockchainType) => {
    walletStore.setRequestedWalletBlockchainType(blockchainType);

    const extensionCheckResponse = commonWalletServiceInstance.checkWalletExtension(blockchainType);
    if (extensionCheckResponse) {
      if (extensionCheckResponse.isInstalled) {
        const { isConnected, connectedAddress } = await commonWalletServiceInstance.connectWallet(blockchainType);
        if (isConnected && connectedAddress) {
          commonWalletServiceInstance.updateWalletStatus(blockchainType, connectedAddress, WalletStatus.CONNECTED);
          walletStore.setIsWalletConnected(true);
          walletStore.setConnectedWalletBlockchainType(blockchainType);
          walletStore.setConnectedWalletAddress(connectedAddress);
        } else {
          showToast(t('common:wallet.connectionFailToast.message'));
        }
      } else {
        walletStore.setShowInstallExtensionDialog(true);
      }
    } else {
      showToast(t('common:wallet.connectionFailToast.message'));
    }
    walletStore.setShowSelectWalletDialog(false);
  };

  const classes = useStyles();
  return (
    <>
      <MuiAppBar className={classes.appBar} color={colorSet.appBar}>
        <div className={`${classes.wrapper} ${classes.flexBox}`}>
          {/* Logo Box */}
          {/* TODO: replace text to image */}
          <div className={classes.logoBox}>
            <Typography className={classes.logoText} color={colorSet.logo}>
              næmo
            </Typography>
          </div>
          {/* Menu Box */}
          {isLogged && (
            <div className={`${classes.menuBox} ${classes.flexBox}`}>
              {menuList &&
                menuList.map((menu, index, array) => (
                  <>
                    <Button
                      variant="text"
                      size="medium"
                      color={colorSet.button}
                      key={menu.label}
                      component={Link}
                      to={menu.url}
                    >
                      {menu.label}
                    </Button>
                    {array.length - 1 !== index && <Spacer x={3} />}
                  </>
                ))}
            </div>
          )}
          {/* Tool Box */}
          <div className={`${classes.toolBox} ${classes.flexBox}`}>
            {/* Search Icon */}
            <IconButton size="small" color={colorSet.button}>
              <Icon fontSize="large">
                <Search fontSize="large" />
              </Icon>
            </IconButton>
            <Spacer x={2} />
            {/* Notification Icon */}
            {isLogged && (
              <>
                <IconButton size="small" color={colorSet.button}>
                  <Icon fontSize="large">
                    <NotificationsNone fontSize="large" />
                  </Icon>
                </IconButton>
                <Spacer x={2} />
              </>
            )}
            {/* Language Icon Button */}
            <Button variant="text" size="medium" color={colorSet.button} startIcon={<Language />}>
              EN
            </Button>
            <Spacer x={2} />
            {/* Login and Sign Up */}
            {!isLogged ? (
              <div className={classes.flexBox}>
                <Button variant="roundOutlined" size="medium" color={colorSet.button} component={Link} to={'/login'}>
                  Login
                </Button>
                <Spacer x={1} />
                <Button
                  className={classes.signUpButton}
                  variant="roundContained"
                  size="medium"
                  color="primary"
                  component={Link}
                  to={'/signUp'}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <div className={classes.flexBox}>
                <ProfileMenu />
                <WalletButton />
              </div>
            )}
          </div>
          <div className={`${classes.contextMenuBox} ${classes.flexBox}`}>
            {/* ContextMenu Icon */}
            {/* TODO: modify menu list in ContextMenu */}
            {isLogged && <WalletButton />}
            <ContextMenu color={colorSet.button} />
          </div>
        </div>
      </MuiAppBar>
      <Divider className={classes.divider} hidden={colorSet.dividerHidden} />
      <CustomContentDialog
        title={t('common:wallet.selectWalletDialog.title')}
        showDialog={walletStore.showSelectWalletDialog}
        rightButtonVarient={'text'}
        rightButtonContent={t('common:wallet.selectWalletDialog.closeButton')}
        handleModalRightButton={handleCloseSelectWalletDialog}
      >
        <Box>
          <Button
            className={classes.walletButton}
            variant="outlined"
            size="xlarge"
            color="primary"
            onClick={() => handleWalletClick(BlockchainType.ETHEREUM)}
            startIcon={<CustomMetamaskIcon />}
          >
            {walletNames[BlockchainType.ETHEREUM]}
          </Button>
        </Box>
        <Box>
          <Button
            className={classes.walletButton}
            variant="outlined"
            size="xlarge"
            color="primary"
            onClick={() => handleWalletClick(BlockchainType.SOLANA)}
            disabled={true}
            startIcon={<CustomPhantomIcon disabled={true} />}
          >
            {walletNames[BlockchainType.SOLANA]}
          </Button>
        </Box>
        <Box>
          <Button
            className={classes.walletButton}
            variant="outlined"
            size="xlarge"
            color="primary"
            disabled={true}
            startIcon={<CustomBinanceIcon disabled={true} />}
          >
            Binance
          </Button>
        </Box>
        <Spacer y={2} />
        <Button>{t('common:wallet.selectWalletDialog.FAQButton')}</Button>
      </CustomContentDialog>
      <CustomContentDialog
        title={`${walletNames[walletStore.requestedWalletBlockchainType] || 'Wallet'} ${t(
          'common:wallet.installWalletDialog.title'
        )}`}
        showDialog={walletStore.showInstallExtensionDialog}
        leftButtonVarient={'text'}
        rightButtonVarient={'contained'}
        leftButtonContent={t('common:wallet.installWalletDialog.cancelButton')}
        rightButtonContent={t('common:wallet.installWalletDialog.goToInstallButton')}
        handleModalLeftButton={handleCloseInstallExtensionDialog}
        handleModalRightButton={() => handleGoToInstallButtonClick(walletStore.requestedWalletBlockchainType)}
      >
        {t('common:wallet.installWalletDialog.content')}
        <Spacer y={2} />
        <Button>{t('common:wallet.installWalletDialog.FAQButton')}</Button>
        <Spacer y={6} />
      </CustomContentDialog>
    </>
  );
});

export default AppBar;
