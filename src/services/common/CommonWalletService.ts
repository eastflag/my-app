import BaseService from './BaseService';
import { Method } from './model/Method';
import { BeApiRequest, BeApiResponse } from './model/RestApi';
import { Service } from './model/Service';
import {
  CommonWallet,
  ConnectWalletResponse,
  ExtensionCheckResponse,
  ValidateConnectedAddressResponse,
} from './model/CommonWallet';
import { CommonWalletModule } from '../../utils/ext/common-wallet-module';

class CommonWalletService extends BaseService {
  public getWallets = async () => {
    const getWalletsRequest: BeApiRequest = {
      method: Method.GET,
      url: '/marketplace/v1/member/wallets',
      serviceName: Service.MARKETPLACE,
    };
    const response: BeApiResponse<CommonWallet[]> = await this.fnRest(getWalletsRequest);
    return response;
  };

  public updateWalletStatus = async (blockchainType: string, walletAddress: string, newStatus: string) => {
    const updateWalletStatusRequest: BeApiRequest = {
      method: Method.PUT,
      url: `/marketplace/v1/member/wallets/${blockchainType}`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: {
          walletAddress: walletAddress,
          newStatus: newStatus,
        },
      },
    };
    const response: BeApiResponse<void> = await this.fnRest(updateWalletStatusRequest);
    return response;
  };

  public validateConnectedAddress = async (blockchainType: string, walletAddress: string) => {
    const response: ValidateConnectedAddressResponse = await CommonWalletModule.validateConnectedAddress(
      blockchainType,
      walletAddress
    );
    return response;
  };

  public checkWalletExtension(blockchainType: string) {
    const response: ExtensionCheckResponse = CommonWalletModule.checkExtensionInstalled(blockchainType);
    return response;
  }

  public connectWallet = async (blockchainType: string) => {
    const response: ConnectWalletResponse = await CommonWalletModule.connectWallet(blockchainType);
    return response;
  };
}

export const commonWalletServiceInstance = new CommonWalletService();
