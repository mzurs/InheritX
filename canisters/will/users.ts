import { Principal, $update, ic, match, $query, Result } from "azle";
import {
  userDetailsArgs,
  AddUserDetails,
  UserDetails,
  GetUserDetails,
  UpdateUserDetails,
} from "./utils/types";
import { users } from "./will";

//-------------------------------------------------------FUNCTIONS------------------------------------------------------

// check whether principal already add details
export function is_user_exists(principal: Principal): boolean {
  return users.containsKey(principal);
}

//--------------------------------------------------Query Methods-------------------------------------------------------

// Get User Details From Stable Memory
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
      None: () => ic.trap("User Value not present"),
    });

    return {
      userDetails: getUserDetails,
    };
  }
}
//extra

$query;
export function get_user_by_princicpal(princicpal: Principal): string {
 return match(users.get(princicpal), {
    Some: (user) => JSON.stringify(user),
    None: (none) => "null",
  });
}
//--------------------------------------------------Update Methods-------------------------------------------------------

// Add User Details Inside Stable Memory
$update;
export function add_user_details(userDetails: userDetailsArgs): AddUserDetails {
  if (is_user_exists(ic.caller())) {
    return {
      userExists: true,
    };
  } else {
    const userData: UserDetails = {
      principal: ic.caller(),
      firstNames: userDetails.firstNames,
      lastName: userDetails.lastName,
      sex: userDetails.sex,
      birthDate: userDetails.birthDate,
      birthLocationCode: userDetails.birthLocationCode,
    };
    users.insert(ic.caller(), userData);

    return {
      success: true,
    };
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
      firstNames: userDetails.firstNames,
      lastName: userDetails.lastName,
      sex: userDetails.sex,
      birthDate: userDetails.birthDate,
      birthLocationCode: userDetails.birthLocationCode,
    };
    users.insert(ic.caller(), updatedUserData);

    return {
      success: true,
    };
  }
}
