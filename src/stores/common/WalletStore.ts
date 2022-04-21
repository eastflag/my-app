import { makeObservable, observable, runInAction, reaction, action } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { CommonWallet, WalletStatus, BlockchainType } from '../../services/common/model/CommonWallet';
import { commonWalletServiceInstance } from '../../services/common/CommonWalletService';

interface WalletModel {
  walletAddress: string;
  status: string;
}

class WalletStore extends BaseStore {
  wallets: { [blockchainType in BlockchainType]: WalletModel } = {
    [BlockchainType.ETHEREUM]: { walletAddress: '', status: '' },
    [BlockchainType.SOLANA]: { walletAddress: '', status: '' },
  };
  isWalletConnected: boolean = false;
  requestedWalletBlockchainType: BlockchainType = BlockchainType.ETHEREUM;
  connectedWalletBlockchainType: BlockchainType = BlockchainType.ETHEREUM;
  connectedWalletAddress: string = '';
  showSelectWalletDialog: boolean = false;
  showInstallExtensionDialog: boolean = false;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      wallets: observable,
      isWalletConnected: observable,
      requestedWalletBlockchainType: observable,
      connectedWalletAddress: observable,
      connectedWalletBlockchainType: observable,
      showSelectWalletDialog: observable,
      showInstallExtensionDialog: observable,
      setIsWalletConnected: action,
      setRequestedWalletBlockchainType: action,
      setConnectedWalletBlockchainType: action,
      setConnectedWalletAddress: action,
      setShowSelectWalletDialog: action,
      setShowInstallExtensionDialog: action,
      cleanUp: action,
    });
    reaction(
      () => [root.sessionStore.isLogged || this.isWalletConnected],
      async (isLogged) => {
        if (isLogged) {
          this.getWallets();
          const persistedConnectedWallet = Object.entries(this.wallets).find(([blockchainType, wallet]) => {
            return wallet.status == WalletStatus.CONNECTED;
          });
          if (persistedConnectedWallet) {
            const [blockchainType, wallet] = persistedConnectedWallet;
            const { isValid } = await commonWalletServiceInstance.validateConnectedAddress(
              blockchainType,
              wallet.walletAddress
            );
            if (isValid) {
              this.setIsWalletConnected(true);
              this.setConnectedWalletBlockchainType(blockchainType as BlockchainType);
              this.setConnectedWalletAddress(wallet.walletAddress);
            }
          }
        } else {
          this.cleanUp();
        }
      }
    );
  }

  async get(blockchainType: BlockchainType) {
    if (!this.wallets[blockchainType]) {
      runInAction(() => {
        this.wallets[blockchainType] = { walletAddress: '', status: '' };
      });
      const wallets = await this.getWallets();
      if (wallets) {
        runInAction(() => {
          wallets.forEach((wallet) => {
            this.wallets[wallet.chainType] = {
              walletAddress: wallet.walletAddress,
              status: wallet.status,
            };
          });
        });
      }
    }
    return this.wallets[blockchainType];
  }

  async getWallets() {
    const walletsResult = await this.callApiWithStateEvenLoading<BeApiResponse<CommonWallet[]>>(
      commonWalletServiceInstance.getWallets
    );

    if (walletsResult?.successOrNot === 'Y') {
      console.log(JSON.stringify(walletsResult.data));
      return walletsResult.data;
    }
  }

  async updateWalletStatus(newStatus: string) {
    commonWalletServiceInstance.updateWalletStatus(
      this.connectedWalletBlockchainType,
      this.connectedWalletAddress,
      newStatus
    );
  }

  setIsWalletConnected(isConnected: boolean) {
    this.isWalletConnected = isConnected;
  }

  setRequestedWalletBlockchainType(blockchainType: BlockchainType) {
    this.requestedWalletBlockchainType = blockchainType;
  }

  setConnectedWalletBlockchainType(connectedBlockchainType: BlockchainType) {
    this.connectedWalletBlockchainType = connectedBlockchainType;
  }

  setConnectedWalletAddress(connectedAddress: string) {
    this.connectedWalletAddress = connectedAddress;
  }

  setShowSelectWalletDialog(showDialog: boolean) {
    this.showSelectWalletDialog = showDialog;
  }

  setShowInstallExtensionDialog(showDialog: boolean) {
    this.showInstallExtensionDialog = showDialog;
  }

  cleanUp() {
    this.wallets = {
      [BlockchainType.ETHEREUM]: { walletAddress: '', status: '' },
      [BlockchainType.SOLANA]: { walletAddress: '', status: '' },
    };
    this.setIsWalletConnected(false);
    this.setRequestedWalletBlockchainType(BlockchainType.ETHEREUM);
    this.setConnectedWalletBlockchainType(BlockchainType.ETHEREUM);
    this.setConnectedWalletAddress('');
    this.updateWalletStatus(WalletStatus.DISCONNECTED);
  }
}
export default WalletStore;
