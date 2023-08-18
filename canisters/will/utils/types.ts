import { Principal, Record, Variant, blob, nat32 } from "azle";

// User Details
export type UserDetails = Record<{
  principal: Principal;
  firstName: string;
  lastName: string;
  legalName: string;
  sex: string;
  birthDate: string;
  birthLocationCode: string;
  isUserDied: boolean;
}>;
export type userDetailsArgs = Record<{
  firstName: string;
  lastName: string;
  legalName: string;
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
export const ICRCs = ["ckBTC", "CHAT"];

// Type supported to create a will
export const will_types = ["ICRC", "BTC", "ICP"];

//stable Memory Type for Will
export type Will = Record<{
  identifier: string;
  type: string;
  owner: Principal;
  hiers: Principal;
  value: nat32;
  isClaimed: boolean;
}>;

export type CreateWill = Variant<{
  userNotExists: boolean;
  success: boolean;
  willTypeNotSupported: string;
}>;

export type CreateWillArgs = Record<{
  identifier: string;
  hiers: Principal;
  will_type: string;
  amount: nat32;
}>;

export type DeleteWill = Variant<{
  userNotExists: boolean;
  success: boolean;
  willNotExists: boolean;
  errorMessage: string;
}>;
