import {
  $query,
  $update,
  $init,
  $preUpgrade,
  $postUpgrade,
  StableBTreeMap,
  nat,
  nat32,
  match,
  Result,
  Opt,
  Variant,
  ic,
  Record,
  blob,
} from "azle";

import {
  HttpResponse,
  HttpTransformArgs,
  managementCanister,
} from "azle/canisters/management";
import decodeUtf8 from "decode-utf8";

const MATCHID_URL = "https://deces.matchid.io/deces/api/v1/";

type DeathDetails = Record<{
  firstName: string;
  lastName: string;

  birthDate: string;
  birthLocationCode: number;

  deathDate: string;
  deathLocationCode: number;
}>;
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
$update;
export function get_matchid_url(): string {
  return process.env.MATCHID_URL!;
}

export async function is_user_exists_in_response(
  response_body: blob
): Promise<boolean> {
  const parseData = JSON.parse(decodeUtf8(Uint8Array.from(response_body)));
  if (parseData.response.total == 1) {
    return true;
  } else {
    return false;
  }
}

async function fetch_death_records(_url: string): Promise<HttpResponse> {
  // const url =
  //   "https://deces.matchid.io/deces/api/v1/search?firstName=Elijah&legalName=JULIAN%20Elie&sex=M&birthDate=23%2F12%2F1927&deathDate=16%2F02%2F2023&lastName=Julien";
  const httpResult = await managementCanister
    .http_request({
      url: _url,
      max_response_bytes: Opt.Some(2_000n),
      method: {
        get: null,
      },
      headers: [],
      body: Opt.None,
      transform: Opt.Some({
        function: [ic.id(), "xkcdTransform"],
        context: Uint8Array.from([]),
      }),
    })
    .cycles(50_000_000n)
    .call();

  return match(httpResult, {
    Ok: (httpResponse) => httpResponse,
    Err: (err) => ic.trap(err),
  });
}
$update;
export async function check_user_dead_details(
  details: DeathDetails
): Promise<Variant<{ res: boolean; err: string }>> {
  const url =
    MATCHID_URL +
    "search?" +
    "firstName=" +
    details.firstName +
    "&lastName=" +
    details.lastName +
    "&birthDate=" +
    details.birthDate +
    "&birthLocationCode=" +
    details.birthLocationCode +
    "&deathDate=" +
    details.deathDate+
    "&birthLocationCode=" +
    details.deathLocationCode;

  const response: HttpResponse = await fetch_death_records(url);

  if (response.status == 200n) {
    const res = await is_user_exists_in_response(response.body);
    return { res };
  }
  return { err:(decodeUtf8(response.body)) };
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
  return {
    ...args.response,
    headers: [],
  };
}
