import { $query, $update } from "azle";

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
