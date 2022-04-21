import Web3 from 'web3';
import * as solanaWeb3 from '@solana/web3.js';

var CommonWalletModule = (function () {
  /********************************/
  /**** CommonWallet Variables ****/
  /********************************/
  // define Blockchain Code Object
  var BlockChainType = {
    ETHEREUM: 'ETHEREUM',
    SOLANA: 'SOLANA',
  };

  var GenerativeGetMethodName = {
    isActive: 'isActive()',
  };

  var GenerativeSetMethodName = {
    setActive: 'setActive(bool)',
  };

  /********************************/
  /****** CommonWallet Utils ******/
  /********************************/
  // conversion eth to wei hexstring
  var getEthWeb3 = function () {
    var ethWeb3;
    if (window.ethereum) {
      ethWeb3 = new Web3(window.ethereum);
    }
    return ethWeb3;
  };

  var getSolWeb3 = function () {
    var solWeb3;
    if (window.solana) {
      solWeb3 = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('testnet'), 'confirmed');
    }
    return solWeb3;
  };

  var ethToWei = function (value) {
    var eth = parseFloat(value);
    var wei = eth * 10 ** 18;
    return wei.toString();
  };

  // conversion wei to eth
  var weiToEth = function (value) {
    var wei = parseInt(value);
    var eth = wei * 10 ** -18;
    return eth;
  };

  // conversion sol to lamport number
  var solToLamport = function (value) {
    var sol = parseFloat(value);
    var lamport = sol * solanaWeb3.LAMPORTS_PER_SOL;
    return lamport;
  };

  // conversion lamport to sol
  var lamportToSol = function (value) {
    var lamport = parseInt(value);
    var sol = lamport / solanaWeb3.LAMPORTS_PER_SOL;
    return sol;
  };

  // handle ethereum account changed event
  // function handleEthAccountChanged(accounts) {
  //     // To-do

  //     return;
  // }

  // handler solana account changed event
  // function handleSolAccountChanged(accounts) {
  //     //
  //     return;
  // }

  /********************************/
  /*** CommonWallet Main Funcs ****/
  /********************************/
  // validate input address
  var validateInputAddress = function (connectedBlockChainType, inputAddress) {
    var isValid = true;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        try {
          var ethWeb3 = getEthWeb3();
          isValid = ethWeb3.utils.isAddress(inputAddress);
        } catch (error) {
          isValid = false;
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      case BlockChainType.SOLANA:
        try {
          var inputAddressToPubKey = new solanaWeb3.PublicKey(inputAddress);
          isValid = solanaWeb3.PublicKey.isOnCurve(inputAddressToPubKey);
        } catch (error) {
          isValid = false;
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }
    return { isValid, errorCode, errorMessage };
  };

  // return connectedAddress validate
  var validateConnectedAddress = async function (connectedBlockChainType, inputAddress) {
    var address = null;
    var isValid = false;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        try {
          var ethWeb3 = getEthWeb3();
          var response = await ethWeb3.eth.getAccounts();
          address = response[0];
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      case BlockChainType.SOLANA:
        address = window.solana.publicKey.toString();
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }
    if (inputAddress === address) {
      isValid = true;
    }

    return { isValid, errorCode, errorMessage };
  };

  var checkExtensionInstalled = function (requestBlockChainType) {
    var isInstalled = false;
    var errorCode = null;
    var errorMessage = null;

    switch (requestBlockChainType) {
      case BlockChainType.ETHEREUM:
        if (window.ethereum) {
          isInstalled = true;
        } else {
          isInstalled = false;
          errorCode = 'WE001';
          errorMessage = 'Metamask not installed';
        }
        break;
      case BlockChainType.SOLANA:
        if (window.solana) {
          isInstalled = true;
        } else {
          isInstalled = false;
          errorCode = 'WE002';
          errorMessage = 'Phantom not installed';
        }
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { isInstalled, errorCode, errorMessage };
  };

  // request connect wallet
  var connectWallet = async function (requestBlockChainType) {
    var response = null;
    var isConnected = false;
    var connectedAddress = null;
    var errorCode = null;
    var errorMessage = null;

    switch (requestBlockChainType) {
      case BlockChainType.ETHEREUM:
        try {
          // request connect to ethereum
          var ethWeb3 = getEthWeb3();
          response = await ethWeb3.eth.requestAccounts();
          connectedAddress = response[0];
          isConnected = true;
          // set ethereum event
          //window.ethereum.on('accountsChanged', handleEthAccountChanged);
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      case BlockChainType.SOLANA:
        try {
          // request connect to solana
          response = await window.solana.connect();
          connectedAddress = response.publicKey.toString();

          console.log(connectedAddress);
          isConnected = true;
          // set solana event
          //window.solana.on('accountChanged', handleSolAccountChanged);
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { isConnected, connectedAddress, errorCode, errorMessage };
  };

  var getConnectedAddress = function (connectedBlockChainType) {
    var connectedAddress = null;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        try {
          connectedAddress = window.ethereum.selectedAddress;
        } catch (error) {
          errorCode = 'WE000';
          errorMessage = error;
        }
        break;
      case BlockChainType.SOLANA:
        try {
          connectedAddress = window.solana.publicKey.toString();
        } catch (error) {
          errorCode = 'WE000';
          errorMessage = error;
        }
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { connectedAddress, errorCode, errorMessage };
  };

  var getBalance = async function (connectedBlockChainType, inputAddress) {
    var respBalance = null;
    var balance = null;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        try {
          var ethWeb3 = getEthWeb3();
          respBalance = await ethWeb3.eth.getBalance(inputAddress);
          balance = weiToEth(respBalance);
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;

      case BlockChainType.SOLANA:
        try {
          var solWeb3 = getSolWeb3();
          respBalance = await solWeb3.getBalance(new solanaWeb3.PublicKey(inputAddress));
          balance = lamportToSol(respBalance);
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;

      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { balance, errorCode, errorMessage };
  };

  var transferBalance = async function (connectedBlockChainType, fromAddress, toAddress, amount) {
    var transactionHash = null;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        var ethWeb3 = getEthWeb3();
        var weiAmount = ethToWei(amount);
        await ethWeb3.eth.sendTransaction(
          {
            from: fromAddress,
            to: toAddress,
            value: weiAmount,
          },
          function (error, hash) {
            if (error) {
              errorCode = error.code;
              errorMessage = error.message;
            } else {
              transactionHash = hash;
            }
          }
        );
        break;
      case BlockChainType.SOLANA:
        try {
          var solWeb3 = getSolWeb3();
          var lamportAmount = solToLamport(amount);
          var transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
              fromPubkey: new solanaWeb3.PublicKey(fromAddress),
              toPubkey: new solanaWeb3.PublicKey(toAddress),
              lamports: lamportAmount,
            })
          );
          transaction.feePayer = new solanaWeb3.PublicKey(fromAddress);
          transaction.recentBlockhash = (await solWeb3.getLatestBlockhash()).blockhash;
          var { signature } = await window.solana.signAndSendTransaction(transaction);
          transactionHash = signature;
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { transactionHash, errorCode, errorMessage };
  };

  var resetConnectedBlockchain = function (connectedBlockChainType) {
    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        // remove ethereum event
        //window.ethereum.removeListener('accountsChanged', handleEthAccountChanged);
        break;
      case BlockChainType.SOLANA:
        // remove solana event
        //window.solana.removeListener('accountChanged', handleSolAccountChanged);
        break;
      default:
    }
  };

  var getSmartContractExecution = async function (
    connectedBlockChainType,
    contractABI,
    contractAddress,
    methodName,
    params
  ) {
    var result = null;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        var ethWeb3 = getEthWeb3();
        var contract = new ethWeb3.eth.Contract(contractABI, contractAddress);
        var contractMethod = null;
        if (params) {
          contractMethod = contract.methods[methodName](params);
        } else {
          contractMethod = contract.methods[methodName]();
        }
        await contractMethod.call(function (error, response) {
          if (error) {
            errorCode = error.code;
            errorMessage = error.message;
          } else {
            result = response.toString();
          }
        });
        break;
      case BlockChainType.SOLANA:
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { result, errorCode, errorMessage };
  };

  var setSmartContractExecution = async function (
    connectedBlockChainType,
    connectedAddress,
    contractABI,
    contractAddress,
    methodName,
    params
  ) {
    var transactionHash = null;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        try {
          var ethWeb3 = getEthWeb3();
          var contract = new ethWeb3.eth.Contract(contractABI, contractAddress);
          var contractMethod = null;
          if (params) {
            contractMethod = contract.methods[methodName](params);
          } else {
            contractMethod = contract.methods[methodName]();
          }
          await contractMethod.send({ from: connectedAddress }, function (error, hash) {
            if (error) {
              errorCode = error.code;
              errorMessage = error.message;
            } else {
              transactionHash = hash;
            }
          });
        } catch (error) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        break;
      case BlockChainType.SOLANA:
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { transactionHash, errorCode, errorMessage };
  };

  var deploySmartContract = async function (connectedBlockChainType, connectedAddress, contractABI, contractByteCode) {
    var contractAddress = null;
    var transactionHash = null;
    var errorCode = null;
    var errorMessage = null;

    switch (connectedBlockChainType) {
      case BlockChainType.ETHEREUM:
        var ethWeb3 = getEthWeb3();
        var undeployContract = new ethWeb3.eth.Contract(contractABI);
        await undeployContract
          .deploy({
            data: contractByteCode,
          })
          .send(
            {
              from: connectedAddress,
            },
            function (error, hash) {
              transactionHash = hash;
              if (error) {
                errorCode = error.code;
                errorMessage = error.message;
              }
            }
          )
          .then(function (newContractInstance) {
            contractAddress = newContractInstance.options.address;
          });
        break;
      case BlockChainType.SOLANA:
        break;
      default:
        errorCode = 'WE101';
        errorMessage = 'Wallet did not connected';
    }

    return { contractAddress, transactionHash, errorCode, errorMessage };
  };

  return {
    BlockChainType: BlockChainType,
    GenerativeGetMethodName: GenerativeGetMethodName,
    GenerativeSetMethodName: GenerativeSetMethodName,
    checkExtensionInstalled: checkExtensionInstalled,
    connectWallet: connectWallet,
    validateInputAddress: validateInputAddress,
    validateConnectedAddress: validateConnectedAddress,
    getConnectedAddress: getConnectedAddress,
    getBalance: getBalance,
    transferBalance: transferBalance,
    resetConnectedBlockchain: resetConnectedBlockchain,
    getSmartContractExecution: getSmartContractExecution,
    setSmartContractExecution: setSmartContractExecution,
    deploySmartContract: deploySmartContract,
  };
})();

export { CommonWalletModule };
