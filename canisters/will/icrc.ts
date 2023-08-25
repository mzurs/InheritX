import { $update, ic, nat32, Opt, match } from "azle";
import {
  ICRCCreateWillArgs,
  CreateWill,
  ICRCs,
  Will,
  DeleteWill,
} from "./utils/types";
import {
  add_identifier_to_mapping,
  remove_identifier_from_mapping,
  wills,
} from "./will";
import { is_user_exists } from "./users";

//---------------------------------------------WILLS RELATED TO ICRCs---------------------------------------------

//--------------------------------------------------Query Methods-------------------------------------------------------

//--------------------------------------------------Update Methods-------------------------------------------------------

//  create a will for ICRC supported assets

$update;
export async function icrc_create_will(
  args: ICRCCreateWillArgs
): Promise<CreateWill> {
  // check user existence
  const isUserExists = is_user_exists(ic.caller());
  if (!isUserExists) {
    return {
      userNotExists: true,
    };
  }

  //check will_type supported
  if (!ICRCs.includes(args.will_type)) {
    return {
      willTypeNotSupported: `${args.will_type} Not Supported`,
    };
  }

  const willObject: Will = {
    willName: args.willName,
    identifier: args.identifier,
    will_type: args.will_type,
    testator: ic.caller(),
    heirs: args.heirs,
    value: args.amount,
    timeStamp: ic.time(),
    isClaimed: false,
  };

  // add the will object to will stable Memory
  wills.insert(args.identifier, willObject);

  // add Will identifier to theirs respective mapping
  add_identifier_to_mapping(ic.caller(), args.heirs, args.identifier);

  return {
    success: true,
  };
}

//  delete a will
$update;
export function icrc_delete_will(identifier: nat32): DeleteWill {
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

  const heirs = will.heirs;
  const testator = ic.caller();

  wills.remove(identifier);

  remove_identifier_from_mapping(testator, heirs, identifier);

  return {
    success: true,
  };
}
