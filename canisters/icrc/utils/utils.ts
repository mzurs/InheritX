import { $query, $update } from "azle";

//CANISTER IDs
export let WILL_CANISTER_ID = "";

$query;
export function get_will_canister_id(): string {
  return WILL_CANISTER_ID;
}

$update;
export function set_will_canister_id(willCanisterId: string): string {
  WILL_CANISTER_ID = willCanisterId;
  return WILL_CANISTER_ID;
}
