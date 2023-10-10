import {
  blob,
  $init,
  match,
  nat64,
  $postUpgrade,
  $update,
  Vec,
  $query,
  nat32,
  ic,
  nat,
} from "azle";
import {
  BitcoinNetwork,
  GetUtxosResult,
  MillisatoshiPerByte,
} from "azle/canisters/management";

import * as bitcoinApi from "./apis";
import * as bitcoinWallet from "./wallet/wallet";
import { BitcoinTransfer, SendRequest } from "./utils/types";
import {
  WILL_CANISTER_ID,
  getIdentifierBlob,
  set_will_canister_id,
} from "./utils/utils";
import { get_will_canister_id } from "./utils/utils";
//=====================================================VARIABLES===========================================================

// The current Bitcoin Network the canister using
let NETWORK: BitcoinNetwork = {
  Testnet: null,
};

// The ECDSA key name.
let KEY_NAME: string = "";

//=============================================CANISTER LIFECYCLE=========================================================
$init;
export function init(network: BitcoinNetwork): void {
  NETWORK = network;

  KEY_NAME = match(network, {
    Mainnet: () => "test_key_1",
    Testnet: () => "test_key_1",
    Regtest: () => "dfx_test_key",
  });
}

$postUpgrade;
export function postUpgrade(network: BitcoinNetwork): void {
  NETWORK = network;

  KEY_NAME = match(network, {
    Mainnet: () => "test_key_1",
    Testnet: () => "test_key_1",
    Regtest: () => "dfx_test_key",
  });
}

//===================================================BITCOIN CANISTER ======================================================

//====================================================FUNCTIONS=============================================================
async function calculate_p2pkh_address_estimate_fee(
  utxoLength: nat
): Promise<nat> {
  // Get fee percentiles from previous transactions to estimate our own fee.
  const feePercentiles = await bitcoinApi.get_current_fees_percentiles(NETWORK);

  const feePerByte =
    feePercentiles.length === 0
      ? // There are no fee percentiles. This case can only happen on a regtest
        // network where there are no non-coinbase transactions. In this case,
        // we use a default of 2000 millisatoshis/byte (i.e. 2 satoshi/byte)
        2_000n
      : // Choose the 50th percentile for sending fees.
        feePercentiles[49];

  // Input size (one UTXO): 148 bytes
  // Output size (one output): 34 bytes
  // Transaction header size: 8 bytes
  // Transaction size overhead: 10 bytes (assuming one input and one output)

  const INPUT_SIZE_OF_ONE_UTXO = 148n;
  const OUTPUT_SIZE_OF_ONE_UTXO = 34n;
  const TRANSACTION_HEADER_SIZE = 8n;
  const TRANSACTION_OVERHEAD_SIZE = 10n;
  const MILLI_SATOSHI_TO_SATOSHI = 1000n;

  const transactionSize =
    INPUT_SIZE_OF_ONE_UTXO * utxoLength +
    OUTPUT_SIZE_OF_ONE_UTXO * 2n +
    TRANSACTION_HEADER_SIZE +
    TRANSACTION_OVERHEAD_SIZE;

  const estimatedFee =
    (transactionSize * feePerByte) / MILLI_SATOSHI_TO_SATOSHI;

  return estimatedFee;
}
//---------------------------------------------------Query Methods----------------------------------------------------------

// function to get the current Bitcoin Network using
$query;
export function get_bitcoin_network(): BitcoinNetwork {
  return NETWORK;
}
//---------------------------------------------------Update Methods---------------------------------------------------------

// Returns the balance of the given bitcoin address.
$update;
export async function get_balance(address: string): Promise<nat64> {
  return await bitcoinApi.get_balance(NETWORK, address);
}

// Returns the balance of the given will identifier
$update;
export async function get_balance_by_identifier(
  identifier: nat32
): Promise<nat64> {
  const address = await bitcoinWallet.get_p2pkh_address(NETWORK, KEY_NAME, [
    getIdentifierBlob(identifier),
  ]);

  const balance = await bitcoinApi.get_balance(NETWORK, address);

  return balance;
}

/// Returns the UTXOs of the given bitcoin address.
$update;
export async function get_utxos(address: string): Promise<GetUtxosResult> {
  return await bitcoinApi.get_utxos(NETWORK, address);
}

// Returns the 100 fee percentiles measured in millisatoshi/byte.
// Percentiles are computed from the last 10,000 transactions (if available).
$update;
export async function get_current_fees_percentiles(): Promise<
  Vec<MillisatoshiPerByte>
> {
  return await bitcoinApi.get_current_fees_percentiles(NETWORK);
}

/// Returns the P2PKH address of this canister at a specific derivation path.
$update;
export async function get_p2pkh_address(identifier: nat32): Promise<string> {
  return await bitcoinWallet.get_p2pkh_address(NETWORK, KEY_NAME, [
    getIdentifierBlob(identifier),
  ]);
}

$update;
export async function bitcoin_transfer(
  request: SendRequest
): Promise<BitcoinTransfer> {
  if (ic.caller().toText() !== WILL_CANISTER_ID) {
    return {
      unAuthorized: true,
    };
  } else {
    //get the canister source address for a given identifier
    const srcCanisterAddress = await bitcoinWallet.get_p2pkh_address(
      NETWORK,
      KEY_NAME,
      [getIdentifierBlob(request.identifier)]
    );

    const totalUtxos = await bitcoinApi.get_utxos(NETWORK, srcCanisterAddress);

    const totalUtxosLength = totalUtxos.utxos.length;

    const estimatedFee = await calculate_p2pkh_address_estimate_fee(
      BigInt(totalUtxosLength)
    );

    //get the canister source address balance for a given identifier
    const srcAddressBalance = await bitcoinApi.get_balance(
      NETWORK,
      srcCanisterAddress
    );

    // srcAddress Balance should contain > amount for the calculated fee
    if (srcAddressBalance <= estimatedFee) {
      return {
        inSufficientFunds: true,
      };
    }

    const expectedAmount = srcAddressBalance - estimatedFee;

    // return transaction hash if it successfull
    const txId = await bitcoinWallet.bitcoin_transfer(
      NETWORK,
      [getIdentifierBlob(request.identifier)],
      KEY_NAME,
      request.destinationAddress,
      // request.amountInSatoshi
      expectedAmount
    );

    return {
      txid: txId.to_string(),
    };
  }
}

//====================================EXPORTS=================================
export { get_will_canister_id, set_will_canister_id };
