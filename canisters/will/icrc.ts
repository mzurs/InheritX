import { $update, ic, nat32, Opt, match, Principal } from "azle";
import {
  ICRCCreateWillArgs,
  ICRCs,
  Will,
  DeleteWill,
  ICRCCreateWill,
  ICRCClaimWill,
  ICRCDeleteWill,
} from "./utils/types";
import {
  add_identifier_to_mapping,
  isIdentifierUsed,
  remove_identifier_from_mapping,
  wills,
} from "./will";
import { is_user_exists } from "./users";
import { ICRCCANISTER } from "../../services/icrc";

//---------------------------------------------WILLS RELATED TO ICRCs---------------------------------------------------

export const icrc = new ICRCCANISTER(
  Principal.fromText(process.env.ICRC_CANISTER_ID!)
);
//--------------------------------------------------Query Methods-------------------------------------------------------

//--------------------------------------------------Update Methods------------------------------------------------------

//  create a will for ICRC supported assets

export async function icrc_create_will(
  args: ICRCCreateWillArgs
): Promise<ICRCCreateWill> {
  // check the reentrancy of unique identifier
  if (isIdentifierUsed.containsKey(args.identifier)) {
    return {
      identifierUsed: true,
    };
  }

  //check tokenTicker supported
  if (!ICRCs.includes(args.tokenTicker)) {
    return {
      tokenTickerNotSupported: `${args.tokenTicker} Not Supported`,
    };
  }

  const willObject: Will = {
    willName: args.willName,
    identifier: args.identifier,
    tokenTicker: args.tokenTicker,
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

  // mark Identifier as used
  isIdentifierUsed.insert(args.identifier, true);

  return {
    success: true,
  };
}

//  delete a will
export async function icrc_delete_will(
  identifier: nat32
): Promise<ICRCDeleteWill> {
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

  // // stop un-authorized user to delete a will
  // if (testator != will.testator) {
  //   return {
  //     unAuthorized: true,
  //   };
  // }

  wills.remove(identifier);

  remove_identifier_from_mapping(testator, heirs, identifier);

  return {
    success: true,
  };
}

export async function icrc_claim_will(will: Will): Promise<ICRCClaimWill> {
  if (will.isClaimed) {
    return {
      isClaimed: true,
    };
  }
  if (!ICRCs.includes(will.tokenTicker)) {
    return {
      tokenTickerNotSupported: true,
    };
  }

  const claimResult = await icrc
    .icrc_icp_transfer(will.identifier, will.heirs)
    .call();

  const result = match(claimResult, {
    Ok: (res) => res,
    Err: (err) => err,
  });
  if (typeof result === "string") {
    return {
      claimError: result,
    };
  }
  return {
    result: result,
  };
}
