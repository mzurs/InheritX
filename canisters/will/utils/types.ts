import {
  Duration,
  Principal,
  Record,
  Variant,
  Vec,
  blob,
  nat,
  nat32,
} from "azle";
import { ICPTRANSFER, ICRCICPTRANSFER } from "../../icrc/utils/types";
import { ICRC1TransferError } from "azle/canisters/icrc";

// User Details
export type UserDetails = Record<{
  principal: Principal;
  firstNames: Vec<string>;
  lastName: string;
  sex: string;
  birthDate: string;
  birthLocationCode: string;
}>;
export type userDetailsArgs = Record<{
  firstNames: Vec<string>;
  lastName: string;
  sex: string;
  birthDate: string;
  birthLocationCode: string;
}>;

// Return Type of AddUserDetail
export type AddUserDetails = Variant<{
  userExists: boolean;
  success: boolean;
}>;

// Return type of GetUserDetail
export type GetUserDetails = Variant<{
  userDetails: UserDetails;
  userNotExists: boolean;
}>;

//Return type of updateUserDetail
// Return Type of AddUserDetail
export type UpdateUserDetails = Variant<{
  userNotExists: boolean;
  success: boolean;
}>;

//------------------------------------------------------------------------------------------------------------------------//

//List of supported ICRC tokens
export const ICRCs = ["ICP", "ckBTC", "CHAT"];

// Type supported to create a will
export const tokenTickers = ["BTC"];

//stable Memory Type for Will
export type Will = Record<{
  willName: string;
  identifier: nat32;
  tokenTicker: string;
  testator: Principal;
  heirs: Principal;
  value: nat;
  timeStamp: Duration;
  isClaimed: boolean;
}>;

export type ICRCCreateWill = Variant<{
  userNotExists: boolean;
  success: boolean;
  tokenTickerNotSupported: string;
  identifierUsed: boolean;
}>;

export type ICRCCreateWillArgs = Record<{
  willName: string;
  identifier: nat32;
  heirs: Principal;
  tokenTicker: string;
  amount: nat;
}>;

export type ICRCDeleteWill = Variant<{
  success: boolean;
  errorMessage: string;
}>;

export type GetTestatorWills = Variant<{
  userNotExists: boolean;
  noWillsExists: boolean;
  wills: Vec<Will>;
}>;

export type GetHeirWills = Variant<{
  noWillsExists: boolean;
  wills: Vec<Will>;
}>;

export type CreateWillArgs = Variant<{
  icrc: ICRCCreateWillArgs;
}>;

export type CreateWill = Variant<{
  userNotExists: boolean;
  willTypeNotSupported: boolean;
  icrc: ICRCCreateWill;
  // btc: BTCCreateWill;
}>;

export type ClaimICRCWill = {};

export type ClaimWill = Variant<{
  icrc: ICRCClaimWill;
  // btc: ClaimBTCWill;
  willNotExists: boolean;
  unAuthorizedClaimer: boolean;
  claimError: boolean;
  willTypeNotSupported: boolean;
}>;

export type ICRCClaimWill = Variant<{
  isClaimed: boolean;
  tokenTickerNotSupported: boolean;
  claimError: string;
  icpClaimResult: Record<{
    claimICPMessage: string;
    success: boolean;
  }>;
  ckbtcClaimResult: Record<{
    claimCKBTCMessage: string;
    success: boolean;
  }>;
}>;

export type DeleteWill = Variant<{
  userNotExists: boolean;
  identifierUsed: boolean;
  unAuthorizedTestator: boolean;
  willTypeNotSupported: boolean;
  willNotExists: boolean;
  icrc: ICRCDeleteWill;
}>;
