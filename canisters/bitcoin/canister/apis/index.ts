import { blob, ic, match, nat64, Opt, Vec } from "azle";
import {
  BitcoinNetwork,
  GetUtxosResult,
  MillisatoshiPerByte,
} from "azle/canisters/management/bitcoin";
import { managementCanister } from "azle/canisters/management";

const GET_BALANCE_COST_CYCLES: nat64 = 100_000_000n;
const GET_UTXOS_COST_CYCLES: nat64 = 10_000_000_000n;
const GET_CURRENT_FEE_PERCENTILES_CYCLES: nat64 = 100_000_000n;
const SEND_TRANSACTION_BASE_CYCLES: nat64 = 5_000_000_000n;
const SEND_TRANSACTION_PER_BYTE_CYCLES: nat64 = 20_000_000n;

export async function get_balance(
  network: BitcoinNetwork,
  address: string
): Promise<nat64> {
  const balanceRes = await managementCanister
    .bitcoin_get_balance({
      address,
      network,
      min_confirmations: Opt.None,
    })
    .cycles(GET_BALANCE_COST_CYCLES)
    .call();

  return match(balanceRes, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

export async function get_utxos(
  network: BitcoinNetwork,
  address: string
): Promise<GetUtxosResult> {
  const utxosRes = await managementCanister
    .bitcoin_get_utxos({
      address,
      network,
      filter: Opt.None,
    })
    .cycles(GET_UTXOS_COST_CYCLES)
    .call();

  return match(utxosRes, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

export async function get_current_fees_percentiles(
  network: BitcoinNetwork
): Promise<Vec<MillisatoshiPerByte>> {
  const res = await managementCanister
    .bitcoin_get_current_fee_percentiles({
      network,
    })
    .cycles(GET_CURRENT_FEE_PERCENTILES_CYCLES)
    .call();

  return match(res, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

export async function send_transaction(
  network: BitcoinNetwork,
  transaction: blob
): Promise<void> {
  const transactionFee =
    SEND_TRANSACTION_BASE_CYCLES +
    BigInt(transaction.length) * SEND_TRANSACTION_PER_BYTE_CYCLES;

  const res = await managementCanister
    .bitcoin_send_transaction({
      network,
      transaction,
    })
    .cycles(transactionFee)
    .call();

  return match(res, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}
