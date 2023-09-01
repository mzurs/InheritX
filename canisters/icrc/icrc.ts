import {
  Principal,
  $init,
  $preUpgrade,
  $postUpgrade,
  $query,
  ic,
  blob,
  nat32,
  Opt,
  match,
  Tuple,
  Vec,
  $update,
} from "azle";
import { ICRC } from "azle/canisters/icrc";
import {
  Ledger,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
import {
  ICP_PRINCIPAL,
  CKBTC_PRINCIPAL,
} from "./utils/icrc_supported_tokens_list";

import {
  icp_transfer,
  get_account_balance_of_icp_identifier,
  icrc_icp_balanceOf,
  icrc_icp_fee,
  icrc_icp_transfer,
} from "./ledgers/icp/icp";
import {
  WILL_CANISTER_ID,
  getSubAccountArray,
  get_will_canister_id,
  set_will_canister_id,
} from "./utils/utils";
import {
  ckbtc_balance_of,
  ckbtc_fee,
  ckbtc_transfer,
  transferFrom,
  transferTo,
} from "./ledgers/ckbtc/ckbtc";
//=============================================Stable Variables===========================================================

export const icpLedger: Ledger = new Ledger(Principal.fromText(ICP_PRINCIPAL));
export const ckbtcLedger: ICRC = new ICRC(Principal.fromText(CKBTC_PRINCIPAL));

//=============================================CANISTER LIFECYCLE=========================================================

$init;
export function init(): void {
  
}

$preUpgrade;
export function preUpgrade(): void {
  console.log("ICRC Canister Pre-upgrade");
}

$postUpgrade;
export function postUpgrade(): void {
  console.log("ICRC Canister Post-Upgrade");
}

//==============================================ICRC CANISTER METHODS===============================================

//----------------------------------------------Query Methods--------------------------------------------------------

// $update;
// export function generateId(): Principal {
//   const randomBytes = new Array(29)
//     .fill(0)
//     .map((_) => Math.floor(Math.random() * 256));

//   const num: nat32 = 34;
//   const principal: Principal = Principal.fromText(
//     "2d5b3-qwqqi-6lqcc-hlbpr-usr2a-xssrt-k5xae-ulskf-y5n22-uqija-j3s"
//   );
//   console.log(principal.toUint8Array());
//   return Principal.fromUint8Array(Uint8Array.from(randomBytes));
// }
// list of canisterids and Ledgers IDs that are pass in an environment variable and others
$query;
export function list_canister_ids(): Vec<Tuple<[string, string]>> {
  // const willCanisterID=["WILL CANISTER",process.env.WILL_CANISTER_ID]
  const list: Vec<Tuple<[string, string]>> = [
    ["WILL CANISTER", WILL_CANISTER_ID],
    ["ICP_Ledger", ICP_PRINCIPAL],
    ["CKBTC_Ledger", CKBTC_PRINCIPAL],
  ];

  return list;
}

// get the current canister id of ICRC Canister
$query;
export function get_icrc_canister_id(): Principal {
  return ic.id();
}

// verify the calling principal is the controller of icrc canister
$query;
export function verify_icrc_controller(principal: Opt<Principal>): boolean {
  const id = match(principal, {
    Some: (principal) => principal,
    None: () => null,
  });

  return ic.isController(!id ? ic.caller() : id);
}

// request unique subaccount by providing identifier
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
$query;
export function binary_address_from_principal(
  principal: Principal,
  subaccount: nat32
): blob {
  return binaryAddressFromPrincipal(principal, subaccount);
}

$query;
export function hex_address_from_principal(
  principal: Principal,
  subaccount: nat32
): string {
  return hexAddressFromPrincipal(principal, subaccount);
}

// To generate blob for a from_subaccount from indentifer
$query;
export function getIdentifierBlob(identifier: nat32): blob {
  return Uint8Array.from(getSubAccountArray(identifier));
}
//----------------------------------------------Update Methods--------------------------------------------------------

//----------------------------------------------EXports---------------------------------------------------------------

export {
  //utils
  get_will_canister_id,
  set_will_canister_id,
  //icp
  icrc_icp_fee,
  icrc_icp_transfer,
  icrc_icp_balanceOf,
  icp_transfer,
  get_account_balance_of_icp_identifier,

  //ckbtc
  ckbtc_fee,
  ckbtc_transfer,
  ckbtc_balance_of,
  transferFrom,
  transferTo,
};
