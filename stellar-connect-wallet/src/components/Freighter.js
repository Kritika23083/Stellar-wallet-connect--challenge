import {
  signTransaction,
  setAllowed,
  getAddress,
  isConnected,
  getNetwork,
  getNetworkDetails
} from '@stellar/freighter-api';
import {
  Networks,
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  StrKey
} from '@stellar/stellar-sdk';

const NETWORK = "TESTNET";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const HORIZON_URL = "https://horizon-testnet.stellar.org";

const server = new Horizon.Server(HORIZON_URL);

/**
 * Checks if the Freighter browser extension is installed.
 */
const isWalletInstalled = async () => {
  try {
    return await isConnected();
  } catch (error) {
    console.error("Error checking Freighter installation:", error);
    return false;
  }
};

/**
 * Request access to user's wallet.
 */
const checkConnection = async () => {
  try {
    const result = await setAllowed();
    if (typeof result === 'boolean') {
      return result;
    }
    return result?.isAllowed || false;
  } catch (error) {
    console.error("Error setting Freighter permissions:", error);
    return false;
  }
};

/**
 * Retrieve connected Freighter public key.
 */
const retrievePublicKey = async () => {
  const { address, error } = await getAddress();
  if (error) {
    throw new Error(error);
  }
  return address;
};

/**
 * Retrieve currently active network in Freighter.
 */
const getWalletNetwork = async () => {
  try {
    const { network, error } = await getNetwork();
    if (error) {
      throw new Error(error);
    }
    return network; // Expected: "TESTNET" or "PUBLIC"
  } catch (error) {
    console.error("Error retrieving Freighter network details:", error);
    return null;
  }
};

/**
 * Load the account from Stellar Testnet Horizon.
 * If 404, indicates the account is valid but not yet activated.
 */
const getBalance = async (address) => {
  try {
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b) => b.asset_type === "native");
    return {
      balance: Number(xlm?.balance || 0).toFixed(4),
      isActivated: true
    };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return {
        balance: "0.0000",
        isActivated: false
      };
    }
    throw err;
  }
};

/**
 * Request funding from Stellar Testnet Friendbot for the specified address.
 */
const fundWithFriendbot = async (address) => {
  const url = `https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Stellar Friendbot faucet error. Please try again later.");
  }
  return await response.json();
};

/**
 * Check if the recipient public key is activated on Testnet.
 */
const checkRecipientAccount = async (recipientAddress) => {
  try {
    await server.loadAccount(recipientAddress);
    return { exists: true };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return { exists: false };
    }
    throw err;
  }
};

/**
 * Validates public key using official Stellar tools.
 */
const isValidAddress = (address) => {
  return StrKey.isValidEd25519PublicKey(address);
};

/**
 * Build, sign and submit a testnet payment transaction.
 * Uses createAccount operation if recipient doesn't exist.
 */
const sendPayment = async ({ sender, recipient, amount, recipientExists }) => {
  // Query network details first before creating the transaction
  const networkDetails = await getNetworkDetails();

  if (
    networkDetails.error ||
    networkDetails.network !== "TESTNET" ||
    networkDetails.networkPassphrase !== Networks.TESTNET
  ) {
    throw new Error(
      "Please switch Freighter to Stellar Testnet before sending."
    );
  }

  // Load current sender account data from Horizon for sequence number
  const sourceAccount = await server.loadAccount(sender);

  const operation = recipientExists
    ? Operation.payment({
        destination: recipient,
        asset: Asset.native(),
        amount: amount.toString(),
      })
    : Operation.createAccount({
        destination: recipient,
        startingBalance: amount.toString(),
      });

  // Build the transaction envelope with explicit testnet passphrase constant
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(180)
    .build();

  // Add temporary console logs immediately before signTransaction
  console.log("Freighter network:", networkDetails);
  console.log("Expected passphrase:", Networks.TESTNET);

  // Prompt Freighter for signing with direct passphrase mapping options
  const signedResult = await signTransaction(transaction.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: sender,
  });

  if (signedResult.error) {
    throw new Error(signedResult.error);
  }

  // Reconstruct the signed transaction using the same testnet passphrase
  const signedTransaction = TransactionBuilder.fromXDR(
    signedResult.signedTxXdr,
    NETWORK_PASSPHRASE
  );

  try {
    // Submit the signed transaction envelope to the Testnet Horizon server
    const result = await server.submitTransaction(signedTransaction);
    return result;
  } catch (submitError) {
    console.error("Horizon submission failed:", submitError);
    if (submitError.response && submitError.response.data) {
      const data = submitError.response.data;
      if (data.extras && data.extras.result_codes) {
        const codes = data.extras.result_codes;
        let msg = "Transaction failed: ";
        if (codes.transaction) {
          msg += `Transaction: ${codes.transaction}. `;
        }
        if (codes.operations && codes.operations.length > 0) {
          msg += `Operation: ${codes.operations.join(", ")}.`;
        }
        throw new Error(msg);
      }
      if (data.detail) {
        throw new Error(data.detail);
      }
    }
    throw submitError;
  }
};

export {
  isWalletInstalled,
  checkConnection,
  retrievePublicKey,
  getWalletNetwork,
  getBalance,
  fundWithFriendbot,
  checkRecipientAccount,
  isValidAddress,
  sendPayment,
  NETWORK,
};
