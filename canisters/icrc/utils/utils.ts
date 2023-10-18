import { $query, $update, ic, nat } from "azle";


$query;
export function get_will_canister_id(): string {
  return process.env.WILL_CANISTER_ID!;
}


export function getSubAccountArray(subaccount: number): number[] {
  return Array(28)
    .fill(0)
    .concat(to32Bits(subaccount ? subaccount : 0));
}

export function to32Bits(number: number): number[] {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, number);
  return Array.from(new Uint8Array(b));
}

// returns the amount of cycles available in the canister
$query;
export function canisterBalance128(): nat {
  return ic.canisterBalance128();
}
