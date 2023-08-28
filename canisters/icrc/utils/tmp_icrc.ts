import {
  $init,
  $postUpgrade,
  $preUpgrade,
  $query,
  $update,
  Opt,
  Principal,
  Result,
  Variant,
  blob,
  ic,
  match,
  nat,
  nat32,
} from "azle";

import {
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
  Ledger,
  Tokens,
  TransferResult,
} from "azle/canisters/ledger";

import {
  ICRC,
  ICRC1Account,
  ICRC1TransferArgs,
  ICRC1TransferError,
} from "azle/canisters/icrc";
import {
  CKBTC_PRINCIPAL,
  ICP_PRINCIPAL,
} from "../utils/icrc_supported_tokens_list";

//=============================================Stable Variables===========================================================

const icpCanister: Ledger = new Ledger(Principal.fromText(ICP_PRINCIPAL));
const ckbtcCanister: ICRC = new ICRC(Principal.fromText(CKBTC_PRINCIPAL));

//=============================================CANISTER LIFECYCLE=========================================================

$init;
export function init(): void {}

$preUpgrade;
export function preUpgrade(): void {
  console.log("ICRC Canister Pre-upgrade");
}

$postUpgrade;
export function postUpgrade(): void {
  console.log("ICRC Canister Post-Upgrade");
}

$query;
export function hex_address_from_principal(
  principal: Principal,
  subaccount: nat32
): string {
  return hexAddressFromPrincipal(principal, subaccount);
}

$query;
export function binary_address_from_principal(
  principal: Principal,
  subaccount: nat32
): blob {
  return binaryAddressFromPrincipal(principal, subaccount);
}

// get canister Principal of ICRC canister
$query;
export function get_icrc_canister_id(): Principal {
  return ic.id();
}

// request subaccount w/0 identifier
$query;
export function get_canister_hex_subaccount_from_identifier(
  identifier: nat32
): string {
  return hexAddressFromPrincipal(ic.id(), identifier);
}

$query;
export function get_canister_binary_subaccount_from_identifier(
  identifier: nat32
): blob {
  return binaryAddressFromPrincipal(ic.id(), identifier);
}

//retrieve current ckBTC ledger canister id used in icrc
$query;
export function get_ckBTC_canister_id(): Principal {
  return Principal.fromText(CKBTC_PRINCIPAL);
}

//====================================ICRC==========================================

//-----------------------------------CKBTC------------------------------------------

// Retrieve the Balance of Sub Account
$query;
export async function ckbtc_balance_of(account: ICRC1Account): Promise<nat> {
  const result = await ckbtcCanister.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

async function _ckbtc_balance_of(account: ICRC1Account): Promise<nat> {
  const result = await ckbtcCanister.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// Retrieve the fee associated with this ledger canister
$query;
export async function ckbtc_fee(): Promise<nat> {
  const result = await ckbtcCanister.icrc1_fee().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// Transfer to Hier SubAccount From icrc canister SubAccount
$update;
export async function ckbtc_transfer(
  identifier: nat32,
  to: Principal
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError; strErr: string }>> {
  const owner = binaryAddressFromPrincipal(ic.id(), identifier);

  const ownerAccount: ICRC1Account = {
    owner: ic.id(),
    subaccount: Opt.Some(owner),
  };
  const balance = await _ckbtc_balance_of(ownerAccount);

  const transferArgs: ICRC1TransferArgs = {
    from_subaccount: Opt.Some(owner),
    to: {
      owner: to,
      subaccount: Opt.None,
    },
    amount: balance,
    fee: Opt.Some(await ckbtc_fee()),
    memo: Opt.None,
    created_at_time: Opt.None,
  };
  const result = await ckbtcCanister.icrc1_transfer(transferArgs).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

//-----------------------------------ICP------------------------------------------

$update;
export async function icrc_transfer(
  to: Principal,
  identifier: nat32
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError; strErr: string }>> {
  const transfer = await icpCanister
    .icrc1_transfer({
      from_subaccount: Opt.Some(
        binaryAddressFromPrincipal(ic.id(), identifier)
      ),
      to: {
        owner: to,
        subaccount: Opt.None,
      },
      amount:
        match(
          await icpCanister
            .icrc1_balance_of({
              owner: ic.id(),
              subaccount: Opt.Some(
                binaryAddressFromPrincipal(ic.id(), identifier)
              ),
            })
            .call(),
          {
            Ok: (ok) => ok,
            Err: (err) => ic.trap(err),
          }
        ) -
        match(await icpCanister.icrc1_fee().call(), {
          Ok: (ok) => ok,
          Err: (err) => ic.trap(err),
        }),
      fee: Opt.Some(
        match(await icpCanister.icrc1_fee().call(), {
          Ok: (ok) => ok,
          Err: (err) => ic.trap(err),
        })
      ),
      memo: Opt.None,
      created_at_time: Opt.None,
    })
    .call();

  return match(transfer, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$update;
export async function icrc_balance(
  to: Principal,
  identifier: nat32
): Promise<Result<bigint, string>> {
  return await icpCanister
    .icrc1_balance_of({
      owner: to,
      subaccount: Opt.Some(binaryAddressFromPrincipal(ic.id(), identifier)),
    })
    .call();
}

$update;
export async function executeTransfer(
  to: Principal,
  identifier: nat32
): Promise<Result<TransferResult, string>> {
  const from = binaryAddressFromPrincipal(ic.id(), identifier);
  // const amount=await
  return await icpCanister
    .transfer({
      memo: 0n,
      amount: {
        e8s: 1_000_000n,
      },
      fee: {
        e8s: 10_000n,
      },
      from_subaccount: Opt.Some(from),
      to: binaryAddressFromPrincipal(to, 0),
      created_at_time: Opt.None,
    })
    .call();
}

$update;
export async function getAccountBalance(
  principal: Principal,
  identifier: nat32
): Promise<Result<Tokens, string>> {
  return await icpCanister
    .account_balance({
      account: binaryAddressFromPrincipal(principal, identifier),
    })
    .call();
}

$query;
export async function getSubAccountBalances(
  identifier: nat32,
  acc: blob
): Promise<Result<Tokens, string>> {
  return await icpCanister
    .account_balance({
      account: acc, //binaryAddressFromPrincipal(ic.id(), identifier),
    })
    .call();
}
