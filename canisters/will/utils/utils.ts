import { $query, $update, ic, nat64 } from "azle";

$query;
export function get_icrc_canister_id(): string {
  return process.env.ICRC_CANISTER_ID!;
}


$query;
export function get_providers_canister_id(): string {
  return process.env.PROVIDERS_CANISTER_ID!;
}

$query;
export function get_bitcoin_canister_id(): string {
  return process.env.BITCOIN_CANISTER_ID!;
}
// returns the amount of cycles available in the canister
$query;
export function canisterBalance(): nat64 {
  return ic.canisterBalance();
}
