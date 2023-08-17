import { Principal, Record, Variant, nat32 } from "azle";

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
//List of supported ICRC tokens
type ICRC = Variant<{
  ckBTC: null;
  CHAT: null;
}>;

type will_type = Variant<{
  ICP: null;
  ICRC: ICRC;
  BTC: null;
}>;

//stable Memory Type for Will
export type Will = Record<{
  identifier: string;
  type: will_type;
  owner: Principal;
  hier: Principal;
  value: nat32;
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
