export enum BlockchainType {
  ETHEREUM = 'ETHEREUM',
  SOLANA = 'SOLANA',
}

export class WalletStatus {
  public static readonly CONNECTED = 'CONNECTED';
  public static readonly DISCONNECTED = 'DISCONNECTED';
}

export interface Config {
  timeout?: number;
  returnValueWhenFail?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CommonWallet {
  chainType: BlockchainType;
  walletAddress: string;
  status: string;
}

export interface UpdateWalletRequest {
  walletAddress: string;
  status: string;
}

export interface ConnectWalletRequest {
  requestBlockchainType: string;
}

export interface ConnectWalletResponse {
  isConnected: boolean;
  connectedAddress: string;
  errorCode: string;
  errorMessage: string;
}

export interface ValidateConnectedAddressRequest {
  connectedBlockChainType: string;
  inputAddress: string;
}

export interface ValidateConnectedAddressResponse {
  isValid: boolean;
  errorCode: string;
  errorMessage: string;
}

export interface AddressValidationRequest {
  inputAddress: string;
}

export interface AddressValidationResponse {
  validate: boolean;
}

export interface BalanceRequest {
  connectedBlockChainType: string;
  inputAddress: string;
}

export interface BalanceResponse {
  balance: string;
  errorCode: string;
  errorMessage: string;
}

export interface BalanceTransferRequest {
  fromAddress: string;
  toAddress: string;
  value: string;
}

export interface BalanceTransferResponse {
  transactionHash: string;
  errorCode: string;
  errorMessage: string;
}

export interface BlockchainResetRequest {
  connectedBlockChainType: string;
}

export interface ExtensionCheckRequest {
  connectedBlockChainType: string;
}

export interface ExtensionCheckResponse {
  isInstalled: boolean;
  errorCode: string;
  errorMessage: string;
}
