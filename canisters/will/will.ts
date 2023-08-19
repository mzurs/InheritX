import {
  blob,
  match,
  $update,
  Result,
  empty,
  Variant,
  nat32,
  $query,
  Record,
  StableBTreeMap,
  Principal,
  ic,
  Opt,
  nat8,
  Vec,
} from "azle";
import { managementCanister } from "azle/canisters/management";
import decodeUtf8 from "decode-utf8";
import { KEY_SIZE, VALUE_SIZE } from "./utils/constants";
import {
  AddUserDetails,
  CreateWill,
  CreateWillArgs,
  DeleteWill,
  GetUserDetails,
  UpdateUserDetails,
  UserDetails,
  Will,
  userDetailsArgs,
  will_types,
} from "./utils/types";

//Store user details before creating any will
let users = new StableBTreeMap<Principal, UserDetails>(1, 38, 500_000);

// Store digital will inside StableMemory with unique will_identifier
let wills = new StableBTreeMap<nat32, Will>(2, 38, 500_000);

// owner principal mapping to will owner ==> will_identifer
let ownerMappingToWillIdentifier = new StableBTreeMap<Principal, Vec<nat32>>(
  3,
  38,
  500_000
);

// hiers principal mapping to will hiers ==> will_identifer
let hiersMappingToWillIdentifier = new StableBTreeMap<Principal, Vec<nat32>>(
  4,
  38,
  500_000
);

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

// request random will identifier to create a uniquw will
$update;
export async function request_random_will_identifier(): Promise<nat32> {
  const MULTIPLY_BY_10s = 100_000_000;
  //   const randomnessResult = await managementCanister.raw_rand().call();
  return Number(
    String(
      parseInt(
        String(
          Math.random() * MULTIPLY_BY_10s + Math.random() * MULTIPLY_BY_10s
        )
      )
    )
  );
}

$query;
export function get_will_canister_id(): Principal {
  return ic.id();
}

// add will identifier to owners and hiers mappings
function add_identifier_to_mapping(
  owner: Principal,
  hiers: Principal,
  identifier: nat32
): void {
  if (ownerMappingToWillIdentifier.isEmpty()) {
    ownerMappingToWillIdentifier.insert(owner, [identifier]);
  } else {
    const identifiers = ownerMappingToWillIdentifier.get(owner);
    match(identifiers, {
      Some: (identifiers) => identifiers.push(identifier),
      None: (none) => none,
    });
  }
  if (hiersMappingToWillIdentifier.isEmpty()) {
    hiersMappingToWillIdentifier.insert(hiers, [identifier]);
  } else {
    const identifiers = hiersMappingToWillIdentifier.get(hiers);
    match(identifiers, {
      Some: (identifiers) => identifiers.push(identifier),
      None: (none) => none,
    });
  }
  return;
}

// remove will identifier from owners and hiers respectively

function remove_identifier_from_mapping(
  owner: Principal,
  hiers: Principal,
  identifier: nat32
): void {
  const ownerIdentifiers = ownerMappingToWillIdentifier.get(owner);
  match(ownerIdentifiers, {
    Some: (identifiers) => {
      const index = identifiers.indexOf(identifier);
      identifiers.splice(index);
    },
    None: (none) => none,
  });

  const hiersIdentifiers = ownerMappingToWillIdentifier.get(hiers);
  match(hiersIdentifiers, {
    Some: (identifiers) => {
      const index = identifiers.indexOf(identifier);
      identifiers.splice(index);
    },
    None: (none) => none,
  });
  return;
}

//  create a will for ICRC supported assets

$update;
export async function icrc_create_will(
  args: CreateWillArgs
): Promise<CreateWill> {
  // check user existence
  const isUserExists = is_user_exists(ic.caller());
  if (!isUserExists) {
    return {
      userNotExists: true,
    };
  }

  //check will_type supported
  if (!(args.will_type in will_types)) {
    return {
      willTypeNotSupported: `${args.will_type} Not Supported`,
    };
  }

  // read User Details From Stable Memory
  const getUserDetailsOpt = users.get(ic.caller());
  const getUserDetails = match(getUserDetailsOpt, {
    Some: (details) => details,
    None: (nullDetails) => nullDetails,
  });
  if (getUserDetails == null) {
    return {
      userNotExists: true,
    };
  }

  const willObject: Will = {
    identifier: args.identifier,
    type: args.will_type,
    owner: ic.caller(),
    hiers: args.hiers,
    value: args.amount,
    isClaimed: false,
  };

  // add the will object to will stable Memory
  wills.insert(args.identifier, willObject);

  // add Will identifier to theirs respective mapping
  add_identifier_to_mapping(ic.caller(), args.hiers, args.identifier);

  return {
    success: true,
  };
}

//  delete a will
$update;
export function delete_will(identifier: nat32): DeleteWill {
  //check user existence
  if (!is_user_exists(ic.caller())) {
    return {
      userNotExists: true,
    };
  }

  // check the will_identifer exist
  if (!wills.containsKey(identifier)) {
    return {
      willNotExists: true,
    };
  }

  const willOpt: Opt<Will> = wills.get(identifier);
  const will = match(willOpt, {
    Some: (will) => will,
    None: (none) => none,
  });

  if (!will) {
    return {
      errorMessage: "Error While Fetching Wll Details",
    };
  }

  const hiers = will.hiers;
  const owner = ic.caller();

  wills.remove(identifier);

  remove_identifier_from_mapping(owner, hiers, identifier);

  return {
    success: true,
  };
}
