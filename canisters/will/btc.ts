import { $query, $update, Principal, ic, match, nat64 } from "azle";
import { Bitcoin } from "../../services/bitcoin";

export const BITCOIN_CANISTER_ID = Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai");
const btc = new Bitcoin(BITCOIN_CANISTER_ID);
$update;
export async function bitcoin_get_balance(address: string): Promise<nat64> {
  const balance = await btc.getBalance(address).call();
  return match(balance, {
    Ok: (res) => res,
    Err: (err) => ic.trap(err),
  });
}
