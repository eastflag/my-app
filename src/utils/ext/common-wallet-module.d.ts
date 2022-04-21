export namespace CommonWalletModule {
  export { BlockChainType };
  export { GenerativeGetMethodName };
  export { GenerativeSetMethodName };
  export { checkExtensionInstalled };
  export { connectWallet };
  export { validateInputAddress };
  export { validateConnectedAddress };
  export { getConnectedAddress };
  export { getBalance };
  export { transferBalance };
  export { resetConnectedBlockchain };
  export { getSmartContractExecution };
  export { setSmartContractExecution };
  export { deploySmartContract };
}
declare namespace BlockChainType {
  const ETHEREUM: string;
  const SOLANA: string;
}
declare namespace GenerativeGetMethodName {
  const isActive: string;
}
declare namespace GenerativeSetMethodName {
  const setActive: string;
}
declare function checkExtensionInstalled(requestBlockChainType: string): {
  isInstalled: boolean;
  errorCode: string;
  errorMessage: string;
};
declare function connectWallet(requestBlockChainType: string): Promise<{
  isConnected: boolean;
  connectedAddress: string;
  errorCode: string;
  errorMessage: string;
}>;
/********************************/
/*** CommonWallet Main Funcs ****/
/********************************/
declare function validateInputAddress(
  connectedBlockChainType: string,
  inputAddress: string
): {
  isValid: boolean;
  errorCode: string;
  errorMessage: string;
};
declare function validateConnectedAddress(
  connectedBlockChainType: string,
  inputAddress: string
): Promise<{
  isValid: boolean;
  errorCode: string;
  errorMessage: string;
}>;
declare function getConnectedAddress(connectedBlockChainType: string): {
  connectedAddress: string;
  errorCode: string;
  errorMessage: string;
};
declare function getBalance(
  connectedBlockChainType: string,
  inputAddress: string
): Promise<{
  balance: number;
  errorCode: string;
  errorMessage: string;
}>;
declare function transferBalance(
  connectedBlockChainType: string,
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<{
  transactionHash: string;
  errorCode: string;
  errorMessage: string;
}>;
declare function resetConnectedBlockchain(connectedBlockChainType: string): void;
declare function getSmartContractExecution(
  connectedBlockChainType: string,
  contractABI: unknown,
  contractAddress: string,
  methodName: string,
  params: string
): Promise<{
  result: unknown;
  errorCode: string;
  errorMessage: string;
}>;
declare function setSmartContractExecution(
  connectedBlockChainType: string,
  connectedAddress: string,
  contractABI: string,
  contractAddress: string,
  methodName: string,
  params: unknown
): Promise<{
  transactionHash: string;
  errorCode: string;
  errorMessage: string;
}>;
declare function deploySmartContract(
  connectedBlockChainType: string,
  connectedAddress: string,
  contractABI: string,
  contractByteCode: string
): Promise<{
  contractAddress: string;
  transactionHash: string;
  errorCode: string;
  errorMessage: string;
}>;
export {};
