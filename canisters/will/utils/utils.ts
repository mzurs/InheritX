import { $query, $update, ic, nat64 } from "azle";

export let ICRC_CANISTER_ID = "";

$query;
export function get_icrc_canister_id(): string {
  return ICRC_CANISTER_ID;
}

$update;
export function set_icrc_canister_id(icrc: string): string {
  ICRC_CANISTER_ID = icrc;
  return ICRC_CANISTER_ID;
}


// returns the amount of cycles available in the canister
$query;
export function canisterBalance(): nat64 {
    return ic.canisterBalance();
}