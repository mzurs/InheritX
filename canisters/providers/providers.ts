import {
  $query,
  $update,
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
import { CheckTestatorDetailsWithID, TestatorDetails } from "./utils/types";
import {
  MATCHID_URL,
  canisterBalance128,
  check_first_names,
  get_will_canister_id,
} from "./utils/utils";

//=============================================Stable Variables===========================================================

// Stable Memory to cache Testator Details if claim death details verified

const testatorCache = new StableBTreeMap<Principal, boolean>(1, 38, 100);

//=============================================CANISTER PROVIDERS METHODS===================================================

$query;
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
  const WILL_CANISTER_ID = process.env.WILL_CANISTER_ID!;

  // Only authorized principal can initiate this transfer
  if (ic.caller().toText() != WILL_CANISTER_ID) {
    return {
      result: false,
      errorMessage: Opt.None,
      message: Opt.Some("UnAuthorized Access"),
    };
  }

  const URL = MATCHID_URL + base64Id;

  // check the length of a base64Id
  if (base64Id.length != 12) {
    return {
      result: false,
      errorMessage: Opt.None,
      message: Opt.Some("Length of Base64 Id should be 12"),
    };
  }

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
    Err: (err) => null,
  });

  if (unparsedResponse == null) {
    return {
      result: false,
      errorMessage: Opt.Some(String(response.Err)),
      message: Opt.None,
    };
  }
  const parsedResponseBody = JSON.parse(
    decodeUtf8(Uint8Array.from(unparsedResponse.body))
  );

  const total = parsedResponseBody.response.total;

  if (total == 0 || total > 1) {
    return {
      errorMessage: Opt.None,
      result: false,
      message: Opt.Some(`Testator Details Not Found ${total}`),
    };
  } else {
    if (total === 1) {
      const responseFirstNames =
        parsedResponseBody.response.persons[0].name.first;
      console.log(
        "🚀 ~ file: providers.ts:124 ~ responseFirstNames:",
        responseFirstNames[0],
        responseFirstNames[1]
      );

      const responseLastName = parsedResponseBody.response.persons[0].name.last;
      // console.log(
      //   "🚀 ~ file: providers.ts:128 ~ responseLastName:",
      //   responseLastName
      // );

      const responseSex = parsedResponseBody.response.persons[0].sex;
      console.log("🚀 ~ file: providers.ts:131 ~ responseSex:", responseSex);

      const responseBirthDate =
        parsedResponseBody.response.persons[0].birth.date;
      // console.log(
      //   "🚀 ~ file: providers.ts:134 ~ responseBirthDate:",
      //   responseBirthDate
      // );

      const responseBirthLocationCode =
        parsedResponseBody.response.persons[0].birth.location.code;
      // console.log(
      //   "🚀 ~ file: providers.ts:138 ~ responseBirthLocationCode:",
      //   responseBirthLocationCode
      // );

      const responseDeathDate =
        parsedResponseBody.response.persons[0].death.date;
      // console.log(
      //   "🚀 ~ file: providers.ts:142 ~ responseDeathDate:",
      //   responseDeathDate
      // );

      const responseDeathLocationCode =
        parsedResponseBody.response.persons[0].death.location.code;
      // console.log(
      //   "🚀 ~ file: providers.ts:146 ~ responseDeathLocationCode:",
      //   responseDeathLocationCode
      // );

      if (
        check_first_names(testatorDetails.firstNames, responseFirstNames) &&
        responseLastName === testatorDetails.lastName &&
        responseBirthDate === testatorDetails.birthDate &&
        responseBirthLocationCode === testatorDetails.birthLocationCode &&
        responseDeathDate /*== testatorDetails.deathDate*/ &&
        responseDeathLocationCode /*== testatorDetails.deathLocationCode*/ &&
        responseSex == testatorDetails.sex
      ) {
        testatorCache.insert(testatorPrincipal, true);

        return {
          errorMessage: Opt.None,

          result: true,
          message: Opt.Some(
            "Testator Details Successfully Verified from MatchID Database"
          ),
        };
      } else {
        return {
          errorMessage: Opt.None,
          result: false,
          message: Opt.Some(
            "Testator Details Not Verified with MatchID Database"
          ),
        };
      }
    } else {
      return {
        result: false,
        message: Opt.Some(`Testator Details Not Found`),
        errorMessage: Opt.None,
      };
    }
  }
}

// Function to verify Testator Details With The Details Retrieve From base64_Identifier
$update;
export async function check_api(url: string): Promise<string> {
  const URL = url;

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

  return match(response, {
    Ok: (res) => decodeUtf8(Uint8Array.from(res.body)),
    Err: (err) => err,
  });
}

// HTTPs Outcalls Transformer
$query;
export function testator_details_transform(
  args: HttpTransformArgs
): HttpResponse {
  const res: HttpResponse = {
    status: args.response.status,
    body: Uint8Array.from([]),
    headers: [],
  };

  if (res.status === 200n) {
    res.body = args.response.body;
  } else {
    console.log("Error Recieved From API ", args);
  }

  return res;
}

//===============================================EXPORTS===========================================================

export { canisterBalance128, get_will_canister_id };
