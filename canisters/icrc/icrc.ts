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
} from "azle";
import { ICRC } from "azle/canisters/icrc";
import { Ledger, binaryAddressFromPrincipal, hexAddressFromPrincipal } from "azle/canisters/ledger";
import {
  ICP_PRINCIPAL,
  CKBTC_PRINCIPAL,
} from "./utils/icrc_supported_tokens_list";

import {
  icrc_icp_balanceOf,
  icrc_icp_fee,
  icrc_icp_transfer,
} from "./ledgers/icp/icp";
import {
  WILL_CANISTER_ID,
  get_will_canister_id,
  set_will_canister_id,
} from "./utils/utils";
//=============================================Stable Variables===========================================================

export const icpLedger: Ledger = new Ledger(Principal.fromText(ICP_PRINCIPAL));
export const ckbtcLedger: ICRC = new ICRC(Principal.fromText(CKBTC_PRINCIPAL));

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

//==============================================ICRC CANISTER METHODS===============================================

//----------------------------------------------Query Methods--------------------------------------------------------

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
//----------------------------------------------Update Methods--------------------------------------------------------

//----------------------------------------------EXports---------------------------------------------------------------

export {
  icrc_icp_fee,
  icrc_icp_transfer,
  icrc_icp_balanceOf,
  get_will_canister_id,
  set_will_canister_id,
};
