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
  LOCAL_ICP_PRINCIPAL,
  MAINNET_CKBTC_PRINCIPAL,
  MAINNET_ICP_PRINCIPAL,
} from "./utils/icrc_supported_tokens_list";

let icpCanister: Ledger;
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
  icpCanister = new Ledger(
    Principal.fromText(
      environment == "local" ? LOCAL_ICP_PRINCIPAL : MAINNET_ICP_PRINCIPAL
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

$update;
export async function executeTransfer(
  identifier: nat32,
  to: Address
): Promise<Result<TransferResult, string>> {
  const owner = binaryAddressFromPrincipal(ic.id(), identifier);
  const getBalance = getAccountBalance(to);
  const amount = match(getBalance, {
    Ok: (icp: nat) => icp,
    Err: (err: string) => err,
  });

  const fee = match(await icpCanister.transfer_fee({}).call(), {
    Ok: (icp_fee) => icp_fee.transfer_fee.e8s,
    Err: (err) => ic.trap(err),
  });

  return await icpCanister
    .transfer({
      memo: 0n,
      amount: {
        e8s: amount as nat,
      },
      fee: {
        e8s: fee,
      },
      from_subaccount: Opt.Some(owner),
      to: binaryAddressFromAddress(to),
      created_at_time: Opt.None,
    })
    .call();
}


$query;
export async function getAccountBalance(
  address: Address
): Promise<Result<Tokens, string>> {
  return await icpCanister
    .account_balance({
      account: binaryAddressFromAddress(address),
    })
    .call();
}

$query;
export async function getTransferFee(): Promise<Result<TransferFee, string>> {
  return await icpCanister.transfer_fee({}).call();
}

$query;
export async function getBlocks(
  getBlocksArgs: GetBlocksArgs
): Promise<Result<QueryBlocksResponse, string>> {
  return await icpCanister.query_blocks(getBlocksArgs).call();
}

$query;
export async function getSymbol(): Promise<Result<string, string>> {
  const symbolResultCallResult = await icpCanister.symbol().call();

  return match(symbolResultCallResult, {
    Ok: (symbolResult) => ({ Ok: symbolResult.symbol }),
    Err: (err) => ({ Err: err }),
  });
}

$query;
export async function getName(): Promise<Result<string, string>> {
  const nameResultCallResult = await icpCanister.name().call();

  return match(nameResultCallResult, {
    Ok: (nameResult) => ({ Ok: nameResult.name }),
    Err: (err) => ({ Err: err }),
  });
}

$query;
export async function getDecimals(): Promise<Result<nat32, string>> {
  const decimalsResultCallResult = await icpCanister.decimals().call();

  return match(decimalsResultCallResult, {
    Ok: (decimalsResult) => ({ Ok: decimalsResult.decimals }),
    Err: (err) => ({ Err: err }),
  });
}

$query;
export async function getArchives(): Promise<Result<Archives, string>> {
  return await icpCanister.archives().call();
}

$query;
export function getAddressFromPrincipal(principal: Principal): string {
  return hexAddressFromPrincipal(principal, 0);
}
