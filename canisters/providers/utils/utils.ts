import { $query, Vec, ic, nat } from "azle";

export const MATCHID_URL: string =
  "https://wfqec4ytsif4icqmpb6w4wpray0afpxr.lambda-url.us-east-2.on.aws/?id=";
// "https://deces.matchid.io/deces/api/v1/";

export function check_first_names(
  testatorNames: Vec<string>,
  responseName: Vec<string>
): boolean {
  // Loop through each element of array A.
  for (const a of testatorNames) {
    // Check if element a exists in array B.
    if (!responseName.includes(a)) {
      // If element a does not exist in array B, return false.
      return false;
    }
  }
  return true;
}

// returns the amount of cycles available in the canister
$query;
export function canisterBalance128(): nat {
  return ic.canisterBalance128();
}

$query;
export function get_will_canister_id(): string {
  return process.env.WILL_CANISTER_ID!;
}
