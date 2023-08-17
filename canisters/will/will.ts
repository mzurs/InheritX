import {
  blob,
  match,
  $update,
  Result,
  empty,
  Variant,
  nat64,
  $query,
  Record,
  nat32,
  StableBTreeMap,
  Principal,
  ic,
  Opt,
} from "azle";
import { managementCanister } from "azle/canisters/management";
import decodeUtf8 from "decode-utf8";
import { KEY_SIZE, VALUE_SIZE } from "./utils/constants";
import {
  AddUserDetails,
  GetUserDetails,
  UpdateUserDetails,
  UserDetails,
  Will,
  userDetailsArgs,
} from "./utils/types";

//Store user details before creating any will
let users = new StableBTreeMap<Principal, UserDetails>(1, 38, 500_000);

// Store digital will inside StableMemory with unique will_identifier
let wills = new StableBTreeMap<string, Will>(2, 38, 500_000);



//==============================================//USER FUNCTIONS//==============================================//

// check whether principal already add details
function is_user_exists(principal: Principal): boolean {
  return users.containsKey(principal);
}

$update;
export function add_user_details(userDetails: userDetailsArgs): AddUserDetails {
  if (is_user_exists(ic.caller())) {
    return {
      userExists: true,
    };
  } else {
    const userData: UserDetails = {
      principal: ic.caller(),
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      legalName: userDetails.legalName,
      sex: userDetails.sex,
      birthDate: userDetails.birthDate,
      birthLocationCode: userDetails.birthLocationCode,
      isUserDied: false,
    };
    const addUserOpt = users.insert(ic.caller(), userData);

    const addUser = match(addUserOpt, {
      Some: (success) => success,
      None: (err) => err,
    });

    if (addUser != null) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }
}

// Get User Details in Stable Memory

$query;
export function get_user_details(): GetUserDetails {
  const isUserExists = is_user_exists(ic.caller());
  if (!isUserExists) {
    return {
      userNotExists: true,
    };
  } else {
    const getUserDetailsOpt = users.get(ic.caller());
    const getUserDetails = match(getUserDetailsOpt, {
      Some: (userDetails) => userDetails,
      None: (userNotExists) => userNotExists,
    });
    if (getUserDetails == null) {
      return {
        userNotExists: true,
      };
    } else {
      return {
        userDetails: getUserDetails,
      };
    }
  }
}

//  Update User Details in Stable Memory

$update;
export function update_user_details(
  userDetails: userDetailsArgs
): UpdateUserDetails {
  const isUserExists = is_user_exists(ic.caller());
  if (!isUserExists) {
    return {
      userNotExists: true,
    };
  } else {
    const updatedUserData: UserDetails = {
      principal: ic.caller(),
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      legalName: userDetails.legalName,
      sex: userDetails.sex,
      birthDate: userDetails.birthDate,
      birthLocationCode: userDetails.birthLocationCode,
      isUserDied: false,
    };
    const updatedUserOpt = users.insert(ic.caller(), updatedUserData);

    const updatedUser = match(updatedUserOpt, {
      Some: (success) => success,
      None: (err) => err,
    });

    if (updatedUser != null) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }
}



//==============================================//WILL FUNCTIONS//==============================================//


