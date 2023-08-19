import {
  $init,
  $postUpgrade,
  $preUpgrade,
  $query,
  $update,
  Opt,
  Principal,
  Variant,
  blob,
  ic,
  match,
  nat,
  nat32,
  nat64,
} from "azle";

import {
  Address,
  Archives,
  binaryAddressFromAddress,
  binaryAddressFromPrincipal,
  GetBlocksArgs,
  hexAddressFromPrincipal,
  Ledger,
  QueryBlocksResponse,
  Tokens,
  TransferFee,
  TransferResult,
} from "azle/canisters/ledger";

import {
  ICRC,
  ICRC1Account,
  ICRC1TransferArgs,
  ICRC1TransferError,
} from "azle/canisters/icrc";
import {
  LOCAL_CKBTC_PRINCIPAL,
  MAINNET_CKBTC_PRINCIPAL,
} from "./utils/icrc_supported_tokens_list";

let ckbtcCanister: ICRC;
let preUpgrade_ckbtc_canister: ICRC;
let environment: string = "";
let preUpgrade_environment: string = "";

$init;
export function init(env: string): void {
  environment = env;
  ckbtcCanister = new ICRC(
    Principal.fromText(
      environment == "local" ? LOCAL_CKBTC_PRINCIPAL : MAINNET_CKBTC_PRINCIPAL
    )
  );
}

$preUpgrade;
export function preUpgrade(): void {
  console.log("runs before canister upgrade");
  preUpgrade_ckbtc_canister = ckbtcCanister;
  preUpgrade_environment = environment;
}

$postUpgrade;
export function postUpgrade(): void {
  console.log("runs after canister upgrade");
  ckbtcCanister = preUpgrade_ckbtc_canister;
  environment = preUpgrade_environment;
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
  return Principal.fromText(
    environment == "local" ? LOCAL_CKBTC_PRINCIPAL : MAINNET_CKBTC_PRINCIPAL
  );
}

//retrieve environment which icrc operating currently
$query;
export function get_current_environment(): string {
  return environment;
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
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError }>> {
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
    amount: balance - (await ckbtc_fee()),
    fee: Opt.None,
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
