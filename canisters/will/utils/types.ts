import { Duration, Principal, Record, Variant, Vec, blob, nat32 } from "azle";

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
export const will_types = ["BTC"];

//stable Memory Type for Will
export type Will = Record<{
  willName: string;
  identifier: nat32;
  will_type: string;
  testator: Principal;
  heirs: Principal;
  value: nat32;
  timeStamp:Duration
  isClaimed: boolean;
}>;

export type CreateWill = Variant<{
  userNotExists: boolean;
  success: boolean;
  willTypeNotSupported: string;
}>;

export type ICRCCreateWillArgs = Record<{
  willName: string;
  identifier: nat32;
  heirs: Principal;
  will_type: string;
  amount: nat32;
}>;

export type DeleteWill = Variant<{
  userNotExists: boolean;
  success: boolean;
  willNotExists: boolean;
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
