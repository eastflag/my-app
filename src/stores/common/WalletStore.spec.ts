import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { CommonWallet, WalletStatus, BlockchainType } from '../../services/common/model/CommonWallet';
import { commonWalletServiceInstance } from '../../services/common/CommonWalletService';

const rootStore = new RootStore();

jest.mock('../../services/common/CommonWalletService.ts');
const mockedApi = commonWalletServiceInstance as jest.Mocked<typeof commonWalletServiceInstance>;

describe('WalletStore 테스트', () => {
  const { walletStore } = rootStore;

  it('setIsWalletConnected() called', () => {
    const isWalletConnected = true;
    walletStore.setIsWalletConnected(isWalletConnected);
    expect(walletStore.isWalletConnected).toBe(isWalletConnected);
  });

  it('setRequestedWalletBlockchainType() called', () => {
    const blockchainType = BlockchainType.SOLANA;
    walletStore.setRequestedWalletBlockchainType(blockchainType);
    expect(walletStore.connectedWalletBlockchainType).toBe(BlockchainType.SOLANA);
  });

  it('setConnectedWalletBlockchainType() called', () => {
    const connectedWalletBlockchainType = BlockchainType.SOLANA;
    walletStore.setConnectedWalletBlockchainType(connectedWalletBlockchainType);
    expect(walletStore.connectedWalletBlockchainType).toBe(BlockchainType.SOLANA);
  });

  it('setConnectedWalletAddress() called', () => {
    const connectedWalletAddress = '0xsomething';
    walletStore.setConnectedWalletAddress(connectedWalletAddress);
    expect(walletStore.connectedWalletAddress).toBe(connectedWalletAddress);
  });

  it('setShowSelectWalletDialog() called', () => {
    const showSelectWalletDialog = false;
    walletStore.setShowInstallExtensionDialog(showSelectWalletDialog);
    expect(walletStore.showSelectWalletDialog).toBe(false);
  });

  it('setShowInstallExtensionDialog() called', () => {
    const showInstallExtensionDialog = false;
    walletStore.setShowInstallExtensionDialog(showInstallExtensionDialog);
    expect(walletStore.showInstallExtensionDialog).toBe(false);
  });

  it('cleanUp() called', () => {
    walletStore.cleanUp();
    expect(walletStore.isWalletConnected).toBe(false);
    expect(walletStore.requestedWalletBlockchainType).toBe(BlockchainType.ETHEREUM);
    expect(walletStore.connectedWalletBlockchainType).toBe(BlockchainType.ETHEREUM);
    expect(walletStore.connectedWalletAddress).toEqual('');
  });
});
