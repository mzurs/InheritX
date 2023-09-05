import {
  blob,
  $init,
  match,
  nat64,
  $postUpgrade,
  $update,
  Vec,
  nat32,
} from "azle";
import {
  BitcoinNetwork,
  GetUtxosResult,
  MillisatoshiPerByte,
} from "azle/canisters/management";

import * as bitcoinApi from "./bitcoin_api";
import * as bitcoinWallet from "./bitcoin_wallet";
import { SendRequest } from "./types";

// The bitcoin network to connect to.
//
// When developing locally this should be `Regtest`.
// When deploying to the IC this should be `Testnet`.
// `Mainnet` is currently unsupported.
let NETWORK: BitcoinNetwork = {
  Regtest: null,
};

// The derivation path to use for ECDSA secp256k1.
let DERIVATION_PATH: Vec<blob> = [Uint8Array.from([1])];

// The ECDSA key name.
let KEY_NAME: string = "test_key_1";

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

/// Returns the balance of the given bitcoin address.
$update;
export async function getBalance(address: string): Promise<nat64> {
  return await bitcoinApi.getBalance(NETWORK, address);
}

/// Returns the UTXOs of the given bitcoin address.
$update;
export async function getUtxos(address: string): Promise<GetUtxosResult> {
  return await bitcoinApi.getUtxos(NETWORK, address);
}

/// Returns the 100 fee percentiles measured in millisatoshi/byte.
/// Percentiles are computed from the last 10,000 transactions (if available).
$update;
export async function getCurrentFeePercentiles(): Promise<
  Vec<MillisatoshiPerByte>
> {
  return await bitcoinApi.getCurrentFeePercentiles(NETWORK);
}
// ===============
export function getSubAccountArray(subaccount: number): number[] {
  return Array(28)
    .fill(0)
    .concat(to32Bits(subaccount ? subaccount : 0));
}

export function to32Bits(number: number): number[] {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, number);
  return Array.from(new Uint8Array(b));
}

// $query;
export function getIdentifierBlob(identifier: nat32): blob {
  return Uint8Array.from(getSubAccountArray(identifier));
}
/// Returns the P2PKH address of this canister at a specific derivation path.
$update;
export async function getP2PKHAddress(identifier: nat32): Promise<string> {
  return await bitcoinWallet.getP2PKHAddress(NETWORK, KEY_NAME, [
    getIdentifierBlob(identifier),
  ]);
}

$update;
export async function send(request: SendRequest): Promise<string> {
  const txId = await bitcoinWallet.send(
    NETWORK,
    [getIdentifierBlob(request.identifier)],
    KEY_NAME,
    request.destinationAddress,
    request.amountInSatoshi
  );

  return txId.to_string();
}
