import {
  $query,
  $update,
  $init,
  $preUpgrade,
  $postUpgrade,
  StableBTreeMap,
  match,
  Opt,
  ic,
  Principal,
} from "azle";

import {
  HttpResponse,
  HttpTransformArgs,
  managementCanister,
} from "azle/canisters/management";
import decodeUtf8 from "decode-utf8";
import {
  CheckTestatorDetailsWithID,
  Person,
  TestatorDetails,
} from "./utils/types";
import { MATCHID_URL, check_first_names } from "./utils/utils";

//=============================================Stable Variables===========================================================

// Stable Memory to cache Testator Details if claim death details verified

const testatorCache = new StableBTreeMap<Principal, boolean>(1, 38, 100);

//=============================================CANISTER LIFECYCLE=========================================================

// Runs on first deployment
$init;
export function init(): void {
  console.log("This runs once when the canister is first initialized");
}

$preUpgrade;
export function pre_upgrade(): void {
  console.log("This runs before every canister upgrade");
}

$postUpgrade;
export function post_upgrade(): void {
  console.log("This runs after every canister upgrade");
}

//=============================================CANISTER PROVIDERS METHODS===================================================

$update;
export function get_matchid_url(): string {
  return MATCHID_URL!;
}

// Function to Whether Testator Already Died
$query;
export function isTestatorDied(testatorPrincipal: Principal): boolean {
  return match(testatorCache.get(testatorPrincipal), {
    Some: (testator) => testator,
    None: () => false,
  });
}

// Function to verify Testator Details With The Details Retrieve From base64_Identifier
$update;
export async function check_testator_details_with_id(
  testatorPrincipal: Principal,
  base64Id: string,
  testatorDetails: TestatorDetails
): Promise<CheckTestatorDetailsWithID> {
  const URL = MATCHID_URL + "id/" + base64Id;

  const response = await managementCanister
    .http_request({
      url: URL,
      max_response_bytes: Opt.Some(2_000n),
      method: {
        get: null,
      },
      headers: [],
      body: Opt.None,
      transform: Opt.Some({
        function: [ic.id(), "testator_details_transform"],
        context: Uint8Array.from([]),
      }),
    })
    .cycles(100_000_000n)
    .call();

  const unparsedResponse = match(response, {
    Ok: (unparsedResponse) => unparsedResponse,
    Err: (err) => ic.trap(err),
  });

  const parsedResponseBody = JSON.parse(
    decodeUtf8(Uint8Array.from(unparsedResponse.body))
  );

  const total = parsedResponseBody.response.total;

  if (total == 0 || total > 1) {
    return {
      result: false,
      message: Opt.Some(`Testator Details Not Found ${total}`),
    };
  } else {
    if (total === 1) {
      const responseFirstNames =
        parsedResponseBody.response.persons[0].name.first;

      const responseLastName = parsedResponseBody.response.persons[0].name.last;

      const responseSex = parsedResponseBody.response.persons[0].sex;

      const responseBirthDate =
        parsedResponseBody.response.persons[0].birth.date;

      const responseBirthLocationCode =
        parsedResponseBody.response.persons[0].birth.location.code;

      const responseDeathDate =
        parsedResponseBody.response.persons[0].death.date;

      const responseDeathLocationCode =
        parsedResponseBody.response.persons[0].death.location.code;

      if (
        (check_first_names(testatorDetails.firstNames, responseFirstNames) &&
          responseLastName == testatorDetails.lastName &&
          responseBirthDate == testatorDetails.birthDate &&
          responseBirthLocationCode == testatorDetails.birthLocationCode,
        responseDeathDate == testatorDetails.deathDate &&
          responseDeathLocationCode == testatorDetails.deathLocationCode &&
          responseSex == testatorDetails.sex)
      ) {
        testatorCache.insert(testatorPrincipal, true);

        return {
          result: true,
          message: Opt.Some(
            "Testator Details Successfully Verified from MatchID Database"
          ),
        };
      } else {
        return {
          result: false,
          message: Opt.Some(
            ` "Testator Details Not Verified from MatchID Database"`
          ),
        };
      }
    } else {
      return {
        result: false,
        message: Opt.Some(`Testator Number should be 1`),
      };
    }
  }
}

// HTTPs Outcalls Transformer
$query;
export function testator_details_transform(
  args: HttpTransformArgs
): HttpResponse {
  return {
    ...args.response,
    headers: [],
  };
}
