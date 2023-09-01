import {
  $query,
  nat,
  match,
  ic,
  $update,
  nat32,
  Principal,
  Variant,
  Opt,
  blob,
  nat64,
} from "azle";
import {
  ICRC1Account,
  ICRC1TransferError,
  ICRC1TransferArgs,
} from "azle/canisters/icrc";
import { binaryAddressFromPrincipal } from "azle/canisters/ledger";
import { ckbtcLedger } from "../../icrc";
import { getSubAccountArray } from "../../utils/utils";

//-----------------------------------CKBTC------------------------------------------

// Retrieve the Balance of Sub Account
$query;
export async function ckbtc_balance_of(account: ICRC1Account): Promise<nat> {
  const result = await ckbtcLedger.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

async function _ckbtc_balance_of(account: ICRC1Account): Promise<nat> {
  const result = await ckbtcLedger.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// Retrieve the fee associated with this ledger canister
$query;
export async function ckbtc_fee(): Promise<nat> {
  const result = await ckbtcLedger.icrc1_fee().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// function to32Bits(number: number): number[] {
//   let b = new ArrayBuffer(4);
//   new DataView(b).setUint32(0, number);
//   return Array.from(new Uint8Array(b));
// }

// function getSubAccountArray(subaccount: number): nat32[] {
//   return Array(28)
//     .fill(0)
//     .concat(to32Bits(subaccount ? subaccount : 0));
// }

// Transfer to Hier SubAccount From icrc canister SubAccount
$update;
export async function ckbtc_transfer(
  identifier: nat32,
  to: Principal
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError; strErr: string }>> {
  const owner = binaryAddressFromPrincipal(ic.id(), identifier);

  const ownerAccount: ICRC1Account = {
    owner: ic.id(),
    subaccount: Opt.None, // Opt.Some(Uint8Array.from(Uint8Array.from([identifier]))),
  };
  const balance = await _ckbtc_balance_of(ownerAccount);

  const transferArgs: ICRC1TransferArgs = {
    from_subaccount: Opt.Some(owner),
    to: {
      owner: to,
      subaccount: Opt.None,
    },
    amount: balance - 1_000_000n,
    fee: Opt.Some(1_000_000n),
    memo: Opt.None,
    created_at_time: Opt.None,
  };
  const result = await ckbtcLedger.icrc1_transfer(transferArgs).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// ======================================================================================================================

$update;
export async function transferFrom(
  identifier: nat32
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError; strErr: string }>> {
  const owner = binaryAddressFromPrincipal(ic.id(), identifier);

  // const getSubAccount = getSubAccountArray(identifier);

  const ownerAccount: ICRC1Account = {
    owner: ic.id(),
    subaccount: Opt.None, // Opt.Some(Uint8Array.from(getIdentifierBlob(identifier))), //Opt.Some(Uint8Array.from(getSubAccount)), // Opt.Some(Uint8Array.from(Uint8Array.from([identifier]))),
  };
  const balance = await _ckbtc_balance_of(ownerAccount);

  const transferArgs: ICRC1TransferArgs = {
    from_subaccount: Opt.None, // Opt.Some(owner),
    to: {
      owner: ic.id(),
      subaccount: Opt.Some(Uint8Array.from([identifier])),
    },
    amount: balance,
    fee: Opt.Some(1_000_000n),
    memo: Opt.None,
    created_at_time: Opt.None,
  };
  const result = await ckbtcLedger.icrc1_transfer(transferArgs).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}
// ================TO

$update;
export async function transferTo(
  identifier: nat32,
  principal: Principal
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError; strErr: string }>> {
  const transferArgs: ICRC1TransferArgs = {
    from_subaccount: Opt.Some(Uint8Array.from(getSubAccountArray(identifier))),
    to: {
      owner: principal,
      subaccount: Opt.Some(Uint8Array.from(getSubAccountArray(identifier))),
    },
    amount: 2_000_000n - 1_000_000n,
    fee: Opt.Some(1_000_000n),
    memo: Opt.None,
    created_at_time: Opt.None,
  };
  const result = await ckbtcLedger.icrc1_transfer(transferArgs).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}
