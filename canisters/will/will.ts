import {
  match,
  $update,
  nat32,
  $query,
  StableBTreeMap,
  Principal,
  ic,
  Opt,
  Vec,
  Tuple,
} from "azle";
import {
  GetTestatorWills,
  UserDetails,
  Will,
  GetHeirWills,
} from "./utils/types";
import {
  add_user_details,
  is_user_exists,
  update_user_details,
  get_user_details,
} from "./users";
import { icrc_create_will, icrc_delete_will } from "./icrc";
//=============================================Stable Variables===========================================================

//Store user details before creating any will
export let users = new StableBTreeMap<Principal, UserDetails>(1, 38, 500_000);

// Store digital will inside StableMemory with unique will_identifier
export let wills = new StableBTreeMap<nat32, Will>(2, 38, 500_000);

// testator principal mapping to will testator ==> will_identifer
export let testatorMappingToWillIdentifier = new StableBTreeMap<
  Principal,
  Vec<nat32>
>(3, 38, 500_000);

// heirs principal mapping to will heirs ==> will_identifer
export let heirsMappingToWillIdentifier = new StableBTreeMap<
  Principal,
  Vec<nat32>
>(4, 38, 500_000);

// stable memory that caches all Identifiers with respect to caller Principal
export let identifiersCache = new StableBTreeMap<nat32, Principal>(5, 32, 38);

//-------------------------------------------------------FUNCTIONS---------------------------------------------

// add will identifier to testators and heirs mappings
export function add_identifier_to_mapping(
  testator: Principal,
  heirs: Principal,
  identifier: nat32
): void {
  if (testatorMappingToWillIdentifier.isEmpty()) {
    testatorMappingToWillIdentifier.insert(testator, [identifier]);
  } else {
    const identifiers = testatorMappingToWillIdentifier.get(testator);
    match(identifiers, {
      Some: (identifiers) => {
        const updatedVec = [...identifiers, identifier];
        testatorMappingToWillIdentifier.insert(testator, updatedVec);
      },
      None: (none) => none,
    });
  }
  if (heirsMappingToWillIdentifier.isEmpty()) {
    heirsMappingToWillIdentifier.insert(heirs, [identifier]);
  } else {
    const identifiers = heirsMappingToWillIdentifier.get(heirs);
    match(identifiers, {
      Some: (identifiers) => {
        const updatedVec = [...identifiers, identifier];
        heirsMappingToWillIdentifier.insert(heirs, updatedVec);
      },
      None: (none) => none,
    });
  }
  return;
}

// remove will identifier from testators and heirs respectively
export function remove_identifier_from_mapping(
  testator: Principal,
  heirs: Principal,
  identifier: nat32
): void {
  const testatorIdentifiers = testatorMappingToWillIdentifier.get(testator);
  match(testatorIdentifiers, {
    Some: (identifiers) => {
      const index = identifiers.indexOf(identifier);
      identifiers.splice(index);
    },
    None: (none) => none,
  });

  const heirsIdentifiers = heirsMappingToWillIdentifier.get(heirs);
  match(heirsIdentifiers, {
    Some: (identifiers) => {
      const index = identifiers.indexOf(identifier);
      identifiers.splice(index);
    },
    None: (none) => none,
  });
  return;
}

//==============================================WILL CANISTER METHODS===============================================

//----------------------------------------------Query Methods--------------------------------------------------------

// Return Will Canister Id
$query;
export function get_will_canister_id(): Principal {
  return ic.id();
}

// This function is used to get all random identifiers create by users.
$query;
export function get_all_identifiers(): Vec<Tuple<[nat32, Principal]>> {
  return identifiersCache.items();
}

$query;
export function get_wills_for_testator(): GetTestatorWills {
  if (!is_user_exists(ic.caller())) {
    return {
      userNotExists: true,
    };
  }
  const testatorWillsIdentifiersOpt: Opt<Vec<nat32>> =
    testatorMappingToWillIdentifier.get(ic.caller());
  const testatorWillsIdentifiers = match(testatorWillsIdentifiersOpt, {
    Some: (identifiers) => identifiers,
    None: (none) => none,
  });
  if (testatorWillsIdentifiers == null) {
    return {
      noWillsExists: true,
    };
  } else {
    let testatorWills: Vec<Will> = [];

    for (const identifier of testatorWillsIdentifiers) {
      const willOpt: Opt<Will> = wills.get(identifier);

      const will = match(willOpt, {
        Some: (willObj) => willObj,
        None: (none) => none,
      });
      if (will == null) {
        continue;
      }
      testatorWills.push(will);
    }

    return {
      wills: testatorWills,
    };
  }
}

// Function used By Heirs To See All Available Wills To Claim
$query;
export function get_wills_for_heir(): GetHeirWills {
  const heirWillsIdentifiersOpt: Opt<Vec<nat32>> =
    heirsMappingToWillIdentifier.get(ic.caller());
  const heirWillsIdentifiers = match(heirWillsIdentifiersOpt, {
    Some: (identifiers) => identifiers,
    None: (none) => none,
  });
  if (heirWillsIdentifiers == null) {
    return {
      noWillsExists: true,
    };
  } else {
    let heirWills: Vec<Will> = [];

    for (const identifier of heirWillsIdentifiers) {
      const willOpt: Opt<Will> = wills.get(identifier);

      const will = match(willOpt, {
        Some: (willObj) => willObj,
        None: (none) => none,
      });

      if (will == null) {
        continue;
      }
      heirWills.push(will);
    }

    return {
      wills: heirWills,
    };
  }
}

$query;
export function get_all_wills(): Vec<Tuple<[nat32, Will]>> {
  return wills.items();
}
//----------------------------------------------Update Methods-------------------------------------------------------

// request random will identifier to create a unique will
$update;
export async function request_random_will_identifier(): Promise<nat32> {
  const MULTIPLY_BY_10s = 100_000_000;

  const randomWillIdentifier = Number(
    String(
      parseInt(
        String(
          Math.random() * MULTIPLY_BY_10s + Math.random() * MULTIPLY_BY_10s
        )
      )
    )
  );
  identifiersCache.insert(randomWillIdentifier, ic.caller());

  return randomWillIdentifier;
}

export {
  get_user_details,
  add_user_details,
  update_user_details,
  icrc_create_will,
  icrc_delete_will,
};
